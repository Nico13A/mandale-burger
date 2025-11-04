from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from promotion.models import PromotionBurger
from .serializers import CartSerializer
from .permissions import IsClientUser
from order.models import Order, OrderItem, OrderStatusHistory
from django.db import transaction
from core.models import Ingredient
from django.utils import timezone
from customerBurger.models import CustomBurger


class CartViewSet(viewsets.ViewSet):
    """
    ViewSet para manejar carrito solo con PromotionBurger:
    - ver carrito
    - agregar ítem
    - eliminar ítem
    - actualizar cantidad
    - checkout (vaciar carrito)
    """

    permission_classes = [IsClientUser]


    def list(self, request):
        """GET /api/cart/ → devuelve el carrito del usuario"""
        try:
            cart = request.user.cart
        except Cart.DoesNotExist:
            return Response({"id": None, "user": request.user.id, "items": [], "total_price": 0})

        serializer = CartSerializer(cart)
        return Response(serializer.data)


    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """
        POST /api/cart/add_item/
        body: { "promotion_id": 1, "quantity": 2 } 
        o  { "custom_burger_id": 5, "quantity": 1 }
        """
        promotion_id = request.data.get('promotion_id')
        custom_burger_id = request.data.get('custom_burger_id')
        quantity = int(request.data.get('quantity', 1))

        if not promotion_id and not custom_burger_id:
            return Response({"error": "Debe indicar promotion_id o custom_burger_id"}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=request.user)

        if promotion_id:
            promotion = get_object_or_404(PromotionBurger, id=promotion_id)
            item, created = CartItem.objects.get_or_create(cart=cart, promotion=promotion)
        else:
            custom_burger = get_object_or_404(CustomBurger, id=custom_burger_id, user=request.user)
            item, created = CartItem.objects.get_or_create(cart=cart, custom_burger=custom_burger)

        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """
        POST /api/cart/remove_item/
        body: { "item_id": 5 }
        """
        try:
            cart = request.user.cart
        except Cart.DoesNotExist:
            return Response({"error": "Carrito vacío"}, status=status.HTTP_400_BAD_REQUEST)

        item_id = request.data.get('item_id')
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()

        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        """
        POST /api/cart/update_quantity/
        body: { "item_id": 5, "quantity": 3 }
        """
        try:
            cart = request.user.cart
        except Cart.DoesNotExist:
            return Response({"error": "Carrito vacío"}, status=status.HTTP_400_BAD_REQUEST)

        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))

        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.quantity = quantity
        item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def clear_cart(self, request):
        """POST /api/cart/clear_cart/ → Vacía solo los items del carrito sin crear orden"""
        try:
            cart = request.user.cart
        except Cart.DoesNotExist:
            return Response({"error": "Carrito vacío"}, status=status.HTTP_400_BAD_REQUEST)
        cart.items.all().delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        """Crea una orden a partir del carrito (soporta promociones y custom burgers)"""
        try:
            cart = request.user.cart
        except Cart.DoesNotExist:
            return Response({"error": "Carrito vacío"}, status=status.HTTP_400_BAD_REQUEST)

        if not cart.items.exists():
            return Response({"error": "El carrito está vacío"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # 1️⃣ Recolectar todos los IDs de ingredientes que participan (promos + custom burgers)
            ingredient_ids = []

            for item in cart.items.all():
                if item.promotion:
                    for promo_ing in item.promotion.ingredients.all():
                        ingredient_ids.append(promo_ing.ingredient.id)
                elif item.custom_burger:
                    for ci in item.custom_burger.ingredients.all():
                        ingredient_ids.append(ci.ingredient.id)

            # Evitar duplicados
            ingredient_ids = list(set(ingredient_ids))

            # 2️⃣ Bloquear ingredientes para evitar condiciones de carrera
            ingredients_locked = Ingredient.objects.select_for_update().filter(id__in=ingredient_ids)
            ingredients_map = {ing.id: ing for ing in ingredients_locked}

            missing_ingredients = []

            # 3️⃣ Verificar stock de todos los ingredientes requeridos
            for item in cart.items.all():
                if item.promotion:
                    for promo_ing in item.promotion.ingredients.all():
                        ingredient = ingredients_map[promo_ing.ingredient.id]
                        required_qty = promo_ing.quantity * item.quantity
                        if ingredient.stock < required_qty:
                            missing_ingredients.append({
                                "producto": item.promotion.name,
                                "ingredient": ingredient.name,
                                "faltante": required_qty - ingredient.stock
                            })
                elif item.custom_burger:
                    for ci in item.custom_burger.ingredients.all():
                        ingredient = ingredients_map[ci.ingredient.id]
                        required_qty = ci.quantity * item.quantity
                        if ingredient.stock < required_qty:
                            missing_ingredients.append({
                                "producto": item.custom_burger.custom_name,
                                "ingredient": ingredient.name,
                                "faltante": required_qty - ingredient.stock
                            })

            if missing_ingredients:
                return Response({
                    "error": "No hay stock disponible",
                    "detalles": missing_ingredients
                }, status=status.HTTP_400_BAD_REQUEST)

            # 4️⃣ Crear la orden principal
            order = Order.objects.create(
                user=request.user,
                status='pending',
                total_price=cart.total_price(),
                expiration_time=timezone.now() + timezone.timedelta(minutes=5)
            )

            OrderStatusHistory.objects.create(
                order=order,
                status='pending',
                start_time=timezone.now(),
                changed_by=request.user
            )

            # 5️⃣ Crear items de orden y descontar stock
            for item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    promotion=item.promotion if item.promotion_id else None,
                    custom_burger=item.custom_burger if item.custom_burger_id else None,
                    quantity=item.quantity
                )

                if item.promotion:
                    for promo_ing in item.promotion.ingredients.all():
                        ingredient = ingredients_map[promo_ing.ingredient.id]
                        ingredient.stock -= promo_ing.quantity * item.quantity
                        ingredient.save()
                elif item.custom_burger:
                    for ci in item.custom_burger.ingredients.all():
                        ingredient = ingredients_map[ci.ingredient.id]
                        ingredient.stock -= ci.quantity * item.quantity
                        ingredient.save()

            # 6️⃣ Vaciar carrito
            cart.items.all().delete()

        # 7️⃣ Respuesta
        return Response({
            "success": "Orden creada correctamente.",
            "order_id": order.id,
            "total": float(order.total_price)
        }, status=status.HTTP_201_CREATED)






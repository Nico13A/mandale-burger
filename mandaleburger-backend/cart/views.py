from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from promotion.models import PromotionBurger
from .serializers import CartSerializer
from .permissions import IsClientUser
from order.models import Order, OrderItem, OrderStatusHistory
from order.utils import validate_pickup_slot, validate_pickup_time_anticipation, validate_pickup_time_format
from django.db import transaction
from core.models import Ingredient
from django.utils import timezone
from customerBurger.models import CustomBurger
from datetime import datetime
from menuburger.models import MenuBurger


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
        menu_burger_id = request.data.get('menu_burger_id')
        quantity = int(request.data.get('quantity', 1))

        if not promotion_id and not custom_burger_id and not menu_burger_id:
            return Response({"error": "Debe indicar promotion_id, custom_burger_id o menu_burger_id"}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=request.user)

        if promotion_id:
            promotion = get_object_or_404(PromotionBurger, id=promotion_id)
            item, created = CartItem.objects.get_or_create(cart=cart, promotion=promotion)
        elif custom_burger_id:
            custom_burger = get_object_or_404(
                CustomBurger,
                id=custom_burger_id,    
            )
            item, created = CartItem.objects.get_or_create(
                cart=cart,
                custom_burger=custom_burger
            )
        elif menu_burger_id:
            menu_burger = get_object_or_404(MenuBurger, id=menu_burger_id)
            item, created = CartItem.objects.get_or_create(cart=cart, menu_burger=menu_burger)

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
                elif item.menu_burger:  
                    for mbi in item.menu_burger.ingredients.all():
                        ingredient_ids.append(mbi.ingredient.id)

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
                elif item.menu_burger:  
                    for mbi in item.menu_burger.ingredients.all():
                        ingredient = ingredients_map[mbi.ingredient.id]
                        required_qty = mbi.quantity * item.quantity
                        if ingredient.stock < required_qty:
                            missing_ingredients.append({
                                "producto": item.menu_burger.name,
                                "ingredient": ingredient.name,
                                "faltante": required_qty - ingredient.stock
                            })

            if missing_ingredients:
                return Response({
                    "error": "No hay stock disponible",
                    "detalles": missing_ingredients
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Todo lo de aca tiene que ver con la funcionalidad programar entrega
            pickup_date = request.data.get("pickup_date")
            pickup_time = request.data.get("pickup_time")

            if not pickup_date or not pickup_time:
                return Response({"error": "Debe seleccionar fecha y hora de retiro"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                pickup_date = datetime.strptime(pickup_date, "%Y-%m-%d").date()
                pickup_time = datetime.strptime(pickup_time, "%H:%M").time()
            except (ValueError, TypeError):
                return Response(
                    {"error": "Formato de fecha u hora inválido."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            today = timezone.localdate()
            now_time = timezone.localtime().time()

            if pickup_date < today:
                return Response({"error": "La fecha de retiro no puede ser del pasado."}, status=status.HTTP_400_BAD_REQUEST)
            
            if pickup_date == today and pickup_time <= now_time:
                return Response(
                    {"error": "La hora de retiro debe ser mayor a la hora actual."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not validate_pickup_slot(pickup_date, pickup_time):
                return Response({"error": "Ese horario ya alcanzó el límite de pedidos disponibles."}, status=status.HTTP_400_BAD_REQUEST)

            if not validate_pickup_time_format(pickup_time):
                return Response(
                    {"error": "Horario inválido. Debe ser entre las 12:00 hs y 22:00 hs, en horas exactas."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not validate_pickup_time_anticipation(pickup_date, pickup_time):
                return Response(
                    {"error": "Debes pedir con al menos 30 minutos de anticipación."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 4️⃣ Crear la orden principal
            order = Order.objects.create(
                user=request.user,
                status='pending',
                total_price=cart.total_price(),
                expiration_time=timezone.now() + timezone.timedelta(minutes=5),
                pickup_date=pickup_date,
                pickup_time=pickup_time
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
                    menu_burger=item.menu_burger if item.menu_burger_id else None,
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
                elif item.menu_burger:
                    for mbi in item.menu_burger.ingredients.all():
                        ingredient = ingredients_map[mbi.ingredient.id]
                        ingredient.stock -= mbi.quantity * item.quantity
                        ingredient.save()

            # 6️⃣ Vaciar carrito
            cart.items.all().delete()

        # 7️⃣ Respuesta
        return Response({
            "success": "Orden creada correctamente.",
            "order_id": order.id,
            "total": float(order.total_price)
        }, status=status.HTTP_201_CREATED)






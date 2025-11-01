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
        """
        promotion_id = request.data.get('promotion_id')
        quantity = int(request.data.get('quantity', 1))
        promotion = get_object_or_404(PromotionBurger, id=promotion_id)

        # Solo crear carrito si agrega algo
        cart, _ = Cart.objects.get_or_create(user=request.user)

        item, created = CartItem.objects.get_or_create(cart=cart, promotion=promotion)
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
        # Intentamos obtener el carrito del usuario que hace la petición
        try:
            cart = request.user.cart
        except Cart.DoesNotExist:
            # Si el usuario no tiene carrito, devolvemos error 400
            return Response({"error": "Carrito vacío"}, status=status.HTTP_400_BAD_REQUEST)

        # Verificamos si el carrito tiene items
        if not cart.items.exists():
            # Si no hay items, devolvemos error
            return Response({"error": "El carrito está vacío"}, status=status.HTTP_400_BAD_REQUEST)

        # Abrimos una transacción atómica: todo lo que hagamos dentro será reversible si hay error
        with transaction.atomic():
            # 🔒 BLOQUEO DE INGREDIENTES: primero recopilamos todos los IDs de ingredientes que necesitamos
            ingredient_ids = []
            for item in cart.items.all():
                for promo_ing in item.promotion.ingredients.all():
                    # Guardamos el id de cada ingrediente que forma parte de las promociones del carrito
                    ingredient_ids.append(promo_ing.ingredient.id)

            # Bloqueamos esos ingredientes para que nadie más pueda modificar su stock mientras procesamos la orden
            ingredients_locked = Ingredient.objects.select_for_update().filter(id__in=ingredient_ids)

            # Creamos un diccionario para acceder rápido a cada ingrediente por su ID
            ingredients_map = {ing.id: ing for ing in ingredients_locked}

            # Lista para acumular ingredientes que no tienen stock suficiente
            missing_ingredients = []

            # Verificamos stock bajo bloqueo
            for item in cart.items.all():
                promotion = item.promotion
                for promo_ing in promotion.ingredients.all():
                    # Obtenemos el ingrediente bloqueado desde el diccionario
                    ingredient = ingredients_map[promo_ing.ingredient.id]
                    # Calculamos la cantidad total necesaria (cantidad del ingrediente * cantidad de promos en el carrito)
                    required_qty = promo_ing.quantity * item.quantity

                    # Si el stock disponible es menor que el requerido, agregamos a la lista de faltantes
                    if ingredient.stock < required_qty:
                        missing_ingredients.append({
                            "promotion": promotion.name,
                            "ingredient": ingredient.name,
                            "faltante": required_qty - ingredient.stock
                        })

            # Si hay algún ingrediente faltante, devolvemos error y no hacemos ningún cambio
            if missing_ingredients:
                return Response({
                    "error": "No hay stock disponible",
                    "detalles": missing_ingredients
                }, status=status.HTTP_400_BAD_REQUEST)

            # Todo está bien: creamos la orden principal
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

            # Recorremos nuevamente los items para crear los OrderItems y descontar stock
            for item in cart.items.all():
                # Creamos cada OrderItem asociado a la orden
                OrderItem.objects.create(
                    order=order,
                    promotion=item.promotion,
                    quantity=item.quantity
                )

                # Descontamos el stock de cada ingrediente
                for promo_ing in item.promotion.ingredients.all():
                    ingredient = ingredients_map[promo_ing.ingredient.id]
                    ingredient.stock -= promo_ing.quantity * item.quantity
                    ingredient.save()  # Guardamos el cambio en la base de datos

            # Vaciar carrito: borramos todos los items del carrito
            cart.items.all().delete()

        # Finalmente devolvemos respuesta exitosa con id de la orden y total
        return Response({
            "success": "Orden creada correctamente.",
            "order_id": order.id,
            "total": float(order.total_price)  
        }, status=status.HTTP_201_CREATED)





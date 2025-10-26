from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from promotion.models import PromotionBurger
from .serializers import CartSerializer

class CartViewSet(viewsets.ViewSet):
    """
    ViewSet para manejar carrito solo con PromotionBurger:
    - ver carrito
    - agregar ítem
    - eliminar ítem
    - actualizar cantidad
    - checkout (vaciar carrito)
    """

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
    def checkout(self, request):
        """
        POST /api/cart/checkout/
        Convierte el carrito en Order (más adelante)
        y limpia el carrito.
        """
        try:
            cart = request.user.cart
        except Cart.DoesNotExist:
            return Response({"error": "Carrito vacío"}, status=status.HTTP_400_BAD_REQUEST)

        cart.items.all().delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)




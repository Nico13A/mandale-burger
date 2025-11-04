from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory
from promotion.models import PromotionBurger
from customerBurger.models import CustomBurger

# -------------------------
# Serializer para promociones
# -------------------------
class PromotionBurgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromotionBurger
        fields = ['id', 'name', 'price', 'img']


# -------------------------
# Serializer para hamburguesas personalizadas
# -------------------------
class CustomBurgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomBurger
        fields = ['id', 'custom_name', 'total_price', 'img']


# -------------------------
# Serializer para los items de la orden
# -------------------------
class OrderItemSerializer(serializers.ModelSerializer):
    promotion = PromotionBurgerSerializer(read_only=True)
    custom_burger = CustomBurgerSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    item_type = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'promotion', 'custom_burger', 'quantity', 'total_price', 'item_type']

    def get_total_price(self, obj):
        return obj.total_price()

    def get_item_type(self, obj):
        return obj.get_item_type()


# -------------------------
# Serializer para el historial de estados
# -------------------------
class OrderStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_username = serializers.CharField(source='changed_by.username', read_only=True)

    class Meta:
        model = OrderStatusHistory
        fields = ['status', 'start_time', 'end_time', 'changed_by_username']


# -------------------------
# Serializer principal de la orden
# -------------------------
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'created_at', 'updated_at', 'total_price', 'items', 'status_history']


# -------------------------
# Serializer simplificado (cliente/cocinero)
# -------------------------
class OrderSerializerLite(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'created_at', 'updated_at', 'total_price', 'items']


# -------------------------
# Serializer para cocina (detalles de ingredientes)
# -------------------------
class PromotionBurgerCocinaSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField()

    class Meta:
        model = PromotionBurger
        fields = ['id', 'name', 'ingredients']

    def get_ingredients(self, obj):
        return [
            {
                "id": pi.ingredient.id,
                "name": pi.ingredient.name,
                "quantity": pi.quantity
            }
            for pi in obj.ingredients.all()
        ]


class CustomBurgerCocinaSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField()

    class Meta:
        model = CustomBurger
        fields = ['id', 'custom_name', 'ingredients']

    def get_ingredients(self, obj):
        return [
            {
                "id": ci.ingredient.id,
                "name": ci.ingredient.name,
                "quantity": ci.quantity
            }
            for ci in obj.ingredients.all()
        ]


# -------------------------
# OrderItem serializer para cocina
# -------------------------
class OrderItemCocinaSerializer(serializers.ModelSerializer):
    promotion = PromotionBurgerCocinaSerializer(read_only=True)
    custom_burger = CustomBurgerCocinaSerializer(read_only=True)
    item_type = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'promotion', 'custom_burger', 'quantity', 'item_type']

    def get_item_type(self, obj):
        return obj.get_item_type()


# -------------------------
# Order serializer para cocina
# -------------------------
class OrderCocinaSerializer(serializers.ModelSerializer):
    items = OrderItemCocinaSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'status', 'items']



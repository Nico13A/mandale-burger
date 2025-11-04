from rest_framework import serializers
from .models import Cart, CartItem
from promotion.models import PromotionBurger
from customerBurger.models import CustomBurger


class PromotionBurgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromotionBurger
        fields = ['id', 'name', 'price', 'img']


class CustomBurgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomBurger
        fields = ['id', 'custom_name', 'total_price', 'img']


class CartItemSerializer(serializers.ModelSerializer):
    promotion = PromotionBurgerSerializer(read_only=True)
    custom_burger = CustomBurgerSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'promotion', 'custom_burger', 'quantity', 'total_price']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price()


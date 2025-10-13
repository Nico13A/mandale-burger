from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import PromotionBurger, PromotionIngredient, PromotionSubscription
from core.models import Ingredient
from subscription.models import SubscriptionPlan


# -------------------------
# Serializer de Ingrediente en la promoción
# -------------------------
class PromotionIngredientSerializer(serializers.ModelSerializer):
    ingredient_id = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all(), write_only=True, source='ingredient')
    ingredient = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = PromotionIngredient
        fields = ['id', 'ingredient', 'ingredient_id', 'quantity']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0")
        return value


# -------------------------
# Serializer de Promoción
# -------------------------
class PromotionBurgerSerializer(serializers.ModelSerializer):
    ingredients = PromotionIngredientSerializer(many=True, read_only=True)
    ingredients_data = PromotionIngredientSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = PromotionBurger
        fields = ['id', 'name', 'description', 'price', 'img', 'ingredients', 'ingredients_data']

    def create(self, validated_data):
        ingredient_data = self.initial_data.get('ingredients_data', [])

        if isinstance(ingredient_data, str):
            import json
            ingredient_data = json.loads(ingredient_data)

        # Crear la promoción
        promo = PromotionBurger.objects.create(**validated_data, is_active=True)

        # Crear los ingredientes asociados
        for item in ingredient_data:
            PromotionIngredient.objects.create(promotion_burger=promo, **item)

        return promo


# -------------------------
# Serializer para asociar promoción a planes
# -------------------------
class PromotionSubscriptionSerializer(serializers.ModelSerializer):
    promotion = PromotionBurgerSerializer(read_only=True)
    promotion_id = serializers.PrimaryKeyRelatedField(queryset=PromotionBurger.objects.all(), write_only=True, source='promotion')
    subscription = serializers.StringRelatedField(read_only=True)
    subscription_id = serializers.PrimaryKeyRelatedField(queryset=SubscriptionPlan.objects.all(), write_only=True, source='subscription')

    class Meta:
        model = PromotionSubscription
        fields = ['id', 'promotion', 'promotion_id', 'subscription', 'subscription_id']

    def validate(self, attrs):
        promotion = attrs.get('promotion')
        subscription = attrs.get('subscription')
        if PromotionSubscription.objects.filter(promotion=promotion, subscription=subscription).exists():
            raise ValidationError("Esta promoción ya está asociada a este plan.")
        return attrs

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import PromotionBurger, PromotionIngredient, PromotionSubscription
from core.models import Ingredient
from subscription.models import SubscriptionPlan


# -------------------------
# Serializer de Ingrediente en la promoción
# -------------------------
class PromotionIngredientSerializer(serializers.ModelSerializer):
    ingredient_id = serializers.PrimaryKeyRelatedField(
        queryset=Ingredient.objects.all(),
        write_only=True,
        source='ingredient'
    )
    ingredient = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = PromotionIngredient
        fields = ['id', 'ingredient', 'ingredient_id', 'quantity']

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor a 0.")
        return value

    def validate(self, data):
        ingredient = data.get('ingredient')

        if not ingredient:
            ingredient_id = self.initial_data.get('ingredient_id')
            if ingredient_id:
                try:
                    ingredient = Ingredient.objects.get(id=ingredient_id)
                except Ingredient.DoesNotExist:
                    raise serializers.ValidationError({"ingredient_id": "El ingrediente no existe."})

        if not ingredient.is_active:
            raise serializers.ValidationError(
                {"ingredient_id": f"El ingrediente '{ingredient.name}' está inactivo y no puede usarse en una promoción."}
            )
        
        if ingredient.stock <= 0:
            raise serializers.ValidationError(
                {"ingredient_id": f"El ingrediente '{ingredient.name}' no tiene stock disponible."}
            )

        return data


# -------------------------
# Serializer de Promoción
# -------------------------
class PromotionBurgerSerializer(serializers.ModelSerializer):
    ingredients = PromotionIngredientSerializer(many=True, read_only=True)
    ingredients_data = PromotionIngredientSerializer(many=True, write_only=True, required=False)
    is_active = serializers.BooleanField(read_only=True)
    plan_id = serializers.SerializerMethodField()
    plan_name = serializers.SerializerMethodField()

    class Meta:
        model = PromotionBurger
        fields = [
            'id',
            'name',
            'description',
            'price',
            'img',
            'ingredients',
            'ingredients_data',
            'is_active',
            'plan_id',
            'plan_name'
        ]

    def create(self, validated_data):
        ingredient_data = self.initial_data.get('ingredients_data', [])

        # Si viene como string (por multipart/form-data)
        if isinstance(ingredient_data, str):
            import json
            ingredient_data = json.loads(ingredient_data)

        validated_data.pop('is_active', None)
        promo = PromotionBurger.objects.create(**validated_data, is_active=True)

        try:
            for item in ingredient_data:
                pis = PromotionIngredientSerializer(data=item)
                pis.is_valid(raise_exception=True)
                PromotionIngredient.objects.create(promotion_burger=promo, **pis.validated_data)
        except Exception as e:
            promo.delete()  
            raise e

        return promo

    def update(self, instance, validated_data):
        ingredient_data = self.initial_data.get('ingredients_data', [])

        if isinstance(ingredient_data, str):
            import json
            ingredient_data = json.loads(ingredient_data)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if ingredient_data:
            instance.ingredients.all().delete()
            for item in ingredient_data:
                pis = PromotionIngredientSerializer(data=item)
                pis.is_valid(raise_exception=True)
                PromotionIngredient.objects.create(promotion_burger=instance, **pis.validated_data)

        return instance

    def get_plan_id(self, obj):
        try:
            promo_sub = PromotionSubscription.objects.get(promotion=obj)
            return promo_sub.subscription.id
        except PromotionSubscription.DoesNotExist:
            return None

    def get_plan_name(self, obj):
        try:
            promo_sub = PromotionSubscription.objects.get(promotion=obj)
            return promo_sub.subscription.name
        except PromotionSubscription.DoesNotExist:
            return None


# -------------------------
# Serializer para asociar promoción a planes
# -------------------------
class PromotionSubscriptionSerializer(serializers.ModelSerializer):
    promotion = PromotionBurgerSerializer(read_only=True)
    promotion_id = serializers.PrimaryKeyRelatedField(
        queryset=PromotionBurger.objects.all(),
        write_only=True,
        source='promotion'
    )
    subscription = serializers.StringRelatedField(read_only=True)
    subscription_id = serializers.PrimaryKeyRelatedField(
        queryset=SubscriptionPlan.objects.all(),
        write_only=True,
        source='subscription'
    )

    class Meta:
        model = PromotionSubscription
        fields = ['id', 'promotion', 'promotion_id', 'subscription', 'subscription_id']

    def validate(self, attrs):
        promotion = attrs.get('promotion')
        subscription = attrs.get('subscription')
        if PromotionSubscription.objects.filter(promotion=promotion, subscription=subscription).exists():
            raise ValidationError("Esta promoción ya está asociada a este plan.")
        return attrs


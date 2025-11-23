from rest_framework import serializers
from .models import MenuBurger, MenuBurgerIngredient


class MenuBurgerIngredientSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source='ingredient.name', read_only=True)
    ingredient_price = serializers.DecimalField(source='ingredient.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = MenuBurgerIngredient
        fields = ['ingredient_name', 'ingredient_price', 'quantity']


class MenuBurgerSerializer(serializers.ModelSerializer):
    ingredients = MenuBurgerIngredientSerializer(many=True, read_only=True)

    class Meta:
        model = MenuBurger
        fields = [
            'id',
            'name',
            'description',
            'img',
            'price',
            'is_active',
            'ingredients',
            'is_vegan',
            'is_gluten_free'
        ]

from rest_framework import serializers
from .models import Category, Ingredient


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class IngredientSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Ingredient
        fields = [
            'id',
            'name',
            'price',
            'img',
            'stock',
            'is_vegan',
            'is_gluten_free',
            'category',
        ]


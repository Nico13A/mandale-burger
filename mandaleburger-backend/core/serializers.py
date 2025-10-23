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


class IngredientCRUDSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), write_only=True)  
    category_name = serializers.StringRelatedField(source='category', read_only=True)
    category_id = serializers.IntegerField(source='category.id', read_only=True)            

    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'price', 'img', 'stock', 'is_vegan', 'is_gluten_free', 'is_active', 'category', 'category_name', 'category_id']
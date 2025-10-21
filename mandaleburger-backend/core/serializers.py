from rest_framework import serializers
from .models import Category, Ingredient


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class IngredientSerializer(serializers.ModelSerializer):
    
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )
   
    img = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Ingredient
        fields = [
            "id",
            "name",
            "price",
            "img",
            "stock",
            "is_vegan",
            "is_gluten_free",
            "is_active",
            "category",  
        ]

    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = CategorySerializer(instance.category).data
        return data


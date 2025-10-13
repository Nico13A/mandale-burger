from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Category, Ingredient
from .serializers import IngredientSerializer


class IngredientByCategoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        category_id = request.query_params.get('category')
        is_vegan = request.query_params.get('is_vegan')
        is_gluten_free = request.query_params.get('is_gluten_free')

        # Traigo categorías
        categories = Category.objects.all()
        if category_id:
            categories = categories.filter(id=category_id)

        result = []

        for cat in categories:
            ingredients = Ingredient.objects.filter(category=cat)

            # Filtros opcionales según query params
            if is_vegan == 'true':
                ingredients = ingredients.filter(is_vegan=True)
            if is_gluten_free == 'true':
                ingredients = ingredients.filter(is_gluten_free=True)

            # Serializo los ingredientes
            ingredients_serialized = IngredientSerializer(ingredients, many=True).data

            result.append({
                'id': cat.id,
                'name': cat.name,
                'ingredients': ingredients_serialized
            })

        return Response(result)




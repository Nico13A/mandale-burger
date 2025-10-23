from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Category, Ingredient
from .serializers import IngredientSerializer, IngredientCRUDSerializer, CategorySerializer
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser


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
            ingredients = Ingredient.objects.filter(category=cat, is_active=True, stock__gt=0)

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


class IngredientCRUDViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientCRUDSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def destroy(self, request, *args, **kwargs):
        ingredient = self.get_object()

        # Revisamos si el ingrediente pertenece a alguna promoción activa
        tiene_promocion_activa = ingredient.promotioningredient_set.filter(
            promotion_burger__is_active=True
        ).exists()

        if tiene_promocion_activa:
            return Response(
                {"detail": "No se puede desactivar este ingrediente porque pertenece a una promoción activa."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Si no tiene promociones activas, desactivamos
        ingredient.is_active = False
        ingredient.save()
        return Response(status=status.HTTP_204_NO_CONTENT)



class CategoryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Category, Ingredient
from .serializers import IngredientSerializer
from rest_framework import generics, permissions
from django.db.models import Q
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

#class IngredientListCreateAPI(generics.ListCreateAPIView):
 #   queryset = Ingredient.objects.all()
  #  serializer_class = IngredientSerializer
   # permission_classes = [permissions.IsAuthenticated]  
    
class IngredientDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

class IngredientListCreateAPI(generics.ListCreateAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    def get_queryset(self):
        qs = super().get_queryset()

        q = self.request.query_params.get("q")              # texto libre
        category = self.request.query_params.get("category")# id de categoría
        is_vegan = self.request.query_params.get("is_vegan")
        is_gluten_free = self.request.query_params.get("is_gluten_free")
        is_active = self.request.query_params.get("is_active")

        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(description__icontains=q))

        if category:
            qs = qs.filter(category_id=category)

        if is_vegan == "true":
            qs = qs.filter(is_vegan=True)
        if is_gluten_free == "true":
            qs = qs.filter(is_gluten_free=True)

        if is_active == "true":
            qs = qs.filter(is_active=True)
        elif is_active == "false":
            qs = qs.filter(is_active=False)

        return qs.order_by("name")
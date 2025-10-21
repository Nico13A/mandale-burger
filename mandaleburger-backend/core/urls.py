from django.urls import path
from .views import (
    IngredientByCategoryView,
    IngredientListCreateAPI,
    IngredientDetailAPI,
)

urlpatterns = [
    path("ingredients/by-category/", IngredientByCategoryView.as_view(), name="ingredient-by-category"),
    path("ingredients/<int:pk>/", IngredientDetailAPI.as_view(), name="ingredient-detail"),
    path("ingredients/", IngredientListCreateAPI.as_view(), name="ingredient-list"),
]

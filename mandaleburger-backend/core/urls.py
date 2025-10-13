from django.urls import path
from .views import IngredientByCategoryView

urlpatterns = [
    path('ingredients/', IngredientByCategoryView.as_view(), name='ingredient-list'),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IngredientByCategoryView, IngredientCRUDViewSet, CategoryListView

router = DefaultRouter()
router.register(r'ingredients-crud', IngredientCRUDViewSet, basename='ingredients-crud')

urlpatterns = [
    path('ingredients/', IngredientByCategoryView.as_view(), name='ingredient-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'), 
] + router.urls

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, CocinaOrderViewSet

# Creamos un router y registramos el ViewSet
router = DefaultRouter()
router.register(r'cocina', CocinaOrderViewSet, basename='cocina-order')
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path
from .views import crear_preferencia

urlpatterns = [
    path('crear-preferencia/', crear_preferencia, name='crear-preferencia'),
]


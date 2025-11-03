from django.contrib import admin
from .models import CustomBurger, CustomIngredient, CustomBurgerUsuario

@admin.register(CustomBurger)
class CustomBurgerAdmin(admin.ModelAdmin):
    list_display = ("id", "custom_name", "total_price", "user", "is_active")
    search_fields = ("custom_name", "user__username")

@admin.register(CustomIngredient)
class CustomIngredientAdmin(admin.ModelAdmin):
    list_display = ("id", "custom_burger", "ingredient", "quantity")
    search_fields = ("custom_burger__custom_name", "ingredient__name")

@admin.register(CustomBurgerUsuario)
class CustomBurgerUsuarioAdmin(admin.ModelAdmin):
    list_display = ("id", "custom_burger", "usuario")
    search_fields = ("custom_burger__custom_name", "usuario__username")

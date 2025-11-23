from django.contrib import admin
from .models import MenuBurger, MenuBurgerIngredient
from core.models import Ingredient

admin.site.unregister(Ingredient)

class MenuBurgerIngredientInline(admin.TabularInline):
    model = MenuBurgerIngredient
    extra = 1 
    autocomplete_fields = ['ingredient'] 

@admin.register(MenuBurger)
class MenuBurgerAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active', 'is_vegan', 'is_gluten_free') 
    search_fields = ('name',)
    list_filter = ('is_active',)
    inlines = [MenuBurgerIngredientInline]

@admin.register(MenuBurgerIngredient)
class MenuBurgerIngredientAdmin(admin.ModelAdmin):
    list_display = ('menu_burger', 'ingredient', 'quantity')
    search_fields = ('menu_burger__name', 'ingredient__name')

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    search_fields = ['name']
from django.contrib import admin
from .models import PromotionBurger, PromotionIngredient, PromotionSubscription

# -----------------------
# Admin de PromotionBurger
# -----------------------
@admin.register(PromotionBurger)
class PromotionBurgerAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active')
    search_fields = ('name', 'description')
    list_filter = ('is_active',)

# -----------------------
# Admin de PromotionIngredient
# -----------------------
@admin.register(PromotionIngredient)
class PromotionIngredientAdmin(admin.ModelAdmin):
    list_display = ('promotion_burger', 'ingredient', 'quantity')
    search_fields = ('promotion_burger__name', 'ingredient__name')

# -----------------------
# Admin de PromotionSubscription
# -----------------------
@admin.register(PromotionSubscription)
class PromotionSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('promotion', 'subscription')
    search_fields = ('promotion__name', 'subscription__name')

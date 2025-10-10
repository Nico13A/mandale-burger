from django.contrib import admin
from .models import SubscriptionPlan, UserSubscription

# -------------------------
# Admin de Planes de Suscripción
# -------------------------
@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'max_monthly_publications', 'is_active')
    search_fields = ('name',)
    list_filter = ('price', 'is_active')


# -------------------------
# Admin de Suscripción de Usuario
# -------------------------
@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active', 'start_date', 'end_date', 'plan')
    search_fields = ('user__username', 'plan__name')


from django.contrib import admin
from .models import Profile, CocineroDelDia, SubscriptionPlan, UserSubscription

# -------------------------
# Admin de Perfil
# -------------------------
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'formacion')  
    search_fields = ('user__username', 'user__first_name', 'user__last_name')


# -------------------------
# Admin de Cocinero del Día
# -------------------------
@admin.register(CocineroDelDia)
class CocineroDelDiaAdmin(admin.ModelAdmin):
    list_display = ('cocinero', 'fecha', 'activo')
    list_filter = ('fecha', 'activo')
    search_fields = ('cocinero__username', 'cocinero__first_name', 'cocinero__last_name')


# -------------------------
# Admin de Planes de Suscripción
# -------------------------
@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'max_monthly_publications')
    search_fields = ('name',)
    list_filter = ('price',)


# -------------------------
# Admin de Suscripción de Usuario
# -------------------------
@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active', 'start_date', 'end_date')
    search_fields = ('user__username', 'plan__name')

from django.contrib import admin
from .models import Profile, CocineroDelDia

# Register your models here.
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'formacion')  
    search_fields = ('user__username', 'user__first_name', 'user__last_name')

@admin.register(CocineroDelDia)
class CocineroDelDiaAdmin(admin.ModelAdmin):
    list_display = ('cocinero', 'fecha', 'activo')
    list_filter = ('fecha', 'activo')
    search_fields = ('cocinero__username', 'cocinero__first_name', 'cocinero__last_name')
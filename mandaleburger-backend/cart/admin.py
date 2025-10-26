from django.contrib import admin
from .models import Cart, CartItem

# Inline para mostrar los items dentro del carrito
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('total_price',)
    autocomplete_fields = ('promotion',)  # Si quieres búsqueda rápida de promociones

# Admin del carrito
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price_display', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user__username',)
    inlines = [CartItemInline]

    def total_price_display(self, obj):
        return obj.total_price()
    total_price_display.short_description = "Total"

# Admin de CartItem por separado (opcional)
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'promotion', 'quantity', 'total_price_display')
    list_filter = ('cart',)
    search_fields = ('promotion__name',)

    def total_price_display(self, obj):
        return obj.total_price()
    total_price_display.short_description = "Subtotal"

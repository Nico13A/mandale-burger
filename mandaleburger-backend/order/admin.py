from django.contrib import admin
from .models import Order, OrderItem, OrderStatusHistory

# ===========================
# Inline para mostrar los items dentro de la orden
# ===========================
class OrderItemInline(admin.TabularInline):  # También puede ser admin.StackedInline
    model = OrderItem
    extra = 0  # No mostrar filas vacías
    readonly_fields = ('promotion', 'quantity', 'total_price_display')

    def total_price_display(self, obj):
        return obj.total_price()
    total_price_display.short_description = "Precio total"

# ===========================
# Inline para mostrar el historial de estados
# ===========================
class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ('status', 'start_time', 'end_time', 'changed_by')
    can_delete = False

# ===========================
# Admin principal de Order
# ===========================
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_price', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'id')
    inlines = [OrderItemInline, OrderStatusHistoryInline]
    readonly_fields = ('total_price',)

    # Calculamos total_price directamente desde los items
    def total_price(self, obj):
        return sum(item.total_price() for item in obj.items.all())
    total_price.short_description = "Total"

# ===========================
# Admin básico para OrderItem (por si querés verlo aparte)
# ===========================
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'promotion', 'quantity', 'total_price_display')

    def total_price_display(self, obj):
        return obj.total_price()
    total_price_display.short_description = "Precio total"

# ===========================
# Admin básico para OrderStatusHistory (opcional)
# ===========================
@admin.register(OrderStatusHistory)
class OrderStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('order', 'status', 'start_time', 'end_time', 'changed_by')
    list_filter = ('status', 'start_time')
    search_fields = ('order__id', 'changed_by__username')
    readonly_fields = ('status', 'start_time', 'end_time', 'changed_by')



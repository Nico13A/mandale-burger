from django.db import models
from django.contrib.auth.models import User
from promotion.models import PromotionBurger
from django.utils import timezone
from customerBurger.models import CustomBurger

# -------------------------
# Modelo principal de Orden
# -------------------------
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('paid', 'Pagada'),
        ('in_progress', 'En preparación'),
        ('ready_for_pickup', 'Lista para retirar'),
        ('picked_up', 'Retirada'),
        ('cancelled', 'Cancelada'),  
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_id = models.CharField(max_length=100, null=True, blank=True)
    expiration_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Orden #{self.id} - {self.user.username} - {self.status}"

     # -------------------------
    # Método para avanzar estado
    # -------------------------
    def advance_status(self, new_status, actor):
        """
        Cambia el estado de la orden respetando el flujo y genera un registro de historial.
        actor: instancia de User que realiza el cambio
        """

        if self.status == new_status:
            return

        valid_transition = False

        if self.status == 'pending' and new_status == 'paid':
            if actor.groups.filter(name='Client').exists() and actor == self.user:
                valid_transition = True
            else:
                raise ValueError("Solo el cliente puede confirmar el pago")

        elif self.status == 'paid' and new_status == 'in_progress':
            if actor.groups.filter(name='Cook').exists():
                valid_transition = True
            else:
                raise ValueError("Solo el cocinero puede iniciar la preparación")

        elif self.status == 'in_progress' and new_status == 'ready_for_pickup':
            if actor.groups.filter(name='Cook').exists():
                valid_transition = True
            else:
                raise ValueError("Solo el cocinero puede marcar lista la orden")

        elif self.status == 'ready_for_pickup' and new_status == 'picked_up':
            if actor.groups.filter(name='Cook').exists():
                valid_transition = True
            else:
                raise ValueError("Solo el cocinero puede confirmar retiro")

        elif self.status == 'pending' and new_status == 'cancelled':
            if (actor.groups.filter(name='Client').exists() and actor == self.user) \
            or actor.groups.filter(name='AppAdmin').exists():
                valid_transition = True
            else:
                raise ValueError("Solo el cliente puede cancelar antes de pagar")

        if not valid_transition:
            raise ValueError("Cambio de estado no permitido")

        # -------------------------
        # Registrar historial
        # -------------------------
        last_history = self.status_history.order_by('-start_time').first()
        if last_history:
            last_history.end_time = timezone.now()
            last_history.save()

        # Crear nuevo historial
        OrderStatusHistory.objects.create(
            order=self,
            status=new_status,
            start_time=timezone.now(),
            changed_by=actor
        )

        if new_status == 'cancelled':
            for item in self.items.all():
                if item.promotion:
                    item.promotion.restore_ingredients(item.quantity)
                elif item.custom_burger:
                    for ci in item.custom_burger.ingredients.all():
                        ingredient = ci.ingredient
                        ingredient.stock += ci.quantity * item.quantity
                        ingredient.save()

        # Actualizar estado actual
        self.status = new_status
        self.save()


# -------------------------
# Historial de cambios de estado
# -------------------------
class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=Order.STATUS_CHOICES)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.order.id} - {self.status} ({self.start_time} → {self.end_time})"


# -------------------------
# Items dentro de la orden
# -------------------------
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    promotion = models.ForeignKey(PromotionBurger, on_delete=models.CASCADE, null=True, blank=True)
    custom_burger = models.ForeignKey(CustomBurger, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    def total_price(self):
        price = 0
        if self.promotion:
            price = self.promotion.price
        elif self.custom_burger:
            price = self.custom_burger.total_price
        return price * self.quantity
    
    def save(self, *args, **kwargs):
        if not self.promotion and not self.custom_burger:
            raise ValueError("Debe especificarse una promoción o una hamburguesa personalizada.")
        if self.promotion and self.custom_burger:
            raise ValueError("Solo puede asociarse una promoción o una hamburguesa personalizada, no ambas.")
        super().save(*args, **kwargs)

    def get_item_type(self):
        if self.promotion:
            return "promotion"
        elif self.custom_burger:
            return "custom_burger"
        return "unknown"

    def __str__(self):
        if self.promotion:
            return f"{self.quantity} x {self.promotion.name}"
        if self.custom_burger:
            return f"{self.quantity} x {self.custom_burger.custom_name}"
        return f"{self.quantity} x (item sin definir)"
from django.db import models
from django.conf import settings
from core.models import Ingredient 


class CustomBurger(models.Model):
    custom_name = models.CharField(max_length=100)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    img = models.ImageField(upload_to='custom_burgers/', blank=True, null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='custom_burgers'
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.custom_name} (${self.total_price})"

    def activate(self):
        self.is_active = True
        self.save()

    def deactivate(self):
        self.is_active = False
        self.save()

# -------------------------
# MODELO DE INGREDIENTES PERSONALIZADOS 
# -------------------------
class CustomIngredient(models.Model):
    custom_burger = models.ForeignKey(
        CustomBurger,
        on_delete=models.CASCADE,
        related_name='ingredients'
    )
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('custom_burger', 'ingredient')

    def __str__(self):
        return f"{self.quantity} x {self.ingredient.name} en {self.custom_burger.custom_name}"


# -------------------------
# MODELO DE RELACIÓN BURGER - USUARIO   
# -------------------------
class CustomBurgerUsuario(models.Model): 
    custom_burger = models.ForeignKey(
        CustomBurger,  
        on_delete=models.CASCADE,
        related_name='usuarios'
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='burgers_usuario'
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['custom_burger', 'usuario'],
                name='uniq_custom_burger_usuario'
            )
        ]
        verbose_name = 'Relación Burger - Usuario'
        verbose_name_plural = 'Relaciones Burger - Usuario'

    def __str__(self):
        return f"{self.custom_burger.custom_name} (Usuario ID: {self.usuario_id})"
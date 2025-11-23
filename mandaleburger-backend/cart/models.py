from django.db import models
from django.contrib.auth.models import User
from promotion.models import PromotionBurger
from customerBurger.models import CustomBurger 
from menuburger.models import MenuBurger


# -------------------------
# Carrito de un usuario
# -------------------------
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def total_price(self):
        return sum(item.total_price() for item in self.items.all())

    def __str__(self):
        return f"Carrito de {self.user.username}"


# -------------------------
# Ítems dentro del carrito
# -------------------------
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    promotion = models.ForeignKey(PromotionBurger, on_delete=models.CASCADE, null=True, blank=True)
    custom_burger = models.ForeignKey(CustomBurger, on_delete=models.CASCADE, null=True, blank=True)
    menu_burger = models.ForeignKey(MenuBurger, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    def total_price(self):
        total = 0
        if self.promotion:
            total += self.promotion.price * self.quantity
        if self.custom_burger:
            total += self.custom_burger.total_price * self.quantity
        if self.menu_burger:
            total += self.menu_burger.price * self.quantity
        return total

    def __str__(self):
        nombres = []
        if self.promotion:
            nombres.append(self.promotion.name)
        if self.custom_burger:
            nombres.append(self.custom_burger.custom_name)
        if self.menu_burger:
            nombres.append(self.menu_burger.name)
        if not nombres:
            nombres.append("Item sin tipo")
        return f"{self.quantity} x {' + '.join(nombres)}"

from django.db import models
from core.models import Ingredient
from subscription.models import SubscriptionPlan

class PromotionBurger(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    img = models.ImageField(upload_to='promotions/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    def activate(self):
        self.is_active = True
        self.save()

    def deactivate(self):
        self.is_active = False
        self.save()


class PromotionIngredient(models.Model):
    promotion_burger = models.ForeignKey(PromotionBurger, on_delete=models.CASCADE, related_name='ingredients')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('promotion_burger', 'ingredient')

    def __str__(self):
        return f"{self.quantity} x {self.ingredient.name} en {self.promotion_burger.name}"


class PromotionSubscription(models.Model):
    promotion = models.ForeignKey(PromotionBurger, on_delete=models.CASCADE)
    subscription = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('promotion', 'subscription')

    def __str__(self):
        return f"{self.promotion.name} para {self.subscription.name}"

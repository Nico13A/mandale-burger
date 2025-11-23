from django.db import models
from core.models import Ingredient  

class MenuBurger(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    img = models.ImageField(upload_to='menu_burgers/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_vegan = models.BooleanField(default=False)
    is_gluten_free = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def activate(self):
        self.is_active = True
        self.save()

    def deactivate(self):
        self.is_active = False
        self.save()

    def restore_ingredients(self, quantity=1):
        """
        Restaura stock cuando una orden con MenuBurger se cancela.
        """
        for item in self.ingredients.all():
            ingredient = item.ingredient
            ingredient.stock += item.quantity * quantity
            ingredient.save()

    @property
    def ingredient_cost(self):
        total = 0
        for item in self.ingredients.all():
            total += item.ingredient.price * item.quantity
        return total

    def update_vegan_gluten_fields(self):
        self.is_vegan = all(item.ingredient.is_vegan for item in self.ingredients.all())
        self.is_gluten_free = all(item.ingredient.is_gluten_free for item in self.ingredients.all())
        self.save()


class MenuBurgerIngredient(models.Model):
    menu_burger = models.ForeignKey(
        MenuBurger,
        on_delete=models.CASCADE,
        related_name='ingredients'
    )
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('menu_burger', 'ingredient')

    def __str__(self):
        return f"{self.quantity} x {self.ingredient.name} en {self.menu_burger.name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.menu_burger.update_vegan_gluten_fields()

    def delete(self, *args, **kwargs):
        menu_burger = self.menu_burger
        super().delete(*args, **kwargs)
        menu_burger.update_vegan_gluten_fields()



from django.db import models
from django.contrib.auth.models import User
from datetime import date, timedelta
from usuario.models import Profile

# -------------------------
# Plan de suscripción
# -------------------------
class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100, unique=True)  
    price = models.DecimalField(max_digits=8, decimal_places=0)
    description = models.TextField(blank=True)
    max_monthly_publications = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name
    
    def deactivate(self):
        self.is_active = False
        self.save()

    def activate(self):
        self.is_active = True
        self.save()
    

# -------------------------
#  Suscripción de usuario
# -------------------------
class UserSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name}"

    def activate(self, duration_days=30):
        self.is_active = True
        self.start_date = date.today()
        self.end_date = self.start_date + timedelta(days=duration_days)
        self.save()

        profile = self.user.profile
        profile.is_fidelized = True
        profile.save()

    def deactivate(self):
        self.is_active = False
        self.save()

        profile = self.user.profile
        profile.is_fidelized = False
        profile.save()

    def check_expiration(self):
        if self.is_active and self.end_date and self.end_date < date.today():
            self.deactivate()
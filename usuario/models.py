from django.db import models
from django.contrib.auth.models import User
from datetime import date, timedelta

# -------------------------
# Perfil de usuario
# -------------------------
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    formacion = models.CharField(max_length=255, blank=True, null=True)
    # -------------------------
    # Fidelización (solo aplicable a clientes)
    # -------------------------
    is_fidelized = models.BooleanField(default=False)  

    def __str__(self):
        return self.user.username
    
    @property
    def es_cliente(self):
        return self.user.groups.filter(name='Client').exists()

    @property
    def cliente_fidelizado(self):
        return self.es_cliente and self.is_fidelized


# -------------------------
# Cocinero del Día
# -------------------------
class CocineroDelDia(models.Model):
    cocinero = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'groups__name': 'Cook'},
        related_name="cocinero_del_dia"
    )
    fecha = models.DateField(auto_now_add=True)
    activo = models.BooleanField(default=True)  

    class Meta:
        ordering = ['-fecha', '-id']

    def __str__(self):
        return f"{self.cocinero.username} - {self.fecha} ({'activo' if self.activo else 'inactivo'})"


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
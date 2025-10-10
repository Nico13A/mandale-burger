from django.db import models
from django.contrib.auth.models import User

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

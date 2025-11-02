from django.db import models
from django.contrib.auth.models import User

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    order = models.ForeignKey('order.Order', on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notificación para {self.user.username}: {self.message[:40]}"


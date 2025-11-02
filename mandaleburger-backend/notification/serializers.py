from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    order_info = serializers.CharField(source='order.__str__', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'message', 'order_info', 'created_at', 'read']

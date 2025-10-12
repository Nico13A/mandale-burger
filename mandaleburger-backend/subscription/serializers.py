from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import SubscriptionPlan, UserSubscription
from django.contrib.auth.models import User

# -------------------------
# Serializer para Planes de Suscripción
# -------------------------
class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ['id', 'name', 'price', 'description', 'max_monthly_publications', 'is_active']


# -------------------------
# Serializer para la Suscripción de un Usuario
# -------------------------
class UserSubscriptionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    plan = SubscriptionPlanSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(queryset=SubscriptionPlan.objects.all(), write_only=True, source='plan')
    payment_id = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = UserSubscription
        fields = ['id', 'user', 'plan', 'plan_id', 'payment_id', 'start_date', 'end_date', 'is_active']

    def validate_plan(self, plan):
        if not plan.is_active:
            raise ValidationError("No puedes suscribirte a un plan inactivo.")
        return plan
    
    def _get_user_from_context(self):
        if 'user' in self.context:
            return self.context['user']
        elif 'request' in self.context and hasattr(self.context['request'], 'user'):
            return self.context['request'].user
        raise ValidationError("No se encontró el usuario en el contexto.")

    def validate(self, attrs):
        user = self._get_user_from_context()
        if UserSubscription.objects.filter(user=user, is_active=True).exists():
            raise ValidationError("Ya tienes una suscripción activa.")
        return attrs

    def create(self, validated_data):
        user = self._get_user_from_context()
        validated_data['user'] = user
        subscription = UserSubscription.objects.create(**validated_data)
        subscription.activate()
        return subscription

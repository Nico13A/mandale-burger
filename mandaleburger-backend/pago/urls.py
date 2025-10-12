# pago/urls.py
from django.urls import path
from .views import CrearPreferenciaPagoView, mercado_pago_webhook

urlpatterns = [
    path("crear-preferencia/", CrearPreferenciaPagoView.as_view(), name="crear_preferencia_pago"),
    path("webhooks/mercadopago/", mercado_pago_webhook, name="webhook-pago"),
]


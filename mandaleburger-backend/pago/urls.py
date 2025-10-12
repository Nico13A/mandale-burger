from django.urls import path
from .views import CrearPreferenciaPagoView, mercado_pago_webhook, success_redirect

urlpatterns = [
    path("crear-preferencia/", CrearPreferenciaPagoView.as_view(), name="crear_preferencia_pago"),
    path("webhooks/mercadopago/", mercado_pago_webhook, name="webhook-pago"),
    path("success/", success_redirect, name="success_redirect"),
]


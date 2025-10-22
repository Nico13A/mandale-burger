from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth.models import User

import json
import mercadopago

from subscription.models import SubscriptionPlan, UserSubscription
from subscription.serializers import UserSubscriptionSerializer 

from django.shortcuts import redirect


# -------------------- CREAR PREFERENCIA DE PAGO --------------------
class CrearPreferenciaPagoView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get("plan_id")
        if not plan_id:
            return Response({"error": "plan_id es requerido"}, status=400)

        try:
            plan = SubscriptionPlan.objects.get(pk=plan_id, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "Plan no encontrado o inactivo"}, status=404)

        sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)

        BASE_URL = settings.URL_PAGO

        NOTIFICATION_URL = f"{BASE_URL}/api/pago/webhooks/mercadopago/"

        preference_data = {
            "items": [
                {"title": plan.name, "quantity": 1, "unit_price": float(plan.price)}
            ],
            "payer": {"email": request.user.email},
            "external_reference": str(request.user.id),
            
            "notification_url": NOTIFICATION_URL,

            "back_urls": {
                "success": f"{BASE_URL}/api/pago/success/",
            },

            "auto_return": "approved",
            
            "metadata": {
                "plan_id": plan.id, 
            },
        }

        print("Datos enviados a Mercado Pago:", json.dumps(preference_data, indent=2))

        try:
            preference_response = sdk.preference().create(preference_data)
            init_point = preference_response["response"]["init_point"]

            print(
                "Respuesta de Mercado Pago:", json.dumps(preference_response, indent=2)
            )
        except Exception as e:
            return Response(
                {"error": f"No se pudo crear la preferencia: {str(e)}"}, status=500
            )

        return Response({"init_point": init_point}, status=200)


#  -------------------- WEBHOOK DE MERCADO PAGO --------------------
@csrf_exempt
def mercado_pago_webhook(request):
    if request.method != "POST":
        return JsonResponse({"message": "Método no permitido"}, status=405)

    try:
        topic = request.GET.get("topic") or request.GET.get("type")
        body = json.loads(request.body.decode('utf-8'))
        resource_id = (body.get("data", {}).get("id") or request.GET.get("id"))

        print("───────────────────────────────")
        print(f"Notificación recibida - Topic: {topic}, ID: {resource_id}")

        if topic != "payment":
            return JsonResponse({"message": "Notificación ignorada (no es pago)"}, status=200)

        sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)
        payment_response = sdk.payment().get(resource_id)
        payment = payment_response.get("response", {})

        if not payment:
            print("No se pudo obtener la información del pago desde Mercado Pago.")
            return JsonResponse({"message": "Pago no encontrado"}, status=200)

        status = payment.get("status")
        external_reference = payment.get("external_reference")
        metadata = payment.get("metadata", {})
        payment_id = str(payment.get("id"))

        print(f"Estado del pago consultado: {status}")
        print(f"Referencia externa (User ID): {external_reference}")

        if status != "approved":
            print("Pago no aprobado. No se crea suscripción.")
            return JsonResponse({"message": "Pago no aprobado"}, status=200)

        try:
            user = User.objects.get(pk=int(external_reference))
        except User.DoesNotExist:
            print(f"ERROR: Usuario con ID {external_reference} no encontrado.")
            return JsonResponse({"message": "Usuario no encontrado"}, status=200)
        
        if UserSubscription.objects.filter(payment_id=payment_id).exists():
            print(f"Webhook ya procesado para este payment_id: {payment_id}")
            return JsonResponse({"message": "Webhook ya procesado para este pago"}, status=200)

        if UserSubscription.objects.filter(user=user, is_active=True).exists():
            print(f"Alerta de Concurrencia: El usuario {user.id} ya tiene una suscripción activa. Webhook ignorado.")
            return JsonResponse({"message": "Suscripción ya activa, webhook ignorado"}, status=200)

        plan_id = metadata.get("plan_id")
        if not plan_id:
            print("ERROR: Falta plan_id en metadata.")
            return JsonResponse({"message": "Falta plan_id en metadata"}, status=200)

        try:
            plan = SubscriptionPlan.objects.get(pk=plan_id)
        except SubscriptionPlan.DoesNotExist:
            print(f"ERROR: Plan con ID {plan_id} no encontrado.")
            return JsonResponse({"message": "Plan no encontrado"}, status=200)

        data = {"plan_id": plan.id, "payment_id": payment_id}
        serializer = UserSubscriptionSerializer(data=data, context={"user": user})

        if serializer.is_valid():
            subscription = serializer.save()
            print(f"¡Suscripción del usuario {user.id} creada con éxito! Plan: {subscription.plan.name}")
        else:
            print(f"ERROR de validación: {serializer.errors}")

        return JsonResponse({"message": "Webhook procesado correctamente"}, status=200)

    except Exception as e:
        print(f"Excepción general en Webhook: {e}")
        return JsonResponse({"message": "Error interno (ver logs)"}, status=200)


def success_redirect(request):
    return redirect("http://localhost:5173")
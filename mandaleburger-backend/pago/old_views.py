import json
import mercadopago
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import HttpResponse

@csrf_exempt
@require_POST
def crear_preferencia(request):
    sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)

    # Leer datos del request
    body = json.loads(request.body.decode("utf-8")) if request.body else {}
    email = body.get("email", "test_user_123456@testuser.com")
    precio = body.get("precio", 2500.00)

    # URL pública generada por ngrok
    ngrok_url = "https://unplunderous-jacki-noncontumacious.ngrok-free.dev"

    preference_data = {
        "items": [
            {
                "title": "Suscripción mensual",
                "quantity": 1,
                "unit_price": float(precio),
                "currency_id": "ARS"
            }
        ],
        "payer": {"email": email},
        "back_urls": {
            "success": f"{ngrok_url}/pago/exitoso",
            "failure": f"{ngrok_url}/pago/fallido",
            "pending": f"{ngrok_url}/pago/pendiente"
        },
        "auto_return": "approved"
    }

    try:
        preference_response = sdk.preference().create(preference_data)
        print("📦 Respuesta completa de MP:", preference_response)

        preference = preference_response.get("response", {})
        if "id" not in preference:
            print("⚠️ Error en la respuesta de MP:", preference)
            return JsonResponse({"error": "Preferencia no creada", "detalle": preference}, status=400)

        return JsonResponse({
            "id": preference["id"],
            "init_point": preference.get("sandbox_init_point", preference["init_point"])
        })

    except Exception as e:
        print("❌ Excepción al crear preferencia:", e)
        return JsonResponse({"error": str(e)}, status=500)

def pago_exitoso(request):
    return HttpResponse("✅ Pago exitoso")

def pago_fallido(request):
    return HttpResponse("❌ Pago fallido")

def pago_pendiente(request):
    return HttpResponse("⏳ Pago pendiente")
active_subscriptions = user.usersubscription_set.filter(
    end_date__gte=timezone.now()
)

# Cambiar esto despues en el backend en promotion views listado.



# En el modelo de suscripcion poner esto
def check_expiration(self):
    if not self.is_active:
        return False 
    if not self.end_date:
        return False 
    if self.end_date < date.today():
        self.deactivate()
        return True  
    return False  

          
          
## Agregar esto en path del frontend          
    <Route path="/client/profile" element={<Profile />} />




```python
# -------------------- CREAR PREFERENCIA DE PAGO -------------------- (Respaldo)
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
```






```python
# -------------------- CREAR PREFERENCIA DE PAGO ORDEN --------------------
class CrearPreferenciaPedidoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")
        if not order_id:
            return Response({"error": "order_id es requerido"}, status=400)

        try:
            order = Order.objects.get(pk=order_id, user=request.user, status="pending")
        except Order.DoesNotExist:
            return Response({"error": "Pedido no encontrado o ya procesado"}, status=404)

        sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)

        BASE_URL = settings.URL_PAGO
        NOTIFICATION_URL = f"{BASE_URL}/api/pago/webhooks/mercadopago/"

        preference_data = {
            "items": [
                {
                    "title": f"Pedido #{order.id}",
                    "quantity": 1,
                    "unit_price": float(order.total_price)
                }
            ],
            "payer": {"email": request.user.email},
            "external_reference": f"order_{order.id}",
            "notification_url": NOTIFICATION_URL,
            "back_urls": {
                "success": f"{BASE_URL}/api/pago/success/",
            },
            "auto_return": "approved",
            "metadata": {
                "order_id": order.id,
                "type": "order"
            },
        }

        try:
            preference_response = sdk.preference().create(preference_data)
            init_point = preference_response["response"]["init_point"]
        except Exception as e:
            return Response({"error": f"No se pudo crear la preferencia: {str(e)}"}, status=500)

        return Response({"init_point": init_point}, status=200)
```





## Asi queda lo nuevo
```python
# -------------------- CREAR PREFERENCIA DE PAGO --------------------
class CrearPreferenciaPagoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        plan_id = request.data.get("plan_id")
        is_mobile = request.data.get("mobile", False)  

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
            "metadata": {"plan_id": plan.id},
        }

        if not is_mobile:
            preference_data["back_urls"] = {"success": f"{BASE_URL}/api/pago/success/"}
            preference_data["auto_return"] = "approved"

        print("Datos enviados a Mercado Pago:", json.dumps(preference_data, indent=2))

        try:
            preference_response = sdk.preference().create(preference_data)
            init_point = preference_response["response"]["init_point"]
            print("Respuesta de Mercado Pago:", json.dumps(preference_response, indent=2))
        except Exception as e:
            return Response({"error": f"No se pudo crear la preferencia: {str(e)}"}, status=500)

        return Response({"init_point": init_point}, status=200)


# -------------------- CREAR PREFERENCIA DE PAGO ORDEN --------------------
class CrearPreferenciaPedidoView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("order_id")
        is_mobile = request.data.get("mobile", False) 

        if not order_id:
            return Response({"error": "order_id es requerido"}, status=400)

        try:
            order = Order.objects.get(pk=order_id, user=request.user, status="pending")
        except Order.DoesNotExist:
            return Response({"error": "Pedido no encontrado o ya procesado"}, status=404)

        sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)
        BASE_URL = settings.URL_PAGO
        NOTIFICATION_URL = f"{BASE_URL}/api/pago/webhooks/mercadopago/"

        preference_data = {
            "items": [
                {
                    "title": f"Pedido #{order.id}",
                    "quantity": 1,
                    "unit_price": float(order.total_price)
                }
            ],
            "payer": {"email": request.user.email},
            "external_reference": f"order_{order.id}",
            "notification_url": NOTIFICATION_URL,
            "metadata": {
                "order_id": order.id,
                "type": "order"
            },
        }

        if not is_mobile:
            preference_data["back_urls"] = {"success": f"{BASE_URL}/api/pago/success/"}
            preference_data["auto_return"] = "approved"

        try:
            preference_response = sdk.preference().create(preference_data)
            init_point = preference_response["response"]["init_point"]
        except Exception as e:
            return Response({"error": f"No se pudo crear la preferencia: {str(e)}"}, status=500)

        return Response({"init_point": init_point}, status=200)
```



## Agregar esto en el boton del creado de hamburguesa
```css
flex items-center justify-center
```
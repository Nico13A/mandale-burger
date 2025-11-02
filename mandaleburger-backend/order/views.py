from rest_framework import viewsets, permissions, status
from .models import Order
from .serializers import OrderSerializer, OrderSerializerLite, OrderCocinaSerializer
from usuario.models import CocineroDelDia
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils.timezone import localdate
from .permissions import IsCookUser


class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vista para listar y consultar órdenes.
    - Cliente: ve solo sus propias órdenes.
    - Cocinero del día: ve todas las órdenes del día.
    - AppAdmin: ve todas las órdenes.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Cliente: solo sus órdenes
        if user.groups.filter(name="Client").exists():
            return Order.objects.filter(user=user).order_by('-created_at')

        # Cocinero: solo si es el cocinero del día actual
        elif user.groups.filter(name="Cook").exists():
            hoy = localdate()
            cocinero_hoy = CocineroDelDia.objects.filter(
                cocinero=user,
                fecha=hoy,
                activo=True
            ).first()
            if cocinero_hoy:
                return Order.objects.filter(
                    Q(created_at__date=hoy) | 
                    Q(status__in=["paid", "in_progress", "ready_for_pickup"])
                ).exclude(status__in=["cancelled", "pending"]).order_by('created_at')
            return Order.objects.none()

        # AppAdmin: ve todo
        elif user.groups.filter(name="AppAdmin").exists():
            return Order.objects.all().order_by('-created_at')

        # Si no pertenece a ningún grupo válido
        return Order.objects.none()

    def get_serializer_class(self):
        user = self.request.user
        if user.groups.filter(name="AppAdmin").exists():
            return OrderSerializer  
        return OrderSerializerLite  


    # -------------------------
    # Acción para avanzar estado
    # -------------------------
    @action(detail=True, methods=["post"])
    def advance_status(self, request, pk=None):
        """
        Permite al cocinero (o cliente) avanzar el estado de la orden.
        Body ejemplo: {"new_status": "in_progress"}
        """
        from notification.models import Notification
        order = self.get_object()
        new_status = request.data.get("new_status")

        if not new_status:
            return Response({"error": "Debe indicar el nuevo estado"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order.advance_status(new_status, request.user)
            # -------------------------
            # Crear notificación para el cliente
            # -------------------------
            mensaje = None
            if new_status == 'in_progress':
                mensaje = "Tu orden está siendo preparada"
            elif new_status == 'ready_for_pickup':
                mensaje = "Tu orden está lista para retirar"

            if mensaje:
                Notification.objects.create(
                    user=order.user,  
                    order=order,
                    message=mensaje
                )
            return Response({"message": f"Estado actualizado a '{new_status}'"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)




class CocinaOrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet solo para cocineros, devuelve las órdenes con ingredientes.
    """
    permission_classes = [IsCookUser]
    serializer_class = OrderCocinaSerializer

    def get_queryset(self):
        user = self.request.user

        hoy = localdate()
        cocinero_hoy = CocineroDelDia.objects.filter(
            cocinero=user,
            fecha=hoy,
            activo=True
        ).first()
        if cocinero_hoy:
            return Order.objects.filter(
                Q(created_at__date=hoy) |
                Q(status__in=["paid", "in_progress", "ready_for_pickup"])
            ).exclude(status__in=["cancelled", "pending"]).order_by('created_at')
        return Order.objects.none()
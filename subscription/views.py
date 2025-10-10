from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
from .models import SubscriptionPlan, UserSubscription
from .serializers import SubscriptionPlanSerializer, UserSubscriptionSerializer
from usuario.permissions import IsInGroup


# =========================
# Crear plan de suscripción (solo Admin) 
# =========================
class SubscriptionPlanCreateView(generics.CreateAPIView):
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']  


# =========================
# Edición de plan de suscripción (solo Admin)
# =========================
class SubscriptionPlanUpdateView(generics.UpdateAPIView):
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']
    queryset = SubscriptionPlan.objects.all()  


# =========================
# Baja de plan de suscripción (solo Admin)
# =========================
class SubscriptionPlanDeactivateView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']

    def patch(self, request, pk):
        try:
            plan = SubscriptionPlan.objects.get(pk=pk, is_active=True)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "Plan no encontrado o ya inactivo"}, status=status.HTTP_404_NOT_FOUND)

        plan.is_active = False
        plan.save()

        usuarios_activos = UserSubscription.objects.filter(plan=plan, is_active=True).count()
        mensaje_extra = ""
        if usuarios_activos > 0:
            mensaje_extra = f" Hay {usuarios_activos} usuarios que mantienen este plan hasta su vencimiento."

        return Response(
            {"success": f"Plan dado de baja.{mensaje_extra}"},
            status=status.HTTP_200_OK
        )


# =========================
# Alta de plan de suscripción (solo Admin)
# =========================
class SubscriptionPlanActivateView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']

    def patch(self, request, pk):
        try:
            plan = SubscriptionPlan.objects.get(pk=pk, is_active=False)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "Plan no encontrado o ya activo"}, status=status.HTTP_404_NOT_FOUND)

        plan.is_active = True
        plan.save()
        return Response({"success": "Plan reactivado"}, status=status.HTTP_200_OK)


# =========================
# Listado de planes 
# =========================
class SubscriptionPlanListView(generics.ListAPIView):
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['Client', 'AppAdmin']  

    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='AppAdmin').exists():
            return SubscriptionPlan.objects.all()
        return SubscriptionPlan.objects.filter(is_active=True)


# =========================
# Creación de suscripción a un plan 
# =========================
class UserSubscriptionCreateView(generics.CreateAPIView):
    serializer_class = UserSubscriptionSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['Client'] 


# =========================
# Detalle para ver propio plan activo
# =========================
class UserSubscriptionDetailView(generics.RetrieveAPIView):
    serializer_class = UserSubscriptionSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['Client']

    def get_object(self):
        today = date.today()  
        return UserSubscription.objects.filter(
            user=self.request.user,   
            is_active=True,         
            end_date__gte=today      
        ).first() 
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from datetime import date
from .serializers import (
    RegisterUserSerializer,
    CurrentUserSerializer,
    CocineroSerializer,
    ProfileImageUpdateSerializer,
    CreateCocineroSerializer,
    AdminUserUpdateSerializer,
    CocineroDelDiaCreateSerializer,
    CocineroDelDiaSerializer,
    ClienteSerializer,
    ClienteUpdateSerializer,
    UserProfileUpdateSerializer,
    ChangePasswordSerializer,
)
from .subscriptions_serializers import (SubscriptionPlanSerializer, UserSubscriptionSerializer)
from .permissions import IsInGroup
from .models import Profile, CocineroDelDia, SubscriptionPlan, UserSubscription
from .pagination import StandardResultsSetPagination
from django.db.models import Q


# =========================
# Registro de usuario (Client)
# =========================
class RegisterUserView(generics.CreateAPIView):
    serializer_class = RegisterUserSerializer
    permission_classes = [AllowAny]


# =========================
# Usuario actual
# =========================
class CurrentUserView(APIView):
    allowed_groups = ['Client', 'Cook', 'AppAdmin']
    permission_classes = [IsAuthenticated, IsInGroup]

    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)


# =========================
# Editar propio perfil
# =========================
class UserProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    

# =========================
# Cambio de contraseña
# =========================
class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# =========================
# Actualizar foto de perfil
# =========================
class ProfileImageUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileImageUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


# =========================
# Crear Cocinero (solo Admin)
# =========================
class CreateCocineroView(generics.CreateAPIView):
    serializer_class = CreateCocineroSerializer
    allowed_groups = ['AppAdmin']
    permission_classes = [IsAuthenticated, IsInGroup]


# =========================
# Lista de cocineros activos (solo Admin)
# =========================
class CocineroListView(generics.ListAPIView):
    serializer_class = CocineroSerializer
    allowed_groups = ['AppAdmin']
    permission_classes = [IsAuthenticated, IsInGroup]

    def get_queryset(self):
        return User.objects.filter(groups__name='Cook', is_active=True)
    

# =========================
# Lista de cocineros inactivos (solo Admin)
# =========================
class CocineroInactiveListView(generics.ListAPIView):
    serializer_class = CocineroSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']

    def get_queryset(self):
        return User.objects.filter(groups__name='Cook', is_active=False)


# =========================
# Editar cocinero (solo Admin)
# =========================
class CocineroUpdateView(generics.UpdateAPIView):
    queryset = User.objects.filter(groups__name="Cook")
    serializer_class = AdminUserUpdateSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']


# =========================
# Borrado lógico de cocinero (solo Admin)
# =========================
class CocineroDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']

    def delete(self, request, pk):
        try:
            cocinero = User.objects.get(pk=pk, groups__name="Cook", is_active=True)
        except User.DoesNotExist:
            return Response({"error": "Cocinero no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        hoy = date.today()
        if CocineroDelDia.objects.filter(cocinero=cocinero, fecha=hoy, activo=True).exists():
            return Response(
                {"error": "No se puede dar de baja: Este cocinero es el cocinero del día activo."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cocinero.is_active = False
        cocinero.save()
        return Response({"success": "Cocinero dado de baja"}, status=status.HTTP_200_OK)
    

# =========================
# Dar de alta (solo Admin)
# =========================
class CocineroActivateView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']

    def patch(self, request, pk):
        try:
            cocinero = User.objects.get(pk=pk, groups__name='Cook', is_active=False)
        except User.DoesNotExist:
            return Response({"error": "Cocinero no encontrado o ya activo"}, status=status.HTTP_404_NOT_FOUND)

        cocinero.is_active = True
        cocinero.save()
        return Response({"success": "Cocinero dado de alta"}, status=status.HTTP_200_OK)


# =========================
# Crear Cocinero del Día (solo Admin)
# =========================
class CocineroDelDiaCreateView(generics.CreateAPIView):
    serializer_class = CocineroDelDiaCreateSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']


# =========================
# Cocinero del día actual
# =========================
class CocineroDelDiaActualView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hoy = date.today()
        cocinero = CocineroDelDia.objects.filter(fecha=hoy, activo=True).first()
        serializer = CocineroDelDiaSerializer(cocinero) if cocinero else None
        return Response(serializer.data if serializer else None, status=200)


# =========================
# Gestión de clientes (solo Admin)
# =========================
class ClienteListView(generics.ListAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        activos = self.request.query_params.get('activos', 'true').lower() == 'true'
        queryset = User.objects.filter(groups__name="Client", is_active=activos)

        search = self.request.query_params.get('search', '').strip()
        if search:
            terms = search.split()
            for term in terms:
                queryset = queryset.filter(
                    Q(first_name__icontains=term) | Q(last_name__icontains=term)
                )

        return queryset


# =========================
# Alta de cliente (solo Admin)
# =========================
class ClienteActivateView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']

    def patch(self, request, pk):
        try:
            cliente = User.objects.get(pk=pk, groups__name="Client", is_active=False)
        except User.DoesNotExist:
            return Response({"error": "Cliente no encontrado o ya activo"}, status=status.HTTP_404_NOT_FOUND)
        cliente.is_active = True
        cliente.save()
        return Response({"success": "Cliente dado de alta"}, status=status.HTTP_200_OK)
    

# =========================
# Baja de cliente (solo Admin)
# =========================
class ClienteDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']

    def delete(self, request, pk):
        try:
            cliente = User.objects.get(pk=pk, groups__name="Client", is_active=True)
        except User.DoesNotExist:
            return Response({"error": "Cliente no encontrado o ya inactivo"}, status=status.HTTP_404_NOT_FOUND)
        cliente.is_active = False
        cliente.save()

        return Response({"success": "Cliente dado de baja"}, status=status.HTTP_200_OK)


# =========================
# Editar cliente (solo Admin)
# =========================
class ClienteUpdateView(generics.UpdateAPIView):
    queryset = User.objects.filter(groups__name="Client")
    serializer_class = ClienteUpdateSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']


# =========================
# Obtener cliente (solo Admin)
# =========================
class ClienteDetailView(generics.RetrieveAPIView):
    queryset = User.objects.filter(groups__name="Client")
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']


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
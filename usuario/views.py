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
)
from .permissions import IsInGroup
from .models import Profile, CocineroDelDia
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
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return User.objects.filter(groups__name='Cook', is_active=True)
    

# =========================
# Lista de cocineros inactivos (solo Admin)
# =========================
class CocineroInactiveListView(generics.ListAPIView):
    serializer_class = CocineroSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['AppAdmin']
    pagination_class = StandardResultsSetPagination

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

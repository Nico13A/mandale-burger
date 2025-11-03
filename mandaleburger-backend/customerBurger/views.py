from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomBurger, CustomBurgerUsuario
from .serializers import CustomBurgerSerializer, CustomerBurgerUsuarioSerializer
from usuario.permissions import IsInGroup


# -------------------------
# Crear burger personalizada (Cliente)
# -------------------------
class CustomBurgerCreateView(generics.CreateAPIView):
    serializer_class = CustomBurgerSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['Client']


# -------------------------
# Obtener detalle de burger
# -------------------------
class CustomBurgerDetailView(generics.RetrieveAPIView):
    serializer_class = CustomBurgerSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['Client', 'AppAdmin']
    queryset = CustomBurger.objects.select_related('user').prefetch_related('ingredients__ingredient').all()


# -------------------------
# Editar burger personalizada
# -------------------------
class CustomBurgerUpdateView(generics.UpdateAPIView):
    serializer_class = CustomBurgerSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['Client', 'AppAdmin']
    queryset = CustomBurger.objects.all()


# -------------------------
# Crear asociación burger-usuario para que otro usuario la pida
# -------------------------
class CustomBurgerUsuarioCreateView(generics.CreateAPIView):
    serializer_class = CustomerBurgerUsuarioSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['Client', 'AppAdmin']


# -------------------------
# Listar burgers (Cliente o Admin)
# -------------------------
class CustomBurgerListView(generics.ListAPIView):
    serializer_class = CustomBurgerSerializer
    permission_classes = [IsAuthenticated, IsInGroup]
    allowed_groups = ['Client', 'AppAdmin']

    def get_queryset(self):
        user = self.request.user
        qs = CustomBurger.objects.select_related('user').prefetch_related('ingredients__ingredient')

        # Si es admin → ve todas
        if user.groups.filter(name='AppAdmin').exists():
            return qs.all()
        # Si es cliente → ve solo activas
        return qs.filter(is_active=True, user=user)

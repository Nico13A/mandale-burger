from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .serializers import RegisterUserSerializer, CurrentUserSerializer
from rest_framework.permissions import AllowAny
from .permissions import IsInGroup

# =========================
# Vista para traer usuario actual
# =========================
class CurrentUserView(APIView):
    allowed_groups = ['Client', 'Cook', 'AppAdmin']
    permission_classes = [IsAuthenticated, IsInGroup]
    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)


# =========================
# Registro de usuario
# =========================
class RegisterUserView(generics.CreateAPIView):
    serializer_class = RegisterUserSerializer
    permission_classes = [AllowAny]

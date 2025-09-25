from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .serializers import RegisterUserSerializer, CurrentUserSerializer, CocineroSerializer
from rest_framework.permissions import AllowAny
from .permissions import IsInGroup
from django.contrib.auth.models import User

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


class CocineroListView(generics.ListAPIView):
    serializer_class = CocineroSerializer
    allowed_groups = ['AppAdmin']
    permission_classes = [IsAuthenticated, IsInGroup]

    def get_queryset(self):
        return User.objects.filter(groups__name='Cook')

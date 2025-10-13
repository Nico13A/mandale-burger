from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404

from .models import Publication, Comment
from .serializers import (
    PublicationListSerializer,
    PublicationDetailSerializer,
    CommentSerializer,
)

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permite lectura a cualquiera; escritura solo al dueño del objeto.
    Sirve para proteger PUT/PATCH/DELETE.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(obj, "user_id", None) == getattr(request.user, "id", None)


class PublicationViewSet(viewsets.ModelViewSet):
    """
    /api/publications/            (GET, POST)
    /api/publications/{id}/       (GET, PUT, PATCH, DELETE)
    /api/publications/{id}/comments/        (POST)   -> crear comentario del post
    /api/publications/{id}/list_comments/   (GET)    -> listar comentarios del post
    """
    queryset = (
        Publication.objects
        .select_related('user')
        .prefetch_related('comments')  
        .all()
    )
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  

    def get_serializer_class(self):
        # Detalle con comentarios anidados
        return PublicationDetailSerializer if self.action == 'retrieve' else PublicationListSerializer

    def perform_create(self, serializer):
        # El “creador” es el usuario autenticado del token
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def comments(self, request, pk=None):
        """
        Crear un comentario para ESTA publicación.
        Body: { "comment_text": "..." }
        """
        publication = get_object_or_404(Publication, pk=pk)
        ser = CommentSerializer(
            data=request.data,
            context={'request': request, 'publication': publication}
        )
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def list_comments(self, request, pk=None):
        """
        Listar comentarios de ESTA publicación.
        """
        qs = Comment.objects.select_related('user').filter(publication_id=pk)
        ser = CommentSerializer(qs, many=True)
        return Response(ser.data)


class CommentViewSet(viewsets.ModelViewSet):
    """
    /api/comments/            (GET lista general, POST directo opcional)
    /api/comments/{id}/       (GET, PUT, PATCH, DELETE)
    Nota: para crear desde la publicación usar /publications/{id}/comments/
    """
    queryset = Comment.objects.select_related('user', 'publication').all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        """
        Soporte opcional: permitir POST directo a /api/comments/ con 'publication' en el body.
        Igual setea el user del token.
        """
        serializer.save(user=self.request.user)

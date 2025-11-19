from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.shortcuts import get_object_or_404
from subscription.models import UserSubscription
from .models import Publication, Comment, Rating
from django.utils import timezone
from datetime import date, timedelta
from rest_framework.exceptions import ValidationError
from .serializers import (
    PublicationListSerializer,
    PublicationDetailSerializer,
    CommentSerializer,
)
from .serializers import RatingSerializer
from usuario.permissions import IsInGroup 
from django.db.models import Avg, Count, F
from .pagination import StandardResultsSetPagination

def _enforce_publication_quota(user):
    sub = (
        UserSubscription.objects
        .select_related('plan')
        .filter(user=user, is_active=True, end_date__gte=date.today()) 
        .order_by('-id')
        .first()
    )
    if not sub:
        raise ValidationError({"subscription": "Necesitás un plan activo para publicar."})
    try:
        limit = int(getattr(sub.plan, 'max_monthly_publications', 0))
    except (TypeError, ValueError):
        limit = 0
    if limit <= 0:
        return

    now = timezone.now()
    period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    period_end = (period_start + timedelta(days=32)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    usados = Publication.objects.filter(
        user=user,
        publication_date__gte=period_start,
        publication_date__lt=period_end,
    ).count()

    if usados >= limit:
        raise ValidationError({
            "quota": f"Alcanzaste tu cupo mensual de ({limit}) publicaciones."
        })

# ========== PUBLICATIONS ==========

# LIST
class PublicationListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [JSONParser]
    serializer_class = PublicationListSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return (Publication.objects
                .select_related('user')
                .prefetch_related('comments', 'comments__user')
                .annotate(
                    average_score=Avg('ratings__score'),            
                    ratings_count=Count('ratings', distinct=True),
                )
                .order_by(
                    F('average_score').desc(nulls_last=True),
                    '-publication_date',
                )
            )

# CREATE
class PublicationCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser]
    serializer_class = PublicationDetailSerializer

    def perform_create(self, serializer):
        _enforce_publication_quota(self.request.user)
        serializer.save(user=self.request.user)

        
# RETRIEVE (detalle, lectura pública)
class PublicationRetrieveView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [JSONParser]
    serializer_class = PublicationDetailSerializer

    queryset = (Publication.objects
                .select_related('user')
                .prefetch_related('comments', 'comments__user')
                .all())

# UPDATE (PUT/PATCH) — sólo dueño o Admin
class PublicationUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser]
    serializer_class = PublicationDetailSerializer

    def get_queryset(self):
        qs = Publication.objects.all()
        user = self.request.user
        if user.groups.filter(name='AppAdmin').exists():
            return qs
        return qs.filter(user=user)

# DELETE — sólo dueño o Admin
class PublicationDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser]
    serializer_class = PublicationDetailSerializer

    def get_queryset(self):
        qs = Publication.objects.all()
        user = self.request.user
        if user.groups.filter(name='AppAdmin').exists():
            return qs
        return qs.filter(user=user)

# ========== COMMENTS ==========

# LIST de comentarios de una publicación
class PublicationCommentListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CommentSerializer

    def get_queryset(self):
        return (Comment.objects
                .select_related('user', 'publication')
                .filter(publication_id=self.kwargs['pk'])
                .order_by('-comment_date'))

# CREATE comentario para una publicación
class PublicationCommentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser]
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        publication = get_object_or_404(Publication, pk=kwargs['pk'])
        ser = self.get_serializer(
            data=request.data,
            context={'request': request, 'publication': publication}
        )
        ser.is_valid(raise_exception=True)
        self.perform_create(ser)
        return Response(ser.data, status=status.HTTP_201_CREATED)

#crea y actualiza la calificacion

class PublicationRatingCreateUpdateView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated, IsInGroup]
    allowed_groups = ['Client', 'AppAdmin']

    def get_publication(self):
        return get_object_or_404(Publication, pk=self.kwargs['pk'])

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['publication'] = self.get_publication()
        return context

    def perform_create(self, serializer):
        serializer.save()

#  LIST de todas las calificaciones de una publicación
class PublicationRatingListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RatingSerializer

    def get_queryset(self):
        return (
            Rating.objects
            .select_related('user', 'publication')
            .filter(publication_id=self.kwargs['pk'])
            .order_by('-created_at')
        )

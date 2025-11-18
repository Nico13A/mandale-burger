from django.urls import path
from .views import (
    PublicationListView,
    PublicationCreateView,
    PublicationRetrieveView,
    PublicationUpdateView,
    PublicationDeleteView,
    PublicationCommentListView,
    PublicationCommentCreateView,
    PublicationRatingCreateUpdateView,
    PublicationRatingListView,
)

urlpatterns = [
    path('publications/',                 PublicationListView.as_view(),      name='publication-list'),
    path('publications/create/',          PublicationCreateView.as_view(),    name='publication-create'),
    path('publications/<int:pk>/',        PublicationRetrieveView.as_view(),  name='publication-detail'),
    path('publications/<int:pk>/edit/',   PublicationUpdateView.as_view(),    name='publication-update'),
    path('publications/<int:pk>/delete/', PublicationDeleteView.as_view(),    name='publication-delete'),

    path('publications/<int:pk>/comments/',        PublicationCommentListView.as_view(),   name='publication-comments-list'),
    path('publications/<int:pk>/comments/create/', PublicationCommentCreateView.as_view(), name='publication-comments-create'),

    path(
        'publications/<int:pk>/ratings/', PublicationRatingListView.as_view(),         name='publication-ratings-list',),
    path('publications/<int:pk>/rating/', PublicationRatingCreateUpdateView.as_view(), name='publication-rating'),
]

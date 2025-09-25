from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterUserView.as_view(), name='register_api'),
    path('user/', views.CurrentUserView.as_view(), name='current_user'),
    path('cocineros/', views.CocineroListView.as_view(), name='cocineros_list'),
]


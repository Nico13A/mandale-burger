from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
   #path('login/', views.user_login, name='login')
    path('login/', views.RolBasedLoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('register/', views.register, name='register'),
    
    # Cambio de contraseña
    path('password_change/', auth_views.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),

    # Reset de contraseña
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),

    # Vistas segun rol
    path('vista/cliente/', views.vista_cliente, name='vista_cliente'),
    path('vista/cocinero/', views.vista_cocinero, name='vista_cocinero'),
    path('vista/admin/', views.vista_admin, name='vista_admin'),

    path('', views.dashboard, name='dashboard'),

    path('api/user/', views.CurrentUserView.as_view(), name='current_user'),
]
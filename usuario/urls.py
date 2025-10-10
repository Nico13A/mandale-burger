from django.urls import path
from . import views

urlpatterns = [
    # ------------------------------------
    # ENDPOINTS DE AUTENTICACIÓN Y PERFIL
    # ------------------------------------
    path('register/', views.RegisterUserView.as_view(), name='register_api'),
    path('user/', views.CurrentUserView.as_view(), name='current_user'),
    path('user/profile/', views.UserProfileUpdateView.as_view(), name='user_profile_update'),
    path('user/profile/image/', views.ProfileImageUpdateView.as_view(), name='update_profile_image'),
    path('user/change-password/', views.ChangePasswordView.as_view(), name='change_password'),

    # ------------------------------------
    # ENDPOINTS DE GESTIÓN DE COCINEROS (ADMIN)
    # ------------------------------------
    
    # Registro de cocineros
    path('cocineros/create/', views.CreateCocineroView.as_view(), name='cocinero_create'),

    # Listados
    path('cocineros/active/', views.CocineroListView.as_view(), name='cocineros_list_active'),
    path('cocineros/inactive/', views.CocineroInactiveListView.as_view(), name='cocineros_list_inactive'),
    
    # Actualización, alta y baja lógica
    path('cocineros/<int:pk>/edit/', views.CocineroUpdateView.as_view(), name='cocinero_update'),
    path('cocineros/<int:pk>/delete/', views.CocineroDeleteView.as_view(), name='cocinero_logical_delete'),
    path('cocineros/<int:pk>/activate/', views.CocineroActivateView.as_view(), name='cocinero_activate'),

    # ------------------------------------
    # ENDPOINTS DE COCINERO DEL DÍA
    # ------------------------------------
    path('cocinero-dia/create/', views.CocineroDelDiaCreateView.as_view(), name='cocinero_dia_create'),
    # Obtener cocinero del día actual
    path('cocinero-dia/actual/', views.CocineroDelDiaActualView.as_view(), name='cocinero_dia_actual'),

    # ------------------------------------
    # ENDPOINTS DE GESTIÓN DE CLIENTES (ADMIN)
    # ------------------------------------
    path('clientes/', views.ClienteListView.as_view(), name='clientes_list'),
    path('clientes/<int:pk>/', views.ClienteDetailView.as_view(), name='cliente_detail'),
    path('clientes/<int:pk>/edit/', views.ClienteUpdateView.as_view(), name='cliente_update'),
    path('clientes/<int:pk>/delete/', views.ClienteDeleteView.as_view(), name='cliente_logical_delete'),
    path('clientes/<int:pk>/activate/', views.ClienteActivateView.as_view(), name='cliente_activate'),

]



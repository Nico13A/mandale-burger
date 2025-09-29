from django.urls import path
from . import views

urlpatterns = [
    # ------------------------------------
    # ENDPOINTS DE AUTENTICACIÓN Y PERFIL
    # ------------------------------------
    path('register/', views.RegisterUserView.as_view(), name='register_api'),
    path('user/', views.CurrentUserView.as_view(), name='current_user'),
    path('user/profile/image/', views.ProfileImageUpdateView.as_view(), name='update_profile_image'),

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
]



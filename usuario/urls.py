from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.RegisterUserView.as_view(), name='register_api'),
    path('user/', views.CurrentUserView.as_view(), name='current_user'),
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]


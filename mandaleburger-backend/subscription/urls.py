from django.urls import path
from . import views

urlpatterns = [
    # ------------------------------------
    # ENDPOINTS DE PLANES DE SUSCRIPCIÓN
    # ------------------------------------
    path('plans/', views.SubscriptionPlanListView.as_view(), name='subscription_plans_list'),
    path('plans/create/', views.SubscriptionPlanCreateView.as_view(), name='subscription_plan_create'),
    path('plans/<int:pk>/edit/', views.SubscriptionPlanUpdateView.as_view(), name='subscription_plan_edit'),
    path('plans/<int:pk>/deactivate/', views.SubscriptionPlanDeactivateView.as_view(), name='subscription_plan_deactivate'),
    path('plans/<int:pk>/activate/', views.SubscriptionPlanActivateView.as_view(), name='subscription_plan_activate'),

    # ------------------------------------
    # ENDPOINTS DE SUSCRIPCIÓN DE USUARIO
    # ------------------------------------
    path('user/active/', views.UserSubscriptionDetailView.as_view(), name='user_subscription_active'),
]
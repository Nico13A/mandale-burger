from django.urls import path
from . import views

urlpatterns = [
    # -------------------------
    # Promociones
    # -------------------------
    path('promotions/', views.PromotionBurgerListView.as_view(), name='promotion-list'),  
    path('promotions/create/', views.PromotionBurgerCreateView.as_view(), name='promotion-create'),
    path('promotions/<int:pk>/update/', views.PromotionBurgerUpdateView.as_view(), name='promotion-update'),
    path('promotions/<int:pk>/deactivate/', views.PromotionBurgerDeactivateView.as_view(), name='promotion-deactivate'),
    path('promotions/<int:pk>/activate/', views.PromotionBurgerActivateView.as_view(), name='promotion-activate'),

    # -------------------------
    # Asociar promoción a plan
    # -------------------------
    path('promotions/subscription/create/', views.PromotionSubscriptionCreateView.as_view(), name='promotion-subscription-create'),
]


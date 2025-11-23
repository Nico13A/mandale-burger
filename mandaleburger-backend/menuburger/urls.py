from django.urls import path
from .views import MenuBurgerAllListView, MenuBurgerListView, MenuBurgerDetailView

urlpatterns = [
    path('', MenuBurgerListView.as_view(), name='menu-burger-list'),
    path('all/', MenuBurgerAllListView.as_view()),
    path('<int:pk>/', MenuBurgerDetailView.as_view(), name='menu-burger-detail'),
]

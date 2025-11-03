from django.urls import path
from .views import (
    CustomBurgerListView,
    CustomBurgerCreateView,
    CustomBurgerDetailView,
    CustomBurgerUpdateView,
    CustomBurgerUsuarioCreateView,
)

app_name = "customerBurger"

urlpatterns = [
    path("customer-burgers/",                  CustomBurgerListView.as_view(),      name="customerburger-list"),
    path("customer-burgers/create/",           CustomBurgerCreateView.as_view(),    name="customerburger-create"),
    path("customer-burgers/<int:pk>/",         CustomBurgerDetailView.as_view(),    name="customerburger-detail"),
    path("customer-burgers/<int:pk>/update/",  CustomBurgerUpdateView.as_view(),    name="customerburger-update"),
    path("customer-burgers/usuario/create/",   CustomBurgerUsuarioCreateView.as_view(), name="customerburger-usuario-create"),
]

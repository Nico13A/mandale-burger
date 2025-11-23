from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import MenuBurger
from .serializers import MenuBurgerSerializer


class BurgerPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'


class MenuBurgerListView(generics.ListAPIView):
    serializer_class = MenuBurgerSerializer
    queryset = MenuBurger.objects.filter(is_active=True)
    pagination_class = BurgerPagination

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend
    ]

    search_fields = ['name', 'description']
    filterset_fields = ['is_vegan', 'is_gluten_free']


class MenuBurgerAllListView(generics.ListAPIView):
    serializer_class = MenuBurgerSerializer
    queryset = MenuBurger.objects.filter(is_active=True)
    pagination_class = None


class MenuBurgerDetailView(generics.RetrieveAPIView):
    serializer_class = MenuBurgerSerializer
    queryset = MenuBurger.objects.filter(is_active=True)

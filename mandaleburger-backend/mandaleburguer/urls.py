from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('usuario.urls')),  
    path('api/subscription/', include('subscription.urls')),
    path('api/pago/', include('pago.urls')),
    path('api/', include('core.urls')),
    path('api/', include('promotion.urls')),
    path('api/', include('post.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('order.urls')),
    path('api/notifications/', include('notification.urls')),
    path('api/burgers/', include('menuburger.urls')),

    
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),

    path("api/", include("customerBurger.urls")),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
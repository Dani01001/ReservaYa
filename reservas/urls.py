from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'restaurantes', views.RestauranteViewSet)
router.register(r'reservas', views.ReservaViewSet, basename='reservas')

urlpatterns = [
    path('', include(router.urls)),                   # /api/reservas/ + viewsets
    path('crear/', views.crear_reserva, name='crear_reserva'),
    path('lista/', views.lista_reservas, name='lista_reservas'),
    path('detalle/<str:nombre>/', views.detalle_restaurante, name='detalle_restaurante'),
    path('pagina/', views.reservas_view, name='reservas'),
    path('registro/', views.registro_view, name='registro'),
    path('login/', views.login_view, name='login'),
    path('quienes-somos/', views.quienes_somos, name='quienes_somos'),
]

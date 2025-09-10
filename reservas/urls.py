from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    crear_reserva,
    RestauranteViewSet,
    ReservaViewSet,
    detalle_restaurante,
    registro_view, 
    login_view
)

router = DefaultRouter()
router.register(r'restaurantes', RestauranteViewSet)
router.register(r'reservas', ReservaViewSet, basename='reserva')

urlpatterns = [
    # ===== API DRF =====
    path('api/', include(router.urls)),
    path('api/crear-reserva/', crear_reserva, name='crear_reserva'),

    # ===== Rutas frontend =====
    # Acceso a cualquier restaurante por nombre del template sin extensión
    path('rest/<str:nombre>/', detalle_restaurante, name='detalle_restaurante'),

    # Rutas para registro e inicio de sesión
    path('registro/', registro_view, name='registro'),
    path('login/', login_view, name='login'),

    # Ruta principal de reservas
    path('', views.reservas_view, name='reservas'),
]

from django.urls import include, path
from .views import crear_reserva, reservas_page, RestauranteViewSet, ReservaViewSet
from rest_framework.routers import DefaultRouter
from rest_framework.routers import DefaultRouter
from .views import ReservaViewSet

router = DefaultRouter()
router.register(r'restaurantes', RestauranteViewSet)
router.register(r'reservas', ReservaViewSet, basename='reserva')

urlpatterns = router.urls

# Ruta para la página de reservas
urlpatterns += [
    path('pagina/', reservas_page, name='reservas_page'),
    path('crear/', crear_reserva, name='crear_reserva'),
]

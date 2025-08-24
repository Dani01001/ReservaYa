from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestauranteViewSet, MesaViewSet, ReservaViewSet

router = DefaultRouter()
router.register(r'restaurantes', RestauranteViewSet)
router.register(r'mesas', MesaViewSet)
router.register(r'reservas', ReservaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]



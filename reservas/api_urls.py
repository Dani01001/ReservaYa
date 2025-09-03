# reservas/api_urls.py
from django.urls import path, include
from .api_views import ReservaViewSet, usuario_actual
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'reservas', ReservaViewSet)

urlpatterns = [
    path('usuario/', usuario_actual),  
    path('', include(router.urls)),
]

# reservas/api_urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import ReservaViewSet

router = DefaultRouter()
router.register(r'reservas', ReservaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.crear_reserva, name='crear_reserva'),
    path('listar/', views.listar_reservas, name='listar_reservas'),
    path('api/', include('reservas.api_urls')),
]


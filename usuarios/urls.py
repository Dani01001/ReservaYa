from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista_usuarios, name='lista_usuarios'),
    path("registrar", views.registrar_usuario, name="registrar_usuario"),
    path("registro/", views.registrar_usuario, name="registro"),
    path("login/", views.iniciar_sesion, name="iniciar_sesion"),
    path("logout/", views.cerrar_sesion, name="cerrar_sesion"),
]

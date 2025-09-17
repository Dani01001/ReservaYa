from django.urls import path
from . import views

urlpatterns = [
    path('', views.lista_usuarios, name='lista_usuarios'),
    path('usuario/', views.usuario, name='usuario'),
    path('usuario/actualizar/', views.actualizar_usuario, name='actualizar_usuario'),
    path('usuario/cambiar_contrasena/', views.cambiar_contrasena, name='cambiar_contrasena'),
    path('principal_publi/', views.principal_publi, name="principal_publi"),
    path("registrar/", views.registrar_usuario, name="registrar_usuario"),
    path("registro/", views.registrar_usuario, name="registro"),
    path("login/", views.iniciar_sesion, name="iniciar_sesion"),
    path("logout/", views.cerrar_sesion, name="cerrar_sesion"),
    path("completar-datos/", views.completar_datos, name="completar_datos"),
]

from django.urls import path
from . import views
urlpatterns = [
    # API JSON
    path('', views.lista_usuarios, name='lista_usuarios'),
    path('registrar/', views.registrar_usuario, name='registrar_usuario'),
    path('registro/', views.registrar_usuario, name='registro'),
    path('login/', views.iniciar_sesion, name='iniciar_sesion'),
    path('logout/', views.cerrar_sesion, name='logout_view'),  # 🔹 nombre actualizado para templates

    # Vistas HTML
    path('usuario/', views.usuario, name='usuario'),
    path('usuario/actualizar/', views.actualizar_usuario, name='actualizar_usuario'),
    path('usuario/cambiar_contrasena/', views.cambiar_contrasena, name='cambiar_contrasena'),
    path('principal_publi/', views.principal_publi, name='principal_publi'),
    path('completar-datos/', views.completar_datos, name='completar_datos'),
    path('perfil/', views.perfil_view, name='perfil_view'),
    path("usuario/mis_reservas/", views.mis_reservas, name="mis_reservas"),
    path("api/reservas/<int:reserva_id>/cancelar/", views.cancelar_reserva, name="cancelar_reserva"),
    path("api/reservas/<int:reserva_id>/editar/", views.editar_reserva, name="editar_reserva"),
    path("reservaya_rest/", views.reservaya_rest, name="reservaya_rest"),

]
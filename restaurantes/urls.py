from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from usuarios import views as user_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # API
    path('api/usuarios/', include('usuarios.urls')),
    path('api/reservas/', include('reservas.urls')),   # API de reservas limpia
    path('accounts/', include('allauth.urls')),

    # Páginas frontend
    path('', TemplateView.as_view(template_name='principal_publi.html'), name="inicio"),
    path('registro/', user_views.registro_view, name='registro'),
    path('login/', user_views.login_view, name='login'),
    path('logout/', user_views.logout_view, name='logout'),
    path('perfil/', user_views.perfil_view, name='perfil'),
]

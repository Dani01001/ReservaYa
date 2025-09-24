from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from reservas.models import Restaurante
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    perfil_imagen = models.ImageField(upload_to='perfiles/', blank=True, null=True)
    avatar_color = models.CharField(max_length=6, blank=True, null=True) 
    direccion = models.CharField(max_length=255, blank=True, null=True)
    es_admin = models.BooleanField(default=False)

    # Campos para control de cambios
    last_username_change = models.DateTimeField(blank=True, null=True)
    last_password_change = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.username


class Restauranteadmin(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE, related_name='admins')

    def save(self, *args, **kwargs):
        if not self.pk:
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.usuario.username} - {self.restaurante.nombre}"

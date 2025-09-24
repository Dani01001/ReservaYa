from django.contrib.auth.models import AbstractUser, User 
from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings  # <- Usar settings
from django.contrib.auth.hashers import make_password, check_password
from reservas.models import Restaurante  # Importa el modelo Restaurante

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    es_admin = models.BooleanField(default=False)  # Nuevo campo para identificar administradores

    def __str__(self):
        return self.username

class Restauranteadmin(models.Model):
    usuario = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='admin_restaurante')
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    restaurante = models.ForeignKey('reservas.Restaurante', on_delete=models.CASCADE, related_name='admins')

    def save(self, *args, **kwargs):
        if not self.pk:  # Solo hashea la contraseña al crear un nuevo usuario
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.usuario.username} - {self.restaurante.nombre}"
    
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    last_username_change = models.DateTimeField(null=True, blank=True)
    last_password_change = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def crear_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

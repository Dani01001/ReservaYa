from django.db import models
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password

# class Restauranteadmin(models.Model):
#     usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=128)
#     restaurante = models.ForeignKey('Restaurante', on_delete=models.CASCADE, related_name='admins')

#     def save(self, *args, **kwargs):
#         if not self.pk:  # Solo hashea la contraseña al crear un nuevo usuario
#             self.password = make_password(self.password)
#         super().save(*args, **kwargs)

#     def check_password(self, raw_password):
#         return check_password(raw_password, self.password)

#     def __str__(self):
#         return f"{self.usuario.username} - {self.restaurante.nombre}"

class Restaurante(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=20)
    

    def __str__(self):
        return self.nombre

class Mesa(models.Model):
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE)
    numero = models.IntegerField()
    capacidad = models.IntegerField()

    def __str__(self):
        return f"Mesa {self.numero} ({self.restaurante.nombre})"

class Reserva(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    mesa = models.ForeignKey(Mesa, on_delete=models.CASCADE, null=True, blank=True) #opcional y permitir null (es temporal apra ver si funciona el resitro nomas)
    nombre_cliente = models.CharField(max_length=100, default="Cliente")
    fecha = models.DateField()
    hora = models.TimeField()
    cantidad_personas = models.IntegerField()
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reserva de {self.nombre_cliente} para {self.cantidad_personas} el {self.fecha} a las {self.hora}"


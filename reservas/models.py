from django.db import models
from django.conf import settings

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
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE)
    mesa = models.ForeignKey(Mesa, on_delete=models.CASCADE)
    fecha = models.DateField()
    hora = models.TimeField()
    cantidad_personas = models.IntegerField()
    creada_en = models.DateTimeField(auto_now_add=True)

    

    def __str__(self):
        return f"Reserva de{self.usuario.username} en {self.restaurante.nombre} para {self.cantidad_personas} el {self.fecha} a las {self.hora}"

from django.db import models

class Restaurante(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre

class Reserva(models.Model):
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE)  # ✅ esto es clave
    nombre_cliente = models.CharField(max_length=100)
    email_cliente = models.EmailField()
    fecha_reserva = models.DateTimeField()
    num_personas = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.nombre_cliente} - {self.restaurante.nombre}"

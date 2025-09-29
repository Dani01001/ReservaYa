from rest_framework import serializers
from .models import Restaurante, Mesa, Reserva 
from django.contrib.auth.models import User

class RestauranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurante
        fields = '__all__'
        
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class MesaSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Mesa
        fields = '__all__'

class ReservaSerializer(serializers.ModelSerializer): 
    usuario = UsuarioSerializer(read_only=True)
    mesa = MesaSerializer(read_only=True)
    
    # Campos adicionales para tu JS
    mesa_asignada = serializers.SerializerMethodField()
    restaurante = serializers.SerializerMethodField()

    class Meta:
        model = Reserva
        fields = (
            'id', 'nombre_cliente', 'fecha', 'hora', 'cantidad_personas',
            'usuario', 'mesa', 'mesa_asignada', 'restaurante'
        )

    def get_mesa_asignada(self, obj):
        return obj.mesa.numero if obj.mesa else None

    def get_restaurante(self, obj):
        if obj.mesa and obj.mesa.restaurante:
            return {
                "id": obj.mesa.restaurante.id,
                "nombre": obj.mesa.restaurante.nombre,
                "direccion": obj.mesa.restaurante.direccion,
                "telefono": obj.mesa.restaurante.telefono,
            }
        return None
        

from rest_framework import serializers
from .models import Restaurante, Mesa, Reserva 

class RestauranteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurante
        fields = '__all__'

class MesaSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Mesa
        fields = '__all__'

class ReservaSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Reserva
        fields = '__all__'
        
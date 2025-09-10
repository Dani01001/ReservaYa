from datetime import time
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from .models import Restaurante, Mesa, Reserva
from .serializers import RestauranteSerializer, MesaSerializer, ReservaSerializer


# ======== Vistas de API ========
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def crear_reserva(request):
    """
    Crea una reserva solo si hay mesas disponibles en el restaurante indicado
    y el usuario está autenticado.
    Funciona con sesión Django (cookies) o Token.
    """
    user = request.user
    if not user.is_authenticated:
        return Response(
            {"error": "Debes estar registrado para hacer reservas."},
            status=401
        )

    # Obtener restaurante desde el request
    restaurante_id = request.data.get("restaurante")
    if not restaurante_id:
        return Response(
            {"error": "Debes especificar un restaurante."},
            status=400
        )

    try:
        restaurante = Restaurante.objects.get(id=restaurante_id)
    except Restaurante.DoesNotExist:
        return Response(
            {"error": "El restaurante no existe."},
            status=404
        )

    # Buscar mesa disponible de ese restaurante
    mesa_disponible = Mesa.objects.filter(restaurante=restaurante).first()
    if not mesa_disponible:
        return Response(
            {"error": "No hay mesas disponibles en este restaurante."},
            status=400
        )

    # Crear la reserva
    data = request.data.copy()
    data["usuario"] = user.id
    data["mesa"] = mesa_disponible.id

    serializer = ReservaSerializer(data=data)
    if serializer.is_valid():
        reserva = serializer.save()
        info_extra = {
            "reserva_id": reserva.id,
            "usuario": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "restaurante": {
                "id": restaurante.id,
                "nombre": restaurante.nombre,
                "direccion": restaurante.direccion,
                "telefono": restaurante.telefono,
            }
        }
        return Response(info_extra, status=201)

    return Response(serializer.errors, status=400)


# ======== Página de reservas (frontend) ========
@login_required
def reservas_page(request):
    return render(request, "reservas/reservas.html")


# ======== ViewSets para DRF ========
class RestauranteViewSet(viewsets.ModelViewSet):
    queryset = Restaurante.objects.all()
    serializer_class = RestauranteSerializer


class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all()
    serializer_class = MesaSerializer


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

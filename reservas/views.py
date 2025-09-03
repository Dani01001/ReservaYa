from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from .models import Restaurante, Mesa, Reserva
from .serializers import RestauranteSerializer, MesaSerializer, ReservaSerializer


# ======== Vistas de API ========
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_reserva(request):
    """
    Crea una reserva solo si hay mesas disponibles
    y el usuario está autenticado.
    """
    if not request.user.is_authenticated:
        return Response(
            {"error": "Debes estar registrado para hacer reservas."},
            status=401
        )

    data = request.data.copy()
    data['usuario'] = request.user.id

    # ⚡ Asignar la primera mesa disponible
    mesa_disponible = Mesa.objects.first()
    if not mesa_disponible:
        return Response(
            {"error": "No hay mesas disponibles."},
            status=400
        )
    data['mesa'] = mesa_disponible.id

    serializer = ReservaSerializer(data=data)
    if serializer.is_valid():
        reserva = serializer.save()  # ⚡ ya incluye usuario y mesa
        info_extra = {
            "reserva_id": reserva.id,
            "usuario": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            },
            "restaurante": {
                "id": reserva.mesa.restaurante.id,
                "nombre": reserva.mesa.restaurante.nombre,
                "direccion": reserva.mesa.restaurante.direccion,
                "telefono": reserva.mesa.restaurante.telefono
            }
        }
        return Response(info_extra, status=201)

    return Response(serializer.errors, status=400)


# ======== Página de reservas (frontend) ========
@login_required
def reservas_page(request):
    """
    Renderiza la página de reservas, solo para usuarios logueados.
    """
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

from multiprocessing import context
from urllib import request
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Restaurante, Mesa, Reserva
from .serializers import RestauranteSerializer, MesaSerializer, ReservaSerializer


# ======== PÁGINA DE RESERVAS ========
@login_required
def reservas_view(request):
    """
    Renderiza la página de reservas.
    Recibe restaurante_id como query string: /reservas/?restaurante=1
    """
    restaurante_id = request.GET.get('restaurante')  # Extrae el ID del restaurante
    context = {'restaurante_id': restaurante_id}
    return render(request, 'reservas.html', context)


# ======== VISTAS DE FRONTEND ========
def registro_view(request):
    return render(request, "registro.html")


def login_view(request):
    return render(request, "login.html")


# ======== PÁGINA DE INICIO ========
def inicio(request):
    return render(request, "principal_publi.html")


# ======== DETALLE DE RESTAURANTE ========
def detalle_restaurante(request, nombre):
    """
    Renderiza la página del restaurante.
    Se espera que la URL pase solo el nombre del template SIN extensión .html
    """
    if nombre.endswith(".html"):
        nombre = nombre[:-5]
    return render(request, f'rest/{nombre}.html')


# ======== VISTAS DE API ========
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def crear_reserva(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"error": "Debes estar registrado para hacer reservas."}, status=401)

    restaurante_id = request.data.get("restaurante")
    if not restaurante_id:
        return Response({"error": "Debes especificar un restaurante."}, status=400)

    try:
        restaurante = Restaurante.objects.get(id=restaurante_id)
    except Restaurante.DoesNotExist:
        return Response({"error": "El restaurante no existe."}, status=404)

    mesa_disponible = Mesa.objects.filter(restaurante=restaurante).first()
    if not mesa_disponible:
        return Response({"error": "No hay mesas disponibles en este restaurante."}, status=400)

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


# ======== VIEWSETS PARA DRF ========
class RestauranteViewSet(viewsets.ModelViewSet):
    queryset = Restaurante.objects.all()
    serializer_class = RestauranteSerializer


class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all()
    serializer_class = MesaSerializer


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
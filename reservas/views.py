from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from django.http import JsonResponse
from .models import Restaurante, Mesa, Reserva
from .serializers import RestauranteSerializer, MesaSerializer, ReservaSerializer


# ======== VISTA JSON RESERVAS (para frontend) ========
def lista_reservas(request):
    reservas = Reserva.objects.values("id", "nombre_cliente", "fecha", "hora")
    return JsonResponse(list(reservas), safe=False)


# ======== AUTENTICACIÓN SIMPLE (plantillas) ========
def registro_view(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user=user)
            messages.success(request, "Registro exitoso. Bienvenido.")
            return redirect("inicio")
    else:
        form = UserCreationForm()
    return render(request, "registro.html", {"form": form})


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Bienvenido {user.username}")
            return redirect("inicio")
    else:
        form = AuthenticationForm()
    return render(request, "login.html", {"form": form})


def logout_view(request):
    logout(request)
    messages.success(request, "Sesión cerrada correctamente.")
    return redirect("inicio")


def home_view(request):
    return render(request, "index.html")


# ======== PÁGINA DE RESERVAS ========
@login_required
def reservas_view(request):
    restaurante_id = request.GET.get('restaurante')
    context = {'restaurante_id': restaurante_id,}
    return render(request, 'reservas.html', context)


# ======== PÁGINAS FRONTEND ========
def inicio(request):
    return render(request, "principal_publi.html")

def quienes_somos(request):
    return render(request, "quienes_somos.html")

def detalle_restaurante(request, nombre):
    if nombre.endswith(".html"):
        nombre = nombre[:-5]
    return render(request, f'rest/{nombre}.html')


# ======== API: CREAR RESERVA ========
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def crear_reserva(request):
    user = request.user
    if not user.is_authenticated:
        return Response({"error": "Debes estar registrado para hacer reservas."}, status=401)

    restaurante_id = request.data.get("restaurante")
    fecha = request.data.get("fecha")
    hora = request.data.get("hora")

    if not restaurante_id or not fecha or not hora:
        return Response({"error": "Debes especificar restaurante, fecha y hora."}, status=400)

    try:
        restaurante = Restaurante.objects.get(id=restaurante_id)
    except Restaurante.DoesNotExist:
        return Response({"error": "El restaurante no existe."}, status=404)

    mesas_ocupadas = Reserva.objects.filter(
        mesa__restaurante=restaurante,
        fecha=fecha,
        hora=hora
    ).values_list("mesa_id", flat=True)

    mesa_disponible = Mesa.objects.filter(
        restaurante=restaurante
    ).exclude(id__in=mesas_ocupadas).first()

    if not mesa_disponible:
        return Response({"error": "No hay mesas disponibles en ese horario."}, status=400)

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
            },
            "mesa_asignada": mesa_disponible.numero,
        }
        return Response(info_extra, status=201)

    return Response(serializer.errors, status=400)


# ======== VIEWSETS DRF ========
class RestauranteViewSet(viewsets.ModelViewSet):
    queryset = Restaurante.objects.all()
    serializer_class = RestauranteSerializer


class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all()
    serializer_class = MesaSerializer


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer

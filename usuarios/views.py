from django.contrib.auth import authenticate, login, logout, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
import json
import random
from django.conf import settings
from .models import Restauranteadmin
from django.contrib.auth.hashers import check_password
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from datetime import timedelta
from django.utils import timezone
from .forms import CompletarDatosForm, ActualizarUsuarioForm
from django.urls import reverse

User = get_user_model()


# ===========================
# Perfil y datos de usuario
# ===========================

@login_required
def completar_datos(request):
    user = request.user

    if user.username and getattr(user, "telefono", None):
        mensaje = "Los datos ya fueron completados. Cierra la ventana."
        return render(request, "completar_datos.html", {
            "datos_completados": True,
            "mensaje": mensaje
        })

    if request.method == 'POST':
        form = CompletarDatosForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            mensaje = "Datos guardados correctamente. Puedes cerrar la ventana."
            return render(request, 'completar_datos.html', {
                'mensaje': mensaje,
                'datos_completados': True
            })
    else:
        form = CompletarDatosForm(instance=user)

    return render(request, "completar_datos.html", {
        "form": form,
        "datos_completados": False
    })


@login_required
def usuario(request):
    user = request.user

    # Control de cambios de username y contraseña
    puede_cambiar_usuario = True
    puede_cambiar_contrasena = True

    if hasattr(user, 'last_username_change') and user.last_username_change:
        puede_cambiar_usuario = (timezone.now() - user.last_username_change) > timedelta(days=14)
    if hasattr(user, 'last_password_change') and user.last_password_change:
        puede_cambiar_contrasena = (timezone.now() - user.last_password_change) > timedelta(days=14)

    tiene_google = user.socialaccount_set.filter(provider='google').exists()

    # Generar inicial y color para avatar si no hay imagen
    colores = ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557", "#ffb703", "#fb8500"]
    color = random.choice(colores)
    inicial = user.username[0].upper()

    user_info = {
        "username": user.username,
        "perfil_imagen": getattr(user, "perfil_imagen", None),
        "inicial": inicial,
        "color": color
    }

    context = {
        "user": user,
        "user_info": user_info,
        "puede_cambiar_usuario": puede_cambiar_usuario,
        "puede_cambiar_contrasena": puede_cambiar_contrasena,
        "tiene_google": tiene_google,
    }

    return render(request, "usuario.html", context)


@login_required
def actualizar_usuario(request):
    user = request.user

    if request.method == "POST":
        form = ActualizarUsuarioForm(request.POST, request.FILES, instance=user)

        if form.is_valid():
            username = form.cleaned_data.get("username")
            email = form.cleaned_data.get("email")
            telefono = form.cleaned_data.get("telefono")
            perfil_imagen = form.cleaned_data.get("perfil_imagen")
            borrar_imagen = request.POST.get("borrar_imagen")  # Campo oculto desde el formulario

            # Validar cambio de username con restricción de 14 días
            if username and username != user.username:
                puede_cambiar_usuario = True
                if hasattr(user, 'last_username_change') and user.last_username_change:
                    puede_cambiar_usuario = (timezone.now() - user.last_username_change) > timedelta(days=14)

                if puede_cambiar_usuario:
                    user.username = username
                    user.last_username_change = timezone.now()
                else:
                    messages.error(request, "Debe esperar 14 días para volver a cambiar el nombre de usuario.")

            # Guardar email y teléfono
            if email and email != user.email:
                user.email = email
            if telefono:
                user.telefono = telefono

            # Gestionar imagen de perfil
            if borrar_imagen:
                user.perfil_imagen.delete(save=False)
                user.perfil_imagen = None
            elif perfil_imagen:
                user.perfil_imagen = perfil_imagen

            user.save()
            messages.success(request, "Datos actualizados correctamente.")
            return redirect("usuario")

    else:
        form = ActualizarUsuarioForm(instance=user)

    return render(request, "usuario.html", {"form": form})


@login_required
def cambiar_contrasena(request):
    user = request.user

    if request.method == 'POST':
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')

        puede_cambiar_contrasena = True
        if hasattr(user, 'last_password_change') and user.last_password_change:
            puede_cambiar_contrasena = (timezone.now() - user.last_password_change) > timedelta(days=14)

        if puede_cambiar_contrasena and user.check_password(old_password) and new_password:
            user.set_password(new_password)
            user.last_password_change = timezone.now()
            user.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Contraseña actualizada correctamente.')
        else:
            messages.error(request, 'No se pudo cambiar la contraseña.')

    return redirect('usuario')


# ===========================
# API y Auth
# ===========================

@login_required
def logout_view(request):
    logout(request)
    return redirect("principal_publi")


@require_http_methods(["GET"])
def lista_usuarios(request):
    usuarios = User.objects.values("id", "username", "email")
    return JsonResponse(list(usuarios), safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def registrar_usuario(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        password = data.get("password")
        password2 = data.get("password2")
        email = data.get("email")

        if not username or not password or not email:
            return JsonResponse({"error": "Username, password y email son requeridos"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Usuario ya existe"}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email ya está registrado"}, status=400)

        if password != password2:
            return JsonResponse({"error": "Las contraseñas no coinciden"}, status=400)

        try:
            validate_password(password)
        except ValidationError as e:
            return JsonResponse({"error": list(e.messages)}, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )

        return JsonResponse({"message": "Usuario creado con éxito", "user_id": user.id}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def iniciar_sesion(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({"error": "Username y password son requeridos"}, status=400)

        user = authenticate(request, username=username, password=password)
        if user is None:
            return JsonResponse({"error": "Credenciales inválidas"}, status=400)

        if not user.is_active:
            return JsonResponse({"error": "Cuenta desactivada"}, status=400)

        login(request, user)

        # Verificamos si es administrador de restaurante
        try:
            admin = Restauranteadmin.objects.get(usuario=user)
            return JsonResponse({
                "message": "Inicio de sesión exitoso (admin restaurante)",
                "redirect": reverse("principal_priv"),
                "admin": {
                    "id": admin.id,
                    "usuario": admin.usuario.username,
                    "restaurante_id": admin.restaurante.id,
                    "restaurante_nombre": admin.restaurante.nombre
                }
            })
        except Restauranteadmin.DoesNotExist:
            return JsonResponse({
                "message": "Inicio de sesión exitoso",
                "redirect": "/pagina_principal/",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            })

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def cerrar_sesion(request):
    logout(request)
    return JsonResponse({"message": "Sesión cerrada"})


# ===========================
# Vistas HTML
# ===========================

def inicio(request):
    return render(request, "inicio.html")


def registro_view(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("principal_publi")
    else:
        form = UserCreationForm()
    return render(request, "registro.html", {"form": form})


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect("principal_publi")
    else:
        form = AuthenticationForm()
    return render(request, "login.html", {"form": form})


@login_required
def perfil_view(request):
    return render(request, "usuario.html")


def principal_publi(request):
    user_info = None
    if request.user.is_authenticated:
        inicial = request.user.username[0].upper()
        colores = ["#e63946", "#539f3a", "#d1a8dc", "#9d4590", "#1d3557", "#ffb703", "#fb8500"]
        colores = [c for c in colores if c.lower() not in ['#ffffff', '#f1faee', '#f2f2f2']]
        color = random.choice(colores)

        user_info = {
            "username": request.user.username,
            "inicial": inicial,
            "color": color
        }

    return render(request, "principal_publi.html", {"user_info": user_info})

def principal_priv(request):
    return render(request, "principal_priv.html")

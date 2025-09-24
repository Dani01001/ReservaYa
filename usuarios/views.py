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
from django.contrib.auth.models import User
from django.conf import settings
from .models import Restauranteadmin   
from django.contrib.auth.hashers import make_password, check_password
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from datetime import timedelta
from django.utils import timezone
from .forms import CompletarDatosForm



User = get_user_model()

@login_required
def completar_datos(request):
    user = request.user

    # Si ya tiene username y teléfono completos, mostrar mensaje
    if user.username and user.telefono:
        mensaje = "Los datos ya fueron completados. Cierra la ventana."
        return render(request, "completar_datos.html", {
            "datos_completados": True,
            "mensaje": mensaje
        })

    if request.method == 'POST':
        form = CompletarDatosForm(request.POST, instance=user)
        if form.is_valid():
            form.save()  # 🔹 Guarda username y telefono
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
    if hasattr(user, 'profile'):
        if user.profile.last_username_change:
            puede_cambiar_usuario = (timezone.now() - user.profile.last_username_change) > timedelta(days=14)
        if user.profile.last_password_change:
            puede_cambiar_contrasena = (timezone.now() - user.profile.last_password_change) > timedelta(days=14)

    # Verifica si el usuario tiene sesión con Google
    tiene_google = user.socialaccount_set.filter(provider='google').exists()

    context = {
        'user': user,
        'puede_cambiar_usuario': puede_cambiar_usuario,
        'puede_cambiar_contrasena': puede_cambiar_contrasena,
        'tiene_google': tiene_google,
    }
    return render(request, 'usuario.html', context)


@login_required
def actualizar_usuario(request):
    user = request.user
    profile = getattr(user, 'profile', None)

    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')

        if profile and profile.last_username_change:
            puede_cambiar_usuario = (timezone.now() - profile.last_username_change) > timedelta(days=14)
        else:
            puede_cambiar_usuario = True

        if puede_cambiar_usuario and username and username != user.username:
            user.username = username
            if profile:
                profile.last_username_change = timezone.now()
                profile.save()

        if email and email != user.email:
            user.email = email

        user.save()
        messages.success(request, 'Datos actualizados correctamente.')

    return redirect('usuario')


@login_required
def cambiar_contrasena(request):
    user = request.user
    profile = getattr(user, 'profile', None)

    if request.method == 'POST':
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')

        if profile and profile.last_password_change:
            puede_cambiar_contrasena = (timezone.now() - profile.last_password_change) > timedelta(days=14)
        else:
            puede_cambiar_contrasena = True

        if puede_cambiar_contrasena and user.check_password(old_password) and new_password:
            user.set_password(new_password)
            user.save()
            if profile:
                profile.last_password_change = timezone.now()
                profile.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Contraseña actualizada correctamente.')
        else:
            messages.error(request, 'No se pudo cambiar la contraseña.')

    return redirect('usuario')


Usuario = get_user_model()

# ================================
# 📌 API de Usuarios (JSON)
# ================================
@login_required
def logout_view(request):
    logout(request)
    return redirect("principal_publi")


@require_http_methods(["GET"])
def lista_usuarios(request):
    """ Devuelve lista de usuarios en JSON """
    usuarios = Usuario.objects.values("id", "username", "email")
    return JsonResponse(list(usuarios), safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def registrar_usuario(request):
    """ Registro de usuario vía API """
    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        password = data.get("password")
        password2 = data.get("password2")
        email = data.get("email")

        if not username or not password or not email:
            return JsonResponse({"error": "Username, password y email son requeridos"}, status=400)

        if Usuario.objects.filter(username=username).exists():
            return JsonResponse({"error": "Usuario ya existe"}, status=400)

        if Usuario.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email ya está registrado"}, status=400)

        if password != password2:
            return JsonResponse({"error": "Las contraseñas no coinciden"}, status=400)

        try:
            validate_password(password)
        except ValidationError as e:
            return JsonResponse({"error": list(e.messages)}, status=400)

        # Crear usuario (sin campo teléfono porque no existe en el modelo por defecto)
        user = Usuario.objects.create_user(
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
    """ Login vía API """
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

        # Si llega aquí, el usuario es válido
        login(request, user)

        # Verificamos si es administrador de restaurante
        from reservas.models import Restauranteadmin
        try:
            admin = Restauranteadmin.objects.get(usuario=user)
            # 👆 aquí buscamos por usuario, no por username

            return JsonResponse({
                "message": "Inicio de sesión exitoso (admin restaurante)",
                "redirect": "/dashboard_restaurante/",  # o donde quieras redirigir
                "admin": {
                    "id": admin.id,
                    "usuario": admin.usuario.username,
                    "restaurante_id": admin.restaurante.id,
                    "restaurante_nombre": admin.restaurante.nombre
                }
            })
        except Restauranteadmin.DoesNotExist:
            # Si no es admin, es un usuario normal
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
    """ Logout vía API """
    logout(request)
    return JsonResponse({"message": "Sesión cerrada"})


# ================================
# 📌 Vistas HTML (plantillas)
# ================================

def inicio(request):
    return render(request, "inicio.html")


def principal_publi(request):
    return render(request, "principal_publi.html")


def registro_view(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # login automático tras registro
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


def logout_view(request):
    logout(request)
    return redirect("principal_publi")


@login_required
def perfil_view(request):
    return render(request, "usuario.html")
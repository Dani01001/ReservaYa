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

Usuario = get_user_model()

# ================================
# 📌 API de Usuarios (JSON)
# ================================

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
        if user is not None:
            if user.is_active:
                login(request, user)
                return JsonResponse({
                    "message": "Inicio de sesión exitoso",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email
                    }
                })
            else:
                return JsonResponse({"error": "Cuenta desactivada"}, status=400)
        else:
            return JsonResponse({"error": "Credenciales inválidas"}, status=400)

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
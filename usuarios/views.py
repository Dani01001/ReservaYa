from django.contrib.auth import authenticate, login, logout, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
import json
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.contrib.auth import get_user_model

Usuario = get_user_model()

@require_http_methods(["GET"])
def lista_usuarios(request):
    usuarios = Usuario.objects.values("id", "username", "email")
    return JsonResponse(list(usuarios), safe=False)

@require_http_methods(["GET"])
def lista_usuarios(request):
    usuarios = User.objects.values("id", "username", "email")
    return JsonResponse(list(usuarios), safe=False)

# Página principal pública
def principal_publi(request):
    return render(request, 'principal_publi.html')

# Registro
def registro_view(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # login automático tras registro
            return redirect('principal_publi')
    else:
        form = UserCreationForm()
    return render(request, 'registro.html', {"form": form})

# Login
def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('principal_publi')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {"form": form})

# Logout
def logout_view(request):
    logout(request)
    return redirect('principal_publi')

# Perfil (solo usuarios logueados)
@login_required
def perfil_view(request):
    return render(request, 'usuario.html')

def inicio(request):
    return render(request, "inicio.html")

def registro(request):
    return render(request, "registro.html")

def login_view(request):
    return render(request, "login.html")

def principal_publi(request):
    return render(request, "principal_publi.html")



@require_http_methods(["GET"])
def lista_usuarios(request):
    usuarios = Usuario.objects.values("id", "username", "email")
    return JsonResponse(list(usuarios), safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def registrar_usuario(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        password = data.get("password")
        password2 = data.get("password2", "")
        email = data.get("email")
        telefono = data.get("telefono", "")

        # Validaciones
        if not username or not password or not email:
            return JsonResponse({
                "error": "Username, password y email son requeridos"
            }, status=400)

        if Usuario.objects.filter(username=username).exists():
            return JsonResponse({"error": "Usuario ya existe"}, status=400)

        if Usuario.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email ya está registrado"}, status=400)

        # Validar contraseña
        password2 = data.get("password2")

        if password != password2:
            return JsonResponse({"error": "Las contraseñas no coinciden"}, status=400)
        try:
            validate_password(password)
        except ValidationError as e:
            return JsonResponse({"error": list(e.messages)}, status=400)

        # Crear usuario solo con los campos válidos
        user = Usuario.objects.create_user(
            username=username,
            password=password,
            email=email,
            telefono=telefono
        )
        
        return JsonResponse({
            "message": "Usuario creado con éxito",
            "user_id": user.id
        }, status=201)
    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        # En desarrollo muestra el error real
        return JsonResponse({"error": str(e)}, status=500)
    
@csrf_exempt
@require_http_methods(["POST"])
def iniciar_sesion(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({
                "error": "Username y password son requeridos"
            }, status=400)

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
    logout(request)
    return JsonResponse({"message": "Sesión cerrada"})


from django.contrib.auth import authenticate, login, logout, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
import json

Usuario = get_user_model()

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
        email = data.get("email")
        telefono = data.get("telefono", "")
        password2 = data.get("password2", "")

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
        try:
            validate_password(password)
        except ValidationError as e:
            return JsonResponse({"error": list(e.messages)}, status=400)

        if password != password2:
            return JsonResponse({"error": "Las contraseñas no coinciden"}, status=400)

        user = Usuario.objects.create_user(
            username=username,
            password=password,
            email=email,
            telefono=telefono,
            password2=password2
        )
        
        return JsonResponse({
            "message": "Usuario creado con éxito",
            "user_id": user.id
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": "Error interno del servidor"}, status=500)

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
        return JsonResponse({"error": "Error interno del servidor"}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def cerrar_sesion(request):
    logout(request)
    return JsonResponse({"message": "Sesión cerrada"})



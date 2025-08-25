from django.contrib.auth import authenticate, login, logout, get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

Usuario = get_user_model()

def lista_usuarios(request):
    if request.method == "GET":
     usuarios = Usuario.objects.values("id", "username", "email")
     return JsonResponse(list(usuarios), safe=False)
    return JsonResponse({"error": "Metodo no permitido"}, status=405)


@csrf_exempt
def registrar_usuario(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")
        telefono = data.get("telefono")
        direccion = data.get("direccion")

        if Usuario.objects.filter(username=username).exists():
            return JsonResponse({"error": "Usuario ya existe"}, status=400)

        user = Usuario.objects.create_user(
            username=username,
            password=password,
            email=email,
            telefono=telefono,
            direccion=direccion
        )
        return JsonResponse({"message": "Usuario creado con éxito"})

    return JsonResponse({"error": "Método no permitido"}, status=405)


@csrf_exempt
def iniciar_sesion(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Inicio de sesión exitoso"})
        else:
            return JsonResponse({"error": "Credenciales inválidas"}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)


@csrf_exempt
def cerrar_sesion(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({"message": "Sesión cerrada"})
    return JsonResponse({"error": "Método no permitido"}, status=405)


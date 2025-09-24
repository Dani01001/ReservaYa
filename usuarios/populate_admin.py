from django.contrib.auth import get_user_model
from reservas.models import Restaurante
from usuarios.models import Restauranteadmin

User = get_user_model()

admins = [
    {"usuario": "Talleyrand_costanera", 
     "password": "adminpass1", 
     "restaurante": "Restaurante 1"},
]

for admin in admins:
    # 1. Crear o recuperar el usuario
    usuario, creado = User.objects.get_or_create(
        username=admin["usuario"],
        defaults={"email": f"{admin['usuario']}@example.com", "is_staff": True}
    )
    if creado:
        usuario.set_password(admin["password"])
        usuario.save()
        print(f"✅ Usuario {admin['usuario']} creado.")
    else:
        print(f"ℹ️ Usuario {admin['usuario']} ya existía.")

    # 2. Buscar el restaurante
    try:
        restaurante = Restaurante.objects.get(nombre=admin["restaurante"])
    except Restaurante.DoesNotExist:
        print(f"⚠️ Restaurante '{admin['restaurante']}' NO encontrado. "
              "Primero crea el restaurante antes de asignarle un admin.")
        continue  # Salta a la siguiente iteración

    # 3. Crear la relación en Restauranteadmin
    admin_obj, creado = Restauranteadmin.objects.get_or_create(
        usuario=usuario,
        restaurante=restaurante
    )
    if creado:
        print(f"✅ Administrador para {admin['restaurante']} creado.")
    else:
        print(f"ℹ️ Administrador para {admin['restaurante']} ya existía.")

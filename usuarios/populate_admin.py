from django.contrib.auth.models import get_user_model
from reservas.models import Restaurante, Restauranteadmin

usuario = get_user_model()

admins = [ 
    {"usuario": "admin_bolsi", "password": "adminpass1", "restaurante": "Restaurante 1"},
    {"usuario": "admin_farola", "password": "adminpass2", "restaurante": "Restaurante 2"},
    {"usuario": "admin_DonVito", "password": "adminpass3", "restaurante": "Restaurante 3"},
]
for admin in admins:
    usuario, creado = usuario.objects.get_or_create(
        username=admin["usuario"],
        defaults={"email": admin["email"], "is_staff": True}
    )
    if creado:  
        usuario.set_password(admin["password"])
        usuario.save()
        print(f"Usuario {admin['usuario']} creado.")
    else:
        print(f"Usuario {admin['usuario']} ya existe.")
    try: 
        restaurante = Restaurante.objects.get(nombre=admin["restaurante"])
    except Restaurante.DoesNotExist:
        print(f"Restaurante {admin['restaurante']} no encontrado.")
        continue

    admin_obj, creado = Restauranteadmin.objects.get_or_create(
        usuario=usuario,
        restaurante=restaurante
    )
    if creado:
        print(f"Administrador para {admin['restaurante']} creado.")
    else:
        print(f"Administrador para {admin['restaurante']} ya existe.")
# usuarios/populate_admin.py
from django.contrib.auth import get_user_model
from reservas.models import Restaurante
from usuarios.models import Restauranteadmin

User = get_user_model()

admins = [ 
    {"usuario": "Talleyrand_costanera", "password": "adminpass1", "email": "talleyrand@example.com", "restaurante": "Restaurante 1"},
    {"usuario": "Alma_Cocina_con_Fuego", "password": "adminpass2", "email": "alma@example.com", "restaurante": "Restaurante 2"},
    # Puedes agregar más aquí
]

for admin in admins:
    user, creado = User.objects.get_or_create(
        username=admin["usuario"],
        defaults={"email": admin["email"], "is_staff": True}
    )

    if creado:
        user.set_password(admin["password"])
        user.save()
        print(f"✅ Usuario '{admin['usuario']}' creado.")
    else:
        print(f"ℹ️ Usuario '{admin['usuario']}' ya existía.")

    try:
        restaurante = Restaurante.objects.get(nombre=admin["restaurante"])
    except Restaurante.DoesNotExist:
        print(f"⚠️ Restaurante '{admin['restaurante']}' no encontrado, saltando.")
        continue

    admin_obj, creado = Restauranteadmin.objects.get_or_create(
        usuario=user,
        restaurante=restaurante
    )

    if creado:
        print(f"✅ Administrador para '{admin['restaurante']}' creado.")
    else:
        print(f"ℹ️ Administrador para '{admin['restaurante']}' ya existía.")

from reservas.models import Restaurante, Mesa

restaurantes = [
    {"Nombre": "Talleyrand_costanera", "direccion": "Complejo Barrail, Av Gral Máximo Santos, Asunción 001202", }
]

for r in restaurantes:
    restaurante_obj, created = Restaurante.objects.get_or_create(nombre=r["Nombre"], defaults={
        "direccion": r["direccion"],
    })

    if created:
        print(f"Restaurante '{restaurante_obj.nombre}' creado.")
    else: 
        print(f"Restaurante '{restaurante_obj.nombre}' ya existe.")

    for i in range(1, 6):
        mesa_obj, mesa_created = Mesa.objects.get_or_create(    
            restaurante=restaurante_obj,
            numero_mesa=i,
            defaults={
                "capacidad": 4
            }
        )
        if mesa_created:
            print(f"Mesa {mesa_obj.numero_mesa} creada para el restaurante '{restaurante_obj.nombre}'.")
        else:
            print(f"Mesa {mesa_obj.numero_mesa} ya existe para el restaurante '{restaurante_obj.nombre}'.")
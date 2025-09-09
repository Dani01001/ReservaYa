import os
from reservas.models import Restaurante, Mesa

HTML_DIR = os.path.join("HTML/rest")

NUM_MESAS = 5

if not os.path.exists(HTML_DIR):
    print(f"El directorio {HTML_DIR} no existe.")
else :
    for filename in os.listdir(HTML_DIR):
        if filename.endswith(".html"):
            nombre_restaurante = filename[:-5]  # Remove .html extension
            restaurante_objt, created = Restaurante.objects.get_or_create(
                nombre=nombre_restaurante,
                defaults={"direccion": "Dirección por defecto"}
            )
            if created: 
                print(f"Restaurante '{restaurante_objt.nombre}' creado.")
            else:
                print(f"Restaurante '{restaurante_objt.nombre}' ya existe.")
            
            for i in range(1, NUM_MESAS + 1):
                mesa_obj, mesa_created = Mesa.objects.get_or_create(
                    restaurante=restaurante_objt,
                    numero=i,
                    defaults={"capacidad": 4}
                )
                if mesa_created:
                    print(f"Mesa {mesa_obj.numero} creada para el restaurante '{restaurante_objt.nombre}'.")
                else:
                    print(f"Mesa {mesa_obj.numero} ya existe para el restaurante '{restaurante_objt.nombre}'.")

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
            numero=i,
            defaults={
                "capacidad": 4
            }
        )
        if mesa_created:
            print(f"Mesa {mesa_obj.numero} creada para el restaurante '{restaurante_obj.nombre}'.")
        else:
            print(f"Mesa {mesa_obj.numero} ya existe para el restaurante '{restaurante_obj.nombre}'.")
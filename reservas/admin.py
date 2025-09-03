from django.contrib import admin

from .models import Restaurante, Mesa, Reserva

admin.site.register(Restaurante)
admin.site.register(Mesa)      # ⚡ Aquí registramos Mesa
admin.site.register(Reserva)
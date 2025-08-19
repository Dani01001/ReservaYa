from django.shortcuts import render, redirect
from .forms import ReservaForm
from .models import Reserva

def crear_reserva(request):
    if request.method == 'POST':
        form = ReservaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('listar_reservas')  # Redirige a la vista listar_reservas
    else:
        form = ReservaForm()
    
    return render(request, 'reservas/crear_reserva.html', {'form': form})

def listar_reservas(request):
    reservas = Reserva.objects.all()
    return render(request, 'reservas/listar_reservas.html', {'reservas': reservas})

from django import forms
from .models import Reserva

class ReservaForm(forms.ModelForm):
    fecha_reserva = forms.DateTimeField(
        input_formats = ['%d/%m/%Y}'],
        widget=forms.DateTimeInput(format='%d/%m/%Y', attrs={'type': 'date'})
    )
    class Meta:
        model = Reserva
        fields = ['restaurante', 'nombre_cliente', 'email_cliente', 'fecha_reserva', 'num_personas']

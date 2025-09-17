from django import forms
from django.contrib.auth.models import User
from .models import Usuario

class ActualizarUsuarioForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email']
# usuarios/forms.py

class CompletarDatosForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ["username_personalizado", "telefono"]
        widgets = {
            "username_personalizado": forms.TextInput(attrs={"class": "form-control", "placeholder": "Nombre de usuario"}),
            "telefono": forms.TextInput(attrs={"class": "form-control", "placeholder": "Número de celular"}),
        }

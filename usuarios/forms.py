from django import forms
from django.contrib.auth.models import User
from .models import Usuario

class ActualizarUsuarioForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email']

class CompletarDatosForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ["username", "telefono"]  # 🔹 campos que realmente existen
        widgets = {
            "username": forms.TextInput(attrs={"class": "form-control", "placeholder": "Nombre de usuario"}),
            "telefono": forms.TextInput(attrs={"class": "form-control", "placeholder": "Número de celular"}),
        }

    def __init__(self, *args, **kwargs):
        user_instance = kwargs.pop('user_instance', None)
        super().__init__(*args, **kwargs)
        if user_instance:
            self.fields['username'].initial = user_instance.username

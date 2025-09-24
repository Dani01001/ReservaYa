from django import forms
from .models import Usuario

class ActualizarUsuarioForm(forms.ModelForm):
    telefono = forms.CharField(required=False)
    perfil_imagen = forms.ImageField(required=False)

    class Meta:
        model = Usuario
        fields = ["username", "email", "telefono", "perfil_imagen"]

    def save(self, commit=True):
        user = super().save(commit=False)
        # Guardar los campos adicionales
        user.telefono = self.cleaned_data.get("telefono")
        if self.cleaned_data.get("perfil_imagen"):
            user.perfil_imagen = self.cleaned_data.get("perfil_imagen")
        if commit:
            user.save()
        return user


class CompletarDatosForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ["username", "telefono"]
        widgets = {
            "username": forms.TextInput(attrs={"class": "form-control", "placeholder": "Nombre de usuario"}),
            "telefono": forms.TextInput(attrs={"class": "form-control", "placeholder": "Número de celular"}),
        }

    def __init__(self, *args, **kwargs):
        user_instance = kwargs.pop('user_instance', None)
        super().__init__(*args, **kwargs)
        if user_instance:
            self.fields['username'].initial = user_instance.username
            self.fields['telefono'].initial = user_instance.telefono

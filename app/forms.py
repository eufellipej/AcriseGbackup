from django import forms
from django.contrib.auth.models import User
from .models import Usuario

class LoginForm(forms.Form):
    email = forms.EmailField(
        label="Email",
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Digite seu email'
        })
    )
    senha = forms.CharField(
        label="Senha",
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Digite sua senha'
        })
    )

class RegistroForm(forms.ModelForm):
    senha = forms.CharField(
        label="Senha",
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Digite sua senha'
        })
    )
    confirmar_senha = forms.CharField(
        label="Confirmar Senha",
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Confirme sua senha'
        })
    )
    
    class Meta:
        model = Usuario
        fields = ['nome', 'email', 'imagem']
        widgets = {
            'nome': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Digite seu nome completo'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Digite seu email'
            }),
            'imagem': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'URL da imagem (opcional)'
            }),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        senha = cleaned_data.get("senha")
        confirmar_senha = cleaned_data.get("confirmar_senha")
        
        if senha != confirmar_senha:
            raise forms.ValidationError("As senhas não coincidem.")
        
        return cleaned_data
    
    def save(self, commit=True):
        usuario = super().save(commit=False)
        usuario.senha = self.cleaned_data["senha"]
        
        if commit:
            usuario.save()
        return usuario
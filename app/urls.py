from django.urls import path
from .views import (
    IndexView, AdminView, ArtigoView, ArtigosView,
    DesastreView, DesastresView, GeneralizadoView,
    JogoView, LoginView, UsuarioView, RegistroView, LogoutView
)

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('admin/', AdminView.as_view(), name='admin_personalizado'),
    path('artigo/', ArtigoView.as_view(), name='artigo'),
    path('artigos/', ArtigosView.as_view(), name='artigos'),
    path('desastre/', DesastreView.as_view(), name='desastre'),
    path('desastres/', DesastresView.as_view(), name='desastres'),
    path('generalizado/', GeneralizadoView.as_view(), name='generalizado'),
    path('jogo/', JogoView.as_view(), name='jogo'),
    path('login/', LoginView.as_view(), name='login'),
    path('registro/', RegistroView.as_view(), name='registro'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('usuario/', UsuarioView.as_view(), name='usuario'),
]
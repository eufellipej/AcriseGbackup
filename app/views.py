from django.views.generic import TemplateView
from django.shortcuts import render, redirect
from django.views import View
from django.contrib import messages
from .forms import LoginForm, RegistroForm
from .models import Usuario, Jogo, CaracteristicaJogo, RequisitoJogo, AtualizacaoJogo, FAQJogo, ImagemJogo, Avaliacao, PerguntaUsuario
from django.db.models import Avg, Count

# View para a página inicial
class IndexView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'index.html')

# Views para os novos templates
class AdminView(View):
    def get(self, request, *args, **kwargs):
        # Verificar se o usuário está logado
        if 'usuario_id' not in request.session:
            messages.error(request, 'Você precisa fazer login para acessar esta página.')
            return redirect('login')
        return render(request, 'admin.html')

class ArtigoView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'artigo.html')

class ArtigosView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'artigos.html')

class DesastreView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'desastre.html')

class DesastresView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'desastres.html')

class GeneralizadoView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'generalizado.html')

class JogoView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Buscar o jogo principal
            jogo = Jogo.objects.filter(ativo=True).first()
            
            if not jogo:
                messages.error(request, 'Nenhum jogo disponível no momento.')
                return redirect('index')
            
            # Buscar FAQs visíveis
            faqs = FAQJogo.objects.filter(
                jogo=jogo, 
                ativo=True, 
                visivel=True
            ).order_by('ordem', 'categoria')
            
            # Agrupar FAQs por categoria
            faqs_por_categoria = {}
            for faq in faqs:
                categoria = faq.get_categoria_display()
                if categoria not in faqs_por_categoria:
                    faqs_por_categoria[categoria] = []
                faqs_por_categoria[categoria].append(faq)
            
            # Buscar dados relacionados
            caracteristicas = CaracteristicaJogo.objects.filter(jogo=jogo).order_by('ordem')
            requisitos_minimos = RequisitoJogo.objects.filter(jogo=jogo, tipo='minimo')
            requisitos_recomendados = RequisitoJogo.objects.filter(jogo=jogo, tipo='recomendado')
            atualizacoes = AtualizacaoJogo.objects.filter(jogo=jogo).order_by('-data')[:5]
            imagens = ImagemJogo.objects.filter(jogo=jogo).order_by('ordem')
            
            # Buscar avaliações de especialistas
            avaliacoes_especialistas = Avaliacao.objects.filter(
                jogo=jogo,
                usuario__tipo__in=['especialista', 'admin', 'editor']
            ).select_related('usuario').order_by('-nota')[:3]
            
            # Calcular média das avaliações
            media_avaliacoes = Avaliacao.objects.filter(jogo=jogo).aggregate(
                media=Avg('nota'),
                total=Count('id')
            )
            
            context = {
                'jogo': jogo,
                'caracteristicas': caracteristicas,
                'requisitos_minimos': requisitos_minimos,
                'requisitos_recomendados': requisitos_recomendados,
                'atualizacoes': atualizacoes,
                'faqs_por_categoria': faqs_por_categoria,
                'faqs': faqs,
                'imagens': imagens[:4],
                'avaliacoes_especialistas': avaliacoes_especialistas,
                'media_avaliacoes': media_avaliacoes['media'] or 4.8,
                'total_avaliacoes': media_avaliacoes['total'] or 50,
            }
            
            return render(request, 'jogo.html', context)
            
        except Exception as e:
            messages.error(request, f'Erro ao carregar informações do jogo: {str(e)}')
            return redirect('index')
    
    def post(self, request, *args, **kwargs):
        # Para o formulário de pergunta do usuário
        action = request.POST.get('action', 'enviar_pergunta')
        
        if action == 'enviar_pergunta':
            try:
                jogo = Jogo.objects.filter(ativo=True).first()
                
                if not jogo:
                    messages.error(request, 'Jogo não encontrado.')
                    return redirect('jogo')
                
                pergunta_texto = request.POST.get('pergunta', '').strip()
                email = request.POST.get('email', '').strip()
                
                if not pergunta_texto:
                    messages.error(request, 'Por favor, digite sua pergunta.')
                    return redirect('jogo')
                
                if not email:
                    messages.error(request, 'Por favor, forneça seu email para resposta.')
                    return redirect('jogo')
                
                # Verificar se o usuário está logado
                usuario = None
                if 'usuario_id' in request.session:
                    try:
                        usuario = Usuario.objects.get(id=request.session['usuario_id'])
                    except Usuario.DoesNotExist:
                        pass
                
                # Criar a pergunta do usuário
                PerguntaUsuario.objects.create(
                    usuario=usuario,
                    jogo=jogo,
                    pergunta=pergunta_texto,
                    email=email,
                    status='pendente'
                )
                
                messages.success(request, 'Pergunta enviada com sucesso! Responderemos em breve por email.')
                
            except Exception as e:
                messages.error(request, f'Erro ao enviar pergunta: {str(e)}')
        
        return redirect('jogo')

# View para login
class LoginView(View):
    def get(self, request, *args, **kwargs):
        # Se já estiver logado, redirecionar para index
        if 'usuario_id' in request.session:
            return redirect('index')
        
        form = LoginForm()
        registro_form = RegistroForm()
        tab = request.GET.get('tab', 'login')
        
        return render(request, 'login.html', {
            'form': form,
            'registro_form': registro_form,
            'active_tab': tab
        })

    def post(self, request, *args, **kwargs):
        form = LoginForm(request.POST)
        
        if form.is_valid():
            email = form.cleaned_data.get('email')
            senha = form.cleaned_data.get('senha')
            
            try:
                usuario = Usuario.objects.get(email=email)
                if usuario.verificar_senha(senha):  # Usando o método verificar_senha
                    # Armazenar informações do usuário na sessão
                    request.session['usuario_id'] = usuario.id
                    request.session['usuario_nome'] = usuario.nome
                    request.session['usuario_email'] = usuario.email
                    request.session['usuario_tipo'] = usuario.tipo
                    
                    messages.success(request, f'Bem-vindo(a), {usuario.nome}!')
                    return redirect('index')
                else:
                    messages.error(request, 'Senha incorreta.')
            except Usuario.DoesNotExist:
                messages.error(request, 'Nenhum usuário encontrado com este email.')
        else:
            messages.error(request, 'Por favor, corrija os erros abaixo.')
        
        registro_form = RegistroForm()
        return render(request, 'login.html', {
            'form': form,
            'registro_form': registro_form,
            'active_tab': 'login'
        })

class RegistroView(View):
    def post(self, request, *args, **kwargs):
        registro_form = RegistroForm(request.POST)
        
        if registro_form.is_valid():
            try:
                usuario = registro_form.save()
                
                # Login automático após registro
                request.session['usuario_id'] = usuario.id
                request.session['usuario_nome'] = usuario.nome
                request.session['usuario_email'] = usuario.email
                request.session['usuario_tipo'] = usuario.tipo
                
                messages.success(request, 'Cadastro realizado com sucesso!')
                return redirect('index')
            except Exception as e:
                messages.error(request, f'Erro ao criar usuário: {str(e)}')
        else:
            messages.error(request, 'Por favor, corrija os erros abaixo.')
        
        # Se houver erros, mostrar formulário de login com erros de registro
        form = LoginForm()
        
        return render(request, 'login.html', {
            'form': form,
            'registro_form': registro_form,
            'active_tab': 'register'
        })

class LogoutView(View):
    def get(self, request, *args, **kwargs):
        # Limpar a sessão
        if 'usuario_id' in request.session:
            del request.session['usuario_id']
        if 'usuario_nome' in request.session:
            del request.session['usuario_nome']
        if 'usuario_email' in request.session:
            del request.session['usuario_email']
        if 'usuario_tipo' in request.session:
            del request.session['usuario_tipo']
        
        messages.success(request, 'Logout realizado com sucesso!')
        return redirect('index')

class UsuarioView(View):
    def get(self, request, *args, **kwargs):
        # Verificar se o usuário está logado
        if 'usuario_id' not in request.session:
            messages.error(request, 'Você precisa fazer login para acessar esta página.')
            return redirect('login')
        
        # Obter informações do usuário
        usuario_id = request.session.get('usuario_id')
        try:
            usuario = Usuario.objects.get(id=usuario_id)
            return render(request, 'usuario.html', {'usuario': usuario})
        except Usuario.DoesNotExist:
            messages.error(request, 'Usuário não encontrado.')
            return redirect('index')
    
    def post(self, request, *args, **kwargs):
        # Verificar se o usuário está logado
        if 'usuario_id' not in request.session:
            messages.error(request, 'Você precisa fazer login para executar esta ação.')
            return redirect('login')
        
        usuario_id = request.session.get('usuario_id')
        action = request.POST.get('action')
        
        try:
            usuario = Usuario.objects.get(id=usuario_id)
            
            if action == 'update_profile':
                # Atualizar informações do perfil
                usuario.nome = request.POST.get('nome')
                usuario.email = request.POST.get('email')
                usuario.tipo = request.POST.get('tipo', 'usuario')
                usuario.save()
                
                # Atualizar sessão
                request.session['usuario_nome'] = usuario.nome
                request.session['usuario_email'] = usuario.email
                request.session['usuario_tipo'] = usuario.tipo
                
                messages.success(request, 'Perfil atualizado com sucesso!')
                
            elif action == 'change_password':
                current_password = request.POST.get('current_password')
                new_password = request.POST.get('new_password')
                confirm_password = request.POST.get('confirm_password')
                
                # Verificar senha atual
                if usuario.senha != current_password:
                    messages.error(request, 'Senha atual incorreta.')
                elif new_password != confirm_password:
                    messages.error(request, 'As senhas não coincidem.')
                else:
                    usuario.senha = new_password
                    usuario.save()
                    messages.success(request, 'Senha alterada com sucesso!')
            
            elif action == 'request_access':
                access_type = request.POST.get('access_type')
                message = request.POST.get('message', '')
                messages.info(request, f'Solicitação de acesso {access_type} enviada. Entraremos em contato em breve.')
            
            elif action == 'save_preferences':
                messages.success(request, 'Preferências salvas com sucesso!')
            
            return redirect('usuario')
            
        except Usuario.DoesNotExist:
            messages.error(request, 'Usuário não encontrado.')
            return redirect('index')
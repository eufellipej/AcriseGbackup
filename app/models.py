from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from datetime import date
from django.utils import timezone

# ===============================================================
# USUARIO
# ===============================================================
class Usuario(models.Model):
    # Mantendo os campos originais
    nome = models.CharField(max_length=45, verbose_name="Nome")
    email = models.EmailField(max_length=90, unique=True, verbose_name="Email")
    senha = models.CharField(max_length=128, verbose_name="Senha")  # Aumentado para 128 para hash
    imagem = models.CharField(max_length=100, null=True, blank=True, verbose_name="Imagem")
    tipo = models.CharField(max_length=45, null=True, blank=True, verbose_name="Tipo", default="usuario")
    data = models.DateField(default=date.today, verbose_name="Data de Cadastro")  # Auto now add

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
        ordering = ['-data', 'nome']

    def __str__(self):
        return f"{self.nome} ({self.email})"

    # Sobrescrever o método save para hashear a senha
    def save(self, *args, **kwargs):
        # Se a senha foi alterada e não está hasheada, hash ela
        if self.senha and not self.senha.startswith('pbkdf2_sha256$'):
            self.senha = make_password(self.senha)
        super().save(*args, **kwargs)

    # Método para verificar senha (com hash)
    def verificar_senha(self, senha):
        # Se a senha armazenada começar com 'pbkdf2_sha256$', então está hasheada
        if self.senha.startswith('pbkdf2_sha256$'):
            return check_password(senha, self.senha)
        else:
            # Senha em texto claro
            if self.senha == senha:
                # Atualiza para hash e salva
                self.senha = make_password(senha)
                self.save()
                return True
            return False

    # Propriedade para verificar se é admin
    @property
    def is_admin(self):
        return self.tipo == 'admin'

    # Propriedade para verificar se é editor
    @property
    def is_editor(self):
        return self.tipo == 'editor'

    # Método para obter avatar ou ícone padrão
    def get_avatar(self):
        if self.imagem:
            return self.imagem
        # Retorna inicial do nome
        return f"https://ui-avatars.com/api/?name={self.nome}&background=random&color=fff&size=100"


# ===============================================================
# DESASTRE
# ===============================================================
class Desastre(models.Model):
    titulo = models.CharField(max_length=100, verbose_name="Título")
    descricao = models.CharField(max_length=255, null=True, blank=True, verbose_name="Descrição")
    icone = models.CharField(max_length=100, null=True, blank=True, verbose_name="Ícone")

    class Meta:
        verbose_name = "Desastre"
        verbose_name_plural = "Desastres"

    def __str__(self):
        return self.titulo


# ===============================================================
# ACONTECIMENTO
# ===============================================================
class Acontecimento(models.Model):
    titulo = models.CharField(max_length=100, verbose_name="Título")
    descricao = models.TextField(null=True, blank=True, verbose_name="Descrição")
    dataAcontecimento = models.DateField(null=True, blank=True, verbose_name="Data do Acontecimento")
    risco = models.CharField(max_length=45, null=True, blank=True, verbose_name="Risco")

    class Meta:
        verbose_name = "Acontecimento"
        verbose_name_plural = "Acontecimentos"

    def __str__(self):
        return self.titulo


# ===============================================================
# RISCO
# ===============================================================
class Risco(models.Model):
    nome = models.CharField(max_length=100, verbose_name="Nome")
    nivel = models.CharField(max_length=45, null=True, blank=True, verbose_name="Nível")
    descricao = models.TextField(null=True, blank=True, verbose_name="Descrição")
    localizacao = models.CharField(max_length=100, null=True, blank=True, verbose_name="Localização")
    desastre = models.ForeignKey(
        Desastre,
        on_delete=models.CASCADE,
        verbose_name="Desastre Relacionado"
    )

    class Meta:
        verbose_name = "Risco"
        verbose_name_plural = "Riscos"

    def __str__(self):
        return self.nome


# ===============================================================
# ARTIGO
# ===============================================================
class Artigo(models.Model):
    titulo = models.CharField(max_length=100, verbose_name="Título")
    resumo = models.CharField(max_length=500, null=True, blank=True, verbose_name="Resumo")
    dataPublicacao = models.DateField(null=True, blank=True, verbose_name="Data de Publicação")
    usuario = models.ForeignKey(
        Usuario,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Autor"
    )

    class Meta:
        verbose_name = "Artigo"
        verbose_name_plural = "Artigos"

    def __str__(self):
        return self.titulo


# ===============================================================
# JOGO
# ===============================================================
# No arquivo models.py, atualize o modelo Jogo:

class Jogo(models.Model):
    titulo = models.CharField(max_length=100, verbose_name="Título")
    subtitulo = models.CharField(max_length=200, null=True, blank=True, verbose_name="Subtítulo")
    descricao = models.TextField(null=True, blank=True, verbose_name="Descrição")
    descricao_detalhada = models.TextField(null=True, blank=True, verbose_name="Descrição Detalhada")
    desenvolvedor = models.CharField(max_length=100, default="A Crise G Studios", verbose_name="Desenvolvedor")
    plataformas = models.CharField(max_length=200, default="Windows, Android, iOS", verbose_name="Plataformas")
    idade_recomendada = models.CharField(max_length=50, default="12+ anos", verbose_name="Idade Recomendada")
    tamanho = models.CharField(max_length=50, default="850MB (PC) / 320MB (Mobile)", verbose_name="Tamanho")
    versao = models.CharField(max_length=20, default="1.3.2", verbose_name="Versão")
    download_windows = models.URLField(null=True, blank=True, verbose_name="Link Download Windows")
    download_android = models.URLField(null=True, blank=True, verbose_name="Link Download Android")
    download_ios = models.URLField(null=True, blank=True, verbose_name="Link Download iOS")
    imagem_capa = models.CharField(max_length=500, null=True, blank=True, verbose_name="Imagem de Capa")
    data_lancamento = models.DateField(null=True, blank=True, verbose_name="Data de Lançamento")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    # Estatísticas
    jogadores_ativos = models.IntegerField(default=50000, verbose_name="Jogadores Ativos")
    avaliacao_media = models.DecimalField(max_digits=3, decimal_places=1, default=4.8, verbose_name="Avaliação Média")
    tempo_jogo_medio = models.CharField(max_length=20, default="12h", verbose_name="Tempo de Jogo Médio")
    aprendizado_efetivo = models.CharField(max_length=20, default="95%", verbose_name="Aprendizado Efetivo")
    
    class Meta:
        verbose_name = "Jogo"
        verbose_name_plural = "Jogos"

    def __str__(self):
        return self.titulo
    
    @property
    def plataformas_lista(self):
        return [p.strip() for p in self.plataformas.split(',')]
    
    @property
    def get_imagem_capa(self):
        if self.imagem_capa:
            return self.imagem_capa
        return "https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=1000"
    
    
# Adicione ao arquivo models.py:

class CaracteristicaJogo(models.Model):
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE, related_name='caracteristicas')
    icone = models.CharField(max_length=50, default="fas fa-check-circle", verbose_name="Ícone")
    descricao = models.TextField(verbose_name="Descrição")
    ordem = models.IntegerField(default=0, verbose_name="Ordem de Exibição")
    
    class Meta:
        verbose_name = "Característica do Jogo"
        verbose_name_plural = "Características do Jogo"
        ordering = ['ordem']

    def __str__(self):
        return f"{self.jogo.titulo} - {self.descricao[:30]}..."

class RequisitoJogo(models.Model):
    TIPO_CHOICES = [
        ('minimo', 'Mínimo'),
        ('recomendado', 'Recomendado'),
    ]
    
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE, related_name='requisitos')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='minimo')
    descricao = models.CharField(max_length=200, verbose_name="Descrição")
    
    class Meta:
        verbose_name = "Requisito do Jogo"
        verbose_name_plural = "Requisitos do Jogo"

    def __str__(self):
        return f"{self.jogo.titulo} - {self.get_tipo_display()}"

class AtualizacaoJogo(models.Model):
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE, related_name='atualizacoes')
    versao = models.CharField(max_length=20, verbose_name="Versão")
    data = models.DateField(verbose_name="Data da Atualização")
    descricao = models.TextField(verbose_name="Descrição")
    detalhes = models.TextField(null=True, blank=True, verbose_name="Detalhes")
    ordem = models.IntegerField(default=0, verbose_name="Ordem de Exibição")
    
    class Meta:
        verbose_name = "Atualização do Jogo"
        verbose_name_plural = "Atualizações do Jogo"
        ordering = ['-data', '-ordem']

    def __str__(self):
        return f"{self.jogo.titulo} - v{self.versao}"

# No arquivo models.py, atualize o modelo FAQJogo:

class FAQJogo(models.Model):
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE, related_name='faqs')
    pergunta = models.TextField(verbose_name="Pergunta")
    resposta = models.TextField(verbose_name="Resposta")
    ordem = models.IntegerField(default=0, verbose_name="Ordem de Exibição")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    visivel = models.BooleanField(default=True, verbose_name="Visível no Site")  # Novo campo
    categoria = models.CharField(
        max_length=50, 
        default="geral", 
        verbose_name="Categoria",
        choices=[
            ('geral', 'Geral'),
            ('tecnico', 'Técnico'),
            ('jogabilidade', 'Jogabilidade'),
            ('pedagogico', 'Pedagógico'),
            ('outros', 'Outros')
        ]
    )
    data_criacao = models.DateTimeField(default=timezone.now, verbose_name="Data de Criação")
    data_atualizacao = models.DateTimeField(auto_now=True, verbose_name="Última Atualização")
    
    class Meta:
        verbose_name = "FAQ do Jogo"
        verbose_name_plural = "FAQs do Jogo"
        ordering = ['ordem', 'categoria', 'data_criacao']

    def __str__(self):
        return f"{self.jogo.titulo} - {self.pergunta[:50]}..."

class ImagemJogo(models.Model):
    jogo = models.ForeignKey(Jogo, on_delete=models.CASCADE, related_name='imagens')
    url = models.CharField(max_length=500, verbose_name="URL da Imagem")
    legenda = models.TextField(null=True, blank=True, verbose_name="Legenda")
    ordem = models.IntegerField(default=0, verbose_name="Ordem de Exibição")
    
    class Meta:
        verbose_name = "Imagem do Jogo"
        verbose_name_plural = "Imagens do Jogo"
        ordering = ['ordem']

    def __str__(self):
        return f"{self.jogo.titulo} - Imagem {self.id}"


# ===============================================================
# PAGINA
# ===============================================================
class Pagina(models.Model):
    titulo = models.CharField(max_length=100, verbose_name="Título")
    descricao = models.TextField(null=True, blank=True, verbose_name="Descrição")

    artigo = models.ForeignKey(
        Artigo,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Artigo"
    )
    desastre = models.ForeignKey(
        Desastre,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Desastre"
    )
    jogo = models.ForeignKey(
        Jogo,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Jogo"
    )
    acontecimento = models.ForeignKey(
        Acontecimento,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Acontecimento"
    )

    class Meta:
        verbose_name = "Página"
        verbose_name_plural = "Páginas"

    def __str__(self):
        return self.titulo


# ===============================================================
# AVALIAÇÃO
# ===============================================================
class Avaliacao(models.Model):
    texto = models.TextField(null=True, blank=True, verbose_name="Texto")
    horario = models.DateTimeField(auto_now_add=True, verbose_name="Horário")
    nota = models.IntegerField(verbose_name="Nota")

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        verbose_name="Usuário"
    )
    jogo = models.ForeignKey(
        Jogo,
        on_delete=models.CASCADE,
        verbose_name="Jogo"
    )

    class Meta:
        verbose_name = "Avaliação"
        verbose_name_plural = "Avaliações"

    def __str__(self):
        return f"{self.jogo.titulo} - {self.nota}"


# ===============================================================
# TÓPICO ARTIGO
# ===============================================================
class TopicoArtigo(models.Model):
    titulo = models.CharField(max_length=100, verbose_name="Título")
    texto = models.TextField(null=True, blank=True, verbose_name="Texto")
    artigo = models.ForeignKey(
        Artigo,
        on_delete=models.CASCADE,
        verbose_name="Artigo"
    )

    class Meta:
        verbose_name = "Tópico do Artigo"
        verbose_name_plural = "Tópicos dos Artigos"

    def __str__(self):
        return self.titulo


# ===============================================================
# TÓPICO DESASTRE
# ===============================================================
class TopicoDesastre(models.Model):
    titulo = models.CharField(max_length=100, verbose_name="Título")
    texto = models.TextField(null=True, blank=True, verbose_name="Texto")
    desastre = models.ForeignKey(
        Desastre,
        on_delete=models.CASCADE,
        verbose_name="Desastre"
    )

    class Meta:
        verbose_name = "Tópico do Desastre"
        verbose_name_plural = "Tópicos dos Desastres"

    def __str__(self):
        return self.titulo


# ===============================================================
# PERGUNTA
# ===============================================================
class Pergunta(models.Model):
    pergunta = models.TextField(verbose_name="Pergunta")
    resposta = models.TextField(null=True, blank=True, verbose_name="Resposta")

    jogo = models.ForeignKey(
        Jogo,
        on_delete=models.CASCADE,
        verbose_name="Jogo"
    )
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        verbose_name="Usuário"
    )

    class Meta:
        verbose_name = "Pergunta"
        verbose_name_plural = "Perguntas"

    def __str__(self):
        return self.pergunta[:40] + "..."


# Adicione ao arquivo models.py:

class PerguntaUsuario(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('respondida', 'Respondida'),
        ('arquivada', 'Arquivada'),
        ('publicada', 'Publicada como FAQ'),
    ]
    
    usuario = models.ForeignKey(
        Usuario, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='perguntas_enviadas',
        verbose_name="Usuário"
    )
    jogo = models.ForeignKey(
        Jogo, 
        on_delete=models.CASCADE,
        related_name='perguntas_usuarios',
        verbose_name="Jogo"
    )
    pergunta = models.TextField(verbose_name="Pergunta")
    email = models.EmailField(verbose_name="Email para Resposta")
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pendente',
        verbose_name="Status"
    )
    resposta_admin = models.TextField(null=True, blank=True, verbose_name="Resposta do Admin")
    data_envio = models.DateTimeField(auto_now_add=True, verbose_name="Data de Envio")
    data_resposta = models.DateTimeField(null=True, blank=True, verbose_name="Data da Resposta")
    admin_respondeu = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='perguntas_respondidas',
        verbose_name="Admin que Respondeu"
    )
    publicado_como_faq = models.ForeignKey(
        FAQJogo,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Publicado como FAQ"
    )
    
    class Meta:
        verbose_name = "Pergunta do Usuário"
        verbose_name_plural = "Perguntas dos Usuários"
        ordering = ['-data_envio', 'status']
    
    def __str__(self):
        return f"{self.pergunta[:50]}... - {self.get_status_display()}"
    
    @property
    def tempo_decorrido(self):
        from django.utils import timezone
        from django.utils.timesince import timesince
        
        return timesince(self.data_envio, timezone.now())
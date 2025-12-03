from django.contrib import admin
from django.utils.safestring import mark_safe
from django.utils.html import format_html
from .models import *

# ===============================================================
# USUÁRIO ADMIN CONFIG
# ===============================================================
@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome', 'email', 'tipo', 'data', 'imagem_preview']
    search_fields = ['nome', 'email', 'tipo']
    list_filter = ['tipo', 'data']
    list_editable = ['tipo']
    list_per_page = 20
    ordering = ['-data', 'nome']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'email', 'senha', 'tipo')
        }),
        ('Informações Adicionais', {
            'fields': ('imagem', 'data'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['data']
    
    def imagem_preview(self, obj):
        if obj.imagem:
            return mark_safe(f'<img src="{obj.imagem}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />')
        return "Sem imagem"
    
    imagem_preview.short_description = 'Avatar'
    
    actions = ['tornar_administrador', 'tornar_usuario_padrao']
    
    def tornar_administrador(self, request, queryset):
        updated = queryset.update(tipo='admin')
        self.message_user(request, f'{updated} usuário(s) tornaram-se administrador(es).')
    
    def tornar_usuario_padrao(self, request, queryset):
        updated = queryset.update(tipo='usuario')
        self.message_user(request, f'{updated} usuário(s) tornaram-se usuário(s) padrão.')
    
    tornar_administrador.short_description = "Tornar selecionados Administradores"
    tornar_usuario_padrao.short_description = "Tornar selecionados Usuários Padrão"

# ===============================================================
# DESASTRE
# ===============================================================
@admin.register(Desastre)
class DesastreAdmin(admin.ModelAdmin):
    list_display = ['id', 'titulo', 'descricao_curta', 'icone']
    search_fields = ['titulo', 'descricao']
    list_filter = ['titulo']
    
    def descricao_curta(self, obj):
        if obj.descricao:
            return obj.descricao[:50] + '...' if len(obj.descricao) > 50 else obj.descricao
        return "Sem descrição"
    descricao_curta.short_description = 'Descrição'

# ===============================================================
# ACONTECIMENTO
# ===============================================================
@admin.register(Acontecimento)
class AcontecimentoAdmin(admin.ModelAdmin):
    list_display = ['id', 'titulo', 'dataAcontecimento', 'risco', 'descricao_curta']
    search_fields = ['titulo', 'risco']
    list_filter = ['risco', 'dataAcontecimento']
    date_hierarchy = 'dataAcontecimento'
    
    def descricao_curta(self, obj):
        if obj.descricao:
            return obj.descricao[:100] + '...' if len(obj.descricao) > 100 else obj.descricao
        return "Sem descrição"
    descricao_curta.short_description = 'Descrição'

# ===============================================================
# RISCO
# ===============================================================
@admin.register(Risco)
class RiscoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nome', 'nivel', 'localizacao', 'desastre']
    search_fields = ['nome', 'localizacao', 'nivel']
    list_filter = ['nivel', 'desastre']
    raw_id_fields = ['desastre']

# ===============================================================
# ARTIGO
# ===============================================================
@admin.register(Artigo)
class ArtigoAdmin(admin.ModelAdmin):
    list_display = ['id', 'titulo', 'usuario', 'dataPublicacao', 'resumo_curto']
    search_fields = ['titulo', 'resumo']
    list_filter = ['dataPublicacao']
    date_hierarchy = 'dataPublicacao'
    raw_id_fields = ['usuario']
    
    def resumo_curto(self, obj):
        if obj.resumo:
            return obj.resumo[:100] + '...' if len(obj.resumo) > 100 else obj.resumo
        return "Sem resumo"
    resumo_curto.short_description = 'Resumo'

# ===============================================================
# JOGO
# ===============================================================
@admin.register(Jogo)
class JogoAdmin(admin.ModelAdmin):
    list_display = ['id', 'titulo', 'desenvolvedor', 'versao', 'ativo', 'data_lancamento']
    search_fields = ['titulo', 'desenvolvedor']
    list_filter = ['ativo', 'data_lancamento']
    list_editable = ['ativo', 'versao']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('titulo', 'subtitulo', 'descricao', 'descricao_detalhada')
        }),
        ('Configurações Técnicas', {
            'fields': ('desenvolvedor', 'plataformas', 'idade_recomendada', 
                      'tamanho', 'versao', 'data_lancamento', 'ativo')
        }),
        ('Links de Download', {
            'fields': ('download_windows', 'download_android', 'download_ios'),
            'classes': ('collapse',)
        }),
        ('Imagens e Estatísticas', {
            'fields': ('imagem_capa', 'jogadores_ativos', 'avaliacao_media',
                      'tempo_jogo_medio', 'aprendizado_efetivo'),
            'classes': ('collapse',)
        }),
    )

# ===============================================================
# PÁGINA
# ===============================================================
@admin.register(Pagina)
class PaginaAdmin(admin.ModelAdmin):
    list_display = ['id', 'titulo', 'artigo', 'desastre', 'jogo', 'acontecimento']
    search_fields = ['titulo']
    list_filter = ['artigo', 'desastre', 'jogo', 'acontecimento']
    raw_id_fields = ['artigo', 'desastre', 'jogo', 'acontecimento']

# ===============================================================
# AVALIAÇÃO
# ===============================================================
@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'jogo', 'nota', 'horario', 'texto_curto']
    search_fields = ['texto']
    list_filter = ['nota', 'horario']
    date_hierarchy = 'horario'
    raw_id_fields = ['usuario', 'jogo']
    
    def texto_curto(self, obj):
        if obj.texto:
            return obj.texto[:50] + '...' if len(obj.texto) > 50 else obj.texto
        return "Sem texto"
    texto_curto.short_description = 'Avaliação'

# ===============================================================
# TÓPICO ARTIGO
# ===============================================================
@admin.register(TopicoArtigo)
class TopicoArtigoAdmin(admin.ModelAdmin):
    list_display = ['id', 'titulo', 'artigo', 'texto_curto']
    search_fields = ['titulo', 'texto']
    list_filter = ['artigo']
    raw_id_fields = ['artigo']
    
    def texto_curto(self, obj):
        if obj.texto:
            return obj.texto[:100] + '...' if len(obj.texto) > 100 else obj.texto
        return "Sem texto"
    texto_curto.short_description = 'Conteúdo'

# ===============================================================
# TÓPICO DESASTRE
# ===============================================================
@admin.register(TopicoDesastre)
class TopicoDesastreAdmin(admin.ModelAdmin):
    list_display = ['id', 'titulo', 'desastre', 'texto_curto']
    search_fields = ['titulo', 'texto']
    list_filter = ['desastre']
    raw_id_fields = ['desastre']
    
    def texto_curto(self, obj):
        if obj.texto:
            return obj.texto[:100] + '...' if len(obj.texto) > 100 else obj.texto
        return "Sem texto"
    texto_curto.short_description = 'Conteúdo'

# ===============================================================
# PERGUNTA
# ===============================================================
@admin.register(Pergunta)
class PerguntaAdmin(admin.ModelAdmin):
    list_display = ['id', 'pergunta_curta', 'jogo', 'usuario', 'resposta_curta']
    search_fields = ['pergunta', 'resposta']
    list_filter = ['jogo']
    raw_id_fields = ['jogo', 'usuario']
    
    def pergunta_curta(self, obj):
        return obj.pergunta[:50] + '...' if len(obj.pergunta) > 50 else obj.pergunta
    pergunta_curta.short_description = 'Pergunta'
    
    def resposta_curta(self, obj):
        if obj.resposta:
            return obj.resposta[:50] + '...' if len(obj.resposta) > 50 else obj.resposta
        return "Sem resposta"
    resposta_curta.short_description = 'Resposta'

# ===============================================================
# CARACTERÍSTICA JOGO
# ===============================================================
@admin.register(CaracteristicaJogo)
class CaracteristicaJogoAdmin(admin.ModelAdmin):
    list_display = ['jogo', 'descricao_curta', 'icone', 'ordem']
    list_filter = ['jogo']
    list_editable = ['ordem']
    search_fields = ['descricao']
    
    def descricao_curta(self, obj):
        return obj.descricao[:100] + '...' if len(obj.descricao) > 100 else obj.descricao
    descricao_curta.short_description = 'Descrição'

# ===============================================================
# REQUISITO JOGO
# ===============================================================
@admin.register(RequisitoJogo)
class RequisitoJogoAdmin(admin.ModelAdmin):
    list_display = ['jogo', 'tipo', 'descricao']
    list_filter = ['jogo', 'tipo']
    search_fields = ['descricao']

# ===============================================================
# ATUALIZAÇÃO JOGO
# ===============================================================
@admin.register(AtualizacaoJogo)
class AtualizacaoJogoAdmin(admin.ModelAdmin):
    list_display = ['jogo', 'versao', 'data', 'descricao_curta']
    list_filter = ['jogo', 'data']
    search_fields = ['versao', 'descricao']
    date_hierarchy = 'data'
    
    def descricao_curta(self, obj):
        return obj.descricao[:100] + '...' if len(obj.descricao) > 100 else obj.descricao
    descricao_curta.short_description = 'Descrição'

# ===============================================================
# FAQ JOGO
# ===============================================================
@admin.register(FAQJogo)
class FAQJogoAdmin(admin.ModelAdmin):
    list_display = [
        'pergunta_curta', 
        'jogo', 
        'categoria', 
        'ordem', 
        'visivel', 
        'ativo',
        'data_criacao_formatada'
    ]
    
    list_filter = ['visivel', 'ativo', 'categoria', 'jogo']
    list_editable = ['visivel', 'ativo', 'ordem', 'categoria']
    search_fields = ['pergunta', 'resposta']
    list_per_page = 20
    
    actions = [
        'tornar_visivel', 
        'tornar_invisivel', 
        'ativar', 
        'desativar',
        'criar_do_template'
    ]
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('jogo', 'pergunta', 'resposta')
        }),
        ('Configurações de Exibição', {
            'fields': ('categoria', 'ordem', 'visivel', 'ativo'),
            'classes': ('collapse', 'wide'),
        }),
    )
    
    readonly_fields = ['data_criacao', 'data_atualizacao']
    
    def pergunta_curta(self, obj):
        return obj.pergunta[:100] + '...' if len(obj.pergunta) > 100 else obj.pergunta
    pergunta_curta.short_description = 'Pergunta'
    
    def data_criacao_formatada(self, obj):
        return obj.data_criacao.strftime('%d/%m/%Y %H:%M')
    data_criacao_formatada.short_description = 'Criada em'
    
    # Ações personalizadas
    def tornar_visivel(self, request, queryset):
        updated = queryset.update(visivel=True)
        self.message_user(request, f'{updated} FAQ(s) tornada(s) visível(eis) no site.')
    tornar_visivel.short_description = "Tornar visível no site"
    
    def tornar_invisivel(self, request, queryset):
        updated = queryset.update(visivel=False)
        self.message_user(request, f'{updated} FAQ(s) tornada(s) invisível(eis) no site.')
    tornar_invisivel.short_description = "Tornar invisível no site"
    
    def ativar(self, request, queryset):
        updated = queryset.update(ativo=True)
        self.message_user(request, f'{updated} FAQ(s) ativada(s).')
    ativar.short_description = "Ativar FAQ"
    
    def desativar(self, request, queryset):
        updated = queryset.update(ativo=False)
        self.message_user(request, f'{updated} FAQ(s) desativada(s).')
    desativar.short_description = "Desativar FAQ"
    
    def criar_do_template(self, request, queryset):
        templates = [
            {
                'pergunta': 'O jogo é gratuito?',
                'resposta': 'Sim, a versão básica é gratuita. Temos uma versão premium com recursos adicionais.',
                'categoria': 'geral'
            },
            {
                'pergunta': 'Posso jogar offline?',
                'resposta': 'Sim, após o download o jogo funciona totalmente offline.',
                'categoria': 'tecnico'
            },
            {
                'pergunta': 'Quantos níveis tem o jogo?',
                'resposta': 'O jogo possui 50 níveis principais e 20 desafios especiais.',
                'categoria': 'jogabilidade'
            },
        ]
        
        count = 0
        for jogo in queryset:
            for template in templates:
                FAQJogo.objects.create(
                    jogo=jogo,
                    pergunta=template['pergunta'],
                    resposta=template['resposta'],
                    categoria=template['categoria'],
                    ordem=FAQJogo.objects.filter(jogo=jogo).count() + 1
                )
                count += 1
        
        self.message_user(request, f'{count} FAQ(s) criada(s) a partir de templates.')
    criar_do_template.short_description = "Criar FAQs de template"

# ===============================================================
# IMAGEM JOGO
# ===============================================================
@admin.register(ImagemJogo)
class ImagemJogoAdmin(admin.ModelAdmin):
    list_display = ['jogo', 'legenda_curta', 'ordem']
    list_filter = ['jogo']
    list_editable = ['ordem']
    
    def legenda_curta(self, obj):
        if obj.legenda:
            return obj.legenda[:50] + '...' if len(obj.legenda) > 50 else obj.legenda
        return "Sem legenda"
    legenda_curta.short_description = 'Legenda'

# ===============================================================
# PERGUNTA USUÁRIO
# ===============================================================
@admin.register(PerguntaUsuario)
class PerguntaUsuarioAdmin(admin.ModelAdmin):
    list_display = [
        'pergunta_curta',
        'usuario_info',
        'jogo',
        'status_badge',
        'tempo_decorrido',
        'data_envio_formatada'
    ]
    
    list_filter = ['status', 'jogo', 'data_envio']
    search_fields = ['pergunta', 'email', 'usuario__nome', 'usuario__email']
    date_hierarchy = 'data_envio'
    
    actions = [
        'marcar_como_respondida',
        'marcar_como_pendente',
        'publicar_como_faq',
        'enviar_resposta_email'
    ]
    
    fieldsets = (
        ('Informações da Pergunta', {
            'fields': ('usuario', 'jogo', 'pergunta', 'email', 'status')
        }),
        ('Resposta', {
            'fields': ('resposta_admin', 'publicado_como_faq', 'admin_respondeu')
        }),
        ('Datas', {
            'fields': ('data_envio', 'data_resposta'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['data_envio', 'data_resposta']
    
    # Métodos para listagem
    def pergunta_curta(self, obj):
        return obj.pergunta[:80] + '...' if len(obj.pergunta) > 80 else obj.pergunta
    pergunta_curta.short_description = 'Pergunta'
    
    def usuario_info(self, obj):
        if obj.usuario:
            return f"{obj.usuario.nome} ({obj.usuario.email})"
        return f"Anônimo: {obj.email}"
    usuario_info.short_description = 'Usuário'
    
    def data_envio_formatada(self, obj):
        return obj.data_envio.strftime('%d/%m/%Y %H:%M')
    data_envio_formatada.short_description = 'Enviada em'
    
    def status_badge(self, obj):
        colors = {
            'pendente': 'orange',
            'respondida': 'green',
            'arquivada': 'gray',
            'publicada': 'blue'
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'
    
    def tempo_decorrido(self, obj):
        return obj.tempo_decorrido
    tempo_decorrido.short_description = 'Tempo'
    
    # Ações personalizadas
    def marcar_como_respondida(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(
            status='respondida',
            data_resposta=timezone.now(),
            admin_respondeu=request.user
        )
        self.message_user(request, f'{updated} pergunta(s) marcada(s) como respondida(s).')
    marcar_como_respondida.short_description = "Marcar como respondida"
    
    def marcar_como_pendente(self, request, queryset):
        updated = queryset.update(status='pendente', data_resposta=None)
        self.message_user(request, f'{updated} pergunta(s) marcada(s) como pendente(s).')
    marcar_como_pendente.short_description = "Marcar como pendente"
    
    def publicar_como_faq(self, request, queryset):
        count = 0
        for pergunta in queryset:
            if pergunta.status != 'publicada' and pergunta.resposta_admin:
                faq = FAQJogo.objects.create(
                    jogo=pergunta.jogo,
                    pergunta=pergunta.pergunta,
                    resposta=pergunta.resposta_admin,
                    categoria='geral',
                    ordem=FAQJogo.objects.filter(jogo=pergunta.jogo).count() + 1,
                    visivel=True,
                    ativo=True
                )
                pergunta.status = 'publicada'
                pergunta.publicado_como_faq = faq
                pergunta.save()
                count += 1
        
        self.message_user(request, f'{count} pergunta(s) publicada(s) como FAQ.')
    publicar_como_faq.short_description = "Publicar como FAQ"
    
    def enviar_resposta_email(self, request, queryset):
        self.marcar_como_respondida(request, queryset)
        self.message_user(request, f'Respostas preparadas para {queryset.count()} pergunta(s).')
    enviar_resposta_email.short_description = "Enviar resposta por email"

# ===============================================================
# CONFIGURAÇÃO DO SITE ADMIN
# ===============================================================
admin.site.site_header = "A Crise G - Administração"
admin.site.site_title = "Portal A Crise G"
admin.site.index_title = "Bem-vindo ao Portal de Administração"
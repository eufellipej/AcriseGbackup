# app/management/commands/seed_data.py
from django.core.management.base import BaseCommand
from app.models import Usuario, Desastre, Artigo, Jogo
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Popula o banco de dados com dados de exemplo'
    
    def handle(self, *args, **kwargs):
        # Criar usuários de exemplo
        usuarios = [
            Usuario(nome="Admin Master", email="admin@acriseg.com", 
                   senha=make_password("admin123"), tipo="admin"),
            Usuario(nome="João Editor", email="editor@acriseg.com", 
                   senha=make_password("editor123"), tipo="editor"),
            Usuario(nome="Maria Usuária", email="maria@exemplo.com", 
                   senha=make_password("maria123"), tipo="usuario"),
        ]
        
        for usuario in usuarios:
            usuario.save()
        
        self.stdout.write(self.style.SUCCESS(f'{len(usuarios)} usuários criados!'))
        
        # Criar desastres de exemplo
        desastres = [
            Desastre(titulo="Enchentes", descricao="Desastres relacionados a inundações", icone="🌊"),
            Desastre(titulo="Queimadas", descricao="Incêndios florestais", icone="🔥"),
            Desastre(titulo="Terremotos", descricao="Tremores de terra", icone="🌍"),
        ]
        
        for desastre in desastres:
            desastre.save()
        
        self.stdout.write(self.style.SUCCESS(f'{len(desastres)} desastres criados!'))
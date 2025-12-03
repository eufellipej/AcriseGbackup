// artigo.js - Funcionalidades para página de artigo individual

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips
    initTooltips();
    
    // Inicializar funcionalidade de citação
    initCitacoes();
    
    // Inicializar funcionalidade de salvamento
    initSalvamento();
    
    // Inicializar funcionalidade de impressão
    initImpressao();
});

// Tooltips para elementos interativos
function initTooltips() {
    const elementosComTooltip = document.querySelectorAll('[data-tooltip]');
    
    elementosComTooltip.forEach(elemento => {
        elemento.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            this._tooltip = tooltip;
        });
        
        elemento.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// Funcionalidade de citação
function initCitacoes() {
    const citacoes = document.querySelectorAll('.citacao');
    
    citacoes.forEach(citacao => {
        citacao.addEventListener('click', function() {
            const texto = this.textContent.trim();
            navigator.clipboard.writeText(texto).then(() => {
                mostrarNotificacao('Citação copiada para a área de transferência!', 'sucesso');
            }).catch(err => {
                console.error('Erro ao copiar citação: ', err);
            });
        });
    });
}

// Funcionalidade de salvamento
function initSalvamento() {
    const btnSalvar = document.querySelector('.btn-outline .fa-bookmark')?.closest('button');
    
    if (btnSalvar) {
        btnSalvar.addEventListener('click', function() {
            const artigoSalvo = localStorage.getItem('artigo_salvo') === 'true';
            
            if (artigoSalvo) {
                localStorage.removeItem('artigo_salvo');
                this.innerHTML = '<i class="fas fa-bookmark"></i> Salvar Artigo';
                mostrarNotificacao('Artigo removido dos salvos', 'info');
            } else {
                localStorage.setItem('artigo_salvo', 'true');
                this.innerHTML = '<i class="fas fa-bookmark"></i> Artigo Salvo';
                mostrarNotificacao('Artigo salvo com sucesso!', 'sucesso');
            }
        });
        
        // Verificar estado inicial
        if (localStorage.getItem('artigo_salvo') === 'true') {
            btnSalvar.innerHTML = '<i class="fas fa-bookmark"></i> Artigo Salvo';
        }
    }
}

// Funcionalidade de impressão
function initImpressao() {
    const btnImprimir = document.querySelector('.btn-outline .fa-print')?.closest('button');
    
    if (btnImprimir) {
        btnImprimir.addEventListener('click', function() {
            window.print();
        });
    }
}

// Sistema de notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao ${tipo}`;
    notificacao.innerHTML = `
        <i class="fas fa-${tipo === 'sucesso' ? 'check-circle' : tipo === 'erro' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span class="mensagem">${mensagem}</span>
        <button class="btn-fechar-notificacao">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notificacao);
    
    // Animação de entrada
    setTimeout(() => {
        notificacao.classList.add('ativo');
    }, 10);
    
    // Fechar notificação
    const btnFechar = notificacao.querySelector('.btn-fechar-notificacao');
    btnFechar.addEventListener('click', () => {
        notificacao.classList.remove('ativo');
        setTimeout(() => {
            notificacao.remove();
        }, 300);
    });
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.classList.remove('ativo');
            setTimeout(() => {
                if (notificacao.parentNode) {
                    notificacao.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Destacar seções ativas durante a leitura
function initHighlightSections() {
    const secoes = document.querySelectorAll('.secao-artigo');
    const menu = document.createElement('nav');
    menu.className = 'menu-navegacao-artigo';
    
    secoes.forEach((secao, index) => {
        const titulo = secao.querySelector('h3');
        if (titulo) {
            const item = document.createElement('a');
            item.href = `#secao-${index}`;
            item.textContent = titulo.textContent;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                secao.scrollIntoView({ behavior: 'smooth' });
            });
            menu.appendChild(item);
        }
        
        secao.id = `secao-${index}`;
    });
    
    // Adicionar menu se houver seções
    if (secoes.length > 0) {
        const container = document.querySelector('.conteudo-artigo');
        container.insertBefore(menu, container.firstChild);
    }
}

// Exportar funções para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTooltips,
        initCitacoes,
        initSalvamento,
        initImpressao,
        mostrarNotificacao,
        initHighlightSections
    };
}
// geral.js - Funcionalidades Gerais do Site

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    inicializarSistemaDeTema();
    inicializarNavegacao();
    inicializarTooltips();
    inicializarModais();
    inicializarFormularios();
    inicializarAnimacoes();
    inicializarScrollSuave();
    inicializarCarregamentoLazy();
    inicializarNotificacoes();
    inicializarDropdowns();
    inicializarContadores();
});

// Sistema de Tema Escuro/Claro
function inicializarSistemaDeTema() {
    const botaoTema = document.querySelector('.botao-tema');
    const iconSol = document.querySelector('.icon-sol');
    const iconLua = document.querySelector('.icon-lua');
    
    if (!botaoTema) return;
    
    // Verificar preferência do sistema
    const preferenciaSistema = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const temaSalvo = localStorage.getItem('tema');
    
    // Aplicar tema inicial
    if (temaSalvo === 'claro' || (!temaSalvo && !preferenciaSistema)) {
        ativarTemaClaro();
    } else {
        ativarTemaEscuro();
    }
    
    botaoTema.addEventListener('click', alternarTema);
    
    function alternarTema() {
        const temaAtual = document.documentElement.getAttribute('data-tema');
        
        if (temaAtual === 'claro') {
            ativarTemaEscuro();
            localStorage.setItem('tema', 'escuro');
        } else {
            ativarTemaClaro();
            localStorage.setItem('tema', 'claro');
        }
    }
    
    function ativarTemaEscuro() {
        document.documentElement.setAttribute('data-tema', 'escuro');
        iconSol?.classList.remove('ativo');
        iconLua?.classList.add('ativo');
    }
    
    function ativarTemaClaro() {
        document.documentElement.setAttribute('data-tema', 'claro');
        iconSol?.classList.add('ativo');
        iconLua?.classList.remove('ativo');
    }
}

// Navegação Suave
function inicializarNavegacao() {
    // Links internos com scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const alvo = document.querySelector(href);
            if (alvo) {
                e.preventDefault();
                alvo.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Atualizar URL sem recarregar a página
                history.pushState(null, null, href);
            }
        });
    });
    
    // Ativar item ativo na navegação
    const linksNavegacao = document.querySelectorAll('.conter-nav a');
    const urlAtual = window.location.pathname;
    
    linksNavegacao.forEach(link => {
        const linkUrl = link.getAttribute('href');
        if (linkUrl && urlAtual.includes(linkUrl.replace(/^\//, ''))) {
            link.classList.add('ativo');
        }
    });
}

// Tooltips
function inicializarTooltips() {
    const elementosTooltip = document.querySelectorAll('[data-tooltip]');
    
    elementosTooltip.forEach(elemento => {
        elemento.addEventListener('mouseenter', mostrarTooltip);
        elemento.addEventListener('mouseleave', esconderTooltip);
    });
    
    function mostrarTooltip(e) {
        const elemento = e.target;
        const texto = elemento.getAttribute('data-tooltip');
        
        if (!texto) return;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = texto;
        
        document.body.appendChild(tooltip);
        
        const rect = elemento.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        tooltip.style.zIndex = '10000';
        
        elemento.dataset.tooltipId = Date.now();
        tooltip.id = 'tooltip-' + elemento.dataset.tooltipId;
    }
    
    function esconderTooltip(e) {
        const elemento = e.target;
        const tooltipId = elemento.dataset.tooltipId;
        
        if (tooltipId) {
            const tooltip = document.getElementById('tooltip-' + tooltipId);
            if (tooltip) {
                tooltip.remove();
            }
        }
    }
}

// Sistema de Modais
function inicializarModais() {
    const modais = document.querySelectorAll('.modal');
    const botoesAbrir = document.querySelectorAll('[data-modal-abrir]');
    const botoesFechar = document.querySelectorAll('[data-modal-fechar]');
    
    // Abrir modal
    botoesAbrir.forEach(botao => {
        botao.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-abrir');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                abrirModal(modal);
            }
        });
    });
    
    // Fechar modal
    botoesFechar.forEach(botao => {
        botao.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                fecharModal(modal);
            }
        });
    });
    
    // Fechar modal ao clicar fora
    modais.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                fecharModal(this);
            }
        });
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modalAberto = document.querySelector('.modal.ativo');
            if (modalAberto) {
                fecharModal(modalAberto);
            }
        }
    });
    
    function abrirModal(modal) {
        modal.classList.add('ativo');
        document.body.style.overflow = 'hidden';
    }
    
    function fecharModal(modal) {
        modal.classList.remove('ativo');
        document.body.style.overflow = '';
    }
}

// Validação de Formulários
function inicializarFormularios() {
    const formularios = document.querySelectorAll('form[data-validar]');
    
    formularios.forEach(formulario => {
        formulario.addEventListener('submit', validarFormulario);
        
        // Validação em tempo real
        const campos = formulario.querySelectorAll('[data-validar-campo]');
        campos.forEach(campo => {
            campo.addEventListener('blur', validarCampo);
            campo.addEventListener('input', limparErroCampo);
        });
    });
    
    function validarFormulario(e) {
        e.preventDefault();
        
        const formulario = e.target;
        const campos = formulario.querySelectorAll('[data-validar-campo]');
        let valido = true;
        
        // Limpar erros anteriores
        limparErros(formulario);
        
        // Validar cada campo
        campos.forEach(campo => {
            if (!validarCampoIndividual(campo)) {
                valido = false;
                mostrarErroCampo(campo);
            }
        });
        
        if (valido) {
            // Simular envio (substituir por AJAX real)
            console.log('Formulário válido, enviando...');
            mostrarSucesso(formulario);
        }
    }
    
    function validarCampo(e) {
        const campo = e.target;
        const valido = validarCampoIndividual(campo);
        
        if (!valido) {
            mostrarErroCampo(campo);
        } else {
            limparErroCampo(e);
        }
    }
    
    function validarCampoIndividual(campo) {
        const valor = campo.value.trim();
        const tipo = campo.getAttribute('type');
        const obrigatorio = campo.hasAttribute('required');
        const padrao = campo.getAttribute('pattern');
        const minLength = campo.getAttribute('minlength');
        const maxLength = campo.getAttribute('maxlength');
        
        // Campo obrigatório vazio
        if (obrigatorio && !valor) {
            return false;
        }
        
        // Validação de email
        if (tipo === 'email' && valor) {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(valor)) {
                return false;
            }
        }
        
        // Validação de padrão
        if (padrao && valor) {
            const regex = new RegExp(padrao);
            if (!regex.test(valor)) {
                return false;
            }
        }
        
        // Validação de tamanho
        if (minLength && valor.length < parseInt(minLength)) {
            return false;
        }
        
        if (maxLength && valor.length > parseInt(maxLength)) {
            return false;
        }
        
        return true;
    }
    
    function mostrarErroCampo(campo) {
        const mensagem = campo.getAttribute('data-mensagem-erro') || 'Por favor, preencha este campo corretamente.';
        const grupo = campo.closest('.form-group') || campo.parentElement;
        
        grupo.classList.add('erro');
        
        let elementoErro = grupo.querySelector('.mensagem-erro');
        if (!elementoErro) {
            elementoErro = document.createElement('div');
            elementoErro.className = 'mensagem-erro';
            grupo.appendChild(elementoErro);
        }
        
        elementoErro.textContent = mensagem;
    }
    
    function limparErroCampo(e) {
        const campo = e.target;
        const grupo = campo.closest('.form-group') || campo.parentElement;
        
        grupo.classList.remove('erro');
        
        const elementoErro = grupo.querySelector('.mensagem-erro');
        if (elementoErro) {
            elementoErro.remove();
        }
    }
    
    function limparErros(formulario) {
        const grupos = formulario.querySelectorAll('.form-group');
        grupos.forEach(grupo => {
            grupo.classList.remove('erro');
            const elementoErro = grupo.querySelector('.mensagem-erro');
            if (elementoErro) {
                elementoErro.remove();
            }
        });
    }
    
    function mostrarSucesso(formulario) {
        const botao = formulario.querySelector('button[type="submit"]');
        const textoOriginal = botao.textContent;
        
        botao.disabled = true;
        botao.textContent = 'Enviando...';
        botao.classList.add('enviando');
        
        // Simular envio
        setTimeout(() => {
            botao.disabled = false;
            botao.textContent = 'Enviado!';
            botao.classList.remove('enviando');
            botao.classList.add('enviado');
            
            setTimeout(() => {
                botao.textContent = textoOriginal;
                botao.classList.remove('enviado');
                formulario.reset();
            }, 2000);
        }, 1500);
    }
}

// Animações ao Scroll
function inicializarAnimacoes() {
    const elementosAnimaveis = document.querySelectorAll('[data-animacao]');
    
    if (!elementosAnimaveis.length) return;
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const elemento = entrada.target;
                const animacao = elemento.getAttribute('data-animacao');
                elemento.classList.add('animar', animacao);
                observador.unobserve(elemento);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elementosAnimaveis.forEach(elemento => {
        observador.observe(elemento);
    });
}

// Scroll Suave para Elementos
function inicializarScrollSuave() {
    const linksInternos = document.querySelectorAll('a[href^="#"]');
    
    linksInternos.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#top') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const alvo = document.querySelector(href);
            if (alvo) {
                e.preventDefault();
                alvo.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Carregamento Lazy de Imagens
function inicializarCarregamentoLazy() {
    const imagensLazy = document.querySelectorAll('img[data-src]');
    
    if (!('IntersectionObserver' in window)) {
        // Fallback para navegadores antigos
        imagensLazy.forEach(img => {
            img.src = img.dataset.src;
        });
        return;
    }
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const img = entrada.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observador.unobserve(img);
            }
        });
    });
    
    imagensLazy.forEach(img => {
        observador.observe(img);
    });
}

// Sistema de Notificações
function inicializarNotificacoes() {
    window.mostrarNotificacao = function(mensagem, tipo = 'info') {
        const container = document.getElementById('notificacoes-container') || criarContainerNotificacoes();
        const notificacao = criarNotificacao(mensagem, tipo);
        
        container.appendChild(notificacao);
        
        // Remover automaticamente após 5 segundos
        setTimeout(() => {
            fecharNotificacao(notificacao);
        }, 5000);
    };
    
    function criarContainerNotificacoes() {
        const container = document.createElement('div');
        container.id = 'notificacoes-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    function criarNotificacao(mensagem, tipo) {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        notificacao.innerHTML = `
            <div class="conteudo-notificacao">
                <i class="icone-notificacao"></i>
                <span>${mensagem}</span>
            </div>
            <button class="fechar-notificacao">&times;</button>
        `;
        
        // Estilos da notificação
        notificacao.style.cssText = `
            background: var(--secudario);
            color: var(--fonte);
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: var(--sombra-forte);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            animation: slideIn 0.3s ease;
            border-left: 4px solid;
        `;
        
        // Cores baseadas no tipo
        const cores = {
            sucesso: '#27ae60',
            erro: '#e74c3c',
            alerta: '#f39c12',
            info: '#3498db'
        };
        
        notificacao.style.borderLeftColor = cores[tipo] || cores.info;
        
        // Botão de fechar
        const botaoFechar = notificacao.querySelector('.fechar-notificacao');
        botaoFechar.style.cssText = `
            background: none;
            border: none;
            color: var(--fonte);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        
        botaoFechar.addEventListener('click', () => fecharNotificacao(notificacao));
        
        return notificacao;
    }
    
    function fecharNotificacao(notificacao) {
        notificacao.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.parentNode.removeChild(notificacao);
            }
        }, 300);
    }
}

// Dropdowns
function inicializarDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const botao = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (botao && menu) {
            botao.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('ativo');
                botao.classList.toggle('ativo');
            });
        }
    });
    
    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            const botao = dropdown.querySelector('.dropdown-toggle');
            
            if (menu && menu.classList.contains('ativo')) {
                menu.classList.remove('ativo');
                botao?.classList.remove('ativo');
            }
        });
    });
}

// Contadores Animados
function inicializarContadores() {
    const contadores = document.querySelectorAll('.contador');
    
    if (!contadores.length) return;
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const contador = entrada.target;
                const valorFinal = parseInt(contador.textContent);
                const duracao = 2000; // 2 segundos
                const incremento = valorFinal / (duracao / 16); // 60fps
                
                let valorAtual = 0;
                
                const timer = setInterval(() => {
                    valorAtual += incremento;
                    
                    if (valorAtual >= valorFinal) {
                        contador.textContent = valorFinal.toLocaleString();
                        clearInterval(timer);
                    } else {
                        contador.textContent = Math.floor(valorAtual).toLocaleString();
                    }
                }, 16);
                
                observador.unobserve(contador);
            }
        });
    });
    
    contadores.forEach(contador => {
        observador.observe(contador);
    });
}

// Botão Voltar ao Topo
function inicializarBotaoVoltarTopo() {
    const botao = document.querySelector('.back-to-top');
    
    if (!botao) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            botao.classList.add('visible');
        } else {
            botao.classList.remove('visible');
        }
    });
    
    botao.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Função de Debounce para otimização
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Formatar números
function formatarNumero(numero) {
    return new Intl.NumberFormat('pt-BR').format(numero);
}

// Formatar data
function formatarData(data, formato = 'pt-BR') {
    return new Date(data).toLocaleDateString(formato, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Verificar se elemento está visível na viewport
function estaNaViewport(elemento) {
    const rect = elemento.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Copiar para clipboard
function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarNotificacao('Copiado para a área de transferência!', 'sucesso');
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        mostrarNotificacao('Erro ao copiar', 'erro');
    });
}

// Exportar funções para uso global
window.CriseG = {
    mostrarNotificacao,
    formatarNumero,
    formatarData,
    copiarParaClipboard,
    debounce
};

// Inicializar funções extras
inicializarBotaoVoltarTopo();

// Animar elementos na entrada
setTimeout(() => {
    document.body.classList.add('carregado');
}, 100);
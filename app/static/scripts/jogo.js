// jogo.js - Funcionalidades da página do jogo educativo

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página do jogo carregada');
    
    // Inicializar FAQ
    initFAQ();
    
    // Inicializar sistema de downloads
    initDownloads();
    
    // Inicializar galeria
    initGaleria();
    
    // Inicializar formulário
    initFormulario();

    initFAQ();
});

// Sistema de FAQ
function initFAQ() {
    const perguntas = document.querySelectorAll('.pergunta-titulo');
    
    perguntas.forEach(pergunta => {
        pergunta.addEventListener('click', function() {
            const resposta = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Fechar outras respostas
            document.querySelectorAll('.pergunta-resposta').forEach(r => {
                if (r !== resposta && r.classList.contains('ativo')) {
                    r.classList.remove('ativo');
                    r.previousElementSibling.classList.remove('ativo');
                    r.previousElementSibling.querySelector('i').classList.remove('fa-chevron-up');
                    r.previousElementSibling.querySelector('i').classList.add('fa-chevron-down');
                }
            });
            
            // Alternar estado atual
            this.classList.toggle('ativo');
            resposta.classList.toggle('ativo');
            
            // Alternar ícone
            if (this.classList.contains('ativo')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
}

// Sistema de downloads
function initDownloads() {
    const botoesDownload = document.querySelectorAll('.botoes-download .btn');
    
    botoesDownload.forEach(botao => {
        botao.addEventListener('click', function() {
            const tipo = this.textContent.includes('Windows') ? 'Windows' : 
                        this.textContent.includes('Mobile') ? 'Mobile' : 'iOS';
            
            // Simular download
            mostrarNotificacao(`Iniciando download da versão para ${tipo}...`, 'info');
            
            // Em um ambiente real, aqui iniciaria o download
            setTimeout(() => {
                mostrarNotificacao('Download iniciado com sucesso!', 'sucesso');
            }, 1000);
        });
    });
}

// Sistema de galeria
function initGaleria() {
    const galeriaItens = document.querySelectorAll('.galeria-item');
    
    galeriaItens.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const legenda = this.querySelector('.galeria-legenda').textContent;
            
            // Criar modal de visualização
            criarModalImagem(img.src, legenda);
        });
    });
}

// Sistema de formulário
function initFormulario() {
    const formPergunta = document.getElementById('form-pergunta-jogo');
    
    if (formPergunta) {
        formPergunta.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pergunta = document.getElementById('pergunta-usuario').value;
            const email = document.getElementById('email-pergunta').value;
            
            // Validação básica
            if (!pergunta || !email) {
                mostrarNotificacao('Por favor, preencha todos os campos.', 'erro');
                return;
            }
            
            if (!validarEmail(email)) {
                mostrarNotificacao('Por favor, insira um email válido.', 'erro');
                return;
            }
            
            // Simular envio
            mostrarNotificacao('Enviando sua pergunta...', 'info');
            
            setTimeout(() => {
                mostrarNotificacao('Pergunta enviada com sucesso! Responderemos em até 48 horas.', 'sucesso');
                formPergunta.reset();
            }, 1500);
        });
    }
}

// Funções auxiliares
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `alert alert-${tipo} fade-in`;
    notificacao.innerHTML = `
        <div class="d-flex align-center justify-between">
            <span>${mensagem}</span>
            <button class="btn btn-pequeno btn-outline" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Adicionar ao container principal
    const container = document.querySelector('.container');
    container.insertBefore(notificacao, container.firstChild);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.remove();
        }
    }, 5000);
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function criarModalImagem(src, legenda) {
    // Remover modal existente
    const modalExistente = document.getElementById('modal-galeria');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    // Criar novo modal
    const modal = document.createElement('div');
    modal.id = 'modal-galeria';
    modal.className = 'modal-galeria ativo';
    modal.innerHTML = `
        <div class="modal-conteudo">
            <button class="modal-fechar">
                <i class="fas fa-times"></i>
            </button>
            <img src="${src}" alt="${legenda}">
            <div class="modal-legenda">${legenda}</div>
            <div class="modal-controles">
                <button class="btn btn-outline" onclick="proximaImagem()">
                    <i class="fas fa-arrow-left"></i> Anterior
                </button>
                <button class="btn btn-outline" onclick="proximaImagem()">
                    Próxima <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fechar modal ao clicar no botão ou fora
    modal.querySelector('.modal-fechar').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Adicionar estilo CSS para o modal
    const estilo = document.createElement('style');
    estilo.textContent = `
        .modal-galeria {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            padding: var(--espaco-md);
        }
        
        .modal-galeria .modal-conteudo {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
        }
        
        .modal-galeria img {
            max-width: 100%;
            max-height: 70vh;
            border-radius: var(--raio-lg);
        }
        
        .modal-legenda {
            text-align: center;
            color: white;
            margin-top: var(--espaco-sm);
            font-size: 1.2rem;
        }
        
        .modal-controles {
            display: flex;
            justify-content: center;
            gap: var(--espaco-md);
            margin-top: var(--espaco-lg);
        }
        
        .modal-fechar {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
        }
    `;
    
    document.head.appendChild(estilo);
}

// Funções de navegação da galeria (simplificadas)
function imagemAnterior() {
    mostrarNotificacao('Navegando para imagem anterior...', 'info');
}

function proximaImagem() {
    mostrarNotificacao('Navegando para próxima imagem...', 'info');
}



function initFAQ() {
    const faqQuestions = document.querySelectorAll('.pergunta-content');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
        });
    });
}

// Adicione ao seu arquivo jogo.js ou crie um novo arquivo faq.js

document.addEventListener('DOMContentLoaded', function() {
    // Filtros de FAQ
    const filtrosFAQ = document.querySelectorAll('.btn-filtro-faq');
    const categoriasFAQ = document.querySelectorAll('.faq-categoria');
    
    filtrosFAQ.forEach(filtro => {
        filtro.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            
            // Atualizar filtro ativo
            filtrosFAQ.forEach(f => f.classList.remove('ativo'));
            this.classList.add('ativo');
            
            // Mostrar/ocultar categorias
            if (categoria === 'todas') {
                categoriasFAQ.forEach(cat => {
                    cat.style.display = 'block';
                    setTimeout(() => {
                        cat.style.opacity = '1';
                    }, 10);
                });
            } else {
                categoriasFAQ.forEach(cat => {
                    if (cat.id === `categoria-${categoria}`) {
                        cat.style.display = 'block';
                        setTimeout(() => {
                            cat.style.opacity = '1';
                        }, 10);
                    } else {
                        cat.style.opacity = '0';
                        setTimeout(() => {
                            cat.style.display = 'none';
                        }, 300);
                    }
                });
            }
        });
    });
    
    // Contador de caracteres para textarea
    const textareaPergunta = document.getElementById('pergunta-usuario');
    const contadorPergunta = document.getElementById('contador-pergunta');
    
    if (textareaPergunta && contadorPergunta) {
        textareaPergunta.addEventListener('input', function() {
            const length = this.value.length;
            contadorPergunta.textContent = length;
            
            // Mudar cor quando atingir limite
            if (length > 450) {
                contadorPergunta.style.color = '#FF6B6B';
            } else if (length > 400) {
                contadorPergunta.style.color = '#FFA726';
            } else {
                contadorPergunta.style.color = '';
            }
        });
    }
    
    // Formulário de pergunta do usuário
    const formPerguntaUsuario = document.getElementById('form-pergunta-usuario');
    if (formPerguntaUsuario) {
        formPerguntaUsuario.addEventListener('submit', function(e) {
            const pergunta = document.getElementById('pergunta-usuario').value.trim();
            const email = document.getElementById('email-pergunta').value.trim();
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Validação
            if (!pergunta) {
                e.preventDefault();
                showToast('Por favor, digite sua pergunta.', 'error');
                document.getElementById('pergunta-usuario').focus();
                return false;
            }
            
            if (!email || !isValidEmail(email)) {
                e.preventDefault();
                showToast('Por favor, forneça um email válido.', 'error');
                document.getElementById('email-pergunta').focus();
                return false;
            }
            
            if (pergunta.length > 500) {
                e.preventDefault();
                showToast('A pergunta deve ter no máximo 500 caracteres.', 'error');
                return false;
            }
            
            // Mostrar loading
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Reativar botão após 5 segundos (caso o submit falhe)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 5000);
        });
    }
    
    // Toggle de perguntas anteriores
    const btnTogglePerguntas = document.querySelector('.btn-toggle-perguntas');
    if (btnTogglePerguntas) {
        btnTogglePerguntas.addEventListener('click', function() {
            const perguntasLista = this.nextElementSibling;
            const icon = this.querySelector('.fa-chevron-down, .fa-chevron-up');
            
            if (perguntasLista.style.display === 'none' || perguntasLista.style.display === '') {
                perguntasLista.style.display = 'block';
                this.classList.add('ativo');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
                
                // Carregar perguntas se ainda não carregou
                if (perguntasLista.querySelector('.perguntas-loading')) {
                    carregarMinhasPerguntas();
                }
            } else {
                perguntasLista.style.display = 'none';
                this.classList.remove('ativo');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    }
    
    // Função para carregar perguntas anteriores do usuário
    function carregarMinhasPerguntas() {
        const loadingDiv = document.querySelector('.perguntas-loading');
        
        // Simulação de chamada AJAX
        setTimeout(() => {
            loadingDiv.innerHTML = `
                <div class="pergunta-item-minha">
                    <div class="pergunta-texto-minha">Como posso resetar meu progresso?</div>
                    <div class="status-pergunta">
                        <span class="status-badge status-respondida">Respondida</span>
                    </div>
                    <div class="data-pergunta">15/11/2024</div>
                </div>
                <div class="pergunta-item-minha">
                    <div class="pergunta-texto-minha">O jogo tem suporte a controle?</div>
                    <div class="status-pergunta">
                        <span class="status-badge status-publicada">Publicada como FAQ</span>
                    </div>
                    <div class="data-pergunta">10/11/2024</div>
                </div>
                <div class="pergunta-item-minha">
                    <div class="pergunta-texto-minha">Posso jogar em múltiplos dispositivos?</div>
                    <div class="status-pergunta">
                        <span class="status-badge status-pendente">Pendente</span>
                    </div>
                    <div class="data-pergunta">05/11/2024</div>
                </div>
            `;
        }, 1000);
    }
    
    // Funções auxiliares
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showToast(message, type = 'info') {
        // Remover toast anterior se existir
        const existingToast = document.querySelector('.toast-message');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Criar novo toast
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
});

// Adicione estas funções globalmente se precisar
window.moverPersonagem = function(direcao) {
    // Sua função existente...
};

window.tomarDecisao = function() {
    // Sua função existente...
};
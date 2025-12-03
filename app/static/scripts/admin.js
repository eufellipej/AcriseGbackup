// admin.js - Painel Administrativo Interativo

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dashboard
    initDashboard();
    
    // Inicializar gráficos
    initCharts();
    
    // Inicializar tabelas
    initTables();
    
    // Inicializar modais
    initModals();
    
    // Inicializar navegação
    initNavigation();
    
    // Inicializar filtros
    initFilters();
    
    // Inicializar busca
    initSearch();
});

function initDashboard() {
    // Animar estatísticas
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('slide-in');
        }, index * 100);
    });
    
    // Animar números das estatísticas
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if(currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentValue);
        }, 30);
    });
    
    // Atualizar estatísticas em tempo real
    updateStats();
}

function initCharts() {
    // Verificar se Chart.js está disponível
    if(typeof Chart === 'undefined') {
        console.log('Chart.js não carregado');
        return;
    }
    
    // Gráfico de usuários ativos
    const usersCtx = document.getElementById('usersChart');
    if(usersCtx) {
        const usersChart = new Chart(usersCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Usuários Ativos',
                    data: [120, 135, 148, 165, 180, 200, 220],
                    borderColor: 'rgb(252, 159, 54)',
                    backgroundColor: 'rgba(252, 159, 54, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de solicitações
    const requestsCtx = document.getElementById('requestsChart');
    if(requestsCtx) {
        const requestsChart = new Chart(requestsCtx, {
            type: 'bar',
            data: {
                labels: ['Aprovadas', 'Pendentes', 'Recusadas'],
                datasets: [{
                    label: 'Solicitações',
                    data: [45, 12, 8],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.7)',
                        'rgba(255, 193, 7, 0.7)',
                        'rgba(244, 67, 54, 0.7)'
                    ],
                    borderColor: [
                        'rgb(76, 175, 80)',
                        'rgb(255, 193, 7)',
                        'rgb(244, 67, 54)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }
}

function initTables() {
    // Adicionar funcionalidade às linhas da tabela
    const tableRows = document.querySelectorAll('.admin-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // Não selecionar se clicar em um botão
            if(e.target.tagName === 'BUTTON' || e.target.tagName === 'I') return;
            
            // Alternar seleção
            this.classList.toggle('selected');
            
            // Adicionar animação
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'fadeIn 0.3s';
            }, 10);
        });
    });
    
    // Botões de ação
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const userId = row.cells[0].textContent;
            const userName = row.cells[1].textContent;
            openEditModal(userId, userName);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const userName = row.cells[1].textContent;
            
            if(confirm(`Tem certeza que deseja remover o usuário "${userName}"?`)) {
                // Adicionar animação de remoção
                row.style.opacity = '0.5';
                row.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    row.remove();
                    showNotification(`Usuário "${userName}" removido com sucesso!`, 'success');
                    updateStats();
                }, 300);
            }
        });
    });
    
    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const userName = row.cells[1].textContent;
            
            // Atualizar status
            row.cells[4].innerHTML = '<span style="color:#4CAF50">Aprovado</span>';
            row.cells[5].innerHTML = '<span style="color:#888">Processado</span>';
            
            showNotification(`Solicitação de "${userName}" aprovada!`, 'success');
        });
    });
    
    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const userName = row.cells[1].textContent;
            
            // Atualizar status
            row.cells[4].innerHTML = '<span style="color:#f44336">Recusado</span>';
            row.cells[5].innerHTML = '<span style="color:#888">Processado</span>';
            
            showNotification(`Solicitação de "${userName}" recusada!`, 'error');
        });
    });
}

function initModals() {
    // Criar modais dinamicamente
    createEditModal();
    
    // Fechar modal ao clicar no X
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.admin-modal').style.display = 'none';
        });
    });
    
    // Fechar modal ao clicar fora
    document.querySelectorAll('.admin-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if(e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}

function createEditModal() {
    const modalHTML = `
        <div class="admin-modal" id="editModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Editar Usuário</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <form id="editUserForm">
                    <div class="form-group">
                        <label for="editUserName">Nome</label>
                        <input type="text" id="editUserName" required>
                    </div>
                    <div class="form-group">
                        <label for="editUserEmail">Email</label>
                        <input type="email" id="editUserEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="editUserRole">Função</label>
                        <select id="editUserRole" required>
                            <option value="user">Usuário</option>
                            <option value="editor">Editor</option>
                            <option value="moderator">Moderador</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editUserStatus">Status</label>
                        <select id="editUserStatus" required>
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                            <option value="pending">Pendente</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-full">
                        <i class="fas fa-save"></i> Salvar Alterações
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Formulário de edição
    document.getElementById('editUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const userName = document.getElementById('editUserName').value;
        const modal = document.getElementById('editModal');
        
        showNotification(`Usuário "${userName}" atualizado com sucesso!`, 'success');
        modal.style.display = 'none';
        
        // Atualizar estatísticas
        updateStats();
    });
}

function openEditModal(userId, userName) {
    const modal = document.getElementById('editModal');
    
    // Preencher formulário com dados
    document.getElementById('editUserName').value = userName;
    document.getElementById('editUserEmail').value = `${userId.toLowerCase()}@exemplo.com`;
    
    // Mostrar modal
    modal.style.display = 'flex';
}

function initNavigation() {
    // Navegação da sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remover active de todos
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            // Adicionar active ao clicado
            this.classList.add('active');
            
            // Carregar conteúdo da seção
            const section = this.getAttribute('data-section');
            loadSection(section);
        });
    });
}

function loadSection(section) {
    // Aqui você implementaria o carregamento dinâmico do conteúdo
    console.log(`Carregando seção: ${section}`);
    
    // Simulação de carregamento
    showNotification(`Carregando ${section}...`, 'info');
}

function initFilters() {
    // Filtros dinâmicos
    document.querySelectorAll('.filter-group select').forEach(select => {
        select.addEventListener('change', function() {
            applyFilters();
        });
    });
}

function applyFilters() {
    // Aplicar filtros às tabelas
    const roleFilter = document.getElementById('filterRole')?.value;
    const statusFilter = document.getElementById('filterStatus')?.value;
    
    const rows = document.querySelectorAll('.admin-table tbody tr');
    rows.forEach(row => {
        let showRow = true;
        
        if(roleFilter && roleFilter !== 'all') {
            const role = row.querySelector('.role-badge').textContent.toLowerCase();
            if(!role.includes(roleFilter)) {
                showRow = false;
            }
        }
        
        if(showRow && statusFilter && statusFilter !== 'all') {
            const status = row.cells[4]?.textContent.toLowerCase();
            if(status !== statusFilter) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}

function initSearch() {
    const searchInput = document.querySelector('.search-box input');
    if(searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('.admin-table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

function updateStats() {
    // Atualizar estatísticas em tempo real
    const totalUsers = document.querySelectorAll('.admin-table tbody tr').length;
    const pendingRequests = document.querySelectorAll('.btn-approve').length;
    
    // Atualizar números
    document.querySelectorAll('.stat-value')[0].textContent = totalUsers;
    document.querySelectorAll('.stat-value')[1].textContent = pendingRequests;
}

function showNotification(message, type) {
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 'rgba(33, 150, 243, 0.9)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideIn 0.3s forwards;
        min-width: 300px;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Adicionar animação fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);

// Exportar funções para uso global
window.AdminPanel = {
    openEditModal,
    showNotification,
    updateStats
};
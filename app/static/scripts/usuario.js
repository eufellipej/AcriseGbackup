document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const successAlert = createAlertElement('success', '');
    const errorAlert = createAlertElement('error', '');
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(successAlert, formContainer.firstChild);
    formContainer.insertBefore(errorAlert, formContainer.firstChild);

    // Inicializar avatar
    initAvatar();

    // Inicializar estatísticas
    initStats();

    // Inicializar progresso
    initProgress();

    // Controle das abas
    const tabs = document.querySelectorAll('.form-tab');
    const contents = document.querySelectorAll('.form-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            // Atualizar abas
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Atualizar conteúdos
            contents.forEach(content => {
                content.classList.remove('active');
                if(content.id === `${target}-content`) {
                    content.classList.add('active');
                }
            });
            
            clearMessages();
        });
    });

    // Alternar visibilidade da senha
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    });

    // Formulário de perfil
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const confirm = document.getElementById('user-confirm').value;

        // Validações
        if(!name || !email) {
            showError('Nome e email são obrigatórios');
            return;
        }

        if(password !== confirm) {
            showError('As senhas não coincidem');
            return;
        }

        if(password && password.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        // Simulação de atualização
        simulateUpdate(name, email);
    });

    // Solicitação de acesso
    const accessRequestBtn = document.querySelector('.btn-outline');
    accessRequestBtn.addEventListener('click', function() {
        const accessType = document.getElementById('access-request').value;
        const message = document.getElementById('request-message').value;
        
        // Simulação de envio
        console.log('Solicitação de acesso:', { accessType, message });
        
        showSuccess('Solicitação de acesso enviada com sucesso! Entraremos em contato em breve.');
        
        // Reset do formulário
        document.getElementById('request-message').value = '';
    });

    // Upload de avatar
    const avatarUpload = document.getElementById('avatar-upload');
    if(avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const avatarImg = document.querySelector('.profile-avatar img') || 
                                     document.querySelector('.profile-avatar i');
                    
                    if(avatarImg.tagName === 'IMG') {
                        avatarImg.src = event.target.result;
                    } else {
                        // Substituir ícone por imagem
                        const newImg = document.createElement('img');
                        newImg.src = event.target.result;
                        newImg.alt = 'Avatar do usuário';
                        document.querySelector('.profile-avatar').innerHTML = '';
                        document.querySelector('.profile-avatar').appendChild(newImg);
                    }
                    
                    showSuccess('Avatar atualizado com sucesso!');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Funções auxiliares
    function createAlertElement(type, message) {
        const alert = document.createElement('div');
        alert.className = `alert-message alert-${type}`;
        alert.textContent = message;
        return alert;
    }

    function showSuccess(message) {
        successAlert.textContent = message;
        successAlert.style.display = 'block';
        
        setTimeout(() => {
            successAlert.style.display = 'none';
        }, 5000);
    }

    function showError(message) {
        errorAlert.textContent = message;
        errorAlert.style.display = 'block';
        
        setTimeout(() => {
            errorAlert.style.display = 'none';
        }, 5000);
    }

    function clearMessages() {
        successAlert.style.display = 'none';
        errorAlert.style.display = 'none';
    }

    function initAvatar() {
        const avatarContainer = document.querySelector('.profile-avatar');
        if(!avatarContainer.querySelector('img')) {
            // Criar avatar com inicial do nome
            const name = document.getElementById('user-name').value || 'Usuário';
            const initial = name.charAt(0).toUpperCase();
            avatarContainer.innerHTML = `<span style="font-size: 3rem; font-weight: bold;">${initial}</span>`;
            
            // Adicionar opção para upload
            const uploadBtn = document.createElement('button');
            uploadBtn.className = 'btn';
            uploadBtn.innerHTML = '<i class="fas fa-camera"></i> Alterar Avatar';
            uploadBtn.style.marginTop = '15px';
            uploadBtn.style.padding = '8px 15px';
            uploadBtn.style.fontSize = '0.9rem';
            uploadBtn.onclick = function() {
                document.getElementById('avatar-upload').click();
            };
            
            avatarContainer.parentElement.appendChild(uploadBtn);
            
            // Input oculto para upload
            const uploadInput = document.createElement('input');
            uploadInput.type = 'file';
            uploadInput.id = 'avatar-upload';
            uploadInput.accept = 'image/*';
            uploadInput.style.display = 'none';
            avatarContainer.parentElement.appendChild(uploadInput);
        }
    }

    function initStats() {
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
    }

    function initProgress() {
        // Animar barras de progresso
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width || '75%';
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 300);
        });
    }

    function simulateUpdate(name, email) {
        // Simular delay de rede
        setTimeout(() => {
            // Atualizar avatar se necessário
            const avatarInitial = name.charAt(0).toUpperCase();
            const avatarSpan = document.querySelector('.profile-avatar span');
            if(avatarSpan) {
                avatarSpan.textContent = avatarInitial;
            }
            
            // Atualizar nome no card
            document.querySelector('.profile-name').textContent = name;
            
            showSuccess('Perfil atualizado com sucesso!');
            
            // Reset dos campos de senha
            document.getElementById('user-password').value = '';
            document.getElementById('user-confirm').value = '';
        }, 1000);
    }
});
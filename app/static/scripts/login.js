// login.js - Funcionalidades específicas para a página de login/cadastro

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginContent = document.getElementById('login-content');
    const registerContent = document.getElementById('register-content');
    const switchToLogin = document.querySelector('.switch-to-login');
    const alertMessage = document.getElementById('alert-message');
    
    // Verificar se estamos na aba de cadastro (parâmetro na URL)
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'register') {
        switchToRegister();
    }
    
    // Controle das abas
    loginTab.addEventListener('click', function() {
        switchToLoginTab();
    });
    
    registerTab.addEventListener('click', function() {
        switchToRegisterTab();
    });
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            switchToLoginTab();
        });
    }
    
    // Alternar visibilidade da senha
    const loginPasswordToggle = document.getElementById('login-password-toggle');
    const loginPasswordInput = document.getElementById('login-password');
    
    if (loginPasswordToggle && loginPasswordInput) {
        loginPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(loginPasswordInput, this);
        });
    }
    
    const registerPasswordToggle = document.getElementById('register-password-toggle');
    const registerPasswordInput = document.getElementById('register-password');
    
    if (registerPasswordToggle && registerPasswordInput) {
        registerPasswordToggle.addEventListener('click', function() {
            togglePasswordVisibility(registerPasswordInput, this);
        });
    }
    
    // Verificar força da senha
    const passwordInput = document.getElementById('register-password');
    const passwordStrengthBar = document.getElementById('password-strength-bar');
    const passwordStrengthText = document.getElementById('password-strength-text');
    
    if (passwordInput && passwordStrengthBar && passwordStrengthText) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value, passwordStrengthBar, passwordStrengthText);
        });
    }
    
    // Validação em tempo real do formulário de cadastro
    const registerForm = document.getElementById('register-content');
    const registerConfirmInput = document.getElementById('register-confirm');
    
    if (registerConfirmInput && passwordInput) {
        registerConfirmInput.addEventListener('input', function() {
            validatePasswordMatch(passwordInput, this);
        });
    }
    
    // Validação do formulário de login
    const loginForm = document.getElementById('login-content');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            if (!validateLoginForm()) {
                e.preventDefault();
            }
        });
    }
    
    // Validação do formulário de cadastro
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            if (!validateRegisterForm()) {
                e.preventDefault();
            }
        });
    }
    
    // Esqueci minha senha
    const forgotPasswordLink = document.getElementById('forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAlert('Funcionalidade em desenvolvimento. Em breve você poderá recuperar sua senha por email.', 'info');
        });
    }
    
    // Funções auxiliares
    function switchToLoginTab() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginContent.classList.add('active');
        registerContent.classList.remove('active');
        clearAlerts();
    }
    
    function switchToRegisterTab() {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginContent.classList.remove('active');
        registerContent.classList.add('active');
        clearAlerts();
    }
    
    function togglePasswordVisibility(passwordInput, toggleButton) {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        const icon = toggleButton.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }
    
    function checkPasswordStrength(password, strengthBar, strengthText) {
        let strength = 0;
        let message = '';
        let color = '';
        
        // Verificar comprimento
        if (password.length >= 8) strength += 25;
        
        // Verificar letras maiúsculas e minúsculas
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        
        // Verificar números
        if (/\d/.test(password)) strength += 25;
        
        // Verificar caracteres especiais
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
        
        // Definir mensagem e cor
        if (strength < 25) {
            message = 'Muito fraca';
            color = 'var(--destaque)';
        } else if (strength < 50) {
            message = 'Fraca';
            color = 'var(--alerta)';
        } else if (strength < 75) {
            message = 'Boa';
            color = 'var(--info)';
        } else {
            message = 'Forte';
            color = 'var(--sucesso)';
        }
        
        // Atualizar UI
        strengthBar.style.width = `${strength}%`;
        strengthBar.style.background = color;
        strengthText.textContent = `Força da senha: ${message}`;
        strengthText.style.color = color;
        
        return strength;
    }
    
    function validatePasswordMatch(passwordInput, confirmInput) {
        if (passwordInput.value && confirmInput.value) {
            if (passwordInput.value !== confirmInput.value) {
                showAlert('As senhas não coincidem!', 'error');
                return false;
            }
        }
        return true;
    }
    
    function validateLoginForm() {
        const email = document.getElementById('login-email');
        const password = document.getElementById('login-password');
        
        if (!email.value.trim()) {
            showAlert('Por favor, informe seu email', 'error');
            email.focus();
            return false;
        }
        
        if (!password.value.trim()) {
            showAlert('Por favor, informe sua senha', 'error');
            password.focus();
            return false;
        }
        
        // Validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showAlert('Por favor, informe um email válido', 'error');
            email.focus();
            return false;
        }
        
        return true;
    }
    
    function validateRegisterForm() {
        const name = document.getElementById('register-name');
        const email = document.getElementById('register-email');
        const password = document.getElementById('register-password');
        const confirm = document.getElementById('register-confirm');
        const terms = document.getElementById('accept-terms');
        
        // Validação de nome
        if (!name.value.trim()) {
            showAlert('Por favor, informe seu nome completo', 'error');
            name.focus();
            return false;
        }
        
        if (name.value.length < 3) {
            showAlert('O nome deve ter pelo menos 3 caracteres', 'error');
            name.focus();
            return false;
        }
        
        // Validação de email
        if (!email.value.trim()) {
            showAlert('Por favor, informe seu email', 'error');
            email.focus();
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showAlert('Por favor, informe um email válido', 'error');
            email.focus();
            return false;
        }
        
        // Validação de senha
        if (!password.value.trim()) {
            showAlert('Por favor, crie uma senha', 'error');
            password.focus();
            return false;
        }
        
        if (password.value.length < 6) {
            showAlert('A senha deve ter pelo menos 6 caracteres', 'error');
            password.focus();
            return false;
        }
        
        // Validação de confirmação de senha
        if (!confirm.value.trim()) {
            showAlert('Por favor, confirme sua senha', 'error');
            confirm.focus();
            return false;
        }
        
        if (password.value !== confirm.value) {
            showAlert('As senhas não coincidem!', 'error');
            confirm.focus();
            return false;
        }
        
        // Validação de termos
        if (!terms.checked) {
            showAlert('Você deve aceitar os termos de uso e política de privacidade', 'error');
            terms.focus();
            return false;
        }
        
        return true;
    }
    
    function showAlert(message, type) {
        alertMessage.textContent = message;
        alertMessage.className = 'alert-message ' + type;
        alertMessage.style.display = 'block';
        
        // Rolar para a mensagem
        alertMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Esconder após 5 segundos
        setTimeout(() => {
            alertMessage.style.display = 'none';
        }, 5000);
    }
    
    function clearAlerts() {
        if (alertMessage) {
            alertMessage.style.display = 'none';
        }
    }
    
    // Verificar se há mensagens do Django
    const djangoMessages = document.querySelector('.alert.alert-success, .alert.alert-error, .alert.alert-warning, .alert.alert-info');
    if (djangoMessages) {
        djangoMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Função para alternar entre login e registro
function switchToLogin() {
    document.getElementById('tab-login').click();
}

function switchToRegister() {
    document.getElementById('tab-register').click();
}

// Exportar funções para uso global
window.loginUtils = {
    switchToLogin,
    switchToRegister
};
// =========================================
// SISTEMA DE AUTENTICAÇÃO E PERMISSÕES
// =========================================

const AuthManager = {
    // Tipos de usuário e suas permissões
    roles: {
        adm: {
            name: 'Administrador',
            permissions: ['dashboard', 'estoque', 'producao', 'vendas', 'fluxo', 'notificacoes', 'configuracoes']
        },
        funcionario: {
            name: 'Funcionário',
            // Permissões serão definidas por tipo de funcionário
            permissions: []
        },
        cliente: {
            name: 'Cliente',
            permissions: ['dashboard', 'vendas', 'suporte']
        }
    },

    // Usuários simulados (em produção, viria de um backend)
    users: [
        // Admin padrão
        {
            id: 1,
            name: 'Admin',
            email: 'admin@beiramar.com',
            password: 'admin123',
            role: 'adm'
        },
        // Cliente padrão
        {
            id: 2,
            name: 'Cliente Teste',
            email: 'cliente@teste.com',
            password: 'cliente123',
            role: 'cliente'
        }
    ],

    // Usuário atual
    currentUser: null,

    // Inicializa o sistema de autenticação
    init() {
        // Verifica se há usuário logado
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showLoader();
            setTimeout(() => {
                this.hideLoader();
                this.showApp();
            }, 2000);
        } else {
            this.showLogin();
        }

        // Configura eventos dos formulários
        this.setupLoginForm();
        this.setupRegisterForm();
    },

    // Mostra a tela de login
    showLogin() {
        const loginPage = document.getElementById('login-page');
        const appContainer = document.querySelector('.app-container');
        const globalLoader = document.getElementById('global-loader');
        
        if (loginPage) {
            loginPage.classList.remove('hidden');
        }
        
        if (appContainer) {
            appContainer.style.display = 'none';
        }

        if (globalLoader) {
            globalLoader.classList.add('d-none');
        }

        // Adiciona toggle de tema na tela de login
        setTimeout(() => {
            this.setupLoginThemeToggle();
        }, 100);
    },

    // Esconde a tela de login
    hideLogin() {
        const loginPage = document.getElementById('login-page');
        if (loginPage) {
            loginPage.classList.add('hidden');
        }
    },

    // Mostra a tela de carregamento
    showLoader() {
        const loaderPage = document.getElementById('loader-page');
        if (loaderPage) {
            loaderPage.classList.remove('hidden');
        }
    },

    // Esconde a tela de carregamento
    hideLoader() {
        const loaderPage = document.getElementById('loader-page');
        if (loaderPage) {
            loaderPage.classList.add('hidden');
        }
    },

    // Mostra o aplicativo principal
    showApp() {
        const appContainer = document.querySelector('.app-container');
        const globalLoader = document.getElementById('global-loader');
        
        if (appContainer) {
            appContainer.style.display = 'flex';
        }
        
        if (globalLoader) {
            globalLoader.classList.add('d-none');
        }
        
        this.hideLogin();
        this.hideLoader();
        
        // Cria o toggle de tema no header
        if (window.ThemeManager) {
            setTimeout(() => {
                window.ThemeManager.createThemeToggle();
            }, 300);
        }
        
        // Aplica permissões baseadas no usuário
        setTimeout(() => {
            this.applyPermissions();
        }, 100);
    },

    // Configura o formulário de login
    setupLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(loginForm);
                const email = formData.get('email');
                const password = formData.get('password');

                if (this.login(email, password)) {
                    this.showLoader();
                    setTimeout(() => {
                        this.hideLoader();
                        this.showApp();
                    }, 2000);
                } else {
                    if (window.BeiraMarUtils) {
                        window.BeiraMarUtils.showToast('Email ou senha incorretos!', 'error');
                    }
                }
            });
        }
    },

    // Configura o formulário de registro
    setupRegisterForm() {
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(registerForm);
                const name = formData.get('name');
                const email = formData.get('email');
                const password = formData.get('password');
                const role = formData.get('role');

                if (this.register(name, email, password, role)) {
                    this.showLoader();
                    setTimeout(() => {
                        this.hideLoader();
                        this.showApp();
                    }, 2000);
                } else {
                    if (window.BeiraMarUtils) {
                        window.BeiraMarUtils.showToast('Erro ao registrar. Tente novamente!', 'error');
                    }
                }
            });
        }
    },

    // Faz login
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            if (window.BeiraMarUtils) {
                window.BeiraMarUtils.showToast(`Bem-vindo, ${user.name}!`, 'success');
            }
            return true;
        }
        return false;
    },

    // Registra novo usuário
    register(name, email, password, role) {
        // Verifica se o email já existe
        if (this.users.find(u => u.email === email)) {
            if (window.BeiraMarUtils) {
                window.BeiraMarUtils.showToast('Este email já está cadastrado!', 'error');
            }
            return false;
        }

        const newUser = {
            id: this.users.length + 1,
            name,
            email,
            password,
            role
        };

        this.users.push(newUser);
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        if (window.BeiraMarUtils) {
            window.BeiraMarUtils.showToast(`Conta criada com sucesso, ${name}!`, 'success');
        }
        return true;
    },

    // Faz logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showLogin();
        if (window.BeiraMarUtils) {
            window.BeiraMarUtils.showToast('Logout realizado com sucesso!', 'info');
        }
    },

    // Verifica se o usuário tem permissão para acessar uma página
    hasPermission(page) {
        if (!this.currentUser) return false;
        
        const role = this.roles[this.currentUser.role];
        if (!role) return false;

        // Admin tem acesso a tudo
        if (this.currentUser.role === 'adm') return true;

        // Verifica permissões específicas
        return role.permissions.includes(page);
    },

    // Aplica permissões baseadas no usuário
    applyPermissions() {
        if (!this.currentUser) return;

        // Esconde elementos baseado nas permissões
        const sidebarItems = document.querySelectorAll('[data-permission]');
        sidebarItems.forEach(item => {
            const permission = item.getAttribute('data-permission');
            if (!this.hasPermission(permission)) {
                item.style.display = 'none';
            }
        });

        // Esconde páginas sem permissão
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            const pageId = page.id;
            if (pageId && !this.hasPermission(pageId)) {
                // Não remove, apenas não navega para ela
            }
        });
    },

    // Retorna o usuário atual
    getCurrentUser() {
        return this.currentUser;
    },

    // Retorna o tipo de usuário atual
    getCurrentRole() {
        return this.currentUser ? this.currentUser.role : null;
    },

    // Configura o toggle de tema na tela de login
    setupLoginThemeToggle() {
        const loginThemeToggle = document.getElementById('login-theme-toggle');
        if (loginThemeToggle && window.ThemeManager) {
            const toggleHTML = `
                <label class="theme-toggle" for="login-theme-toggle-checkbox">
                    <input type="checkbox" id="login-theme-toggle-checkbox" class="theme-toggle-input">
                    <div class="theme-toggle-slider"></div>
                    <svg class="theme-toggle-icon sun" height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z"></path>
                    </svg>
                    <svg class="theme-toggle-icon moon" height="512" width="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2ZM20.5,12a1,1,0,0,1-.97-.757l-.358-1.43L17.74,9.428a1,1,0,0,1,.035-1.94l1.4-.325.351-1.406a1,1,0,0,1,1.94,0l.355,1.418,1.418.355a1,1,0,0,1,0,1.94l-1.418.355-.355,1.418A1,1,0,0,1,20.5,12ZM16,14a1,1,0,0,0,2,0A1,1,0,0,0,16,14Zm6,4a1,1,0,0,0,2,0A1,1,0,0,0,22,18Z"></path>
                    </svg>
                </label>
            `;
            loginThemeToggle.innerHTML = toggleHTML;

            const checkbox = document.getElementById('login-theme-toggle-checkbox');
            if (checkbox) {
                checkbox.checked = window.ThemeManager.getCurrentTheme() === 'dark';
                checkbox.addEventListener('change', (e) => {
                    const theme = e.target.checked ? 'dark' : 'light';
                    window.ThemeManager.setTheme(theme);
                });
            }
        }
    }
};

// Exporta globalmente
window.AuthManager = AuthManager;

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthManager.init());
} else {
    AuthManager.init();
}


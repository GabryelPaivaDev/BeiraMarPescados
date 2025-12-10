// =========================================
// NAVEGAÇÃO SPA - FINAL
// =========================================

let currentPage = 'dashboard';

function navigateToPage(pageName) {
    console.log(`🧭 Navegando para: ${pageName}`);

    const loader = document.getElementById('global-loader');
    
    // 1. Loader
    if(loader) loader.classList.remove('d-none');

    setTimeout(() => {
        // Remove overlays de acesso negado se existirem
        const overlayVendas = document.querySelector('.overlay-acesso-negado-vendas');
        if (overlayVendas) {
            overlayVendas.remove();
        }
        const overlayProducao = document.querySelector('.overlay-acesso-negado-producao');
        if (overlayProducao) {
            overlayProducao.remove();
        }
        const overlayEstoque = document.querySelector('.overlay-acesso-negado-estoque');
        if (overlayEstoque) {
            overlayEstoque.remove();
        }
        
        // 2. Esconde todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });

        // 3. Mostra a página certa
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.style.display = 'block';
            setTimeout(() => {
                targetPage.classList.add('active');
            }, 10);
            
            // === AQUI ESTÁ A CORREÇÃO ===
            // Manda o Sidebar atualizar a cor do botão!
            if (window.BeiraMarSidebar && window.BeiraMarSidebar.setActivePage) {
                window.BeiraMarSidebar.setActivePage(pageName);
            }
            // ============================
            
            // Atualiza título
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                const titles = {
                    'dashboard': 'Dashboard',
                    'estoque': 'Estoque',
                    'producao': 'Produção',
                    'vendas': 'Vendas',
                    'fluxo': 'Fluxo',
                    'notificacoes': 'Notificações',
                    'funcionarios': 'Gestão de Funcionários',
                    'contato': 'Contato',
                    'sedelocal': 'Sede e Local',
                    'chatbot': 'Chatbot',
                    'ajuda': 'Ajuda'
                };
                pageTitle.textContent = titles[pageName] || pageName.charAt(0).toUpperCase() + pageName.slice(1);
            }
            
            // Carrega scripts da página
            loadPageSpecifics(pageName);
            
            currentPage = pageName;
            
        } else {
            console.error(`❌ Página não encontrada: #${pageName}`);
        }

        // 4. Garante que os botões do header estejam presentes no mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                ensureMobileHeaderButtons();
            }, 50);
        }
        
        // 5. Tira o loader
        if(loader) loader.classList.add('d-none');

    }, 300);
}

// Função simples para garantir botões no mobile
function ensureMobileHeaderButtons() {
    if (window.innerWidth > 768) return; // Só funciona no mobile
    
    const headerActions = document.querySelector('.top-header .header-actions');
    if (!headerActions) return;
    
    // Garante que o header-buttons-group existe
    let buttonsGroup = headerActions.querySelector('.header-buttons-group');
    if (!buttonsGroup) {
        buttonsGroup = document.createElement('div');
        buttonsGroup.className = 'header-buttons-group';
        headerActions.appendChild(buttonsGroup);
    }
    
    // Garante que o tema toggle existe dentro do buttonsGroup
    if (window.ThemeManager) {
        let themeToggle = document.getElementById('theme-toggle');
        const checkbox = document.getElementById('theme-toggle-checkbox');
        
        // Se não existe o wrapper ou se existe mas está vazio, cria/preenche
        if (!themeToggle || (themeToggle && !checkbox)) {
            window.ThemeManager.createThemeToggle();
            themeToggle = document.getElementById('theme-toggle');
        }
        
        // Se o toggle existe mas não está no buttonsGroup, move ele
        if (themeToggle && !buttonsGroup.contains(themeToggle)) {
            buttonsGroup.insertBefore(themeToggle, buttonsGroup.firstChild);
        }
        
        // Garante visibilidade no mobile
        if (themeToggle) {
            themeToggle.style.display = 'flex';
            themeToggle.style.visibility = 'visible';
            themeToggle.style.opacity = '1';
        }
    }
    
    // Garante que o notification-wrapper existe dentro do buttonsGroup
    if (!buttonsGroup.querySelector('.notification-wrapper')) {
        const notificationWrapper = document.createElement('div');
        notificationWrapper.className = 'notification-wrapper';
        notificationWrapper.innerHTML = `
            <button class="notification-btn" id="btnSininho">
                <i class="fas fa-bell"></i>
                <span class="notification-count">0</span>
            </button>
            <div class="notifications-dropdown" id="dropdownSininho">
                <div class="notifications-dropdown-header">
                    <h3>Notificações</h3>
                    <button class="mark-all-read">Marcar todas</button>
                </div>
                <div class="notifications-list"><div style="padding:20px;text-align:center;color:#999">Vazio</div></div>
            </div>
        `;
        const userBtn = buttonsGroup.querySelector('.user-menu-btn');
        if (userBtn) {
            buttonsGroup.insertBefore(notificationWrapper, userBtn);
        } else {
            buttonsGroup.appendChild(notificationWrapper);
        }
        if (window.BeiraMarNotifications) {
            window.BeiraMarNotifications.init();
        }
    }
    
    // Garante que o user-menu-btn existe dentro do buttonsGroup
    if (!buttonsGroup.querySelector('.user-menu-btn')) {
        const userBtn = document.createElement('button');
        userBtn.className = 'user-menu-btn';
        userBtn.type = 'button';
        userBtn.onclick = () => {
            if (window.BeiraMarUser && window.BeiraMarUser.handleUserClick) {
                window.BeiraMarUser.handleUserClick();
            }
        };
        userBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
        buttonsGroup.appendChild(userBtn);
    }
    
    // Garante que os botões estejam dentro do buttonsGroup se estiverem soltos
    const themeToggle = document.getElementById('theme-toggle');
    const notificationWrapper = headerActions.querySelector('.notification-wrapper:not(.header-buttons-group .notification-wrapper)');
    const userBtn = headerActions.querySelector('.user-menu-btn:not(.header-buttons-group .user-menu-btn)');
    
    if (themeToggle && !buttonsGroup.contains(themeToggle)) {
        buttonsGroup.insertBefore(themeToggle, buttonsGroup.firstChild);
    }
    if (notificationWrapper && !buttonsGroup.contains(notificationWrapper)) {
        buttonsGroup.appendChild(notificationWrapper);
    }
    if (userBtn && !buttonsGroup.contains(userBtn)) {
        buttonsGroup.appendChild(userBtn);
    }
}

// Carrega funções específicas
function loadPageSpecifics(pageName) {
    try {
        // Verifica se está na página do cliente
        const isClientePage = window.location.pathname.includes('cliente.html') || 
                             sessionStorage.getItem('userType') === 'cliente';
        
        if(pageName === 'dashboard' && window.BeiraMarDashboard) window.BeiraMarDashboard.updateDashboardData();
        if(pageName === 'estoque') {
            console.log('📦 [Navigation] Página estoque detectada');
            console.log('📦 [Navigation] isClientePage:', isClientePage);
            console.log('📦 [Navigation] window.BeiraMarEstoque:', window.BeiraMarEstoque);
            
            // Remove o loading imediatamente
            const estoquePage = document.getElementById('estoque');
            if (estoquePage) {
                const loading = estoquePage.querySelector('.estoque-loading');
                if (loading) {
                    console.log('🗑️ [Navigation] Removendo loading...');
                    loading.remove();
                }
            }
            
            if (!isClientePage) {
                // Tenta múltiplas vezes para garantir que o módulo esteja carregado
                const tentarCarregarEstoque = (tentativa = 0) => {
                    if (window.BeiraMarEstoque && typeof window.BeiraMarEstoque.loadEstoqueContent === 'function') {
                        console.log('🚀 [Navigation] Chamando loadEstoqueContent (tentativa ' + tentativa + ')...');
                        try {
                            window.BeiraMarEstoque.loadEstoqueContent();
                        } catch (error) {
                            console.error('❌ [Navigation] Erro ao carregar estoque:', error);
                            console.error('Stack:', error.stack);
                        }
                    } else if (tentativa < 5) {
                        console.log('⏳ [Navigation] Aguardando BeiraMarEstoque... (tentativa ' + tentativa + ')');
                        setTimeout(() => tentarCarregarEstoque(tentativa + 1), 200);
                    } else {
                        console.error('❌ [Navigation] BeiraMarEstoque.loadEstoqueContent não encontrado após 5 tentativas!');
                        console.error('window.BeiraMarEstoque:', window.BeiraMarEstoque);
                        // Tenta chamar diretamente a função se existir
                        if (typeof loadEstoqueContent === 'function') {
                            console.log('🔄 [Navigation] Tentando chamar loadEstoqueContent diretamente...');
                            try {
                                loadEstoqueContent();
                            } catch (error) {
                                console.error('❌ [Navigation] Erro ao chamar loadEstoqueContent diretamente:', error);
                            }
                        }
                    }
                };
                
                tentarCarregarEstoque();
            } else {
                console.warn('⚠️ [Navigation] Página de cliente, não carregando estoque');
            }
        }
        if(pageName === 'producao' && window.BeiraMarProducao && !isClientePage) window.BeiraMarProducao.loadProducaoContent();
        if(pageName === 'vendas' && window.BeiraMarVendas && !isClientePage) window.BeiraMarVendas.loadVendasContent();
        if(pageName === 'fluxo' && window.BeiraMarFluxo && !isClientePage) window.BeiraMarFluxo.loadFluxoContent();
        if(pageName === 'funcionarios' && window.BeiraMarFuncionarios && !isClientePage) {
            setTimeout(() => {
                if (!window.BeiraMarFuncionariosInicializado) {
                    window.BeiraMarFuncionarios.init();
                    window.BeiraMarFuncionariosInicializado = true;
                }
            }, 100);
        }
        
        // Só carrega notificações padrão se NÃO for página do cliente
        if(pageName === 'notificacoes' && window.BeiraMarNotificacoes && !isClientePage) {
            window.BeiraMarNotificacoes.loadNotificacoesContent();
        }
        
        // Inicializa o chatbot quando a página for exibida
        if(pageName === 'chatbot' && window.initChatBot) {
            window.initChatBot();
        }
        
        // Carrega detalhes do produto se necessário
        if(pageName === 'produto-detalhes' && window.ProdutoDetalhes) {
            // A página será carregada via verDetalhes()
        }
        
        // Inicializa sistema de compras quando a página de estoque (compras) for carregada na página do cliente
        if(pageName === 'estoque' && isClientePage && window.ClienteCompras) {
            setTimeout(() => {
                if (!window.ClienteCompras.inicializado) {
                    window.ClienteCompras.init();
                } else {
                    // Se já inicializado, apenas atualiza contadores e eventos
                    window.ClienteCompras.setupCardEvents();
                    window.ClienteCompras.atualizarContadores();
                }
            }, 300);
        }
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
    }
}

function initializeNavigation() {
    console.log("Navegação pronta.");
    // Garante botões na inicialização
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            ensureMobileHeaderButtons();
        }, 500);
    }
}

window.BeiraMarNavigation = {
    navigateToPage,
    initializeNavigation
};
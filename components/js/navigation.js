// =========================================
// NAVEGAÇÃO COM TRANSIÇÃO (LOADER CAMINHÃO)
// =========================================

let currentPage = 'dashboard';

// Inicializa os ouvintes de clique no menu
function initializeNavigation() {
    console.log("Iniciando navegação...");

    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navLinks.length === 0) {
        console.warn("Nenhum link de navegação encontrado (.nav-link).");
        return;
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Pega o destino (ex: 'estoque', 'vendas')
            const targetPage = this.getAttribute('data-page');
            
            // Só navega se o destino existir e for diferente da página atual
            if (targetPage) {
                if (targetPage !== currentPage) {
                    navigateToPage(targetPage);
                } else {
                    console.log(`Já estamos na página: ${targetPage}`);
                }
            }
            
            // Se estiver no celular, fecha o menu lateral depois de clicar
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) sidebar.classList.remove('open');
                
                const sidebarContainer = document.getElementById('sidebar-container');
                if (sidebarContainer) sidebarContainer.classList.remove('open');
                
                const appContainer = document.querySelector('.app-container');
                if (appContainer) appContainer.classList.remove('sidebar-open');
            }
        });
    });
}

// Função Principal de Navegação
function navigateToPage(pageName) {
    console.log(`Navegando para: ${pageName}`);
    
    const loader = document.getElementById('global-loader');
    
    // 1. MOSTRA O CAMINHÃO (Se ele existir no HTML)
    if(loader) {
        loader.classList.remove('d-none');
    } else {
        console.warn("Loader não encontrado no HTML! Navegando sem animação.");
    }

    // 2. AGUARDA A ANIMAÇÃO (500ms)
    setTimeout(() => {
        
        // --- A. TROCA DE TELA (Esconde todas, mostra a nova) ---
        
        const allPages = document.querySelectorAll('.page');
        allPages.forEach(page => {
            page.style.display = 'none'; // Garante que suma
            page.classList.remove('active');
        });

        const targetPageEl = document.getElementById(pageName);
        if (targetPageEl) {
            targetPageEl.style.display = 'block'; // Garante que apareça
            // Pequeno delay para permitir o browser renderizar o display:block antes da classe active
            setTimeout(() => targetPageEl.classList.add('active'), 10);
            
            window.scrollTo(0,0); // Rola para o topo
        } else {
            console.error(`Página não encontrada: #${pageName}`);
        }

        // --- B. ATUALIZA O MENU LATERAL (Marca o azulzinho) ---
        
        document.querySelectorAll('.nav-link').forEach(link => {
            // Remove active do pai (li) e do link
            if(link.parentElement) link.parentElement.classList.remove('active');
            link.classList.remove('active');
            
            // Adiciona se for a página certa
            if(link.getAttribute('data-page') === pageName) {
                if(link.parentElement) link.parentElement.classList.add('active');
                link.classList.add('active');
            }
        });

        // --- C. ATUALIZA O TÍTULO DO HEADER ---
        
        const titles = {
            'dashboard': 'Dashboard',
            'estoque': 'Gestão de Estoque',
            'producao': 'Produção & Logística',
            'vendas': 'Vendas',
            'fluxo': 'Fluxo de Trabalho',
            'notificacoes': 'Notificações'
        };
        const pageTitle = document.getElementById('pageTitle');
        if(pageTitle) pageTitle.textContent = titles[pageName] || 'Beira Mar';

        // --- D. CARREGA OS DADOS DA PÁGINA ---
        loadPageContent(pageName);
        
        // Atualiza variável global
        currentPage = pageName;

        // 3. ESCONDE O CAMINHÃO
        if(loader) {
            loader.classList.add('d-none');
        }

    }, 500); // Tempo da animação
}

// Carrega os scripts específicos de cada tela
function loadPageContent(pageName) {
    try {
        if(pageName === 'dashboard' && window.BeiraMarDashboard) window.BeiraMarDashboard.updateDashboardData();
        if(pageName === 'estoque' && window.BeiraMarEstoque) window.BeiraMarEstoque.loadEstoqueContent();
        if(pageName === 'producao' && window.BeiraMarProducao) window.BeiraMarProducao.loadProducaoContent();
        if(pageName === 'vendas' && window.BeiraMarVendas) window.BeiraMarVendas.loadVendasContent();
        if(pageName === 'fluxo' && window.BeiraMarFluxo) window.BeiraMarFluxo.loadFluxoContent();
        if(pageName === 'notificacoes' && window.BeiraMarNotificacoes) window.BeiraMarNotificacoes.loadNotificacoesContent();
    } catch (e) {
        console.error("Erro ao carregar conteúdo da página:", e);
    }
}

// Exporta para uso global
window.BeiraMarNavigation = {
    initializeNavigation,
    navigateToPage
};

// Se o documento já estiver pronto, inicializa
if (document.readyState !== 'loading') {
    initializeNavigation();
} else {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
}
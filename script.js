// Aplicação Beira Mar Pescados — scripts principais

// Seletores de elementos do DOM que usamos com frequência
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');

// Estado atual da aplicação (página ativa e sidebar)
let currentPage = 'dashboard';
let sidebarCollapsed = window.innerWidth <= 1024;

// Pontapé inicial quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeNavigation();
    initializeResponsive();
    updateDashboardData();
    
    // Prepara a lógica dos modais
    setupModals();
    
    // Ativa os botões de ação e seus cliques
    setupActionButtons();
    
    // Faz a ponte entre cliques do dashboard e as páginas
    setupDashboardWorkflowNavigation();
    
    // Simula atualizações em tempo real do dashboard
    setInterval(updateDashboardData, 30000); // Atualiza a cada 30 segundos
});

// Inicializa a sidebar e seu comportamento
function initializeSidebar() {
    // Busca elementos no momento da inicialização (podem ter sido injetados)
    const sidebarEl = document.querySelector('.sidebar');
    const sidebarContainer = document.getElementById('sidebar-container');
    const appContainer = document.querySelector('.app-container');
    const toggleBtn = document.getElementById('sidebarToggle') || document.querySelector('.sidebar-toggle');

    if (!sidebarEl) return;

    if (sidebarCollapsed && window.innerWidth > 768) {
        sidebarEl.classList.add('collapsed');
        sidebarContainer?.classList.add('collapsed');
        appContainer?.classList.add('sidebar-collapsed');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    
    // Também permite recolher/expandir clicando na logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', toggleSidebar);
    }
}

// Alterna entre aberto/fechado (mobile) e recolhido (desktop)
function toggleSidebar() {
    const sidebarEl = document.querySelector('.sidebar');
    const sidebarContainer = document.getElementById('sidebar-container');
    const appContainer = document.querySelector('.app-container');
    if (!sidebarEl) return;

    if (window.innerWidth <= 768) {
        sidebarEl.classList.toggle('open');
        sidebarContainer?.classList.toggle('open');
        const appContainer = document.querySelector('.app-container');
        appContainer?.classList.toggle('sidebar-open');
        // Controla overflow do body para evitar scroll de fundo
        if (sidebarEl.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    } else {
        if (window.innerWidth <= 1024) {
            // Tablet: manter collapsed (icons-only) por padrão — não expandir com o toggle
            sidebarEl.classList.add('collapsed');
            sidebarContainer?.classList.add('collapsed');
            appContainer?.classList.add('sidebar-collapsed');
            sidebarCollapsed = true;
        } else {
            sidebarEl.classList.toggle('collapsed');
            sidebarContainer?.classList.toggle('collapsed');
            appContainer?.classList.toggle('sidebar-collapsed');
            sidebarCollapsed = sidebarEl.classList.contains('collapsed');
        }
    }

    // Sincroniza --sidebar-current inline para layout imediato
    const root = document.documentElement;
    const computed = getComputedStyle(root);
    const collapsedVal = computed.getPropertyValue('--sidebar-collapsed') || '96px';
    const widthVal = computed.getPropertyValue('--sidebar-width') || '280px';
    const app = document.querySelector('.app-container');
    if (app) {
        if (app.classList.contains('sidebar-open')) {
            app.style.setProperty('--sidebar-current', '0px');
        } else if (app.classList.contains('sidebar-collapsed')) {
            app.style.setProperty('--sidebar-current', collapsedVal.trim());
        } else {
            app.style.setProperty('--sidebar-current', widthVal.trim());
        }
    }
}

// Inicializa a navegação entre as páginas
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            if (targetPage && targetPage !== currentPage) {
                navigateToPage(targetPage);
            }
            
            // Em mobile, fecha a sidebar após navegar
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
}

// Faz a navegação para a página solicitada
function navigateToPage(pageName) {
    // Primeiro remove o estado "active" de links e páginas
    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
    });
    
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Depois marca o link e a página atuais como "active"
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    const activePage = document.getElementById(pageName);
    
    if (activeLink && activePage) {
        activeLink.parentElement.classList.add('active');
        activePage.classList.add('active');
        
        // Atualiza o título da página no cabeçalho
        const pageTitle = activeLink.querySelector('span').textContent;
        document.getElementById('pageTitle').textContent = pageTitle;
        
        currentPage = pageName;
        
        // Carrega o conteúdo específico conforme a página
        loadPageContent(pageName);
    }
}

// Decide qual conteúdo carregar com base no nome da página
function loadPageContent(pageName) {
    switch(pageName) {
        case 'estoque':
            loadEstoqueContent();
            break;
        case 'producao':
            loadProducaoContent();
            break;
        case 'vendas':
            loadVendasContent();
            break;
        case 'fluxo':
            loadFluxoContent();
            break;
        case 'notificacoes':
            loadNotificacoesContent();
            break;
        case 'dashboard':
            updateDashboardData();
            break;
    }
}

// Atualiza os dados e pequenas animações do dashboard
function updateDashboardData() {
    // Gera números aleatórios para simular tempo real
    const statusCards = document.querySelectorAll('.card-number');
    const workflowSteps = document.querySelectorAll('.workflow-step p');
    
    // Pacote de dados simulados
    const data = {
        estoque: Math.floor(Math.random() * 500) + 1000,
        pedidos: Math.floor(Math.random() * 20) + 15,
        transporte: Math.floor(Math.random() * 10) + 5,
        producao: Math.floor(Math.random() * 15) + 8
    };
    
    // Preenche os cards de status quando disponíveis
    if (statusCards.length >= 4) {
        statusCards[0].textContent = data.estoque.toLocaleString();
        statusCards[1].textContent = data.pedidos;
        statusCards[2].textContent = data.transporte;
        statusCards[3].textContent = data.producao;
    }
    
    // Dá um "pulso" rápido nos números para indicar atualização
    statusCards.forEach(card => {
        card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    });
}

// Monta o conteúdo do módulo de Estoque
function loadEstoqueContent() {
    const estoquePage = document.getElementById('estoque');
    estoquePage.innerHTML = `
        <div class="module-header">
            <h2>Controle de Estoque</h2>
            <button class="btn btn-primary">
                <i class="fas fa-plus"></i>
                Adicionar Item
            </button>
        </div>
        
        <div class="estoque-grid">
            <div class="estoque-summary">
                <div class="summary-card">
                    <h3>Total em Estoque</h3>
                    <p class="summary-number">1,247</p>
                    <span>produtos</span>
                </div>
                <div class="summary-card">
                    <h3>Valor Total</h3>
                    <p class="summary-number">R$ 45.230</p>
                    <span>em estoque</span>
                </div>
                <div class="summary-card">
                    <h3>Produtos Críticos</h3>
                    <p class="summary-number warning">8</p>
                    <span>baixo estoque</span>
                </div>
            </div>
            
            <div class="estoque-table">
                <h3>Produtos em Estoque</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Quantidade</th>
                                <th>Status</th>
                                <th>Localização</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Salmão Fresco</td>
                                <td>Peixe Fresco</td>
                                <td>50 kg</td>
                                <td><span class="status-badge success">Normal</span></td>
                                <td>Câmara Fria A</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Tilápia Inteira</td>
                                <td>Peixe Inteiro</td>
                                <td>25 kg</td>
                                <td><span class="status-badge warning">Baixo</span></td>
                                <td>Câmara Fria B</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Camarão Médio</td>
                                <td>Crustáceo</td>
                                <td>80 kg</td>
                                <td><span class="status-badge success">Normal</span></td>
                                <td>Freezer 1</td>
                                <td>
                                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    addEstoqueStyles();
}

// Monta o conteúdo do módulo de Produção
function loadProducaoContent() {
    const producaoPage = document.getElementById('producao');
    producaoPage.innerHTML = `
        <div class="module-header">
            <h2>Produção & Logística</h2>
            <button class="btn btn-primary">
                <i class="fas fa-plus"></i>
                Novo Lote
            </button>
        </div>
        
        <section class="producao-section">
            <div class="section-title">
                <h3>Produção</h3>
            </div>
            <div class="producao-kanban">
                <div class="kanban-board">
                    <div class="kanban-column">
                        <div class="column-header">
                            <h3>Recebimento</h3>
                            <span class="item-count">2</span>
                        </div>
                        <div class="kanban-items">
                            <div class="kanban-item">
                                <h4>Lote #789 - Salmão</h4>
                                <p>100kg • Fornecedor A</p>
                                <span class="item-date">Hoje, 08:30</span>
                            </div>
                            <div class="kanban-item">
                                <h4>Lote #790 - Tilápia</h4>
                                <p>80kg • Fornecedor B</p>
                                <span class="item-date">Hoje, 09:10</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="kanban-column">
                        <div class="column-header">
                            <h3>Processamento</h3>
                            <span class="item-count">2</span>
                        </div>
                        <div class="kanban-items">
                            <div class="kanban-item">
                                <h4>Filé de Tilápia</h4>
                                <p>Lote #2024-001 • 50kg</p>
                                <span class="item-date">Em andamento</span>
                            </div>
                            <div class="kanban-item">
                                <h4>Posta de Salmão</h4>
                                <p>Lote #2024-003 • 40kg</p>
                                <span class="item-date">Preparando</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="kanban-column">
                        <div class="column-header">
                            <h3>Embalagem</h3>
                            <span class="item-count">1</span>
                        </div>
                        <div class="kanban-items">
                            <div class="kanban-item">
                                <h4>Camarão Limpo</h4>
                                <p>Lote #2024-002 • 30kg</p>
                                <span class="item-date">Finalizando</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="kanban-column">
                        <div class="column-header">
                            <h3>Pronto</h3>
                            <span class="item-count">2</span>
                        </div>
                        <div class="kanban-items">
                            <div class="kanban-item">
                                <h4>Filé de Tilápia</h4>
                                <p>Lote #2024-002 • 30kg</p>
                                <span class="item-date">14:30</span>
                            </div>
                            <div class="kanban-item">
                                <h4>Peixe Inteiro</h4>
                                <p>Lote #2024-004 • 60kg</p>
                                <span class="item-date">13:50</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="logistica-section">
            <div class="section-title">
                <h3>Logística</h3>
            </div>
            <div class="logistica-kanban">
                <div class="kanban-board">
                    <div class="kanban-column">
                        <div class="column-header">
                            <h3>Transporte</h3>
                            <span class="item-count">1</span>
                        </div>
                        <div class="kanban-items">
                            <div class="kanban-item">
                                <h4>Carga #789</h4>
                                <p>Camarão 50kg</p>
                                <span class="item-date">Em trânsito</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="kanban-column">
                        <div class="column-header">
                            <h3>Recebimento</h3>
                            <span class="item-count">1</span>
                        </div>
                        <div class="kanban-items">
                            <div class="kanban-item">
                                <h4>Lote #456</h4>
                                <p>Verificação de qualidade</p>
                                <span class="item-date">Aguardando</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="kanban-column">
                        <div class="column-header">
                            <h3>Expedição</h3>
                            <span class="item-count">2</span>
                        </div>
                        <div class="kanban-items">
                            <div class="kanban-item">
                                <h4>Entrega #1234</h4>
                                <p>Restaurante Mar Azul</p>
                                <span class="item-date">Em rota</span>
                            </div>
                            <div class="kanban-item">
                                <h4>Entrega #1235</h4>
                                <p>Feira Central</p>
                                <span class="item-date">Preparando</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="kanban-column">
                        <div class="column-header">
                            <h3>Entregue</h3>
                            <span class="item-count">1</span>
                        </div>
                        <div class="kanban-items">
                            <div class="kanban-item">
                                <h4>Entrega #1229</h4>
                                <p>Mercado Peixe Bom</p>
                                <span class="item-date">Hoje, 10:15</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    addProducaoStyles();
}

// Monta o conteúdo do módulo de Vendas
function loadVendasContent() {
    const vendasPage = document.getElementById('vendas');
    vendasPage.innerHTML = `
        <div class="module-header">
            <h2>Módulo de Vendas</h2>
            <button class="btn btn-primary">
                <i class="fas fa-plus"></i>
                Novo Pedido
            </button>
        </div>
        
        <div class="vendas-grid">
            <div class="vendas-summary">
                <div class="summary-card">
                    <h3>Vendas Hoje</h3>
                    <p class="summary-number">R$ 12.450</p>
                    <span>23 pedidos</span>
                </div>
                <div class="summary-card">
                    <h3>Meta Mensal</h3>
                    <p class="summary-number">68%</p>
                    <span>R$ 85.000 / R$ 125.000</span>
                </div>
                <div class="summary-card">
                    <h3>Pedidos Pendentes</h3>
                    <p class="summary-number warning">5</p>
                    <span>aguardando</span>
                </div>
            </div>
            
            <div class="pedidos-recentes">
                <h3>Pedidos Recentes</h3>
                <div class="pedidos-list">
                    <div class="pedido-item">
                        <div class="pedido-info">
                            <h4>Pedido #1234</h4>
                            <p>Restaurante Mar Azul</p>
                            <span class="pedido-time">há 30 min</span>
                        </div>
                        <div class="pedido-value">
                            <p>R$ 850,00</p>
                            <span class="status-badge success">Confirmado</span>
                        </div>
                    </div>
                    <div class="pedido-item">
                        <div class="pedido-info">
                            <h4>Pedido #1235</h4>
                            <p>Distribuidora Oceano</p>
                            <span class="pedido-time">há 1 hora</span>
                        </div>
                        <div class="pedido-value">
                            <p>R$ 1.200,00</p>
                            <span class="status-badge warning">Pendente</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    addVendasStyles();
}

// Monta o conteúdo do módulo de Fluxo de Trabalho
function loadFluxoContent() {
    const fluxoPage = document.getElementById('fluxo');
    fluxoPage.innerHTML = `
        <div class="module-header">
            <h2>Fluxo de Trabalho</h2>
            <div class="view-toggle">
                <button class="btn btn-secondary active" data-view="kanban">Kanban</button>
                <button class="btn btn-secondary" data-view="timeline">Timeline</button>
            </div>
        </div>
        
        <div class="fluxo-container">
            <div class="kanban-board">
                <div class="kanban-column">
                    <div class="column-header">
                        <h3>Compra</h3>
                        <span class="item-count">3</span>
                    </div>
                    <div class="kanban-items">
                        <div class="kanban-item">
                            <h4>Lote Salmão #001</h4>
                            <p>100kg - Fornecedor A</p>
                            <span class="item-date">Hoje, 08:00</span>
                        </div>
                        <div class="kanban-item">
                            <h4>Lote Tilápia #002</h4>
                            <p>80kg - Fornecedor B</p>
                            <span class="item-date">Hoje, 09:30</span>
                        </div>
                    </div>
                </div>
                
                <div class="kanban-column">
                    <div class="column-header">
                        <h3>Transporte</h3>
                        <span class="item-count">2</span>
                    </div>
                    <div class="kanban-items">
                        <div class="kanban-item">
                            <h4>Carga #789</h4>
                            <p>Camarão 50kg</p>
                            <span class="item-date">Em trânsito</span>
                        </div>
                    </div>
                </div>
                
                <div class="kanban-column">
                    <div class="column-header">
                        <h3>Recebimento</h3>
                        <span class="item-count">1</span>
                    </div>
                    <div class="kanban-items">
                        <div class="kanban-item">
                            <h4>Lote #456</h4>
                            <p>Verificação de qualidade</p>
                            <span class="item-date">Aguardando</span>
                        </div>
                    </div>
                </div>
                
                <div class="kanban-column">
                    <div class="column-header">
                        <h3>Armazenamento</h3>
                        <span class="item-count">5</span>
                    </div>
                    <div class="kanban-items">
                        <div class="kanban-item">
                            <h4>Estoque Geral</h4>
                            <p>1.247 produtos</p>
                            <span class="item-date">Atualizado</span>
                        </div>
                    </div>
                </div>
                
                <div class="kanban-column">
                    <div class="column-header">
                        <h3>Produção</h3>
                        <span class="item-count">3</span>
                    </div>
                    <div class="kanban-items">
                        <div class="kanban-item">
                            <h4>Filé Tilápia</h4>
                            <p>Lote #789 - 30kg</p>
                            <span class="item-date">Em processo</span>
                        </div>
                    </div>
                </div>
                
                <div class="kanban-column">
                    <div class="column-header">
                        <h3>Vendas</h3>
                        <span class="item-count">8</span>
                    </div>
                    <div class="kanban-items">
                        <div class="kanban-item">
                            <h4>Pedido #1234</h4>
                            <p>Restaurante Mar Azul</p>
                            <span class="item-date">Confirmado</span>
                        </div>
                    </div>
                </div>
                
                <div class="kanban-column">
                    <div class="column-header">
                        <h3>Expedição</h3>
                        <span class="item-count">4</span>
                    </div>
                    <div class="kanban-items">
                        <div class="kanban-item">
                            <h4>Entrega #567</h4>
                            <p>Feira Central</p>
                            <span class="item-date">Saindo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    addFluxoStyles();
}

// Monta o conteúdo do módulo de Notificações
function loadNotificacoesContent() {
    const notificacoesPage = document.getElementById('notificacoes');
    notificacoesPage.innerHTML = `
        <div class="module-header">
            <h2>Central de Notificações</h2>
            <button class="btn btn-secondary">
                <i class="fas fa-check-double"></i>
                Marcar Todas como Lidas
            </button>
        </div>
        
        <div class="notifications-container">
            <div class="notification-filters">
                <button class="filter-btn active" data-filter="all">Todas</button>
                <button class="filter-btn" data-filter="urgent">Urgentes</button>
                <button class="filter-btn" data-filter="info">Informações</button>
                <button class="filter-btn" data-filter="system">Sistema</button>
            </div>
            
            <div class="notifications-list">
                <div class="notification-item urgent unread">
                    <div class="notification-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="notification-content">
                        <h4>Estoque Crítico</h4>
                        <p>Tilápia Inteira está com estoque baixo (25kg restantes)</p>
                        <span class="notification-time">há 15 minutos</span>
                    </div>
                    <div class="notification-actions">
                        <button class="btn-icon"><i class="fas fa-eye"></i></button>
                        <button class="btn-icon"><i class="fas fa-times"></i></button>
                    </div>
                </div>
                
                <div class="notification-item info unread">
                    <div class="notification-icon">
                        <i class="fas fa-truck"></i>
                    </div>
                    <div class="notification-content">
                        <h4>Entrega Realizada</h4>
                        <p>Pedido #1234 foi entregue com sucesso no Restaurante Mar Azul</p>
                        <span class="notification-time">há 1 hora</span>
                    </div>
                    <div class="notification-actions">
                        <button class="btn-icon"><i class="fas fa-eye"></i></button>
                        <button class="btn-icon"><i class="fas fa-times"></i></button>
                    </div>
                </div>
                
                <div class="notification-item system">
                    <div class="notification-icon">
                        <i class="fas fa-cog"></i>
                    </div>
                    <div class="notification-content">
                        <h4>Atualização do Sistema</h4>
                        <p>Sistema atualizado com sucesso. Novas funcionalidades disponíveis.</p>
                        <span class="notification-time">há 3 horas</span>
                    </div>
                    <div class="notification-actions">
                        <button class="btn-icon"><i class="fas fa-eye"></i></button>
                        <button class="btn-icon"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    addNotificacoesStyles();
}

// Ajustes de interface conforme o tamanho da janela
function initializeResponsive() {
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('open');
        } else if (window.innerWidth <= 1024) {
            sidebar.classList.add('collapsed');
            sidebar.classList.remove('open');
        } else {
            if (sidebarCollapsed) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
            sidebar.classList.remove('open');
        }
    });
}

// Injeta estilos específicos de cada módulo quando necessário
function addEstoqueStyles() {
    if (!document.getElementById('estoque-styles')) {
        const styles = document.createElement('style');
        styles.id = 'estoque-styles';
        styles.textContent = `
            .module-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid var(--border-color);
            }
            
            .btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }
            
            .btn-primary {
                background: var(--primary-color);
                color: var(--white);
            }
            
            .btn-primary:hover {
                background: var(--primary-dark);
            }
            
            .estoque-grid {
                display: grid;
                gap: 2rem;
            }
            
            .estoque-summary {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .summary-card {
                background: var(--white);
                padding: 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                text-align: center;
            }
            
            .summary-number {
                font-size: 2rem;
                font-weight: 700;
                color: var(--primary-color);
                margin: 0.5rem 0;
            }
            
            .summary-number.warning {
                color: var(--warning-color);
            }
            
            .estoque-table {
                background: var(--white);
                padding: 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
            }
            
            .table-container {
                overflow-x: auto;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 1rem;
            }
            
            th, td {
                padding: 1rem;
                text-align: left;
                border-bottom: 1px solid var(--border-color);
            }
            
            th {
                background: var(--background);
                font-weight: 600;
                color: var(--text-primary);
            }
            
            .status-badge {
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .status-badge.success {
                background: #dcfce7;
                color: #166534;
            }
            
            .status-badge.warning {
                background: #fef3c7;
                color: #92400e;
            }
            
            .btn-icon {
                background: none;
                border: none;
                padding: 0.5rem;
                border-radius: 4px;
                cursor: pointer;
                color: var(--text-secondary);
                margin: 0 0.25rem;
            }
            
            .btn-icon:hover {
                background: var(--secondary-color);
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(styles);
    }
}

function addProducaoStyles() {
    if (!document.getElementById('producao-styles')) {
        const styles = document.createElement('style');
        styles.id = 'producao-styles';
        styles.textContent = `
            .section-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 1rem 0 0.5rem 0;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid var(--border-color);
            }
            .section-title h3 {
                margin: 0;
                font-size: 1.125rem;
                color: var(--text-primary);
            }
            .producao-kanban {
                margin-top: 1rem;
            }
            .kanban-board {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 1rem;
            }
            .kanban-column {
                background: var(--background);
                border-radius: var(--border-radius);
                padding: 1rem;
                min-height: 420px;
            }
            .column-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid var(--primary-color);
            }
            .kanban-items {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .kanban-item {
                background: var(--white);
                padding: 1rem;
                border-radius: 8px;
                box-shadow: var(--shadow);
                cursor: pointer;
            }
            .logistica-section { 
                margin-top: 2rem; 
            }
            @media (max-width: 768px) {
                .kanban-board {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

function addVendasStyles() {
    if (!document.getElementById('vendas-styles')) {
        const styles = document.createElement('style');
        styles.id = 'vendas-styles';
        styles.textContent = `
            .vendas-grid {
                display: grid;
                gap: 2rem;
            }
            
            .vendas-summary {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            .pedidos-recentes {
                background: var(--white);
                padding: 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
            }
            
            .pedidos-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .pedido-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                background: var(--background);
            }
            
            .pedido-info h4 {
                margin-bottom: 0.25rem;
                color: var(--text-primary);
            }
            
            .pedido-time {
                font-size: 0.75rem;
                color: var(--text-secondary);
            }
            
            .pedido-value { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }

            .pedido-value p {
                font-size: 1.125rem;
                font-weight: 600;
                color: var(--text-primary);
                margin: 0;
            }
        `;
        document.head.appendChild(styles);
    }
}

function addFluxoStyles() {
    if (!document.getElementById('fluxo-styles')) {
        const styles = document.createElement('style');
        styles.id = 'fluxo-styles';
        styles.textContent = `
            .view-toggle {
                display: flex;
                gap: 0.5rem;
            }
            
            .btn-secondary {
                background: var(--secondary-color);
                color: var(--text-secondary);
            }
            
            .btn-secondary.active {
                background: var(--primary-color);
                color: var(--white);
            }
            
            .fluxo-container {
                margin-top: 2rem;
            }
            
            .kanban-board {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                overflow-x: auto;
                padding-bottom: 1rem;
            }
            
            .kanban-column {
                background: var(--background);
                border-radius: var(--border-radius);
                padding: 1rem;
                min-height: 400px;
            }
            
            .column-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid var(--primary-color);
            }
            
            .column-header h3 {
                font-size: 1rem;
                font-weight: 600;
                color: var(--text-primary);
            }
            
            .item-count {
                background: var(--primary-color);
                color: var(--white);
                font-size: 0.75rem;
                padding: 0.25rem 0.5rem;
                border-radius: 10px;
                min-width: 1.5rem;
                text-align: center;
            }
            
            .kanban-items {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .kanban-item {
                background: var(--white);
                padding: 1rem;
                border-radius: 8px;
                box-shadow: var(--shadow);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .kanban-item:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            
            .kanban-item h4 {
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 0.5rem;
            }
            
            .kanban-item p {
                font-size: 0.75rem;
                color: var(--text-secondary);
                margin-bottom: 0.5rem;
            }
            
            .item-date {
                font-size: 0.625rem;
                color: var(--text-secondary);
                font-weight: 500;
            }
            
            @media (max-width: 768px) {
                .kanban-board {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

function addNotificacoesStyles() {
    if (!document.getElementById('notificacoes-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notificacoes-styles';
        styles.textContent = `
            .notifications-container {
                background: var(--white);
                border-radius: var(--border-radius);
                box-shadow: var(--shadow);
                overflow: hidden;
            }
            
            .notification-filters {
                display: flex;
                gap: 0.5rem;
                padding: 1rem;
                border-bottom: 1px solid var(--border-color);
                background: var(--background);
            }
            
            .filter-btn {
                padding: 0.5rem 1rem;
                border: 1px solid var(--border-color);
                background: var(--white);
                color: var(--text-secondary);
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.875rem;
                transition: all 0.3s ease;
            }
            
            .filter-btn.active {
                background: var(--primary-color);
                color: var(--white);
                border-color: var(--primary-color);
            }
            
            .notifications-list {
                max-height: 600px;
                overflow-y: auto;
            }
            
            .notification-item {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1rem;
                border-bottom: 1px solid var(--border-color);
                transition: all 0.3s ease;
            }
            
            .notification-item:hover {
                background: var(--background);
            }
            
            .notification-item.unread {
                background: rgba(59, 130, 246, 0.05);
                border-left: 4px solid var(--primary-color);
            }
            
            .notification-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                flex-shrink: 0;
            }
            
            .notification-item.urgent .notification-icon {
                background: rgba(239, 68, 68, 0.1);
                color: var(--danger-color);
            }
            
            .notification-item.info .notification-icon {
                background: rgba(59, 130, 246, 0.1);
                color: var(--primary-color);
            }
            
            .notification-item.system .notification-icon {
                background: rgba(107, 114, 128, 0.1);
                color: var(--text-secondary);
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-content h4 {
                font-size: 0.875rem;
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 0.25rem;
            }
            
            .notification-content p {
                font-size: 0.75rem;
                color: var(--text-secondary);
                margin-bottom: 0.25rem;
                line-height: 1.4;
            }
            
            .notification-time {
                font-size: 0.625rem;
                color: var(--text-secondary);
            }
            
            .notification-actions {
                display: flex;
                gap: 0.25rem;
            }
        `;
        document.head.appendChild(styles);
    }
}

// Utilitários
function showToast(message, type = 'info') {
    // Implementar sistema de toast notifications
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Configuração dos modais
function setupModals() {
    // Botão do perfil para abrir modal de login
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            openModal('loginModal');
        });
    }
    
    // Botões de fechar modais
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Fechar modal ao clicar no fundo
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
    
    // Configurar formulários
    setupForms();
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Configuração dos botões de ação
function setupActionButtons() {
    // Adicionar event listeners para os botões que abrem modais
    document.addEventListener('click', function(e) {
        // Botão adicionar item no estoque
        if (e.target.closest('.btn') && e.target.textContent.includes('Adicionar Item')) {
            e.preventDefault();
            openModal('addItemModal');
        }
        
        // Botão novo lote na produção
        if (e.target.closest('.btn') && e.target.textContent.includes('Novo Lote')) {
            e.preventDefault();
            openModal('newBatchModal');
        }
        
        // Botão novo pedido nas vendas
        if (e.target.closest('.btn') && e.target.textContent.includes('Novo Pedido')) {
            e.preventDefault();
            openModal('newOrderModal');
        }
    });
}

// Navegação pelos passos do fluxo no Dashboard
function setupDashboardWorkflowNavigation() {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return;
    dashboard.addEventListener('click', function(e) {
        const step = e.target.closest('.workflow-step');
        if (!step) return;
        const titleElement = step.querySelector('h4');
        if (!titleElement) return;
        const stepName = titleElement.textContent.trim().toLowerCase();
        // Mapear conforme solicitado:
        // compra -> vendas
        // transporte -> producao (logística na mesma página Produção & Logística)
        // recebimento -> producao
        // armazenamento -> estoque
        // vendas -> vendas
        let targetPage = null;
        if (stepName.includes('compra')) targetPage = 'vendas';
        else if (stepName.includes('transporte')) targetPage = 'producao';
        else if (stepName.includes('recebimento')) targetPage = 'producao';
        else if (stepName.includes('armazenamento')) targetPage = 'estoque';
        else if (stepName.includes('vendas')) targetPage = 'vendas';
        if (targetPage) {
            navigateToPage(targetPage);
        }
    });
}

// Configuração dos formulários
function setupForms() {
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simulação de login
            if (email && password) {
                showToast('Login realizado com sucesso!', 'success');
                closeModal('loginModal');
                this.reset();
            }
        });
    }
    
    // Formulário adicionar item
    const addItemForm = document.getElementById('addItemForm');
    if (addItemForm) {
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const itemName = document.getElementById('itemName').value;
            const itemQuantity = document.getElementById('itemQuantity').value;
            
            if (itemName && itemQuantity) {
                showToast(`Item "${itemName}" adicionado ao estoque com sucesso!`, 'success');
                closeModal('addItemModal');
                this.reset();
            }
        });
    }
    
    // Formulário novo lote
    const newBatchForm = document.getElementById('newBatchForm');
    if (newBatchForm) {
        newBatchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const batchProduct = document.getElementById('batchProduct').value;
            const batchQuantity = document.getElementById('batchQuantity').value;
            
            if (batchProduct && batchQuantity) {
                showToast(`Lote de "${batchProduct}" criado com sucesso!`, 'success');
                closeModal('newBatchModal');
                this.reset();
            }
        });
    }
    
    // Formulário novo pedido
    const newOrderForm = document.getElementById('newOrderForm');
    if (newOrderForm) {
        newOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const clientName = document.getElementById('clientName').value;
            
            if (clientName) {
                showToast(`Pedido para "${clientName}" criado com sucesso!`, 'success');
                closeModal('newOrderModal');
                this.reset();
            }
        });
        
        // Funcionalidade de adicionar/remover produtos
        setupProductList(newOrderForm);
    }
}

// Configuração da lista de produtos no modal de pedidos
function setupProductList(form) {
    const addProductBtn = form.querySelector('.btn-add-product');
    const productList = form.querySelector('.product-list');
    
    if (addProductBtn && productList) {
        addProductBtn.addEventListener('click', function() {
            const newProductItem = createProductItem();
            productList.appendChild(newProductItem);
        });
        
        // Event delegation para botões de remover
        productList.addEventListener('click', function(e) {
            if (e.target.closest('.btn-remove-product')) {
                const productItem = e.target.closest('.product-item');
                if (productList.children.length > 1) {
                    productItem.remove();
                }
            }
        });
    }
}

function createProductItem() {
    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    productItem.innerHTML = `
        <div class="product-row">
            <select name="product[]" required>
                <option value="">Selecione o produto...</option>
                <option value="salmao-fresco">Salmão Fresco</option>
                <option value="tilapia-inteira">Tilápia Inteira</option>
                <option value="camarao-medio">Camarão Médio</option>
                <option value="file-tilapia">Filé de Tilápia</option>
            </select>
            <input type="number" name="quantity[]" placeholder="Qtd" min="1" step="0.1" required>
            <input type="number" name="price[]" placeholder="Preço" min="0" step="0.01" required>
            <button type="button" class="btn-remove-product">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return productItem;
}

// Expõe algumas funções no escopo global para uso externo
window.BeiraMar = {
    navigateToPage,
    updateDashboardData,
    showToast,
    openModal,
    closeModal
};
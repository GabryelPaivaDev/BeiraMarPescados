// =========================================
// CONTROLE DA SIDEBAR - NAVEGAÇÃO E TOGGLE
// =========================================

function initializeSidebar() {
  console.log("🚀 Sidebar Inicializado");
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);

  // Evento ÚNICO de clique global
  document.addEventListener('click', handleSidebarClick);
}

/**
 * Manipulador único de cliques do sidebar
 */
function handleSidebarClick(e) {
  const body = document.body;

  // 1. BOTÃO HAMBURGER (Desktop)
  if (e.target.closest('#sidebarToggle')) {
    if (window.innerWidth > 768) {
      e.preventDefault();
      body.classList.toggle('compact-mode');
      console.log('📦 Modo Compacto Alternado');
    }
    return;
  }

  // 2. LOGO (Mobile ou Dashboard)
  if (e.target.closest('#brandLogo')) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      body.classList.toggle('mobile-menu-open');
      console.log('📱 Menu Mobile Alternado');
    } else {
      navigateToPage('dashboard');
    }
    return;
  }

  // 3. LINKS DO MENU
  if (e.target.closest('.nav-link')) {
    const link = e.target.closest('.nav-link');
    const page = link.getAttribute('data-page');
    if (page) {
      e.preventDefault();
      e.stopPropagation();
      navigateToPage(page);
    }
    return;
  }

  // 4. FECHAR MENU MOBILE AO CLICAR FORA
  if (window.innerWidth <= 768 && body.classList.contains('mobile-menu-open')) {
    const sidebar = document.querySelector('.sidebar');
    const btnLogo = document.getElementById('brandLogo');
    if (sidebar && !sidebar.contains(e.target) && (!btnLogo || !btnLogo.contains(e.target))) {
      body.classList.remove('mobile-menu-open');
      console.log('📱 Menu Mobile Fechado');
    }
  }
}

/**
 * Verifica o tamanho da tela e ajusta classe
 */
function checkScreenSize() {
  const body = document.body;
  const sidebar = document.querySelector('.sidebar');

  if (window.innerWidth > 768 && window.innerWidth <= 1024) {
    // Tablet: Força compacto automaticamente
    body.classList.add('compact-mode');
    body.classList.remove('mobile-menu-open');
    console.log('📊 Tablet: Compacto Ativado');
  } else if (window.innerWidth > 1024) {
    // PC: Remove ambas as classes
    body.classList.remove('compact-mode');
    body.classList.remove('mobile-menu-open');
    console.log('🖥️ Desktop');
  } else {
    // Mobile: Remove compact, mantém mobile-menu-open se necessário
    body.classList.remove('compact-mode');
    console.log('📱 Mobile');
  }

  // Força reflow para atualizar layout
  if (sidebar) {
    sidebar.offsetHeight; // Trigger reflow
  }
}

/**
 * Navega para uma página
 */
function navigateToPage(page) {
  console.log(`🔗 Navegando para: ${page}`);

  // Fecha menu mobile
  if (window.innerWidth <= 768) {
    document.body.classList.remove('mobile-menu-open');
  }

  // Atualiza link ativo
  updateActiveLink(page);

  // Chama sistema de app se disponível
  if (window.BeiraMarApp && window.BeiraMarApp.loadPage) {
    window.BeiraMarApp.loadPage(page);
  } else if (window.BeiraMarNavigation && window.BeiraMarNavigation.navigateToPage) {
    window.BeiraMarNavigation.navigateToPage(page);
  } else {
    console.warn('⚠️ Sistema de navegação não encontrado');
  }
}

/**
 * Atualiza o link ativo no menu
 */
function updateActiveLink(page) {
  // Remove active de todos
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Adiciona no correto
  const activeLink = document.querySelector(`[data-page="${page}"]`);
  if (activeLink) {
    activeLink.closest('.nav-item').classList.add('active');
    console.log(`✅ Link ativo: ${page}`);
  }
}

/**
 * Define página ativa (útil ao carregar)
 */
function setActivePage(page) {
  updateActiveLink(page);
}

// =========================================
// EXPORTAR API GLOBAL
// =========================================

window.BeiraMarSidebar = {
  initializeSidebar,
  navigateToPage,
  setActivePage
};

// =========================================
// INICIALIZAR
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  initializeSidebar();
  console.log('✅ Sidebar Sistema Pronto!');
});

// Se carregar antes do DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSidebar);
} else {
  initializeSidebar();
}

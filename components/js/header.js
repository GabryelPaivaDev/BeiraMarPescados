// =========================================
// MÓDULO DO HEADER - CONTROLE DA BANDEJA
// =========================================

const BeiraMarHeader = {
  initialized: false,

  init() {
    if (this.initialized) {
      console.log('⚠️ Header já inicializado, pulando...');
      return;
    }

    console.log('📢 Inicializando Header...');
    this.setupNotificationButton();
    this.setupClickOutside();
    this.initialized = true;
  },

  setupNotificationButton() {
    // Aguarda o dropdown estar pronto
    const maxAttempts = 20; // 20 tentativas = 2 segundos
    let attempts = 0;

    const trySetup = () => {
      const btnSininho = document.getElementById('notificationToggle') || 
                         document.getElementById('btnSininho') ||
                         document.querySelector('.notification-btn');
      
      const dropdownSininho = document.getElementById('notificationsDropdown') || 
                              document.getElementById('dropdownSininho') ||
                              document.querySelector('.notifications-dropdown');

      if (!btnSininho || !dropdownSininho) {
        attempts++;
        if (attempts < maxAttempts) {
          console.log(`⏳ Tentativa ${attempts}/${maxAttempts}: Aguardando elementos...`);
          setTimeout(trySetup, 100);
        } else {
          console.error('❌ Elementos do header não encontrados após 20 tentativas!');
        }
        return;
      }

      console.log('✅ Botão sino encontrado:', btnSininho);
      console.log('✅ Dropdown sino encontrado:', dropdownSininho);

      // Remove eventos anteriores (evita duplicação)
      const newBtnSininho = btnSininho.cloneNode(true);
      btnSininho.parentNode.replaceChild(newBtnSininho, btnSininho);

      // Evento do botão sino
      newBtnSininho.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = dropdownSininho.classList.contains('show');
        console.log('🔔 Clicou no sino! Estado anterior:', isOpen ? 'ABERTO' : 'FECHADO');
        
        dropdownSininho.classList.toggle('show');
        
        console.log('Estado novo:', dropdownSininho.classList.contains('show') ? 'ABERTO' : 'FECHADO');

        // Atualiza a lista quando abre
        if (dropdownSininho.classList.contains('show')) {
          this.updateNotificationsList();
        }
      });

      console.log('✅ Evento de clique do sino adicionado');
    };

    trySetup();
  },

  setupClickOutside() {
    document.addEventListener('click', (e) => {
      const dropdownSininho = document.getElementById('notificationsDropdown') || 
                              document.getElementById('dropdownSininho') ||
                              document.querySelector('.notifications-dropdown');
      
      const btnSininho = document.getElementById('notificationToggle') || 
                         document.getElementById('btnSininho') ||
                         document.querySelector('.notification-btn');

      if (!dropdownSininho || !btnSininho) return;

      // Se clicou fora do dropdown e do botão, fecha
      if (!dropdownSininho.contains(e.target) && !btnSininho.contains(e.target)) {
        if (dropdownSininho.classList.contains('show')) {
          dropdownSininho.classList.remove('show');
          console.log('❌ Dropdown fechado (clicou fora)');
        }
      }
    });
  },

  updateNotificationsList() {
    console.log('📋 Atualizando lista de notificações...');
    if (window.BeiraMarNotificacoes && window.BeiraMarNotificacoes.renderDropdownNotifications) {
      window.BeiraMarNotificacoes.renderDropdownNotifications();
      console.log('✅ Lista de notificações atualizada');
    } else {
      console.warn('⚠️ BeiraMarNotificacoes não está disponível ainda');
    }
  },

  updateBadge() {
    console.log('🔢 Atualizando badge de notificações...');
    if (window.BeiraMarNotificacoes && window.BeiraMarNotificacoes.updateBadge) {
      window.BeiraMarNotificacoes.updateBadge();
    }
  }
};

// Inicializa quando a página carrega
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('⏳ DOM carregado, aguardando 500ms para garantir carregamento de notificacoes.js...');
    setTimeout(() => {
      BeiraMarHeader.init();
      BeiraMarHeader.updateBadge();
      console.log('✅ Header inicializado com sucesso!');
    }, 500);
  });
} else {
  console.log('📍 DOM já carregado, inicializando header agora...');
  BeiraMarHeader.init();
  BeiraMarHeader.updateBadge();
}

// Exporta globalmente
window.BeiraMarHeader = BeiraMarHeader;
console.log('✅ Módulo BeiraMarHeader carregado');

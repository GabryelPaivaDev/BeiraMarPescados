// =========================================
// MÓDULO DO HEADER - CONTROLE DA BANDEJA
// =========================================

const BeiraMarHeader = {
  init() {
    console.log('📢 Inicializando Header...');
    this.setupNotificationButton();
    this.setupClickOutside();
  },

  setupNotificationButton() {
    // Tenta ambos os IDs possíveis
    const btnSininho = document.getElementById('notificationToggle') || 
                       document.getElementById('btnSininho') ||
                       document.querySelector('.notification-btn');
    
    const dropdownSininho = document.getElementById('notificationsDropdown') || 
                            document.getElementById('dropdownSininho') ||
                            document.querySelector('.notifications-dropdown');

    if (!btnSininho || !dropdownSininho) {
      console.error('❌ Elementos do header não encontrados!');
      console.error('btnSininho:', btnSininho);
      console.error('dropdownSininho:', dropdownSininho);
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
      console.log('🔔 Clicou no sino!');
      
      const isOpen = dropdownSininho.classList.contains('show');
      console.log('Estado anterior:', isOpen ? 'ABERTO' : 'FECHADO');
      
      dropdownSininho.classList.toggle('show');
      
      console.log('Estado novo:', dropdownSininho.classList.contains('show') ? 'ABERTO' : 'FECHADO');

      // Atualiza a lista de notificações quando abre
      if (dropdownSininho.classList.contains('show')) {
        this.updateNotificationsList();
      }
    });

    console.log('✅ Evento de clique do sino adicionado');
  },

  setupClickOutside() {
    const dropdownSininho = document.getElementById('notificationsDropdown') || 
                            document.getElementById('dropdownSininho') ||
                            document.querySelector('.notifications-dropdown');
    
    const btnSininho = document.getElementById('notificationToggle') || 
                       document.getElementById('btnSininho') ||
                       document.querySelector('.notification-btn');

    if (!dropdownSininho || !btnSininho) return;

    document.addEventListener('click', (e) => {
      // Se clicou fora do dropdown e do botão, fecha
      if (!dropdownSininho.contains(e.target) && !btnSininho.contains(e.target)) {
        dropdownSininho.classList.remove('show');
        console.log('❌ Dropdown fechado (clicou fora)');
      }
    });
  },

  updateNotificationsList() {
    console.log('📋 Atualizando lista de notificações...');
    // Chama a função do notificacoes.js
    if (window.BeiraMarNotificacoes && window.BeiraMarNotificacoes.renderDropdownNotifications) {
      window.BeiraMarNotificacoes.renderDropdownNotifications();
      console.log('✅ Lista de notificações atualizada');
    } else {
      console.warn('⚠️ BeiraMarNotificacoes não está disponível');
    }
  },

  updateBadge() {
    console.log('🔢 Atualizando badge de notificações...');
    if (window.BeiraMarNotificacoes && window.BeiraMarNotificacoes.updateBadge) {
      window.BeiraMarNotificacoes.updateBadge();
    }
  }
};

// Inicializa quando a página carrega - SEM DELAY
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('⏳ DOM carregado, inicializando header...');
    BeiraMarHeader.init();
    BeiraMarHeader.updateBadge();
    console.log('✅ Header inicializado com sucesso!');
  });
} else {
  // Se já passou do DOMContentLoaded
  console.log('📍 DOM já carregado, inicializando header agora...');
  BeiraMarHeader.init();
  BeiraMarHeader.updateBadge();
}

// Exporta globalmente
window.BeiraMarHeader = BeiraMarHeader;
console.log('✅ Módulo BeiraMarHeader carregado');

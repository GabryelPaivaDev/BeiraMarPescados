// =========================================
// MÓDULO DO HEADER - CONTROLE DA BANDEJA
// =========================================

const BeiraMarHeader = {
    init() {
        console.log('📢 Inicializando Header...');
        this.setupNotificationButton();
        this.setupClickOutside();
        this.updateLogo();
    },
    
    updateLogo() {
        // Atualiza o logo baseado no tema atual
        if (window.ThemeManager && window.ThemeManager.updateHeaderLogo) {
            const currentTheme = window.ThemeManager.getCurrentTheme();
            window.ThemeManager.updateHeaderLogo(currentTheme);
        }
    },

    setupNotificationButton() {
        const btnSininho = document.getElementById('btnSininho');
        const dropdownSininho = document.getElementById('dropdownSininho');

        if (!btnSininho || !dropdownSininho) {
            console.error('❌ Elementos do header não encontrados!');
            console.error('btnSininho:', btnSininho);
            console.error('dropdownSininho:', dropdownSininho);
            return false;
        }

        console.log('✅ Botão sino encontrado:', btnSininho);
        console.log('✅ Dropdown sino encontrado:', dropdownSininho);

        // Remove qualquer listener anterior (marca o botão para evitar duplicação)
        if (btnSininho.dataset.listenerAdded === 'true') {
            console.log('⚠️ Listener já adicionado anteriormente, pulando...');
            return true;
        }

        // Evento do botão sino
        btnSininho.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔔 Clicou no sino!');
            
            const isOpen = dropdownSininho.classList.contains('show');
            
            if (isOpen) {
                dropdownSininho.classList.remove('show');
                btnSininho.classList.remove('active');
                console.log('➡️ Fechando dropdown');
            } else {
                dropdownSininho.classList.add('show');
                btnSininho.classList.add('active');
                console.log('➡️ Abrindo dropdown');
                
                // Atualiza a lista de notificações quando abre
                this.updateNotificationsList();
            }
        });

        // Marca que o listener foi adicionado
        btnSininho.dataset.listenerAdded = 'true';
        console.log('✅ Evento de clique do sino adicionado');
        return true;
    },

    setupClickOutside() {
        const dropdownSininho = document.getElementById('dropdownSininho');
        const btnSininho = document.getElementById('btnSininho');

        if (!dropdownSininho || !btnSininho) return;

        // Remove listener anterior se existir
        if (document._notificationClickOutsideHandler) {
            document.removeEventListener('click', document._notificationClickOutsideHandler);
        }

        // Cria novo handler
        document._notificationClickOutsideHandler = (e) => {
            // Se clicou fora do dropdown e do botão, fecha
            if (!dropdownSininho.contains(e.target) && !btnSininho.contains(e.target)) {
                dropdownSininho.classList.remove('show');
                btnSininho.classList.remove('active');
                console.log('❌ Dropdown fechado (clicou fora)');
            }
        };

        document.addEventListener('click', document._notificationClickOutsideHandler);
    },

    updateNotificationsList() {
        console.log('📋 Atualizando lista de notificações...');
        
        const dropdown = document.getElementById('dropdownSininho');
        if (!dropdown) {
            console.error('❌ Dropdown não encontrado para atualizar');
            return;
        }
        
        // Verifica se está na página do cliente e usa o sistema correto
        const isCliente = window.location.pathname.includes('cliente.html') || 
                         sessionStorage.getItem('userType') === 'cliente';
        
        if (isCliente && window.ClienteNotificacoes && window.ClienteNotificacoes.renderDropdownNotifications) {
            window.ClienteNotificacoes.renderDropdownNotifications();
            console.log('✅ Lista de notificações do cliente atualizada');
        } else if (window.BeiraMarNotificacoes && window.BeiraMarNotificacoes.renderDropdownNotifications) {
            window.BeiraMarNotificacoes.renderDropdownNotifications();
            console.log('✅ Lista de notificações atualizada');
        } else {
            console.warn('⚠️ Sistema de notificações não está disponível, usando conteúdo padrão');
            // Se não tiver o módulo, pelo menos mostra algo
            const listContainer = dropdown.querySelector('.notifications-list');
            if (listContainer && listContainer.innerHTML.trim() === '') {
                listContainer.innerHTML = '<div style="padding:20px;text-align:center;color:#999">Carregando notificações...</div>';
            }
        }
        
        // Força o display para garantir que apareça
        setTimeout(() => {
            if (dropdown.classList.contains('show')) {
                dropdown.style.display = 'block';
                console.log('✅ Dropdown forçado a aparecer');
            }
        }, 10);
    },

    updateBadge() {
        console.log('🔢 Atualizando badge de notificações...');
        
        // Verifica se está na página do cliente e usa o sistema correto
        const isCliente = window.location.pathname.includes('cliente.html') || 
                         sessionStorage.getItem('userType') === 'cliente';
        
        if (isCliente && window.ClienteNotificacoes && window.ClienteNotificacoes.atualizarBadge) {
            window.ClienteNotificacoes.atualizarBadge();
        } else if (window.BeiraMarNotificacoes && window.BeiraMarNotificacoes.updateBadge) {
            window.BeiraMarNotificacoes.updateBadge();
        }
    }

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

  updateBadgeCount() {
    console.log('🔢 Atualizando badge de notificações...');
    
    if (!window.notificationsData) {
      console.warn('⚠️ notificationsData não disponível ainda');
      return;
    }

    const count = window.notificationsData.filter((n) => !n.read).length;
    console.log(`📊 Notificações não lidas: ${count}`);

    const badges = document.querySelectorAll('.notification-count');
    console.log(`🔍 Encontrados ${badges.length} badges na página`);

    badges.forEach((badge, index) => {
      badge.textContent = count;
      console.log(`📍 Atualizando badge ${index + 1}: ${count}`);

      if (count === 0) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'flex';
      }
    });
  }
};

<<<<<<< HEAD
// Função para inicializar quando o header estiver pronto
function initHeaderWhenReady() {
    const btnSininho = document.getElementById('btnSininho');
    const dropdownSininho = document.getElementById('dropdownSininho');
    
    if (btnSininho && dropdownSininho) {
        BeiraMarHeader.init();
        BeiraMarHeader.updateBadge();
        
        // Atualiza o logo se existir
        BeiraMarHeader.updateLogo();
        
        console.log('✅ Header inicializado com sucesso!');
        return true;
    }
    return false;
}

// Tenta inicializar múltiplas vezes até encontrar os elementos
function tryInitHeader(maxAttempts = 10, attempt = 0) {
    if (attempt >= maxAttempts) {
        console.error('❌ Não foi possível inicializar o header após várias tentativas');
        return;
    }
    
    if (initHeaderWhenReady()) {
        return; // Sucesso!
    }
    
    // Tenta novamente após um delay
    setTimeout(() => tryInitHeader(maxAttempts, attempt + 1), 200);
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => tryInitHeader(), 100);
    });
} else {
    // DOM já carregado
    setTimeout(() => tryInitHeader(), 100);
}

// Exporta globalmente
window.BeiraMarHeader = BeiraMarHeader;
console.log('✅ Módulo BeiraMarHeader carregado');

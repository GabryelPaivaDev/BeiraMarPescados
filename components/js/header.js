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
        const btnSininho = document.getElementById('btnSininho');
        const dropdownSininho = document.getElementById('dropdownSininho');

        if (!btnSininho || !dropdownSininho) {
            console.error('❌ Elementos do header não encontrados!');
            return;
        }

        console.log('✅ Botão sino encontrado:', btnSininho);
        console.log('✅ Dropdown sino encontrado:', dropdownSininho);

        // Evento do botão sino
        btnSininho.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔔 Clicou no sino!');
            dropdownSininho.classList.toggle('show');
            
            // Atualiza a lista de notificações quando abre
            if (dropdownSininho.classList.contains('show')) {
                this.updateNotificationsList();
            }
        });

        console.log('✅ Evento de clique do sino adicionado');
    },

    setupClickOutside() {
        const dropdownSininho = document.getElementById('dropdownSininho');
        const btnSininho = document.getElementById('btnSininho');

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

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log('⏳ Aguardando notificacoes.js...');
    
    // Espera um pouco para garantir que notificacoes.js carregou
    setTimeout(() => {
        BeiraMarHeader.init();
        BeiraMarHeader.updateBadge();
        console.log('✅ Header inicializado com sucesso!');
    }, 1000);
});

// Exporta globalmente
window.BeiraMarHeader = BeiraMarHeader;

console.log('✅ Módulo BeiraMarHeader carregado');

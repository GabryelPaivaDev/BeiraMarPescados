// =========================================
// MÓDULO DE NOTIFICAÇÕES - SISTEMA COMPLETO
// =========================================

// DADOS DE NOTIFICAÇÕES (Em memória)
// Será substituído pelos dados salvos se existirem
let notificationsData = [];

// Flag para indicar se os dados já foram carregados
let notificationsLoaded = false;

// Dados padrão (só serão usados se não houver dados salvos)
const defaultNotifications = [
    { id: 1, type: 'warning', title: 'Estoque Baixo', message: 'Tilápia Inteira está com estoque baixo (25kg restantes).', time: new Date(), read: false },
    { id: 2, type: 'success', title: 'Pedido Entregue', message: 'Pedido #1234 foi entregue com sucesso no Restaurante Mar Azul.', time: new Date(Date.now() - 3600000), read: false },
    { id: 3, type: 'info', title: 'Atualização do Sistema', message: 'Sistema atualizado com sucesso. Novas funcionalidades disponíveis.', time: new Date(Date.now() - 7200000), read: false }
];

// Função para obter email do usuário atual
function getUserEmail() {
    return sessionStorage.getItem('userEmail') || '';
}

// Função para carregar notificações salvas - ESPECÍFICA POR USUÁRIO
function loadSavedNotificationsSync() {
    if (notificationsLoaded) {
        return;
    }
    
    try {
        // Tenta migrar dados antigos primeiro (se for a Fernanda)
        if (window.MigracaoDados) {
            window.MigracaoDados.migrarNotificacoes(getUserEmail());
        }
        
        const email = getUserEmail();
        const chave = email ? `notificacoes_${email}` : 'notificacoes';
        
        // Carrega notificações específicas do usuário
        const saved = localStorage.getItem(chave);
        
        if (saved) {
            try {
                const itensCarregados = JSON.parse(saved);
                // Converte strings de volta para Date
                notificationsData = itensCarregados.map(n => ({
                    ...n,
                    time: n.time ? new Date(n.time) : new Date()
                }));
                console.log(`✅ Notificações carregadas para ${email}: ${notificationsData.length} itens`);
            } catch (e) {
                console.error('Erro ao carregar notificações:', e);
                notificationsData = []; // Array vazio para novos usuários
            }
        } else {
            // Se não tiver dados salvos, usa as notificações padrão para qualquer usuário
            notificationsData = [...defaultNotifications];
            console.log(`✅ Notificações padrão carregadas para ${email || 'usuário'}: ${notificationsData.length} itens`);
        }
    } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        notificationsData = [];
    }
    
    notificationsLoaded = true;
}

const BeiraMarNotificacoes = {
    loadNotificacoesContent() {
        console.log('📢 Carregando página de notificações...');
        
        // Carrega dados salvos primeiro
        loadSavedNotificationsSync();
        
        const page = document.getElementById('notificacoes');
        
        if (!page) {
            console.error('❌ Elemento #notificacoes não encontrado!');
            return;
        }

        page.innerHTML = `
            <div class="module-header">
                <h2>Notificações</h2>
                <div class="module-actions">
                    <button class="btn btn-primary" id="btnMarcarTodoLido">
                        <i class="fas fa-check-double"></i> Marcar todas como lidas
                    </button>
                    <button class="btn btn-danger" id="btnLimparTudo">
                        <i class="fas fa-trash-alt"></i> Limpar todas
                    </button>
                </div>
            </div>

            <div class="notifications-container"></div>

            <div class="notifications-empty" style="display: none;">
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <h3>Sem notificações</h3>
                    <p>Você está em dia com todos os alertas do sistema.</p>
                </div>
            </div>
        `;

        this.addStyles();
        this.initButtons();
        this.renderPageNotifications();
        this.updateBadge();

        console.log('✅ Página de notificações carregada');
    },

    renderPageNotifications() {
        const container = document.querySelector('.notifications-container');
        const emptyState = document.querySelector('.notifications-empty');

        if (!container) return;

        if (notificationsData.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        let html = '';
        notificationsData.forEach(n => {
            const icon = this.getIcon(n.type);
            const colorClass = `notif-${n.type}`;
            const readClass = n.read ? 'notification-read' : '';
            
            html += `
                <div class="notification-item ${colorClass} ${readClass}" data-id="${n.id}">
                    <div class="notification-left">
                        <div class="notification-icon ${n.type}">
                            <i class="${icon}"></i>
                        </div>
                    </div>
                    
                    <div class="notification-middle">
                        <h3 class="notification-title">${n.title}</h3>
                        <p class="notification-message">${n.message}</p>
                        <span class="notification-time">
                            <i class="fas fa-clock"></i> ${this.formatTime(n.time)}
                        </span>
                    </div>

                    <div class="notification-right">
                        ${!n.read ? `
                            <button class="notif-action-icon" onclick="BeiraMarNotificacoes.markAsRead(${n.id})" title="Marcar como lido">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        <button class="notif-action-icon notif-delete" onclick="BeiraMarNotificacoes.removeNotification(${n.id})" title="Remover">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="notification-dot" ${n.read ? 'style="background: transparent;"' : ''}></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        console.log(`✅ ${notificationsData.length} notificações renderizadas`);
    },

    renderDropdownNotifications() {
        const listContainer = document.querySelector('.notifications-list');
        if (!listContainer) return;

        if (notificationsData.length === 0) {
            listContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #999; font-size: 0.9rem;">
                    <i class="fas fa-bell-slash" style="font-size: 2rem; margin-bottom: 10px; display: block; color: #cbd5e1;"></i>
                    <p>Sem notificações</p>
                </div>
            `;
            return;
        }

        let html = '';
        notificationsData.slice(0, 5).forEach(n => {
            const icon = this.getIcon(n.type);
            
            html += `
                <div class="notification-item-dropdown ${n.type}" onclick="BeiraMarNotificacoes.markAsRead(${n.id})">
                    <div class="notification-item-icon ${n.type}">
                        <i class="${icon}"></i>
                    </div>
                    <div class="notification-item-content">
                        <p class="notification-item-title">${n.title}</p>
                        <p class="notification-item-text">${n.message}</p>
                        <span class="notification-item-time">${this.formatTime(n.time)}</span>
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = html;
    },

    markAsRead(id) {
        const notif = notificationsData.find(n => n.id === id);
        if (notif) {
            notif.read = true;
            this.renderPageNotifications();
            this.renderDropdownNotifications();
            this.updateBadge();
            // SALVA IMEDIATAMENTE (síncrono, igual ao carrinho)
            this.saveNotifications();
            console.log(`✅ Notificação ${id} marcada como lida E SALVA!`);
        }
    },

    markAllAsRead() {
        notificationsData.forEach(n => n.read = true);
        this.renderPageNotifications();
        this.renderDropdownNotifications();
        this.updateBadge();
        // SALVA IMEDIATAMENTE (síncrono, igual ao carrinho)
        this.saveNotifications();
        console.log('✅ Todas as notificações marcadas como lidas E SALVAS!');
    },

    removeNotification(id) {
        notificationsData = notificationsData.filter(n => n.id !== id);
        this.renderPageNotifications();
        this.renderDropdownNotifications();
        this.updateBadge();
        // SALVA IMEDIATAMENTE (síncrono, igual ao carrinho)
        this.saveNotifications();
        console.log(`✅ Notificação ${id} removida E SALVA!`);
    },

    removeAll() {
        if (window.BeiraMarModais && window.BeiraMarModais.showConfirm) {
            window.BeiraMarModais.showConfirm({
                title: 'Remover Notificações',
                message: 'Tem certeza que deseja remover todas as notificações? Esta ação não pode ser desfeita.',
                confirmText: 'Remover',
                cancelText: 'Cancelar',
                icon: 'trash-alt',
                iconColor: '#ef4444',
                onConfirm: () => {
                    notificationsData = [];
                    this.renderPageNotifications();
                    this.renderDropdownNotifications();
                    this.updateBadge();
                    // SALVA IMEDIATAMENTE (síncrono, igual ao carrinho)
                    this.saveNotifications();
                    console.log('✅ Todas as notificações removidas E SALVAS!');
                }
            });
        } else {
            if (confirm('Tem certeza que deseja remover todas as notificações?')) {
                notificationsData = [];
                this.renderPageNotifications();
                this.renderDropdownNotifications();
                this.updateBadge();
                // SALVA IMEDIATAMENTE (síncrono, igual ao carrinho)
                this.saveNotifications();
                console.log('✅ Todas as notificações removidas E SALVAS!');
            }
        }
    },

    updateBadge() {
        const count = notificationsData.filter(n => !n.read).length;
        console.log(`🔔 Contando notificações não lidas: ${count}`);
        
        // Atualiza badges do header (.notification-count)
        const headerBadges = document.querySelectorAll('.notification-count');
        console.log(`🔍 Encontrados ${headerBadges.length} badges no header`);
        
        headerBadges.forEach((badge, index) => {
            console.log(`📍 Atualizando badge do header ${index + 1}:`, badge);
            badge.textContent = count;
            
            if (count === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex';
            }
        });
        
        // Atualiza badges do sidebar (.notification-badge)
        const sidebarBadges = document.querySelectorAll('.notification-badge');
        console.log(`🔍 Encontrados ${sidebarBadges.length} badges no sidebar`);
        
        sidebarBadges.forEach((badge, index) => {
            console.log(`📍 Atualizando badge do sidebar ${index + 1}:`, badge);
            badge.textContent = count;
            
            if (count === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex';
            }
        });
    },

    addNotification(title, message, type = 'info') {
        notificationsData.unshift({
            id: Date.now(),
            type,
            title,
            message,
            time: new Date(),
            read: false
        });
        this.renderPageNotifications();
        this.renderDropdownNotifications();
        this.updateBadge();
        this.saveNotifications();
        console.log(`✅ Notificação adicionada: ${title}`);
    },
    
    // Salva as notificações - EXATAMENTE IGUAL AO CARRINHO (chave simples)
    saveNotifications() {
        try {
            // Serializa Dates para strings
            const serialized = notificationsData.map(n => ({
                ...n,
                time: n.time instanceof Date ? n.time.toISOString() : n.time
            }));
            
            // Salva EXATAMENTE como o carrinho faz - chave simples sem email
            const email = getUserEmail();
            const chave = email ? `notificacoes_${email}` : 'notificacoes';
            localStorage.setItem(chave, JSON.stringify(serialized));
            
            console.log(`✅ Notificações salvas: ${serialized.length} itens`);
        } catch (error) {
            console.error('❌ Erro ao salvar notificações:', error);
        }
    },

    initButtons() {
        const btnMarcar = document.getElementById('btnMarcarTodoLido');
        const btnLimpar = document.getElementById('btnLimparTudo');

        if (btnMarcar) {
            btnMarcar.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }

        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => {
                this.removeAll();
            });
        }
    },

    initDropdown() {
        // Deixa o controle de abrir/fechar com o Header (header.js)
        // Aqui só garantimos que a lista seja renderizada pelo menos uma vez.
        this.renderDropdownNotifications();
        console.log('✅ Dropdown de notificações preparado (render inicial)');
    },

    getIcon(type) {
        const icons = {
            'warning': 'fas fa-exclamation-circle',
            'success': 'fas fa-check-circle',
            'error': 'fas fa-times-circle',
            'info': 'fas fa-info-circle'
        };
        return icons[type] || icons['info'];
    },

    formatTime(date) {
        const d = new Date(date);
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);
        
        if (d.getDate() === hoje.getDate() && d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear()) {
            return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (d.getDate() === ontem.getDate()) {
            return 'Ontem';
        } else {
            return d.toLocaleDateString('pt-BR');
        }
    },

    addStyles() {
        if (document.getElementById('notificacoes-styles')) return;

        const style = document.createElement('style');
        style.id = 'notificacoes-styles';
        style.textContent = `
            /* ===== HEADER MODERNO COM GRADIENTE AZUL ===== */
            #notificacoes .module-header {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 2rem;
                padding: 2rem 2.5rem;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4);
                overflow: hidden;
            }

            #notificacoes .module-header::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -20%;
                width: 400px;
                height: 400px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                pointer-events: none;
            }

            #notificacoes .module-header::after {
                content: '🔔';
                position: absolute;
                right: 30px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 4rem;
                opacity: 0.15;
                pointer-events: none;
            }

            #notificacoes .module-header h2 {
                margin: 0;
                color: #ffffff;
                font-size: 1.8rem;
                font-weight: 800;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                position: relative;
                z-index: 2;
            }

            #notificacoes .module-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                position: relative;
                z-index: 2;
            }

            /* ===== BOTÕES MODERNOS ===== */
            #notificacoes .btn {
                padding: 0.8rem 1.8rem;
                border-radius: 50px;
                border: none;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-size: 0.9rem;
                font-weight: 600;
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                backdrop-filter: blur(10px);
            }

            #notificacoes .btn-primary {
                background: rgba(255, 255, 255, 0.25);
                color: white;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }

            #notificacoes .btn-primary:hover {
                background: rgba(255, 255, 255, 0.35);
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            }

            #notificacoes .btn-danger {
                background: rgba(239, 68, 68, 0.9);
                color: white;
                border: 2px solid transparent;
            }

            #notificacoes .btn-danger:hover {
                background: #dc2626;
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
            }

            #notificacoes .btn:active {
                transform: scale(0.97);
            }

            /* ===== CONTAINER DE NOTIFICAÇÕES ===== */
            .notifications-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            /* ===== CARDS DE NOTIFICAÇÃO MODERNOS ===== */
            .notification-item {
                display: flex;
                gap: 1.2rem;
                align-items: center;
                background: white;
                padding: 1.5rem 1.8rem;
                border-radius: 16px;
                border-left: 5px solid;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                animation: slideIn 0.4s ease-out;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .notification-item.notification-read {
                opacity: 0.55;
                background: #f8fafc;
            }

            .notification-item:hover {
                transform: translateX(8px);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            }

            .notification-item.notif-warning { 
                border-left-color: #f59e0b; 
                background: linear-gradient(135deg, #fffbf0 0%, #fff8e6 100%); 
            }
            .notification-item.notif-success { 
                border-left-color: #10b981; 
                background: linear-gradient(135deg, #f0fdf4 0%, #e8fcef 100%); 
            }
            .notification-item.notif-error { 
                border-left-color: #ef4444; 
                background: linear-gradient(135deg, #fef2f2 0%, #fee8e8 100%); 
            }
            .notification-item.notif-info { 
                border-left-color: #3b82f6; 
                background: linear-gradient(135deg, #eff6ff 0%, #e8f2ff 100%); 
            }

            .notification-left { flex-shrink: 0; }

            .notification-icon {
                width: 56px;
                height: 56px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }

            .notification-icon.warning { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; }
            .notification-icon.success { background: linear-gradient(135deg, #34d399 0%, #10b981 100%); color: white; }
            .notification-icon.error { background: linear-gradient(135deg, #f87171 0%, #ef4444 100%); color: white; }
            .notification-icon.info { background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); color: white; }

            .notification-middle { flex: 1; }

            .notification-title {
                margin: 0 0 0.4rem 0;
                font-size: 1.1rem;
                font-weight: 700;
                color: #1e293b;
            }

            .notification-message {
                margin: 0 0 0.6rem 0;
                font-size: 0.95rem;
                color: #64748b;
                line-height: 1.5;
            }

            .notification-time {
                font-size: 0.85rem;
                color: #94a3b8;
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                background: rgba(148, 163, 184, 0.1);
                padding: 0.3rem 0.8rem;
                border-radius: 20px;
            }

            .notification-right {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                flex-shrink: 0;
            }

            .notif-action-icon {
                width: 38px;
                height: 38px;
                border-radius: 12px;
                background: white;
                border: 2px solid #e2e8f0;
                color: #64748b;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                font-size: 0.9rem;
                padding: 0;
            }

            .notif-action-icon:hover {
                background: #3b82f6;
                color: white;
                border-color: #3b82f6;
                transform: scale(1.1);
            }

            .notif-action-icon.notif-delete:hover {
                background: #ef4444;
                color: white;
                border-color: #ef4444;
            }

            .notification-dot {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                flex-shrink: 0;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
                50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.1); }
            }

            /* ===== ESTADO VAZIO ESTILIZADO ===== */
            .empty-state {
                text-align: center;
                padding: 5rem 2rem;
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-radius: 20px;
                border: 2px dashed #e2e8f0;
            }

            .empty-state i {
                font-size: 5rem;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 1.5rem;
                display: block;
            }

            .empty-state h3 {
                font-size: 1.8rem;
                margin: 0;
                color: #334155;
                font-weight: 700;
            }

            .empty-state p {
                margin: 0.8rem 0 0 0;
                color: #64748b;
                font-size: 1.1rem;
            }

            /* ===== DROPDOWN NOTIFICAÇÕES ===== */
            .notification-item-dropdown {
                display: flex;
                gap: 1rem;
                padding: 1rem 1.2rem;
                border-bottom: 1px solid #f1f5f9;
                cursor: pointer;
                border-left: 4px solid transparent;
                transition: all 0.2s ease;
            }

            .notification-item-dropdown:hover { 
                background: linear-gradient(90deg, #f8fafc 0%, transparent 100%); 
            }

            .notification-item-dropdown.warning { border-left-color: #f59e0b; }
            .notification-item-dropdown.success { border-left-color: #10b981; }
            .notification-item-dropdown.error { border-left-color: #ef4444; }
            .notification-item-dropdown.info { border-left-color: #3b82f6; }

            .notification-item-icon {
                width: 42px;
                height: 42px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                flex-shrink: 0;
            }

            .notification-item-icon.warning { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; }
            .notification-item-icon.success { background: linear-gradient(135deg, #34d399, #10b981); color: white; }
            .notification-item-icon.error { background: linear-gradient(135deg, #f87171, #ef4444); color: white; }
            .notification-item-icon.info { background: linear-gradient(135deg, #60a5fa, #3b82f6); color: white; }

            .notification-item-content { flex: 1; }

            .notification-item-title {
                margin: 0 0 0.3rem 0;
                font-size: 0.95rem;
                font-weight: 600;
                color: #334155;
            }

            .notification-item-text {
                margin: 0;
                font-size: 0.85rem;
                color: #64748b;
                line-height: 1.4;
            }

            .notification-item-time {
                font-size: 0.75rem;
                color: #94a3b8;
                display: block;
                margin-top: 0.5rem;
            }

            /* ===== TEMA ESCURO ===== */
            [data-theme="dark"] #notificacoes .module-header {
                background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
                box-shadow: 0 10px 40px rgba(30, 64, 175, 0.5);
            }

            [data-theme="dark"] .notification-item {
                background: #1e293b;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }

            [data-theme="dark"] .notification-item.notification-read {
                background: #0f172a;
            }

            [data-theme="dark"] .notification-item.notif-warning { 
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%); 
            }
            [data-theme="dark"] .notification-item.notif-success { 
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%); 
            }
            [data-theme="dark"] .notification-item.notif-error { 
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%); 
            }
            [data-theme="dark"] .notification-item.notif-info { 
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%); 
            }

            [data-theme="dark"] .notification-title { color: #f1f5f9; }
            [data-theme="dark"] .notification-message { color: #94a3b8; }
            [data-theme="dark"] .notification-time { color: #64748b; background: rgba(100, 116, 139, 0.2); }

            [data-theme="dark"] .notif-action-icon {
                background: #334155;
                border-color: #475569;
                color: #94a3b8;
            }

            [data-theme="dark"] .empty-state {
                background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                border-color: #334155;
            }

            [data-theme="dark"] .empty-state h3 { color: #f1f5f9; }
            [data-theme="dark"] .empty-state p { color: #94a3b8; }

            [data-theme="dark"] .notification-item-dropdown:hover {
                background: linear-gradient(90deg, rgba(51, 65, 85, 0.5) 0%, transparent 100%);
            }

            [data-theme="dark"] .notification-item-title { color: #f1f5f9; }
            [data-theme="dark"] .notification-item-text { color: #94a3b8; }

            /* ===== RESPONSIVO ===== */
            @media (max-width: 768px) {
                #notificacoes .module-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1.5rem;
                    padding: 1.5rem;
                }

                #notificacoes .module-header::after {
                    display: none;
                }

                #notificacoes .module-actions {
                    width: 100%;
                    flex-direction: column;
                }

                #notificacoes .btn {
                    width: 100%;
                    justify-content: center;
                }

                .notification-item {
                    flex-direction: column;
                    align-items: flex-start;
                    padding: 1.2rem;
                }

                .notification-right {
                    align-self: flex-end;
                    margin-top: 1rem;
                }

                #notificacoes .module-header h2 {
                    font-size: 1.4rem;
                }
            }

            /* =========================================
               TEMA ESCURO - NOTIFICAÇÕES
               ========================================= */

            [data-theme="dark"] .module-header {
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .module-header h2 {
                color: #f1f5f9;
            }

            [data-theme="dark"] .notification-item {
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .notification-item:hover {
                background: #334155;
            }

            [data-theme="dark"] .notification-item.notification-read {
                opacity: 0.7;
            }

            /* Tipos de notificação no tema escuro */
            [data-theme="dark"] .notification-item.notif-warning {
                background: rgba(245, 158, 11, 0.1);
                border-left-color: #f59e0b;
            }

            [data-theme="dark"] .notification-item.notif-success {
                background: rgba(16, 185, 129, 0.1);
                border-left-color: #10b981;
            }

            [data-theme="dark"] .notification-item.notif-error {
                background: rgba(239, 68, 68, 0.1);
                border-left-color: #ef4444;
            }

            [data-theme="dark"] .notification-item.notif-info {
                background: rgba(59, 130, 246, 0.1);
                border-left-color: #3b82f6;
            }

            /* Ícones de notificação - tema escuro */
            [data-theme="dark"] .notification-icon.warning {
                background: rgba(245, 158, 11, 0.2);
                color: #fbbf24;
            }

            [data-theme="dark"] .notification-icon.success {
                background: rgba(16, 185, 129, 0.2);
                color: #34d399;
            }

            [data-theme="dark"] .notification-icon.error {
                background: rgba(239, 68, 68, 0.2);
                color: #f87171;
            }

            [data-theme="dark"] .notification-icon.info {
                background: rgba(59, 130, 246, 0.2);
                color: #60a5fa;
            }

            [data-theme="dark"] .notification-title {
                color: #f1f5f9;
            }

            [data-theme="dark"] .notification-message {
                color: #cbd5e1;
            }

            [data-theme="dark"] .notification-time {
                color: #94a3b8;
            }

            [data-theme="dark"] .notif-action-icon {
                background: #334155;
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #cbd5e1;
            }

            [data-theme="dark"] .notif-action-icon:hover {
                background: #475569;
                color: #60a5fa;
                border-color: #60a5fa;
            }

            [data-theme="dark"] .notif-action-icon.notif-delete:hover {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
                border-color: #ef4444;
            }

            /* Dropdown de notificação - tema escuro */
            [data-theme="dark"] .notification-item-dropdown {
                background: #1e293b;
                border-bottom-color: rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .notification-item-dropdown:hover {
                background: #334155;
            }

            [data-theme="dark"] .notification-item-icon.warning {
                background: rgba(245, 158, 11, 0.2);
                color: #fbbf24;
            }

            [data-theme="dark"] .notification-item-icon.success {
                background: rgba(16, 185, 129, 0.2);
                color: #34d399;
            }

            [data-theme="dark"] .notification-item-icon.error {
                background: rgba(239, 68, 68, 0.2);
                color: #f87171;
            }

            [data-theme="dark"] .notification-item-icon.info {
                background: rgba(59, 130, 246, 0.2);
                color: #60a5fa;
            }

            [data-theme="dark"] .notification-item-title {
                color: #f1f5f9;
            }

            [data-theme="dark"] .notification-item-text {
                color: #cbd5e1;
            }

            [data-theme="dark"] .notification-item-time {
                color: #94a3b8;
            }

            [data-theme="dark"] .empty-state i {
                color: #475569;
            }

            [data-theme="dark"] .empty-state h3 {
                color: #cbd5e1;
            }

            [data-theme="dark"] .empty-state p {
                color: #94a3b8;
            }
        `;
        document.head.appendChild(style);
    },

    page.innerHTML = `
      <div class="module-header">
        <h2>Notificações</h2>
        <div class="module-actions">
          <button class="btn btn-primary" id="btnMarcarTodoLido">
            <i class="fas fa-check-double"></i> Marcar todas como lidas
          </button>
          <button class="btn btn-danger" id="btnLimparTudo">
            <i class="fas fa-trash-alt"></i> Limpar todas
          </button>
        </div>
      </div>

      <div class="notifications-container"></div>

      <div class="notifications-empty" style="display: none;">
        <div class="empty-state">
          <i class="fas fa-bell-slash"></i>
          <h3>Sem notificações</h3>
          <p>Você está em dia com todos os alertas do sistema.</p>
        </div>
      </div>
    `;

    this.addStyles();
    this.initButtons();
    this.renderPageNotifications();
    this.updateBadge();

    console.log('✅ Página de notificações carregada');
  },

  renderPageNotifications() {
    const container = document.querySelector('.notifications-container');
    const emptyState = document.querySelector('.notifications-empty');

    if (!container) return;

    if (notificationsData.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    let html = '';
    notificationsData.forEach((n) => {
      const icon = this.getIcon(n.type);
      const colorClass = `notif-${n.type}`;
      const readClass = n.read ? 'notification-read' : '';

      html += `
        <div class="notification-item ${colorClass} ${readClass}" data-id="${n.id}">
          <div class="notification-left">
            <div class="notification-icon ${n.type}">
              <i class="${icon}"></i>
            </div>
          </div>

          <div class="notification-middle">
            <h3 class="notification-title">${n.title}</h3>
            <p class="notification-message">${n.message}</p>
            <span class="notification-time">
              <i class="fas fa-clock"></i> ${this.formatTime(n.time)}
            </span>
          </div>

          <div class="notification-right">
            ${
              !n.read
                ? `
              <button class="notif-action-icon" onclick="BeiraMarNotificacoes.markAsRead(${n.id})" title="Marcar como lido">
                <i class="fas fa-check"></i>
              </button>
            `
                : ''
            }
            <button class="notif-action-icon notif-delete" onclick="BeiraMarNotificacoes.removeNotification(${n.id})" title="Remover">
              <i class="fas fa-times"></i>
            </button>
            <div class="notification-dot" ${n.read ? 'style="background: transparent;"' : ''}></div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    console.log(`✅ ${notificationsData.length} notificações renderizadas`);
  },

  renderDropdownNotifications() {
    const listContainer = document.querySelector('.notifications-list');
    if (!listContainer) return;

    if (notificationsData.length === 0) {
      listContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #999; font-size: 0.9rem;">
          <i class="fas fa-bell-slash" style="font-size: 2rem; margin-bottom: 10px; display: block; color: #cbd5e1;"></i>
          <p>Sem notificações</p>
        </div>
      `;
      return;
    }

    let html = '';
    notificationsData.slice(0, 5).forEach((n) => {
      const icon = this.getIcon(n.type);

      html += `
        <div class="notification-item-dropdown ${n.type}" onclick="BeiraMarNotificacoes.markAsRead(${n.id})">
          <div class="notification-item-icon ${n.type}">
            <i class="${icon}"></i>
          </div>
          <div class="notification-item-content">
            <p class="notification-item-title">${n.title}</p>
            <p class="notification-item-text">${n.message}</p>
            <span class="notification-item-time">${this.formatTime(n.time)}</span>
          </div>
        </div>
      `;
    });
    listContainer.innerHTML = html;
  },

  markAsRead(id) {
    const notif = notificationsData.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.renderPageNotifications();
      this.renderDropdownNotifications();
      this.updateBadge();
      console.log(`✅ Notificação ${id} marcada como lida`);
    }
  },

  markAllAsRead() {
    notificationsData.forEach((n) => (n.read = true));
    this.renderPageNotifications();
    this.renderDropdownNotifications();
    this.updateBadge();
    console.log('✅ Todas as notificações marcadas como lidas');
  },

  removeNotification(id) {
    notificationsData = notificationsData.filter((n) => n.id !== id);
    this.renderPageNotifications();
    this.renderDropdownNotifications();
    this.updateBadge();
    console.log(`✅ Notificação ${id} removida`);
  },

  removeAll() {
    if (confirm('Tem certeza que deseja remover todas as notificações?')) {
      notificationsData = [];
      this.renderPageNotifications();
      this.renderDropdownNotifications();
      this.updateBadge();
      console.log('✅ Todas as notificações removidas');
    }
  },

  updateBadge() {
    const count = notificationsData.filter((n) => !n.read).length;
    console.log(`🔔 Contando notificações não lidas: ${count}`);

    const badges = document.querySelectorAll('.notification-count');
    console.log(`🔍 Encontrados ${badges.length} badges na página`);

    badges.forEach((badge, index) => {
      console.log(`📍 Atualizando badge ${index + 1}:`, badge);
      badge.textContent = count;

      if (count === 0) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'flex';
      }
    });
  },

  addNotification(title, message, type = 'info') {
    notificationsData.unshift({
      id: Date.now(),
      type,
      title,
      message,
      time: new Date(),
      read: false
    });
    this.renderPageNotifications();
    this.renderDropdownNotifications();
    this.updateBadge();
    console.log(`✅ Notificação adicionada: ${title}`);
  },

  initButtons() {
    const btnMarcar = document.getElementById('btnMarcarTodoLido');
    const btnLimpar = document.getElementById('btnLimparTudo');

    if (btnMarcar) {
      btnMarcar.addEventListener('click', () => {
        this.markAllAsRead();
      });
    }

    if (btnLimpar) {
      btnLimpar.addEventListener('click', () => {
        this.removeAll();
      });
    }
  },

  getIcon(type) {
    const icons = {
      warning: 'fas fa-exclamation-circle',
      success: 'fas fa-check-circle',
      error: 'fas fa-times-circle',
      info: 'fas fa-info-circle'
    };
    return icons[type] || icons['info'];
  },

  formatTime(date) {
    const d = new Date(date);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    if (
      d.getDate() === hoje.getDate() &&
      d.getMonth() === hoje.getMonth() &&
      d.getFullYear() === hoje.getFullYear()
    ) {
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (d.getDate() === ontem.getDate()) {
      return 'Ontem';
    } else {
      return d.toLocaleDateString('pt-BR');
    }
  },

  addStyles() {
    if (document.getElementById('notificacoes-styles')) return;

    const style = document.createElement('style');
    style.id = 'notificacoes-styles';
    style.textContent = `
      /* ===== MODULE HEADER ===== */
      .module-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        background: white;
        border-radius: 8px;
        border-left: 5px solid #3b82f6;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }

      .module-header h2 {
        margin: 0;
        color: #1e293b;
        font-size: 1.5rem;
        font-weight: 700;
      }

      .module-actions {
        display: flex;
        gap: 0.8rem;
        flex-wrap: wrap;
      }

      /* ===== BOTÕES ===== */
      .btn {
        padding: 0.6rem 1.5rem;
        border-radius: 50px;
        border: none;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
      }

      .btn-primary {
        background: #3b82f6;
      }

      .btn-primary:hover {
        background: #2563eb;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .btn-danger {
        background: #ef4444;
      }

      .btn-danger:hover {
        background: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      .btn:active {
        transform: scale(0.98);
      }

      /* ===== CONTAINER ===== */
      .notifications-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      /* ===== ITEMS ===== */
      .notification-item {
        display: flex;
        gap: 1rem;
        align-items: center;
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 5px solid;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        transition: all 0.2s;
      }

      .notification-item.notification-read {
        opacity: 0.6;
      }

      .notification-item:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .notification-item.notif-warning { border-left-color: #f59e0b; background: #fffbf0; }
      .notification-item.notif-success { border-left-color: #10b981; background: #f0fdf4; }
      .notification-item.notif-error { border-left-color: #ef4444; background: #fef2f2; }
      .notification-item.notif-info { border-left-color: #3b82f6; background: #eff6ff; }

      .notification-left { flex-shrink: 0; }

      .notification-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }

      .notification-icon.warning { background: #fff7ed; color: #f59e0b; }
      .notification-icon.success { background: #ecfdf5; color: #10b981; }
      .notification-icon.error { background: #fef2f2; color: #ef4444; }
      .notification-icon.info { background: #eff6ff; color: #3b82f6; }

      .notification-middle { flex: 1; }

      .notification-title {
        margin: 0 0 0.3rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
      }

      .notification-message {
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
        color: #64748b;
      }

      .notification-time {
        font-size: 0.8rem;
        color: #94a3b8;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
      }

      .notification-right {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        flex-shrink: 0;
      }

      .notif-action-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: white;
        border: 1px solid #e2e8f0;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        font-size: 0.9rem;
        padding: 0;
      }

      .notif-action-icon:hover {
        background: #f1f5f9;
        color: #3b82f6;
        border-color: #3b82f6;
      }

      .notif-action-icon.notif-delete:hover {
        background: #fef2f2;
        color: #ef4444;
        border-color: #ef4444;
      }

      .notification-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #3b82f6;
        flex-shrink: 0;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
      }

      .empty-state i {
        font-size: 4rem;
        color: #cbd5e1;
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        font-size: 1.5rem;
        margin: 0;
        color: #475569;
      }

      .empty-state p {
        margin: 0.5rem 0 0 0;
        color: #94a3b8;
      }

      .notification-item-dropdown {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.2rem;
        border-bottom: 1px solid #f8fafc;
        cursor: pointer;
        border-left: 4px solid transparent;
        transition: background 0.2s;
      }

      .notification-item-dropdown:hover { background: #f8fafc; }

      .notification-item-dropdown.warning { border-left-color: #f59e0b; }
      .notification-item-dropdown.success { border-left-color: #10b981; }
      .notification-item-dropdown.error { border-left-color: #ef4444; }
      .notification-item-dropdown.info { border-left-color: #3b82f6; }

      .notification-item-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        flex-shrink: 0;
      }

      .notification-item-icon.warning { background: #fff7ed; color: #ea580c; }
      .notification-item-icon.success { background: #ecfdf5; color: #10b981; }
      .notification-item-icon.error { background: #fef2f2; color: #ef4444; }
      .notification-item-icon.info { background: #eff6ff; color: #3b82f6; }

      .notification-item-content { flex: 1; }

      .notification-item-title {
        margin: 0 0 0.2rem 0;
        font-size: 0.9rem;
        font-weight: 600;
        color: #334155;
      }

      .notification-item-text {
        margin: 0;
        font-size: 0.85rem;
        color: #64748b;
      }

      .notification-item-time {
        font-size: 0.75rem;
        color: #94a3b8;
        display: block;
        margin-top: 0.4rem;
      }

      @media (max-width: 768px) {
        .module-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .module-actions {
          width: 100%;
          flex-direction: column;
        }

        .btn {
          width: 100%;
          justify-content: center;
        }

        .notification-item {
          flex-direction: column;
          align-items: flex-start;
        }

        .notification-right {
          align-self: flex-end;
          margin-top: 0.5rem;
        }

        .module-header h2 {
          font-size: 1.3rem;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// =========================================
// INICIALIZAÇÃO - SEM INICIALIZAR O DROPDOWN
// =========================================
function initializeNotificationsModule() {
    // Carrega dados salvos ANTES de inicializar (igual ao carrinho)
    if (!notificationsLoaded) {
        loadSavedNotificationsSync();
    }
    
    if (document.getElementById('notificacoes')) {
        BeiraMarNotificacoes.loadNotificacoesContent();
    }
    // Garante que o dropdown tenha conteúdo inicial; o clique é controlado no Header
    BeiraMarNotificacoes.initDropdown();
    BeiraMarNotificacoes.updateBadge();
    console.log('✅ Módulo BeiraMarNotificacoes inicializado completamente');
}

// Carrega dados quando o script carrega (igual ao carrinho)
// IMPORTANTE: Carrega ANTES de qualquer coisa
(function() {
    // Aguarda um pouco para garantir que sessionStorage esteja disponível
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(loadSavedNotificationsSync, 50);
            setTimeout(initializeNotificationsModule, 150);
        });
    } else {
        // DOM já carregado
        setTimeout(loadSavedNotificationsSync, 50);
        setTimeout(initializeNotificationsModule, 150);
    }
})();

// =========================================
// EXPOSIÇÃO GLOBAL
// =========================================
window.BeiraMarNotificacoes = BeiraMarNotificacoes;
window.notificationsData = notificationsData;

console.log('✅ Módulo BeiraMarNotificacoes carregado e disponível globalmente');

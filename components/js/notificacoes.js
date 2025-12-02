// =========================================
// MÓDULO DE NOTIFICAÇÕES - SISTEMA COMPLETO
// =========================================

// DADOS DE NOTIFICAÇÕES (Em memória)
let notificationsData = [
  {
    id: 1,
    type: 'warning',
    title: 'Estoque Baixo',
    message: 'Tilápia Inteira está com estoque baixo (25kg restantes).',
    time: new Date(),
    read: false
  },
  {
    id: 2,
    type: 'success',
    title: 'Pedido Entregue',
    message: 'Pedido #1234 foi entregue com sucesso no Restaurante Mar Azul.',
    time: new Date(Date.now() - 3600000),
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: 'Atualização do Sistema',
    message: 'Sistema atualizado com sucesso. Novas funcionalidades disponíveis.',
    time: new Date(Date.now() - 7200000),
    read: false
  }
];

const BeiraMarNotificacoes = {
  loadNotificacoesContent() {
    console.log('📢 Carregando página de notificações...');
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

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (document.getElementById('notificacoes')) {
      BeiraMarNotificacoes.loadNotificacoesContent();
    }
    // NÃO INICIALIZA O DROPDOWN - header.js cuida disso!
    BeiraMarNotificacoes.updateBadge();
    console.log('✅ Módulo BeiraMarNotificacoes inicializado completamente');
  }, 100);
});

// =========================================
// EXPOSIÇÃO GLOBAL
// =========================================
window.BeiraMarNotificacoes = BeiraMarNotificacoes;
window.notificationsData = notificationsData;

console.log('✅ Módulo BeiraMarNotificacoes carregado e disponível globalmente');

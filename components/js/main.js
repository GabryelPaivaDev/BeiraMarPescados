// Inicialização do sistema

document.addEventListener('DOMContentLoaded', function() {

console.log('Sistema Beira Mar carregando...');

// Aguarda 500ms para garantir que os HTMLs foram carregados

setTimeout(function() {

console.log('🔄 Inicializando módulos...');

// Inicializa módulos principais

if (typeof initializeSidebar === 'function') {

initializeSidebar();

} else {

console.warn('⚠️ initializeSidebar não encontrada');

}

if (typeof initializeNavigation === 'function') {

initializeNavigation();

} else {

console.warn('⚠️ initializeNavigation não encontrada');

}

// Carrega conteúdo inicial

if (window.BeiraMarDashboard && window.BeiraMarDashboard.loadDashboardContent) {

window.BeiraMarDashboard.loadDashboardContent();

}

// Inicializa bandeja de notificações do header
// REMOVIDO: Agora é controlado pelo header.js para evitar conflitos
// initNotificationDropdown();

// Atualiza badges inicialmente

if (window.BeiraMarNotificacoes) {

window.BeiraMarNotificacoes.updateBadge();

}

console.log('✅ Sistema Beira Mar carregado!');

}, 500);

});

// Função para abrir/fechar bandeja de notificações

function initNotificationDropdown() {

const notificationBtn = document.querySelector('.notification-btn');

const notificationDropdown = document.querySelector('.notifications-dropdown');

if (!notificationBtn) {

console.warn('⚠️ Botão de notificação não encontrado (.notification-btn)');

return;

}

if (!notificationDropdown) {

console.warn('⚠️ Bandeja de notificações não encontrada (.notifications-dropdown)');

return;

}

console.log('✅ Inicializando dropdown de notificações...');

// Toggle dropdown ao clicar no botão

notificationBtn.addEventListener('click', function(e) {

e.preventDefault();

e.stopPropagation();

const isOpen = notificationDropdown.classList.contains('show');

console.log('🔔 Botão clicado! Estado:', isOpen ? 'aberto' : 'fechado');

if (isOpen) {

notificationDropdown.classList.remove('show');

notificationBtn.classList.remove('active');

console.log('➡️ Fechando dropdown');

} else {

notificationDropdown.classList.add('show');

notificationBtn.classList.add('active');

console.log('➡️ Abrindo dropdown');

}

});

// Fechar ao clicar fora

document.addEventListener('click', function(e) {

if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {

notificationDropdown.classList.remove('show');

notificationBtn.classList.remove('active');

}

});

// Marcar todas como lidas (dentro do dropdown)

const markAllReadBtn = notificationDropdown.querySelector('.mark-all-read');

if (markAllReadBtn) {

markAllReadBtn.addEventListener('click', function(e) {

e.preventDefault();

e.stopPropagation();

// Verifica se está na página do cliente
const isCliente = window.location.pathname.includes('cliente.html') || 
                 sessionStorage.getItem('userType') === 'cliente';

if (isCliente && window.ClienteNotificacoes && window.ClienteNotificacoes.marcarTodasComoLidas) {
    window.ClienteNotificacoes.marcarTodasComoLidas();
} else if (window.BeiraMarNotificacoes && window.BeiraMarNotificacoes.markAllAsRead) {
    window.BeiraMarNotificacoes.markAllAsRead();
}

});

}

// Marcar individual como lida ao clicar (evento delegado, pois os itens são dinâmicos)
document.addEventListener('click', function(e) {
    const notificationItem = e.target.closest('.notification-item-dropdown');
    if (notificationItem) {
        e.preventDefault();
        // A ação já está no onclick do item renderizado
        // Apenas atualiza a lista
        const isCliente = window.location.pathname.includes('cliente.html') || 
                         sessionStorage.getItem('userType') === 'cliente';
        
        if (isCliente && window.ClienteNotificacoes && window.ClienteNotificacoes.renderDropdownNotifications) {
            setTimeout(() => window.ClienteNotificacoes.renderDropdownNotifications(), 100);
        } else if (window.BeiraMarNotificacoes && window.BeiraMarNotificacoes.renderDropdownNotifications) {
            window.BeiraMarNotificacoes.renderDropdownNotifications();
        }
    }
});

// Link "Ver todas as notificações"

const viewAllLink = notificationDropdown.querySelector('.notifications-dropdown-footer a');

if (viewAllLink) {

viewAllLink.addEventListener('click', function(e) {

e.preventDefault();

notificationDropdown.classList.remove('show');

notificationBtn.classList.remove('active');

if (window.BeiraMarNavigation && window.BeiraMarNavigation.navigateToPage) {

window.BeiraMarNavigation.navigateToPage('notificacoes');

}

});

}

console.log('✅ Dropdown de notificações inicializado com sucesso!');

}

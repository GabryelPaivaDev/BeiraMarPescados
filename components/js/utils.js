// =========================================
// UTILITÁRIOS GLOBAIS DO SISTEMA
// =========================================

// 1. FORMATAÇÃO
function formatCurrencyBR(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatNumberBR(value) {
    return new Intl.NumberFormat('pt-BR').format(value);
}

// 2. NOTIFICAÇÕES VISUAIS (TOASTS)
function showToast(message, type = 'info') {
    // Cria o container de toasts se não existir
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(toastContainer);
    }

    // Cores baseadas no tipo
    const colors = {
        success: '#10b981', // Verde
        error: '#ef4444',   // Vermelho
        info: '#3b82f6',    // Azul
        warning: '#f59e0b'  // Laranja
    };

    // Cria o elemento do toast
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.style.cssText = `
        background: white;
        border-left: 4px solid ${colors[type] || colors.info};
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex; align-items: center; gap: 10px;
        min-width: 300px;
        animation: slideIn 0.3s ease;
        font-family: 'Poppins', sans-serif; font-size: 0.9rem; color: #333;
    `;
    
    // Ícone
    let icon = 'info-circle';
    if(type === 'success') icon = 'check-circle';
    if(type === 'error') icon = 'times-circle';
    if(type === 'warning') icon = 'exclamation-triangle';

    toast.innerHTML = `<i class="fas fa-${icon}" style="color: ${colors[type] || colors.info}; font-size: 1.2rem;"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    // Remove automaticamente após 3 segundos
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Injeta animações CSS para os Toasts
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px); } }
`;
document.head.appendChild(styleSheet);


// 3. EXPORTAR PARA CSV (Função que já existia)
function exportTableToCSV(table, filename) {
    const rows = table.querySelectorAll('tr');
    const csv = [];
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = [];
        cols.forEach(col => rowData.push('"' + col.innerText + '"'));
        csv.push(rowData.join(','));
    });
    
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (navigator.msSaveBlob) { 
        navigator.msSaveBlob(blob, filename);
    } else {
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// 4. LOJA DE PREÇOS (Memória de preços)
const ProductPriceStore = {
    prices: {
        'Salmão Fresco': 45.00,
        'Tilápia Inteira': 12.00,
        'Camarão Médio': 65.00,
        'Filé de Tilápia': 38.00
    },
    setPrice(productName, price) { this.prices[productName] = parseFloat(price); },
    getPrice(productName) { return this.prices[productName] || 0; }
};

// =========================================
// [NOVO] SISTEMA DE LOG DE ATIVIDADES
// =========================================
const ActivityStore = {
    logs: [
        { module: 'Sistema', action: 'Sistema iniciado com sucesso', time: new Date(), type: 'info' }
    ],

    add(module, action, type = 'info') {
        this.logs.unshift({ module, action, time: new Date(), type });
        if (this.logs.length > 20) this.logs.pop(); // Mantém só os últimos 20
        
        console.log(`📝 Nova Atividade: [${module}] ${action}`);
        
        // Atualiza Dashboard em tempo real se ele estiver aberto
        if (window.BeiraMarDashboard && window.BeiraMarDashboard.updateDashboardData) {
            window.BeiraMarDashboard.updateDashboardData();
        }
    },

    getRecent() { return this.logs; }
};

// =========================================
// [NOVO] AÇÕES RÁPIDAS (Botões do Dashboard)
// =========================================
function executeQuickAction(action) {
    // Novo Pedido
    if (action === 'novoPedido') {
        if(window.BeiraMarNavigation) window.BeiraMarNavigation.navigateToPage('vendas');
        setTimeout(() => { if(window.abrirModalNovoPedido) window.abrirModalNovoPedido(); }, 800);
    }
    // Novo Lote
    if (action === 'novoLote') {
        if(window.BeiraMarNavigation) window.BeiraMarNavigation.navigateToPage('producao');
        setTimeout(() => { if(window.abrirModalNovoLote) window.abrirModalNovoLote(); }, 800);
    }
    // Entrada de Estoque
    if (action === 'novoItem') {
        if(window.BeiraMarNavigation) window.BeiraMarNavigation.navigateToPage('estoque');
        setTimeout(() => { 
            const btn = document.getElementById('btnAdicionarItem'); 
            if(btn) btn.click(); 
        }, 800);
    }
}

// 5. LÓGICA DE NOTIFICAÇÕES (Menu do Header)
// Mantive para garantir que o menu do sininho continue funcionando
const NotificationUtils = {
    attachDropdownEvents: function() {
        const notificationBtn = document.querySelector('.notification-btn');
        const dropdown = document.querySelector('.notifications-dropdown');
        
        if (notificationBtn && dropdown) {
            // Toggle do menu
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
                notificationBtn.classList.toggle('active');
            });
            
            // Fecha ao clicar fora
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                    dropdown.classList.remove('show');
                    notificationBtn.classList.remove('active');
                }
            });
            
            // Botão "Marcar todas como lidas"
            const markAllBtn = dropdown.querySelector('.mark-all-read');
            if (markAllBtn) {
                markAllBtn.addEventListener('click', () => {
                    if (window.BeiraMarNotifications) {
                        window.BeiraMarNotifications.markAllAsRead();
                    }
                });
            }
        }
    }
};

// =========================================
// EXPORTAÇÃO GLOBAL
// =========================================
window.BeiraMarUtils = {
    formatCurrencyBR,
    formatNumberBR,
    showToast,
    exportTableToCSV,
    ProductPriceStore,
    ActivityStore,        // [NOVO]
    executeQuickAction,   // [NOVO]
    attachDropdownEvents: NotificationUtils.attachDropdownEvents
};
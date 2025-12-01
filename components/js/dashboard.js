// =========================================
// DASHBOARD - LÓGICA DE DADOS (CLEAN UI)
// =========================================

// Formata números grandes em formato compacto (K, M)
function formatarNumeroCompacto(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num.toString();
}

// Formata moeda com abreviação se muito grande
function formatarMoedaCompacta(valor) {
    if (valor >= 1000000) {
        return 'R$ ' + (valor / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (valor >= 1000) {
        return 'R$ ' + (valor / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}

// =========================================
// SISTEMA DE NOTIFICAÇÃO DE ATIVIDADES
// =========================================

const ActivityLogger = {
    activities: [],
    maxActivities: 50,

    types: {
        CREATE: { icon: 'fa-plus-circle', color: '#10b981', bg: '#ecfdf5', label: 'Criação' },
        UPDATE: { icon: 'fa-edit', color: '#3b82f6', bg: '#eff6ff', label: 'Atualização' },
        DELETE: { icon: 'fa-trash-alt', color: '#e11d48', bg: '#fff1f2', label: 'Exclusão' },
        SUCCESS: { icon: 'fa-check-circle', color: '#10b981', bg: '#ecfdf5', label: 'Sucesso' },
        ERROR: { icon: 'fa-exclamation-circle', color: '#e11d48', bg: '#fff1f2', label: 'Erro' },
        WARNING: { icon: 'fa-exclamation-triangle', color: '#f59e0b', bg: '#fef3c7', label: 'Aviso' },
        INFO: { icon: 'fa-info-circle', color: '#0ea5e9', bg: '#e0f2fe', label: 'Informação' },
        PRODUCTION: { icon: 'fa-industry', color: '#3b82f6', bg: '#eff6ff', label: 'Produção' },
        LOGISTICS: { icon: 'fa-truck', color: '#f59e0b', bg: '#fef3c7', label: 'Logística' },
        STOCK: { icon: 'fa-warehouse', color: '#e11d48', bg: '#fff1f2', label: 'Estoque' }
    },

    init() {
        console.log('🔄 Inicializando ActivityLogger...');
        
        this.activities = [
            {
                id: Date.now() + 1,
                title: 'Venda Recente',
                description: 'Restaurante Mar Azul - 20kg Salmão Fresco',
                type: 'SUCCESS',
                timestamp: new Date(),
                data: {}
            },
            {
                id: Date.now() + 2,
                title: 'Alerta de Estoque',
                description: '1 produtos com estoque baixo.',
                type: 'STOCK',
                timestamp: new Date(),
                data: {}
            },
            {
                id: Date.now() + 3,
                title: 'Produção Ativa',
                description: '4 lotes em processamento.',
                type: 'PRODUCTION',
                timestamp: new Date(),
                data: {}
            },
            {
                id: Date.now() + 4,
                title: 'Operações Logísticas',
                description: '4 operações ativas em andamento.',
                type: 'LOGISTICS',
                timestamp: new Date(),
                data: {}
            }
        ];
        
        this.animateNewActivity();
        console.log('✅ ActivityLogger Inicializado');
    },

    addActivity(title, description, type = 'INFO', data = {}) {
        const activity = {
            id: Date.now() + Math.random(),
            title,
            description,
            type: type || 'INFO',
            timestamp: new Date(),
            data
        };

        this.activities.unshift(activity);

        if (this.activities.length > this.maxActivities) {
            this.activities.pop();
        }

        console.log(`📢 [${activity.type}] ${title}:`, description, data);
        this.render();

        return activity;
    },

    render() {
        const container = document.getElementById('dash-lista-atividades');
        
        if (!container) {
            return;
        }

        if (this.activities.length === 0) {
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #94a3b8;">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block; opacity: 0.5;"></i>
                    <p>Nenhuma atividade ainda</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.activities.forEach((activity) => {
            const typeConfig = this.types[activity.type] || this.types.INFO;
            const timeAgo = this.getTimeAgo(activity.timestamp);

            html += `
                <div class="activity-item-new" data-id="${activity.id}" style="animation: slideInLeft 0.3s ease;">
                    <div class="act-icon-new" style="background: ${typeConfig.bg}; color: ${typeConfig.color}">
                        <i class="fas ${typeConfig.icon}"></i>
                    </div>
                    <div class="act-content-new" style="flex: 1;">
                        <h4>${activity.title}</h4>
                        <p>${activity.description}</p>
                        <small style="color: #94a3b8; font-size: 0.75rem;">
                            <i class="fas fa-clock"></i> ${timeAgo}
                        </small>
                    </div>
                    <button class="activity-close-btn" onclick="ActivityLogger.removeActivity('${activity.id}')" style="background: none; border: none; color: #cbd5e1; cursor: pointer; padding: 0.5rem; font-size: 1.2rem; transition: all 0.2s;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    removeActivity(id) {
        this.activities = this.activities.filter(a => a.id != id);
        this.render();
    },

    clearAll() {
        this.activities = [];
        this.render();
    },

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (seconds < 60) return 'agora';
        if (minutes < 60) return `${minutes}m atrás`;
        if (hours < 24) return `${hours}h atrás`;
        return new Date(date).toLocaleDateString('pt-BR');
    },

    animateNewActivity() {
        if (document.getElementById('activity-animations')) return;
        
        const style = document.createElement('style');
        style.id = 'activity-animations';
        style.textContent = `
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    },

    logCreate(entityType, entityName, details = '') {
        this.addActivity(
            `${entityType} Criado`,
            `${entityName} ${details ? '- ' + details : 'foi criado com sucesso'}`,
            'CREATE'
        );
    },

    logUpdate(entityType, entityName, changes = '') {
        this.addActivity(
            `${entityType} Atualizado`,
            `${entityName} ${changes ? '- ' + changes : 'foi atualizado com sucesso'}`,
            'UPDATE'
        );
    },

    logDelete(entityType, entityName, reason = '') {
        this.addActivity(
            `${entityType} Excluído`,
            `${entityName} ${reason ? '- ' + reason : 'foi excluído com sucesso'}`,
            'DELETE'
        );
    },

    logSuccess(title, description = '') {
        this.addActivity(title, description || 'Operação realizada com sucesso', 'SUCCESS');
    },

    logError(title, errorMsg = '') {
        this.addActivity(title, errorMsg || 'Ocorreu um erro na operação', 'ERROR');
    },

    logWarning(title, message = '') {
        this.addActivity(title, message || 'Atenção: verifique esta operação', 'WARNING');
    },

    logProduction(action, details = '') {
        this.addActivity(`Produção ${action}`, details, 'PRODUCTION');
    },

    logLogistics(action, details = '') {
        this.addActivity(`Logística ${action}`, details, 'LOGISTICS');
    },

    logStock(action, details = '') {
        this.addActivity(`Estoque ${action}`, details, 'STOCK');
    }
};

// =========================================
// FUNÇÕES ANTIGAS (MANTIDAS)
// =========================================

function loadDashboardContent() {
    console.log("🔄 Atualizando dados do Dashboard...");
    
    const dataEl = document.getElementById('dash-data-hoje');
    if(dataEl) dataEl.innerText = new Date().toLocaleDateString('pt-BR');

    const dados = getRealTimeData();
    console.log("📊 Dados coletados:", dados);

    requestAnimationFrame(() => {
        updateElement('kpi-estoque-total', formatarNumeroCompacto(dados.estoque.totalItens));
        updateElement('kpi-estoque-critico', dados.estoque.criticos);
        
        updateElement('kpi-vendas-total', dados.vendas.totalHojeNumerico > 0 ? formatarMoedaCompacta(dados.vendas.totalHojeNumerico) : 'R$ 0,00');
        updateElement('kpi-vendas-pendentes', dados.vendas.pendentes);
        
        updateElement('kpi-producao-ativos', formatarNumeroCompacto(dados.producao.ativos));
        updateElement('kpi-fluxo-ativos', formatarNumeroCompacto(dados.fluxo.ativos));

        const listaEl = document.getElementById('dash-lista-atividades');
        if(listaEl) {
            // Renderiza as atividades do ActivityLogger
            ActivityLogger.render();
            console.log("✅ Atividades atualizadas");
        }
    });
}

function updateElement(id, valor) {
    const el = document.getElementById(id);
    if(el) {
        el.innerText = valor;
        console.log(`✅ ${id} = ${valor}`);
    }
}

function getRealTimeData() {
    console.log("🔍 Procurando variáveis globais...");

    let totalEstoque = 0;
    let criticos = 0;
    let listaEstoqueCompleta = [];
    
    if (typeof estoqueGlobal !== 'undefined' && Array.isArray(estoqueGlobal) && estoqueGlobal.length > 0) {
        listaEstoqueCompleta = [...estoqueGlobal];
    }
    
    if (typeof estoqueAtual !== 'undefined' && Array.isArray(estoqueAtual)) {
        listaEstoqueCompleta = [...listaEstoqueCompleta, ...estoqueAtual];
    } else if (typeof itensPadroes !== 'undefined') {
        listaEstoqueCompleta = [...listaEstoqueCompleta, ...itensPadroes];
    }
    
    totalEstoque = listaEstoqueCompleta.length;
    criticos = listaEstoqueCompleta.filter(item => item.status === 'Crítico').length;
    
    console.log("📦 Total Estoque:", totalEstoque);

    let vendasHojeNumerico = 0;
    let vendasPendentes = 0;
    let ultimaVenda = null;
    
    if (typeof vendasData !== 'undefined' && Array.isArray(vendasData)) {
        vendasData.forEach(v => {
            if (v.data && v.data.toLowerCase().includes('hoje') && v.status === 'Concluído') {
                vendasHojeNumerico += (v.valor || 0);
            }
            if (v.status === 'Pendente') vendasPendentes++;
        });
        if (vendasData.length > 0) ultimaVenda = vendasData[0];
    }

    let prodAtivos = 0;
    if (typeof producaoItems !== 'undefined' && Array.isArray(producaoItems)) {
        prodAtivos = producaoItems.length;
    }

    let fluxoAtivos = 0;
    if (typeof logisticaItems !== 'undefined' && Array.isArray(logisticaItems)) {
        fluxoAtivos = logisticaItems.length;
    }

    return {
        estoque: { totalItens: totalEstoque, criticos: criticos },
        vendas: { totalHojeNumerico: vendasHojeNumerico, pendentes: vendasPendentes, ultima: ultimaVenda },
        producao: { ativos: prodAtivos },
        fluxo: { ativos: fluxoAtivos }
    };
}

function waitForDashboardElements() {
    console.log("⏳ Aguardando elementos do dashboard...");
    const maxTentativas = 50;
    let tentativa = 0;

    const interval = setInterval(() => {
        tentativa++;
        const elemento = document.getElementById('kpi-estoque-total');
        
        if (elemento) {
            console.log("✅ Elementos encontrados!");
            clearInterval(interval);
            
            // Inicializa o ActivityLogger AQUI
            ActivityLogger.init();
            
            // Carrega o conteúdo
            loadDashboardContent();
            
            // Atualiza a cada 5 segundos
            setInterval(loadDashboardContent, 5000);
        } else if (tentativa >= maxTentativas) {
            console.error("❌ Timeout! Elementos não encontrados.");
            clearInterval(interval);
        }
    }, 100);
}

window.BeiraMarDashboard = {
    loadDashboardContent: loadDashboardContent,
    updateDashboardData: waitForDashboardElements
};

window.ActivityLogger = ActivityLogger;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForDashboardElements);
} else {
    waitForDashboardElements();
}

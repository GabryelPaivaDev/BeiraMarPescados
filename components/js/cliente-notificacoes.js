// =========================================
// NOTIFICAÇÕES DO CLIENTE - SISTEMA COMPLETO
// =========================================

const ClienteNotificacoes = {
    // Dados de notificações do cliente
    notificacoes: [],
    inicializado: false,
    
    // Função para obter email do usuário atual
    getUserEmail() {
        return sessionStorage.getItem('userEmail') || '';
    },
    
    // Função para carregar notificações do localStorage
    carregarNotificacoes() {
        const email = this.getUserEmail();
        const chave = email ? `notificacoes_${email}` : 'notificacoes';
        
        try {
            // Tenta migrar dados antigos primeiro (se for a Fernanda)
            if (window.MigracaoDados) {
                window.MigracaoDados.migrarNotificacoes(email);
            }
            
            const saved = localStorage.getItem(chave);
            if (saved) {
                const notificacoesCarregadas = JSON.parse(saved);
                // Converte strings de volta para Date
                this.notificacoes = notificacoesCarregadas.map(n => ({
                    ...n,
                    time: n.time ? new Date(n.time) : new Date()
                }));
                console.log(`✅ Notificações carregadas para ${email}: ${this.notificacoes.length} itens`);
            } else {
                // Se não tiver dados salvos, cria notificações iniciais
                this.notificacoes = [];
                console.log(`✅ Novo usuário ${email || 'sem email'}: notificações inicializadas vazias`);
            }
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
            this.notificacoes = [];
        }
    },
    
    // Função para salvar notificações no localStorage
    salvarNotificacoes() {
        const email = this.getUserEmail();
        const chave = email ? `notificacoes_${email}` : 'notificacoes';
        
        try {
            // Serializa Dates para strings
            const serialized = this.notificacoes.map(n => ({
                ...n,
                time: n.time instanceof Date ? n.time.toISOString() : n.time
            }));
            
            localStorage.setItem(chave, JSON.stringify(serialized));
            console.log(`✅ Notificações salvas para ${email}: ${this.notificacoes.length} itens`);
        } catch (error) {
            console.error('Erro ao salvar notificações:', error);
        }
    },
    
    // Inicializa o sistema
    init() {
        // Previne múltiplas inicializações
        if (this.inicializado) {
            console.log('⚠️ Sistema já inicializado, pulando...');
            return;
        }
        
        // Garante que ClienteCompras esteja disponível antes de criar notificações
        if (!window.ClienteCompras) {
            console.log('⏳ Aguardando ClienteCompras carregar...');
            setTimeout(() => this.init(), 300);
            return;
        }
        
        console.log('✅ Inicializando sistema de notificações do cliente...');
        
        // Adiciona estilos CSS se não existirem
        this.adicionarEstilos();
        
        // Carrega notificações salvas primeiro
        this.carregarNotificacoes();
        
        // Se não tiver notificações salvas, cria as iniciais APENAS para a Fernanda
        const email = this.getUserEmail();
        const isFernanda = email.toLowerCase() === 'fernanda12@gmail.com';
        
        if (this.notificacoes.length === 0 && isFernanda) {
            // Apenas a Fernanda recebe notificações iniciais
            this.criarNotificacoesIniciais();
            // Salva as notificações iniciais
            this.salvarNotificacoes();
        } else if (this.notificacoes.length === 0 && !isFernanda) {
            // Novos usuários começam com array vazio (já está vazio, só garante)
            this.notificacoes = [];
            console.log(`✅ Novo usuário ${email || 'sem email'}: notificações inicializadas vazias`);
        }
        
        this.iniciarTimerCancelamento();
        this.renderNotificacoes();
        this.renderDropdownNotifications();
        this.inicializarEventos();
        this.inicializado = true;
        console.log(`✅ ${this.notificacoes.length} notificações carregadas/criadas`);
    },
    
    // Adiciona estilos CSS necessários
    adicionarEstilos() {
        if (document.getElementById('cliente-notificacoes-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'cliente-notificacoes-styles';
        style.textContent = `
            /* ===== NOTIFICATION ITEM ===== */
            .notification-item {
                display: flex !important;
                gap: 1rem;
                align-items: center;
                background: white;
                padding: 1.5rem;
                border-radius: 8px;
                border-left: 5px solid;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                transition: all 0.2s;
                margin-bottom: 1rem;
            }

            .notification-item.notification-read {
                opacity: 0.6;
            }

            .notification-item:hover {
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .notification-item.notif-warning { 
                border-left-color: #f59e0b; 
                background: #fffbf0; 
            }
            .notification-item.notif-success { 
                border-left-color: #10b981; 
                background: #f0fdf4; 
            }
            .notification-item.notif-error { 
                border-left-color: #ef4444; 
                background: #fef2f2; 
            }
            .notification-item.notif-info { 
                border-left-color: #3b82f6; 
                background: #eff6ff; 
            }

            .notification-left { 
                flex-shrink: 0; 
            }

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

            .notification-middle { 
                flex: 1; 
            }

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
            
            /* Tema escuro */
            [data-theme="dark"] .notification-item {
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .notification-item:hover {
                background: #334155;
            }

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

            [data-theme="dark"] .notification-title {
                color: #f1f5f9;
            }

            [data-theme="dark"] .notification-message {
                color: #cbd5e1;
            }

            [data-theme="dark"] .notification-time {
                color: #94a3b8;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Estilos CSS de notificações adicionados');
    },
    
    // Cria as notificações iniciais
    criarNotificacoesIniciais() {
        const agora = new Date();
        const umDiaAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
        const duasHorasAtras = new Date(agora.getTime() - 2 * 60 * 60 * 1000);
        const umaHoraAtras = new Date(agora.getTime() - 60 * 60 * 1000);
        
        // Notificação mais antiga: Pedido para avaliar (1 dia atrás)
        // Verifica se existe pedido a avaliar
        const pedidosAAvaliar = window.ClienteCompras.getComprasPorStatus('a-avaliar');
        if (pedidosAAvaliar.length > 0) {
            this.notificacoes.push({
                id: 'notif-001',
                type: 'success',
                title: 'Pedido para Avaliar',
                message: 'Você tem um pedido aguardando sua avaliação',
                time: umDiaAtras,
                read: false,
                action: 'avaliar',
                pedidoId: pedidosAAvaliar[0].id || 'PED-005'
            });
        }
        
        // Notificação: Atualização do pedido a caminho
        this.notificacoes.push({
            id: 'notif-002',
            type: 'info',
            title: 'Atualização de Entrega',
            message: 'Seu pedido PED-004 saiu para entrega e está a caminho',
            time: duasHorasAtras,
            read: false,
            action: 'acaminho',
            pedidoId: 'PED-004'
        });
        
        // 2 notificações sobre pedidos a pagar
        this.notificacoes.push({
            id: 'notif-003',
            type: 'error',
            title: 'Pagamento Pendente',
            message: 'Você tem 2 pedidos aguardando pagamento',
            time: umaHoraAtras,
            read: false,
            action: 'apagar',
            timerRestante: null // Será calculado
        });
        
        this.notificacoes.push({
            id: 'notif-004',
            type: 'warning',
            title: 'Atenção: Pagamento Pendente',
            message: 'Lembre-se de pagar seus 2 pedidos pendentes',
            time: agora,
            read: false,
            action: 'apagar',
            timerRestante: null
        });
        
        // Ordena por data (mais recentes primeiro)
        this.notificacoes.sort((a, b) => b.time - a.time);
    },
    
    // Inicia timer de cancelamento automático (24 horas)
    iniciarTimerCancelamento() {
        if (!window.ClienteCompras) return;
        
        const pedidosAPagar = window.ClienteCompras.getComprasPorStatus('a-pagar');
        
        pedidosAPagar.forEach(pedido => {
            // Verifica se já tem timestamp de criação
            if (!pedido.dataCriacao) {
                // Se não tiver, usa a data do pedido ou data atual menos algumas horas para simular criação
                try {
                    const partesData = pedido.data.split('/');
                    const dataPedido = new Date(parseInt(partesData[2]), parseInt(partesData[1]) - 1, parseInt(partesData[0]));
                    pedido.dataCriacao = dataPedido.getTime();
                } catch(e) {
                    // Se não conseguir parsear, usa data atual menos algumas horas
                    pedido.dataCriacao = Date.now() - (20 * 60 * 60 * 1000); // 20 horas atrás
                }
            }
            
            // Calcula tempo restante até cancelamento (24 horas)
            const tempoRestante = (24 * 60 * 60 * 1000) - (Date.now() - pedido.dataCriacao);
            
            if (tempoRestante > 0) {
                // Define timer para cancelar automaticamente
                setTimeout(() => {
                    this.cancelarPedidoPorTempo(pedido.id);
                }, tempoRestante);
                
                // Atualiza timer restante nos pedidos
                pedido.timerRestante = tempoRestante;
            } else {
                // Já passou 24 horas, cancela imediatamente
                this.cancelarPedidoPorTempo(pedido.id);
            }
        });
        
        // Atualiza timers nas notificações
        this.atualizarTimersNotificacoes();
    },
    
    // Atualiza timers nas notificações
    atualizarTimersNotificacoes() {
        const pedidosAPagar = window.ClienteCompras.getComprasPorStatus('a-pagar');
        
        if (pedidosAPagar.length > 0) {
            // Encontra a notificação de pagamento pendente
            const notificacao = this.notificacoes.find(n => n.action === 'apagar' && n.id === 'notif-003');
            if (notificacao) {
                    // Calcula o tempo restante do pedido mais antigo
                const pedidoMaisAntigo = pedidosAPagar.reduce((oldest, current) => {
                    const currentTime = current.dataCriacao || (() => {
                        try {
                            const partes = current.data.split('/');
                            return new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0])).getTime();
                        } catch(e) {
                            return Date.now() - (20 * 60 * 60 * 1000);
                        }
                    })();
                    const oldestTime = oldest.dataCriacao || (() => {
                        try {
                            const partes = oldest.data.split('/');
                            return new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0])).getTime();
                        } catch(e) {
                            return Date.now() - (20 * 60 * 60 * 1000);
                        }
                    })();
                    return currentTime < oldestTime ? current : oldest;
                });
                
                const tempoRestante = (24 * 60 * 60 * 1000) - (Date.now() - (pedidoMaisAntigo.dataCriacao || new Date(pedidoMaisAntigo.data.split('/').reverse().join('-')).getTime()));
                notificacao.timerRestante = tempoRestante;
            }
        }
    },
    
    // Cancela pedido por tempo excedido
    cancelarPedidoPorTempo(pedidoId) {
        if (!window.ClienteCompras) return;
        
        const pedido = window.ClienteCompras.comprasCliente.find(p => p.id === pedidoId);
        if (pedido && pedido.status === 'a-pagar') {
            pedido.status = 'cancelado';
            
            // Adiciona notificação de cancelamento
            this.notificacoes.unshift({
                id: `notif-cancel-${Date.now()}`,
                type: 'error',
                title: 'Pedido Cancelado',
                message: `O pedido ${pedidoId} foi cancelado automaticamente por falta de pagamento`,
                time: new Date(),
                read: false,
                action: null
            });
            
            // Atualiza contadores
            window.ClienteCompras.atualizarContadores();
            this.renderNotificacoes();
            this.atualizarBadge();
            
            console.log(`❌ Pedido ${pedidoId} cancelado automaticamente`);
        }
    },
    
    // Formata tempo relativo
    formatarTempoRelativo(date) {
        const agora = new Date();
        const diff = agora - date;
        const minutos = Math.floor(diff / 60000);
        const horas = Math.floor(diff / 3600000);
        const dias = Math.floor(diff / 86400000);
        
        if (dias > 0) {
            return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
        } else if (horas > 0) {
            return `há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
        } else if (minutos > 0) {
            return `há ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
        } else {
            return 'agora há pouco';
        }
    },
    
    // Formata timer de cancelamento
    formatarTimerCancelamento(milliseconds) {
        if (!milliseconds || milliseconds <= 0) return 'Tempo esgotado';
        
        const horas = Math.floor(milliseconds / 3600000);
        const minutos = Math.floor((milliseconds % 3600000) / 60000);
        
        return `${horas}h ${minutos}min restantes`;
    },
    
    // Renderiza notificações na página
    renderNotificacoes() {
        console.log('🔄 Renderizando notificações na página...');
        console.log(`📊 Total de notificações: ${this.notificacoes.length}`);
        
        // Busca o container dentro da página de notificações
        const page = document.getElementById('notificacoes');
        if (!page) {
            console.warn('⚠️ Página de notificações não encontrada, tentando novamente...');
            setTimeout(() => this.renderNotificacoes(), 500);
            return;
        }
        
        const container = page.querySelector('.notifications-container');
        const emptyState = page.querySelector('.notifications-empty');
        
        if (!container) {
            console.error('❌ Container de notificações não encontrado!');
            setTimeout(() => this.renderNotificacoes(), 500);
            return;
        }
        
        console.log(`✅ Container encontrado, renderizando ${this.notificacoes.length} notificações...`);
        
        if (this.notificacoes.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        let html = '';
        this.notificacoes.forEach(notif => {
            const iconClass = this.getIconClass(notif.type);
            const colorClass = `notif-${notif.type}`;
            const readClass = notif.read ? 'notification-read' : '';
            
            // Calcula timer restante se necessário
            let timerRestante = notif.timerRestante;
            if (notif.action === 'apagar' && !timerRestante) {
                // Recalcula timer
                this.atualizarTimersNotificacoes();
                const notifAtualizada = this.notificacoes.find(n => n.id === notif.id);
                timerRestante = notifAtualizada ? notifAtualizada.timerRestante : null;
            }
            
            // Usa a mesma estrutura do index principal
            html += `
                <div class="notification-item ${colorClass} ${readClass}" data-id="${notif.id}" data-action="${notif.action || ''}" data-pedido-id="${notif.pedidoId || ''}">
                    <div class="notification-left">
                        <div class="notification-icon ${notif.type}">
                            <i class="${iconClass}"></i>
                        </div>
                    </div>
                    
                    <div class="notification-middle">
                        <h3 class="notification-title">${notif.title}</h3>
                        <p class="notification-message">${notif.message}</p>
                        ${timerRestante && timerRestante > 0 ? `
                            <div class="notification-timer" id="timer-${notif.id}" style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(239, 68, 68, 0.1); border-radius: 6px; border-left: 3px solid #ef4444; display: inline-block;">
                                <i class="fas fa-clock"></i> 
                                <strong>Cancelamento automático em:</strong> <span class="timer-text">${this.formatarTimerCancelamento(timerRestante)}</span>
                            </div>
                        ` : ''}
                        <span class="notification-time">
                            <i class="fas fa-clock"></i> ${this.formatarTempoRelativo(notif.time)}
                        </span>
                    </div>

                    <div class="notification-right">
                        ${!notif.read ? `
                            <button class="notif-action-icon" onclick="event.stopPropagation(); ClienteNotificacoes.marcarComoLida('${notif.id}')" title="Marcar como lido">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        <button class="notif-action-icon notif-delete" onclick="event.stopPropagation(); ClienteNotificacoes.removerNotificacao('${notif.id}')" title="Remover">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="notification-dot" ${notif.read ? 'style="background: transparent;"' : ''}></div>
                    </div>
                </div>
            `;
        });
        
        // Marca o container para evitar que seja limpo
        container.setAttribute('data-cliente-rendered', 'true');
        
        console.log('📝 HTML gerado:', html.substring(0, 300) + '...');
        
        // Limpa o container e insere o HTML diretamente
        container.innerHTML = html;
        
        // Força o display do container
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        container.style.gap = '1rem';
        
        // Esconde o empty state se houver notificações
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Verifica imediatamente após inserção
        const items = container.querySelectorAll('.notification-item');
        console.log(`📊 Notificações inseridas: ${items.length}`);
        
        if (items.length === 0 && this.notificacoes.length > 0) {
            console.error('❌ ERRO: HTML inserido mas items não encontrados!');
            console.error('Container HTML length:', container.innerHTML.length);
            console.error('Container HTML preview:', container.innerHTML.substring(0, 500));
            
            // Tenta inserir novamente
            setTimeout(() => {
                container.innerHTML = html;
                const itemsRetry = container.querySelectorAll('.notification-item');
                console.log(`🔄 Retry: ${itemsRetry.length} items após nova inserção`);
            }, 100);
        }
        
        // Força display nos items imediatamente
        setTimeout(() => {
            const itemsAfter = container.querySelectorAll('.notification-item');
            itemsAfter.forEach(item => {
                item.style.display = 'flex';
                item.style.visibility = 'visible';
                item.style.opacity = '1';
            });
            
            console.log(`✅ Verificação final: ${itemsAfter.length} notificações no DOM`);
            
            if (itemsAfter.length === 0 && this.notificacoes.length > 0) {
                console.error('❌ PROBLEMA CRÍTICO: Notificações ainda não aparecem!');
                console.error('Container:', container);
                console.error('Container display:', window.getComputedStyle(container).display);
                console.error('Container visibility:', window.getComputedStyle(container).visibility);
                console.error('Container innerHTML length:', container.innerHTML.length);
                console.error('Container innerHTML:', container.innerHTML.substring(0, 1000));
                
                // Última tentativa: insere HTML novamente
                container.innerHTML = html;
                const itemsFinal = container.querySelectorAll('.notification-item');
                console.log(`🔄 Última tentativa: ${itemsFinal.length} items após nova inserção`);
            } else if (itemsAfter.length > 0) {
                console.log(`✅ SUCESSO! ${itemsAfter.length} notificações renderizadas e visíveis!`);
                console.log('Primeiro item:', itemsAfter[0]);
            }
        }, 500);
        
        console.log(`✅ ${this.notificacoes.length} notificações renderizadas na página`);
        
        // Atualiza badge
        const naoLidas = this.notificacoes.filter(n => !n.read).length;
        const headerBadges = document.querySelectorAll('.notification-count');
        headerBadges.forEach(badge => {
            badge.textContent = naoLidas;
            badge.style.display = naoLidas > 0 ? 'flex' : 'none';
        });
        const sidebarBadges = document.querySelectorAll('.notification-badge');
        sidebarBadges.forEach(badge => {
            badge.textContent = naoLidas;
            badge.style.display = naoLidas > 0 ? 'flex' : 'none';
        });
        
        // Inicia atualização de timer em tempo real
        this.iniciarAtualizacaoTimer();
        
        // Re-inicializa eventos dos botões da página (podem ter sido perdidos ao recarregar)
        this.inicializarEventosPagina();
        
        // Log final para debug
        console.log('✅ Renderização completa da página de notificações');
    },
    
    // Inicializa eventos apenas da página (não duplica eventos globais)
    inicializarEventosPagina() {
        // Botões da página
        const btnMarcar = document.getElementById('btnMarcarTodoLido');
        const btnLimpar = document.getElementById('btnLimparTudo');
        
        if (btnMarcar && !btnMarcar.hasAttribute('data-listener-cliente')) {
            btnMarcar.setAttribute('data-listener-cliente', 'true');
            btnMarcar.addEventListener('click', () => this.marcarTodasComoLidas());
        }
        
        if (btnLimpar && !btnLimpar.hasAttribute('data-listener-cliente')) {
            btnLimpar.setAttribute('data-listener-cliente', 'true');
            btnLimpar.addEventListener('click', () => this.limparTodas());
        }
    },
    
    // Inicia atualização do timer em tempo real
    iniciarAtualizacaoTimer() {
        // Limpa intervalo anterior se existir
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Atualiza a cada minuto
        this.timerInterval = setInterval(() => {
            const timerElements = document.querySelectorAll('.notification-timer .timer-text');
            timerElements.forEach(el => {
                const notifId = el.closest('.notification-card').getAttribute('data-id');
                const notif = this.notificacoes.find(n => n.id === notifId);
                if (notif && notif.timerRestante) {
                    notif.timerRestante -= 60000; // Subtrai 1 minuto
                    if (notif.timerRestante > 0) {
                        el.textContent = this.formatarTimerCancelamento(notif.timerRestante);
                    } else {
                        el.textContent = 'Tempo esgotado';
                    }
                }
            });
        }, 60000); // Atualiza a cada minuto
    },
    
    // Obtém classe do ícone (mesmo formato do index principal)
    getIconClass(type) {
        const icons = {
            'warning': 'fas fa-exclamation-circle',
            'success': 'fas fa-check-circle',
            'error': 'fas fa-times-circle',
            'info': 'fas fa-info-circle'
        };
        return icons[type] || icons['info'];
    },
    
    // Executa ação da notificação
    executarAcao(notifId) {
        const notif = this.notificacoes.find(n => n.id === notifId);
        if (!notif) return;
        
        // Marca como lida
        notif.read = true;
        this.renderNotificacoes();
        
        // Função auxiliar para navegar
        const navegarPara = (page) => {
            // Tenta usar BeiraMarNavigation primeiro
            if (window.BeiraMarNavigation && window.BeiraMarNavigation.navigateToPage) {
                window.BeiraMarNavigation.navigateToPage(page);
            } else if (window.navigateToPage) {
                // Fallback para função global
                window.navigateToPage(page);
            } else {
                // Último recurso: navegação manual
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                const targetPage = document.getElementById(page);
                if (targetPage) {
                    targetPage.classList.add('active');
                }
            }
        };
        
        // Executa ação
        if (notif.action === 'avaliar') {
            // Navega para página de compras e abre modal de avaliação
            navegarPara('estoque');
            setTimeout(() => {
                if (window.ClienteCompras && window.ClienteCompras.abrirModalAAvaliar) {
                    window.ClienteCompras.abrirModalAAvaliar();
                }
            }, 500);
        } else if (notif.action === 'acaminho') {
            // Navega para página de compras e abre modal a caminho
            navegarPara('estoque');
            setTimeout(() => {
                if (window.ClienteCompras && window.ClienteCompras.abrirModalACaminho) {
                    window.ClienteCompras.abrirModalACaminho();
                }
            }, 500);
        } else if (notif.action === 'apagar') {
            // Navega para página de compras e abre modal a pagar
            navegarPara('estoque');
            setTimeout(() => {
                if (window.ClienteCompras && window.ClienteCompras.abrirModalAPagar) {
                    window.ClienteCompras.abrirModalAPagar();
                }
            }, 500);
        }
    },
    
    // Marca notificação como lida
    marcarComoLida(notifId) {
        const notif = this.notificacoes.find(n => n.id === notifId);
        if (notif) {
            notif.read = true;
            this.renderNotificacoes();
            this.atualizarBadge();
            // Salva após modificar
            this.salvarNotificacoes();
        }
    },
    
    // Remove notificação
    removerNotificacao(notifId) {
        this.notificacoes = this.notificacoes.filter(n => n.id !== notifId);
        this.renderNotificacoes();
        this.atualizarBadge();
        // Salva após remover
        this.salvarNotificacoes();
    },
    
    // Marca todas como lidas
    marcarTodasComoLidas() {
        this.notificacoes.forEach(n => n.read = true);
        this.renderNotificacoes();
        this.atualizarBadge();
        // Salva após modificar
        this.salvarNotificacoes();
    },
    
    // Limpa todas as notificações
    limparTodas() {
        if (window.BeiraMarModais && window.BeiraMarModais.showConfirm) {
            window.BeiraMarModais.showConfirm({
                title: 'Limpar Notificações',
                message: 'Tem certeza que deseja limpar todas as notificações? Esta ação não pode ser desfeita.',
                confirmText: 'Limpar',
                cancelText: 'Cancelar',
                icon: 'trash-alt',
                iconColor: '#ef4444',
                onConfirm: () => {
                    this.notificacoes = [];
                    this.renderNotificacoes();
                    this.atualizarBadge();
                    // Salva após limpar
                    this.salvarNotificacoes();
                }
            });
        } else {
            if (confirm('Tem certeza que deseja limpar todas as notificações?')) {
                this.notificacoes = [];
                this.renderNotificacoes();
                this.atualizarBadge();
                // Salva após limpar
                this.salvarNotificacoes();
            }
        }
    },
    
    // Adiciona uma nova notificação
    adicionarNotificacao(title, message, type = 'info', action = null, pedidoId = null) {
        const novaNotificacao = {
            id: `notif-${Date.now()}`,
            type: type,
            title: title,
            message: message,
            time: new Date(),
            read: false
        };
        
        if (action) novaNotificacao.action = action;
        if (pedidoId) novaNotificacao.pedidoId = pedidoId;
        
        // Adiciona no início do array (mais recente primeiro)
        this.notificacoes.unshift(novaNotificacao);
        
        this.renderNotificacoes();
        this.renderDropdownNotifications();
        this.atualizarBadge();
        // Salva após adicionar
        this.salvarNotificacoes();
        
        console.log(`✅ Notificação adicionada: ${title}`);
    },
    
    // Atualiza badge
    atualizarBadge() {
        const naoLidas = this.notificacoes.filter(n => !n.read).length;
        
        console.log(`🔢 Atualizando badges: ${naoLidas} notificações não lidas`);
        
        // Atualiza badge do header
        const headerBadges = document.querySelectorAll('.notification-count');
        headerBadges.forEach(badge => {
            badge.textContent = naoLidas;
            badge.style.display = naoLidas > 0 ? 'flex' : 'none';
        });
        
        // Atualiza badge do sidebar
        const sidebarBadges = document.querySelectorAll('.notification-badge');
        sidebarBadges.forEach(badge => {
            badge.textContent = naoLidas;
            badge.style.display = naoLidas > 0 ? 'flex' : 'none';
        });
        
        // Atualiza dropdown também (apenas se necessário)
        const dropdown = document.querySelector('.notifications-dropdown');
        if (dropdown && dropdown.classList.contains('show')) {
            this.renderDropdownNotifications();
        }
    },
    
    // Renderiza notificações no dropdown do header
    renderDropdownNotifications() {
        const listContainer = document.querySelector('.notifications-list');
        if (!listContainer) {
            console.warn('⚠️ Container de notificações do dropdown não encontrado');
            // Tenta encontrar por ID também
            const dropdown = document.getElementById('dropdownSininho');
            if (dropdown) {
                const foundContainer = dropdown.querySelector('.notifications-list');
                if (foundContainer) {
                    return this.renderDropdownInContainer(foundContainer);
                }
            }
            return;
        }
        
        return this.renderDropdownInContainer(listContainer);
    },
    
    // Renderiza no container específico
    renderDropdownInContainer(listContainer) {
        if (this.notificacoes.length === 0) {
            listContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #999; font-size: 0.9rem;">
                    <i class="fas fa-bell-slash" style="font-size: 2rem; margin-bottom: 10px; display: block; color: #cbd5e1;"></i>
                    <p>Sem notificações</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.notificacoes.slice(0, 5).forEach(n => {
            const iconClass = this.getIconClass(n.type);
            const readClass = n.read ? 'notification-read' : '';
            
            html += `
                <div class="notification-item-dropdown ${n.type} ${readClass}" onclick="ClienteNotificacoes.executarAcao('${n.id}'); event.stopPropagation();">
                    <div class="notification-item-icon ${n.type}">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="notification-item-content">
                        <p class="notification-item-title">${n.title}</p>
                        <p class="notification-item-text">${n.message}</p>
                        <span class="notification-item-time">${this.formatarTempoRelativo(n.time)}</span>
                    </div>
                </div>
            `;
        });
        listContainer.innerHTML = html;
    },
    
    // Inicializa eventos
    inicializarEventos() {
        // Clique no card inteiro também executa ação
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.notification-card[data-action]');
            if (card && !e.target.closest('.notification-card-close') && !e.target.closest('button')) {
                const notifId = card.getAttribute('data-id');
                this.executarAcao(notifId);
            }
        });
        
        // Botões da página
        const btnMarcar = document.getElementById('btnMarcarTodoLido');
        const btnLimpar = document.getElementById('btnLimparTudo');
        
        if (btnMarcar) {
            btnMarcar.addEventListener('click', () => this.marcarTodasComoLidas());
        }
        
        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => this.limparTodas());
        }
        
        // Atualiza dropdown quando o botão de notificação for clicado
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                setTimeout(() => {
                    this.renderDropdownNotifications();
                }, 100);
            });
        }
    }
};

// Função para verificar se está na tela do cliente
function isClientePage() {
    return window.location.pathname.includes('cliente.html') || 
           document.querySelector('.cliente-compras-container') ||
           sessionStorage.getItem('userType') === 'cliente';
}

// Sobrescreve o sistema de notificações padrão quando estiver na página do cliente
function substituirSistemaNotificacoes() {
    if (!isClientePage()) return;
    
    // Sobrescreve as funções do BeiraMarNotificacoes para usar ClienteNotificacoes
    if (window.BeiraMarNotificacoes) {
        const originalRender = window.BeiraMarNotificacoes.renderDropdownNotifications;
        window.BeiraMarNotificacoes.renderDropdownNotifications = function() {
            if (window.ClienteNotificacoes) {
                window.ClienteNotificacoes.renderDropdownNotifications();
            } else {
                originalRender.call(this);
            }
        };
        
        const originalUpdateBadge = window.BeiraMarNotificacoes.updateBadge;
        window.BeiraMarNotificacoes.updateBadge = function() {
            if (window.ClienteNotificacoes) {
                window.ClienteNotificacoes.atualizarBadge();
            } else {
                originalUpdateBadge.call(this);
            }
        };
    }
}

// Função de inicialização única para evitar múltiplas chamadas
let inicializacaoEmAndamento = false;

function inicializarNotificacoesCliente() {
    if (!isClientePage()) return;
    if (inicializacaoEmAndamento) return;
    if (window.ClienteNotificacoes && window.ClienteNotificacoes.inicializado) {
        // Se já inicializado, apenas atualiza renderização
        if (window.ClienteNotificacoes.renderNotificacoes) {
            window.ClienteNotificacoes.renderNotificacoes();
        }
        if (window.ClienteNotificacoes.renderDropdownNotifications) {
            window.ClienteNotificacoes.renderDropdownNotifications();
        }
        return;
    }
    
    inicializacaoEmAndamento = true;
    substituirSistemaNotificacoes();
    ClienteNotificacoes.init();
    inicializacaoEmAndamento = false;
}

// Inicializa quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        inicializarNotificacoesCliente();
    }, 800);
});

// Tenta inicializar quando o script carregar (caso a página já esteja carregada)
setTimeout(() => {
    inicializarNotificacoesCliente();
}, 1500);

// Exporta globalmente
window.ClienteNotificacoes = ClienteNotificacoes;


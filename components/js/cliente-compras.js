// =========================================
// MINHAS COMPRAS - GERENCIAMENTO DE PEDIDOS
// =========================================

const ClienteCompras = {
    notificacaoAdicionada: false, // Flag para controlar se notificação já foi adicionada
    inicializado: false,
    
    // Função para obter email do usuário atual
    getUserEmail() {
        return sessionStorage.getItem('userEmail') || '';
    },
    
    // Função para carregar compras do localStorage
    carregarCompras() {
        const email = this.getUserEmail();
        
        // Só tenta migrar dados antigos se for a Fernanda
        if (window.MigracaoDados && email.toLowerCase() === 'fernanda12@gmail.com') {
            window.MigracaoDados.migrarCompras(email);
        }
        
        // IMPORTANTE: Sempre usa chave com email para evitar vazamento de dados
        const chave = email ? `compras_${email}` : `compras_anonimo_${Date.now()}`;
        
        try {
            const saved = localStorage.getItem(chave);
            if (saved) {
                const comprasCarregadas = JSON.parse(saved);
                // Converte dataCriacao de volta para número se for string
                this.comprasCliente = comprasCarregadas.map(c => ({
                    ...c,
                    dataCriacao: typeof c.dataCriacao === 'string' ? new Date(c.dataCriacao).getTime() : c.dataCriacao
                }));
                console.log(`✅ Compras carregadas para ${email}: ${this.comprasCliente.length} pedidos`);
            } else {
                // Se for a Fernanda e não tiver dados, usa as compras padrão
                if (email.toLowerCase() === 'fernanda12@gmail.com' && window.MigracaoDados) {
                    const comprasPadrao = window.MigracaoDados.getComprasPadraoFernanda();
                    this.comprasCliente = comprasPadrao;
                    this.salvarCompras();
                    console.log(`✅ Compras padrão da Fernanda restauradas: ${this.comprasCliente.length} pedidos`);
                } else {
                    // Novo usuário SEMPRE começa com array vazio
                    this.comprasCliente = [];
                    // Salva imediatamente para criar a chave no localStorage
                    this.salvarCompras();
                    console.log(`✅ Novo usuário ${email || 'sem email'}: compras inicializadas vazias`);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar compras:', error);
            this.comprasCliente = [];
        }
    },
    
    // Função para salvar compras no localStorage
    salvarCompras() {
        const email = this.getUserEmail();
        const chave = email ? `compras_${email}` : 'compras';
        
        try {
            localStorage.setItem(chave, JSON.stringify(this.comprasCliente));
            console.log(`✅ Compras salvas para ${email}: ${this.comprasCliente.length} pedidos`);
        } catch (error) {
            console.error('Erro ao salvar compras:', error);
        }
    },
    
    // Dados de compras do cliente (será carregado do localStorage ou vazio para novos usuários)
    comprasCliente: [],
    
    // Obtém compras por status
    getComprasPorStatus(status) {
        return this.comprasCliente.filter(c => c.status === status);
    },
    
    // Conta compras por status
    contarComprasPorStatus(status) {
        return this.getComprasPorStatus(status).length;
    },
    
    // Formata preço
    formatarPreco(preco) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco || 0);
    },
    
    // Calcula timer restante até cancelamento
    calcularTimerRestante(dataCriacao) {
        const agora = Date.now();
        const tempoRestante = (24 * 60 * 60 * 1000) - (agora - dataCriacao);
        
        if (tempoRestante <= 0) {
            return 'Cancelado';
        }
        
        const horas = Math.floor(tempoRestante / 3600000);
        const minutos = Math.floor((tempoRestante % 3600000) / 60000);
        
        return `${horas}h ${minutos}min`;
    },
    
    // Renderiza modal de compras pendentes
    renderModalAPagar() {
        const compras = this.getComprasPorStatus('a-pagar');
        
        if (compras.length === 0) {
            return `
                <div class="modal-compras-vazio">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhuma compra pendente de pagamento</p>
                </div>
            `;
        }
        
        return `
            <div class="modal-compras-lista">
                ${compras.map(compra => `
                    <div class="compra-item-card">
                        <div class="compra-header">
                            <div class="compra-info-top">
                                <span class="compra-id">Pedido ${compra.id}</span>
                                <span class="compra-data">${compra.data}</span>
                            </div>
                            <div class="compra-valor-total">
                                ${this.formatarPreco(compra.valorTotal)}
                            </div>
                        </div>
                        
                        <div class="compra-produtos">
                            <h4>Produtos:</h4>
                            <ul class="lista-produtos">
                                ${compra.produtos.map(prod => `
                                    <li class="produto-item">
                                        <span class="produto-nome">${prod.nome}</span>
                                        <span class="produto-qtd">${prod.quantidade} kg</span>
                                        <span class="produto-preco">${this.formatarPreco(prod.total)}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="compra-footer">
                            <div class="compra-metodo">
                                <i class="fas fa-credit-card"></i>
                                <span>${compra.metodoPagamento}</span>
                                ${compra.dataCriacao ? `
                                    <div class="compra-timer" style="margin-left: 1rem; padding: 0.4rem 0.8rem; background: rgba(239, 68, 68, 0.1); border-radius: 6px; border-left: 3px solid #ef4444; display: inline-flex; align-items: center; gap: 0.5rem;">
                                        <i class="fas fa-clock" style="color: #ef4444;"></i>
                                        <span style="font-size: 0.85rem; font-weight: 600; color: #dc2626;" id="timer-${compra.id}">
                                            ${this.calcularTimerRestante(compra.dataCriacao)}
                                        </span>
                                    </div>
                                ` : ''}
                            </div>
                            <button class="btn-pagar-agora" onclick="ClienteCompras.pagarPedido('${compra.id}')">
                                <i class="fas fa-money-bill-wave"></i> Pagar Agora
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // Renderiza modal de compras em preparação
    renderModalPreparando() {
        const compras = this.getComprasPorStatus('preparando');
        
        if (compras.length === 0) {
            return `
                <div class="modal-compras-vazio">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhum pedido em preparação no momento</p>
                </div>
            `;
        }
        
        return `
            <div class="modal-compras-lista">
                ${compras.map(compra => `
                    <div class="compra-item-card preparando-card">
                        <div class="compra-header">
                            <div class="compra-info-top">
                                <span class="compra-id">Pedido ${compra.id}</span>
                                <span class="compra-data">${compra.data}</span>
                            </div>
                            <div class="compra-valor-total">
                                ${this.formatarPreco(compra.valorTotal)}
                            </div>
                        </div>
                        
                        <div class="compra-produtos">
                            <h4>Produtos:</h4>
                            <ul class="lista-produtos">
                                ${compra.produtos.map(prod => `
                                    <li class="produto-item">
                                        <span class="produto-nome">${prod.nome}</span>
                                        <span class="produto-qtd">${prod.quantidade} kg</span>
                                        <span class="produto-preco">${this.formatarPreco(prod.total)}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="preparando-status">
                            <div class="status-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <span class="status-label">Localização:</span>
                                    <span class="status-value">${compra.localizacao || 'Não especificado'}</span>
                                </div>
                            </div>
                            <div class="status-item">
                                <i class="fas fa-tasks"></i>
                                <div>
                                    <span class="status-label">Etapa Atual:</span>
                                    <span class="status-value">${compra.etapaAtual || 'Em preparação'}</span>
                                </div>
                            </div>
                            <div class="status-item">
                                <i class="fas fa-clock"></i>
                                <div>
                                    <span class="status-label">Tempo Estimado:</span>
                                    <span class="status-value">${compra.tempoEstimado || 'A calcular'}</span>
                                </div>
                            </div>
                            <div class="status-item">
                                <i class="fas fa-user"></i>
                                <div>
                                    <span class="status-label">Responsável:</span>
                                    <span class="status-value">${compra.responsavel || 'Não atribuído'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    // Abre modal de "A Pagar"
    abrirModalAPagar() {
        const modal = document.getElementById('modalAPagar');
        if (!modal) {
            console.error('Modal não encontrado');
            return;
        }
        
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = this.renderModalAPagar();
        }
        
        // Atualiza contador no card
        const count = this.contarComprasPorStatus('a-pagar');
        const cardCount = document.querySelector('[data-status="a-pagar"] .card-count');
        if (cardCount) {
            cardCount.textContent = count;
        }
        
        // Abre modal
        if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
            window.BeiraMarModais.openModal('modalAPagar');
        } else {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    },
    
    // Renderiza modal de compras a caminho com stepper
    renderModalACaminho() {
        const compras = this.getComprasPorStatus('a-caminho');
        
        if (compras.length === 0) {
            return `
                <div class="modal-compras-vazio">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhum pedido a caminho no momento</p>
                </div>
            `;
        }
        
        return compras.map(compra => {
            const etapas = compra.etapasEntrega || [];
            const etapaAtivaIndex = etapas.findIndex(e => e.status === 'active');
            
            return `
                <div class="pedido-a-caminho-card">
                    <div class="pedido-header-info">
                        <div class="pedido-info-top">
                            <span class="pedido-id">Pedido ${compra.id}</span>
                            <span class="pedido-data">${compra.data}</span>
                        </div>
                        <div class="pedido-valor-total">
                            ${this.formatarPreco(compra.valorTotal)}
                        </div>
                    </div>
                    
                    <div class="pedido-produtos-resumo">
                        <h4>Produtos:</h4>
                        <ul class="lista-produtos-resumo">
                            ${compra.produtos.map(prod => `
                                <li>
                                    <span>${prod.nome}</span>
                                    <span>${prod.quantidade} kg - ${this.formatarPreco(prod.total)}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="pedido-info-entrega">
                        <div class="info-item">
                            <i class="fas fa-truck"></i>
                            <div>
                                <span class="info-label">Transportadora:</span>
                                <span class="info-value">${compra.transportadora || 'Não especificado'}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-barcode"></i>
                            <div>
                                <span class="info-label">Código de Rastreamento:</span>
                                <span class="info-value">${compra.codigoRastreamento || 'N/A'}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <span class="info-label">Endereço de Entrega:</span>
                                <span class="info-value">${compra.enderecoEntrega || 'Não especificado'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stepper-box">
                        ${etapas.map((etapa, index) => {
                            const isLast = index === etapas.length - 1;
                            const statusClass = etapa.status === 'completed' ? 'stepper-completed' : 
                                              etapa.status === 'active' ? 'stepper-active' : 
                                              'stepper-pending';
                            
                            return `
                                <div class="stepper-step ${statusClass}">
                                    <div class="stepper-circle">
                                        ${etapa.status === 'completed' ? `
                                            <svg viewBox="0 0 16 16" class="bi bi-check-lg" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"></path>
                                            </svg>
                                        ` : index + 1}
                                    </div>
                                    ${!isLast ? '<div class="stepper-line"></div>' : ''}
                                    <div class="stepper-content">
                                        <div class="stepper-title">${etapa.titulo}</div>
                                        <div class="stepper-status">${
                                            etapa.status === 'completed' ? 'Concluído' : 
                                            etapa.status === 'active' ? 'Em Andamento' : 
                                            'Pendente'
                                        }</div>
                                        <div class="stepper-time">${etapa.data}</div>
                                        ${etapa.descricao ? `<div class="stepper-description">${etapa.descricao}</div>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Abre modal de "Preparando"
    abrirModalPreparando() {
        const modal = document.getElementById('modalPreparando');
        if (!modal) {
            console.error('Modal não encontrado');
            return;
        }
        
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = this.renderModalPreparando();
        }
        
        // Atualiza contador no card
        const count = this.contarComprasPorStatus('preparando');
        const cardCount = document.querySelector('[data-status="preparando"] .card-count');
        if (cardCount) {
            cardCount.textContent = count;
        }
        
        // Abre modal
        if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
            window.BeiraMarModais.openModal('modalPreparando');
        } else {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    },
    
    // Abre modal de "A Caminho"
    abrirModalACaminho() {
        const modal = document.getElementById('modalACaminho');
        if (!modal) {
            console.error('Modal não encontrado');
            return;
        }
        
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = this.renderModalACaminho();
        }
        
        // Atualiza contador no card
        const count = this.contarComprasPorStatus('a-caminho');
        const cardCount = document.querySelector('[data-status="a-caminho"] .card-count');
        if (cardCount) {
            cardCount.textContent = count;
        }
        
        // Abre modal
        if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
            window.BeiraMarModais.openModal('modalACaminho');
        } else {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    },
    
    // Renderiza modal de compras a avaliar
    renderModalAAvaliar() {
        const compras = this.getComprasPorStatus('a-avaliar');
        
        if (compras.length === 0) {
            return `
                <div class="modal-compras-vazio">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhum pedido aguardando avaliação</p>
                </div>
            `;
        }
        
        return compras.map(compra => {
            const uniqueId = compra.id.replace('-', '');
            
            return `
                <div class="pedido-avaliar-card" data-pedido-id="${compra.id}">
                    <div class="pedido-header-info">
                        <div class="pedido-info-top">
                            <span class="pedido-id">Pedido ${compra.id}</span>
                            <span class="pedido-data">Entregue em ${compra.dataEntrega || compra.data}</span>
                        </div>
                        <div class="pedido-valor-total">
                            ${this.formatarPreco(compra.valorTotal)}
                        </div>
                    </div>
                    
                    <div class="avaliacao-section">
                        <h3>Avalie sua experiência</h3>
                        <p class="avaliacao-subtitle">Como foi sua experiência com este pedido?</p>
                        
                        <div class="radio" id="rating-${uniqueId}">
                            <input value="1" name="rating-${uniqueId}" type="radio" id="rating-${uniqueId}-1" />
                            <label title="1 estrela" for="rating-${uniqueId}-1">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                                </svg>
                            </label>
                            
                            <input value="2" name="rating-${uniqueId}" type="radio" id="rating-${uniqueId}-2" />
                            <label title="2 estrelas" for="rating-${uniqueId}-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                                </svg>
                            </label>
                            
                            <input value="3" name="rating-${uniqueId}" type="radio" id="rating-${uniqueId}-3" />
                            <label title="3 estrelas" for="rating-${uniqueId}-3">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                                </svg>
                            </label>
                            
                            <input value="4" name="rating-${uniqueId}" type="radio" id="rating-${uniqueId}-4" />
                            <label title="4 estrelas" for="rating-${uniqueId}-4">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                                </svg>
                            </label>
                            
                            <input value="5" name="rating-${uniqueId}" type="radio" id="rating-${uniqueId}-5" />
                            <label title="5 estrelas" for="rating-${uniqueId}-5">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                                </svg>
                            </label>
                        </div>
                        
                        <div class="comentario-section">
                            <label for="comentario-${uniqueId}" class="comentario-label">Deixe um comentário (opcional)</label>
                            <textarea id="comentario-${uniqueId}" class="comentario-textarea" placeholder="Conte-nos sobre sua experiência..." rows="4"></textarea>
                        </div>
                        
                        <button class="btn-enviar-avaliacao" onclick="ClienteCompras.enviarAvaliacao('${compra.id}', '${uniqueId}')">
                            <i class="fas fa-paper-plane"></i> Enviar Avaliação
                        </button>
                    </div>
                    
                    <div class="pedido-acoes">
                        <button class="btn-acao-secundaria" onclick="ClienteCompras.verDetalhesPedido('${compra.id}')">
                            <i class="fas fa-info-circle"></i> Ver Detalhamento
                        </button>
                        <button class="btn-acao-primaria" onclick="ClienteCompras.comprarNovamente('${compra.id}')">
                            <i class="fas fa-redo"></i> Comprar Novamente
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Renderiza modal de detalhamento do pedido
    renderModalDetalhes(pedidoId) {
        const compra = this.comprasCliente.find(c => c.id === pedidoId);
        if (!compra) return '';
        
        return `
            <div class="detalhes-pedido-completo">
                <div class="pedido-header-info">
                    <div class="pedido-info-top">
                        <span class="pedido-id">Pedido ${compra.id}</span>
                        <span class="pedido-data">${compra.data}</span>
                    </div>
                    <div class="pedido-valor-total">
                        ${this.formatarPreco(compra.valorTotal)}
                    </div>
                </div>
                
                <div class="pedido-produtos-resumo">
                    <h4>Produtos:</h4>
                    <ul class="lista-produtos-resumo">
                        ${compra.produtos.map(prod => `
                            <li>
                                <span>${prod.nome}</span>
                                <span>${prod.quantidade} kg - ${this.formatarPreco(prod.total)}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="pedido-info-entrega">
                    <div class="info-item">
                        <i class="fas fa-credit-card"></i>
                        <div>
                            <span class="info-label">Método de Pagamento:</span>
                            <span class="info-value">${compra.metodoPagamento || 'Não especificado'}</span>
                        </div>
                    </div>
                    ${compra.transportadora ? `
                        <div class="info-item">
                            <i class="fas fa-truck"></i>
                            <div>
                                <span class="info-label">Transportadora:</span>
                                <span class="info-value">${compra.transportadora}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${compra.codigoRastreamento ? `
                        <div class="info-item">
                            <i class="fas fa-barcode"></i>
                            <div>
                                <span class="info-label">Código de Rastreamento:</span>
                                <span class="info-value">${compra.codigoRastreamento}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${compra.enderecoEntrega ? `
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <span class="info-label">Endereço de Entrega:</span>
                                <span class="info-value">${compra.enderecoEntrega}</span>
                            </div>
                        </div>
                    ` : ''}
                    ${compra.dataEntrega ? `
                        <div class="info-item">
                            <i class="fas fa-calendar-check"></i>
                            <div>
                                <span class="info-label">Data de Entrega:</span>
                                <span class="info-value">${compra.dataEntrega}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                ${compra.etapasEntregaCompleta && compra.etapasEntregaCompleta.length > 0 ? `
                    <div class="stepper-box">
                        <h4 style="margin-bottom: 1.5rem; color: var(--text-primary);">Histórico de Entrega</h4>
                        ${compra.etapasEntregaCompleta.map((etapa, index) => {
                            const isLast = index === compra.etapasEntregaCompleta.length - 1;
                            const statusClass = etapa.status === 'completed' ? 'stepper-completed' : 
                                              etapa.status === 'active' ? 'stepper-active' : 
                                              'stepper-pending';
                            
                            return `
                                <div class="stepper-step ${statusClass}">
                                    <div class="stepper-circle">
                                        ${etapa.status === 'completed' ? `
                                            <svg viewBox="0 0 16 16" class="bi bi-check-lg" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"></path>
                                            </svg>
                                        ` : index + 1}
                                    </div>
                                    ${!isLast ? '<div class="stepper-line"></div>' : ''}
                                    <div class="stepper-content">
                                        <div class="stepper-title">${etapa.titulo}</div>
                                        <div class="stepper-status">${
                                            etapa.status === 'completed' ? 'Concluído' : 
                                            etapa.status === 'active' ? 'Em Andamento' : 
                                            'Pendente'
                                        }</div>
                                        <div class="stepper-time">${etapa.data}</div>
                                        ${etapa.descricao ? `<div class="stepper-description">${etapa.descricao}</div>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    // Abre modal de "A Avaliar"
    abrirModalAAvaliar() {
        const modal = document.getElementById('modalAAvaliar');
        if (!modal) {
            console.error('Modal não encontrado');
            return;
        }
        
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = this.renderModalAAvaliar();
            
            // Inicializa sistema de arrastar nas estrelas
            setTimeout(() => {
                this.inicializarSistemaEstrelas();
            }, 100);
        }
        
        // Atualiza contador no card
        const count = this.contarComprasPorStatus('a-avaliar');
        const cardCount = document.querySelector('[data-status="a-avaliar"] .card-count');
        if (cardCount) {
            cardCount.textContent = count;
        }
        
        // Abre modal
        if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
            window.BeiraMarModais.openModal('modalAAvaliar');
        } else {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    },
    
    // Inicializa sistema de estrelas com arrastar
    inicializarSistemaEstrelas() {
        const radioGroups = document.querySelectorAll('.radio');
        
        radioGroups.forEach(radioGroup => {
            const labels = radioGroup.querySelectorAll('label');
            const inputs = radioGroup.querySelectorAll('input[type="radio"]');
            let isDragging = false;
            let currentRating = 0;
            
            // Evento de mouse down
            labels.forEach((label, index) => {
                label.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    isDragging = true;
                    currentRating = index + 1;
                    this.selecionarEstrela(radioGroup, currentRating);
                });
                
                label.addEventListener('mouseenter', () => {
                    if (isDragging) {
                        currentRating = index + 1;
                        this.highlightEstrelas(radioGroup, currentRating);
                    } else {
                        this.highlightEstrelas(radioGroup, index + 1);
                    }
                });
                
                label.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentRating = index + 1;
                    this.selecionarEstrela(radioGroup, currentRating);
                });
            });
            
            // Eventos de mouse up e mouse leave para finalizar arrastar
            radioGroup.addEventListener('mouseleave', () => {
                if (isDragging) {
                    isDragging = false;
                    const checkedInput = radioGroup.querySelector('input:checked');
                    if (checkedInput) {
                        const checkedValue = parseInt(checkedInput.value);
                        this.highlightEstrelas(radioGroup, checkedValue);
                    } else {
                        this.resetEstrelas(radioGroup);
                    }
                }
            });
            
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    const checkedInput = radioGroup.querySelector('input:checked');
                    if (checkedInput) {
                        const checkedValue = parseInt(checkedInput.value);
                        this.highlightEstrelas(radioGroup, checkedValue);
                    }
                }
            });
        });
    },
    
    // Seleciona estrela
    selecionarEstrela(radioGroup, rating) {
        const input = radioGroup.querySelector(`input[value="${rating}"]`);
        if (input) {
            input.checked = true;
            this.highlightEstrelas(radioGroup, rating);
        }
    },
    
    // Destaca estrelas até a avaliação
    highlightEstrelas(radioGroup, rating) {
        const labels = radioGroup.querySelectorAll('label');
        labels.forEach((label, index) => {
            const svg = label.querySelector('svg');
            if (index < rating) {
                svg.style.fill = '#ff9e0b';
            } else {
                svg.style.fill = '#666';
            }
        });
    },
    
    // Reseta estrelas
    resetEstrelas(radioGroup) {
        const labels = radioGroup.querySelectorAll('label');
        labels.forEach(label => {
            const svg = label.querySelector('svg');
            svg.style.fill = '#666';
        });
    },
    
    // Ver detalhes do pedido
    verDetalhesPedido(pedidoId) {
        const modal = document.getElementById('modalDetalhesPedido');
        if (!modal) {
            console.error('Modal de detalhes não encontrado');
            return;
        }
        
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = this.renderModalDetalhes(pedidoId);
        }
        
        if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
            window.BeiraMarModais.openModal('modalDetalhesPedido');
        } else {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    },
    
    // Enviar avaliação
    enviarAvaliacao(pedidoId, uniqueId) {
        const ratingInput = document.querySelector(`input[name="rating-${uniqueId}"]:checked`);
        const comentario = document.getElementById(`comentario-${uniqueId}`).value.trim();
        
        if (!ratingInput) {
            alert('Por favor, selecione uma avaliação com as estrelas');
            return;
        }
        
        const rating = parseInt(ratingInput.value);
        
        // Aqui você pode salvar a avaliação
        console.log(`⭐ Avaliação enviada para pedido ${pedidoId}:`, { rating, comentario });
        
        // Remove o pedido da lista de "A Avaliar"
        const compra = this.comprasCliente.find(c => c.id === pedidoId);
        if (compra) {
            compra.status = 'avaliado';
            this.atualizarContadores();
            
            // Fecha modal e mostra mensagem
            if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                window.BeiraMarModais.closeModal('modalAAvaliar');
            }
            
            if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                window.BeiraMarUtils.showToast('Avaliação enviada com sucesso! Obrigado!', 'success');
            } else {
                alert('Avaliação enviada com sucesso! Obrigado!');
            }
        }
    },
    
    // Comprar novamente
    comprarNovamente(pedidoId) {
        const compra = this.comprasCliente.find(c => c.id === pedidoId);
        if (!compra) return;
        
        console.log(`🛒 Comprando novamente pedido ${pedidoId}`);
        
        // Aqui você pode implementar a lógica de adicionar produtos ao carrinho
        // Por enquanto, apenas mostra mensagem
        if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
            const produtosNome = compra.produtos.map(p => p.nome).join(', ');
            window.BeiraMarUtils.showToast(`Produtos adicionados ao carrinho: ${produtosNome}`, 'success');
        } else {
            alert('Produtos adicionados ao carrinho!');
        }
        
        // Redireciona para início para ver o carrinho
        if (window.BeiraMarNavigation && window.BeiraMarNavigation.navigateToPage) {
            window.BeiraMarNavigation.navigateToPage('dashboard');
        }
    },
    
    // Função para pagar pedido - abre modal de pagamento
    pagarPedido(pedidoId) {
        console.log(`💳 Abrindo modal de pagamento para pedido ${pedidoId}`);
        
        const compra = this.comprasCliente.find(c => c.id === pedidoId);
        if (!compra) {
            alert('Pedido não encontrado!');
            return;
        }
        
        // Fecha modal de "A Pagar" e abre modal de pagamento
        if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
            window.BeiraMarModais.closeModal('modalAPagar');
        }
        
        // Renderiza e abre modal de pagamento
        setTimeout(() => {
            this.renderModalPagamento(compra);
            if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
                window.BeiraMarModais.openModal('modalPagamento');
            }
        }, 300);
    },
    
    // Renderiza modal de pagamento
    renderModalPagamento(compra) {
        const modalBody = document.querySelector('#modalPagamento .pagamento-body');
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <!-- Resumo do Pedido -->
            <div class="payment-summary">
                <h3 class="payment-summary-title">Resumo do Pedido</h3>
                <div class="payment-summary-item">
                    <span>Pedido:</span>
                    <span>${compra.id}</span>
                </div>
                <div class="payment-summary-item">
                    <span>Itens:</span>
                    <span>${compra.produtos.length}</span>
                </div>
                <div class="payment-summary-total">
                    <span>Total:</span>
                    <span>${this.formatarPreco(compra.valorTotal)}</span>
                </div>
            </div>
            
            <!-- Métodos de Pagamento -->
            <div class="payment-methods-container">
                <p class="payment-method-title">Método de Pagamento</p>
                <p class="payment-method-note">
                    Este componente é feito usando <strong>pseudo-classe :has()</strong>
                </p>
                
                <!-- Google Pay -->
                <label class="payment-method-label" data-method="google">
                    <div class="payment-method-icon-container">
                        <svg class="payment-method-icon" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32 13.333l-4.177 9.333h-1.292l1.552-3.266-2.75-6.068h1.359l1.99 4.651h0.026l1.927-4.651zM14.646 16.219v3.781h-1.313v-9.333h3.474c0.828-0.021 1.63 0.266 2.25 0.807 0.615 0.505 0.953 1.219 0.943 1.974 0.010 0.766-0.339 1.5-0.943 1.979-0.604 0.531-1.354 0.792-2.25 0.792zM14.641 11.818v3.255h2.198c0.484 0.016 0.958-0.161 1.297-0.479 0.339-0.302 0.526-0.714 0.526-1.141 0-0.432-0.188-0.844-0.526-1.141-0.349-0.333-0.818-0.51-1.297-0.495zM22.63 13.333c0.833 0 1.495 0.234 1.979 0.698s0.724 1.099 0.724 1.906v3.859h-1.083v-0.87h-0.047c-0.469 0.714-1.089 1.073-1.865 1.073-0.667 0-1.219-0.203-1.667-0.615-0.438-0.385-0.682-0.948-0.672-1.531 0-0.646 0.234-1.161 0.708-1.547 0.469-0.38 1.099-0.573 1.885-0.573 0.672 0 1.224 0.13 1.656 0.385v-0.271c0.005-0.396-0.167-0.776-0.464-1.042-0.297-0.276-0.688-0.432-1.094-0.427-0.63 0-1.13 0.276-1.5 0.828l-0.995-0.646c0.547-0.818 1.359-1.229 2.432-1.229zM21.167 17.88c-0.005 0.302 0.135 0.583 0.375 0.766 0.25 0.203 0.563 0.313 0.88 0.307 0.474 0 0.932-0.198 1.271-0.547 0.359-0.333 0.563-0.802 0.563-1.292-0.354-0.292-0.844-0.438-1.474-0.438-0.464 0-0.844 0.115-1.151 0.344-0.307 0.234-0.464 0.516-0.464 0.859zM5.443 10.667c1.344-0.016 2.646 0.479 3.641 1.391l-1.552 1.521c-0.568-0.526-1.318-0.813-2.089-0.797-1.385 0.005-2.609 0.891-3.057 2.198-0.229 0.661-0.229 1.38 0 2.042 0.448 1.307 1.672 2.193 3.057 2.198 0.734 0 1.365-0.182 1.854-0.505 0.568-0.375 0.964-0.958 1.083-1.625h-2.938v-2.052h5.13c0.063 0.359 0.094 0.719 0.094 1.083 0 1.625-0.594 3-1.62 3.927-0.901 0.813-2.135 1.286-3.604 1.286-2.047 0.010-3.922-1.125-4.865-2.938-0.771-1.505-0.771-3.286 0-4.792 0.943-1.813 2.818-2.948 4.859-2.938z"></path>
                        </svg>
                        <p class="payment-method-label-name">Google Pay</p>
                    </div>
                    <input class="payment-method-input" type="radio" name="payment" value="google" data-method="google">
                </label>
                
                <!-- Apple Pay -->
                <label class="payment-method-label" data-method="apple">
                    <div class="payment-method-icon-container">
                        <svg class="payment-method-icon" fill="currentColor" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M116.9 158.5c-7.5 8.9-19.5 15.9-31.5 14.9-1.5-12 4.4-24.8 11.3-32.6 7.5-9.1 20.6-15.6 31.3-16.1 1.2 12.4-3.7 24.7-11.1 33.8m10.9 17.2c-17.4-1-32.3 9.9-40.5 9.9-8.4 0-21-9.4-34.8-9.1-17.9.3-34.5 10.4-43.6 26.5-18.8 32.3-4.9 80 13.3 106.3 8.9 13 19.5 27.3 33.5 26.8 13.3-.5 18.5-8.6 34.5-8.6 16.1 0 20.8 8.6 34.8 8.4 14.5-.3 23.6-13 32.5-26 10.1-14.8 14.3-29.1 14.5-29.9-.3-.3-28-10.9-28.3-42.9-.3-26.8 21.9-39.5 22.9-40.3-12.5-18.6-32-20.6-38.8-21.1m100.4-36.2v194.9h30.3v-66.6h41.9c38.3 0 65.1-26.3 65.1-64.3s-26.4-64-64.1-64h-73.2zm30.3 25.5h34.9c26.3 0 41.3 14 41.3 38.6s-15 38.8-41.4 38.8h-34.8V165zm162.2 170.9c19 0 36.6-9.6 44.6-24.9h.6v23.4h28v-97c0-28.1-22.5-46.3-57.1-46.3-32.1 0-55.9 18.4-56.8 43.6h27.3c2.3-12 13.4-19.9 28.6-19.9 18.5 0 28.9 8.6 28.9 24.5v10.8l-37.8 2.3c-35.1 2.1-54.1 16.5-54.1 41.5.1 25.2 19.7 42 47.8 42zm8.2-23.1c-16.1 0-26.4-7.8-26.4-19.6 0-12.3 9.9-19.4 28.8-20.5l33.6-2.1v11c0 18.2-15.5 31.2-36 31.2zm102.5 74.6c29.5 0 43.4-11.3 55.5-45.4L640 193h-30.8l-35.6 115.1h-.6L537.4 193h-31.6L557 334.9l-2.8 8.6c-4.6 14.6-12.1 20.3-25.5 20.3-2.4 0-7-.3-8.9-.5v23.4c1.8.4 9.3.7 11.6.7z"></path>
                        </svg>
                        <p class="payment-method-label-name">Apple Pay</p>
                    </div>
                    <input class="payment-method-input" type="radio" name="payment" value="apple" data-method="apple">
                </label>
                
                <!-- PayPal -->
                <label class="payment-method-label" data-method="paypal">
                    <div class="payment-method-icon-container">
                        <svg class="payment-method-icon" fill="currentColor" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M186.3 258.2c0 12.2-9.7 21.5-22 21.5-9.2 0-16-5.2-16-15 0-12.2 9.5-22 21.7-22 9.3 0 16.3 5.7 16.3 15.5zM80.5 209.7h-4.7c-1.5 0-3 1-3.2 2.7l-4.3 26.7 8.2-.3c11 0 19.5-1.5 21.5-14.2 2.3-13.4-6.2-14.9-17.5-14.9zm284 0H360c-1.8 0-3 1-3.2 2.7l-4.2 26.7 8-.3c13 0 22-3 22-18-.1-10.6-9.6-11.1-18.1-11.1zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM128.3 215.4c0-21-16.2-28-34.7-28h-40c-2.5 0-5 2-5.2 4.7L32 294.2c-.3 2 1.2 4 3.2 4h19c2.7 0 5.2-2.9 5.5-5.7l4.5-26.6c1-7.2 13.2-4.7 18-4.7 28.6 0 46.1-17 46.1-45.8zm84.2 8.8h-19c-3.8 0-4 5.5-4.2 8.2-5.8-8.5-14.2-10-23.7-10-24.5 0-43.2 21.5-43.2 45.2 0 19.5 12.2 32.2 31.7 32.2 9 0 20.2-4.9 26.5-11.9-.5 1.5-1 4.7-1 6.2 0 2.3 1 4 3.2 4H200c2.7 0 5-2.9 5.5-5.7l10.2-64.3c.3-1.9-1.2-3.9-3.2-3.9zm40.5 97.9l63.7-92.6c.5-.5.5-1 .5-1.7 0-1.7-1.5-3.5-3.2-3.5h-19.2c-1.7 0-3.5 1-4.5 2.5l-26.5 39-11-37.5c-.8-2.2-3-4-5.5-4h-18.7c-1.7 0-3.2 1.8-3.2 3.5 0 1.2 19.5 56.8 21.2 62.1-2.7 3.8-20.5 28.6-20.5 31.6 0 1.8 1.5 3.2 3.2 3.2h19.2c1.8-.1 3.5-1.1 4.5-2.6zm159.3-106.7c0-21-16.2-28-34.7-28h-39.7c-2.7 0-5.2 2-5.5 4.7l-16.2 102c-.2 2 1.3 4 3.2 4h20.5c2 0 3.5-1.5 4-3.2l4.5-29c1-7.2 13.2-4.7 18-4.7 28.4 0 45.9-17 45.9-45.8zm84.2 8.8h-19c-3.8 0-4 5.5-4.3 8.2-5.5-8.5-14-10-23.7-10-24.5 0-43.2 21.5-43.2 45.2 0 19.5 12.2 32.2 31.7 32.2 9.3 0 20.5-4.9 26.5-11.9-.3 1.5-1 4.7-1 6.2 0 2.3 1 4 3.2 4H484c2.7 0 5-2.9 5.5-5.7l10.2-64.3c.3-1.9-1.2-3.9-3.2-3.9zm47.5-33.3c0-2-1.5-3.5-3.2-3.5h-18.5c-1.5 0-3 1.2-3.2 2.7l-16.2 104-.3.5c0 1.8 1.5 3.5 3.5 3.5h16.5c2.5 0 5-2.9 5.2-5.7L544 191.2v-.3zm-90 51.8c-12.2 0-21.7 9.7-21.7 22 0 9.7 7 15 16.2 15 12 0 21.7-9.2 21.7-21.5.1-9.8-6.9-15.5-16.2-15.5z"></path>
                        </svg>
                        <p class="payment-method-label-name">PayPal</p>
                    </div>
                    <input class="payment-method-input" type="radio" name="payment" value="paypal" data-method="paypal">
                </label>
                
                <!-- Cartão de Crédito -->
                <label class="payment-method-label" data-method="card">
                    <div class="payment-method-icon-container">
                        <svg class="payment-method-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M22.222 15.768l-.225-1.125h-2.514l-.4 1.117-2.015.004a4199.19 4199.19 0 0 1 2.884-6.918c.164-.391.455-.59.884-.588.328.003.863.003 1.606.001L24 15.765l-1.778.003zm-2.173-2.666h1.62l-.605-2.82-1.015 2.82zM7.06 8.257l2.026.002-3.132 7.51-2.051-.002a950.849 950.849 0 0 1-1.528-5.956c-.1-.396-.298-.673-.679-.804C1.357 8.89.792 8.71 0 8.465V8.26h3.237c.56 0 .887.271.992.827.106.557.372 1.975.8 4.254L7.06 8.257zm4.81.002l-1.602 7.508-1.928-.002L9.94 8.257l1.93.002zm3.91-.139c.577 0 1.304.18 1.722.345l-.338 1.557c-.378-.152-1-.357-1.523-.35-.76.013-1.23.332-1.23.638 0 .498.816.749 1.656 1.293.959.62 1.085 1.177 1.073 1.782-.013 1.256-1.073 2.495-3.309 2.495-1.02-.015-1.388-.101-2.22-.396l.352-1.625c.847.355 1.206.468 1.93.468.663 0 1.232-.268 1.237-.735.004-.332-.2-.497-.944-.907-.744-.411-1.788-.98-1.774-2.122.017-1.462 1.402-2.443 3.369-2.443z"></path>
                            </g>
                        </svg>
                        <p class="payment-method-label-name">Cartão de Crédito</p>
                    </div>
                    <input class="payment-method-input" type="radio" name="payment" value="card" data-method="card">
                </label>
                
                <!-- PIX -->
                <label class="payment-method-label" data-method="pix">
                    <div class="payment-method-icon-container">
                        <i class="fab fa-pix" style="font-size: 32px;"></i>
                        <p class="payment-method-label-name">PIX</p>
                    </div>
                    <input class="payment-method-input" type="radio" name="payment" value="pix" data-method="pix">
                </label>
            </div>
            
            <!-- Formulário Google Pay -->
            <div class="payment-form" id="form-google" data-pedido-id="${compra.id}">
                <div class="payment-form-group">
                    <label class="payment-form-label">Email</label>
                    <input type="email" class="payment-form-input" value="usuario@gmail.com" readonly>
                </div>
                <button type="button" class="btn-continuar-pagamento active" onclick="ClienteCompras.processarPagamento('${compra.id}', 'google')">
                    <i class="fas fa-check"></i> Continuar
                </button>
            </div>
            
            <!-- Formulário Apple Pay -->
            <div class="payment-form" id="form-apple" data-pedido-id="${compra.id}">
                <div class="payment-form-group">
                    <label class="payment-form-label">Apple ID</label>
                    <input type="email" class="payment-form-input" value="usuario@icloud.com" readonly>
                </div>
                <button type="button" class="btn-continuar-pagamento active" onclick="ClienteCompras.processarPagamento('${compra.id}', 'apple')">
                    <i class="fas fa-check"></i> Continuar
                </button>
            </div>
            
            <!-- Formulário PayPal -->
            <div class="payment-form" id="form-paypal" data-pedido-id="${compra.id}">
                <div class="payment-form-group">
                    <label class="payment-form-label">Email PayPal</label>
                    <input type="email" class="payment-form-input" value="usuario@paypal.com" readonly>
                </div>
                <button type="button" class="btn-continuar-pagamento active" onclick="ClienteCompras.processarPagamento('${compra.id}', 'paypal')">
                    <i class="fas fa-check"></i> Continuar
                </button>
            </div>
            
            <!-- Formulário Cartão de Crédito -->
            <div class="payment-form" id="form-card" data-pedido-id="${compra.id}">
                <div class="payment-form-group">
                    <label class="payment-form-label">Selecione o Cartão</label>
                    <select class="payment-form-input" id="card-select-${compra.id}" onchange="ClienteCompras.atualizarDadosCartao('${compra.id}', this.value)">
                        <option value="visa">Visa •••• 1111</option>
                        <option value="mastercard">Mastercard •••• 2222</option>
                    </select>
                </div>
                <div class="payment-form-group">
                    <label class="payment-form-label">Número do Cartão</label>
                    <input type="text" class="payment-form-input" id="card-number-${compra.id}" value="4111 1111 1111 1111" readonly>
                </div>
                <div class="payment-form-group">
                    <label class="payment-form-label">Nome no Cartão</label>
                    <input type="text" class="payment-form-input" value="FERNANDA ARAGÃO" readonly>
                </div>
                <div class="payment-form-row">
                    <div class="payment-form-group">
                        <label class="payment-form-label">Validade</label>
                        <input type="text" class="payment-form-input" id="card-expiry-${compra.id}" value="12/25" readonly>
                    </div>
                    <div class="payment-form-group">
                        <label class="payment-form-label">CVV</label>
                        <input type="text" class="payment-form-input" id="card-cvv-${compra.id}" value="123" readonly>
                    </div>
                </div>
                <button type="button" class="btn-continuar-pagamento active" onclick="ClienteCompras.processarPagamento('${compra.id}', 'card')">
                    <i class="fas fa-check"></i> Finalizar Pagamento
                </button>
            </div>
            
            <!-- Formulário PIX -->
            <div class="payment-form" id="form-pix" data-pedido-id="${compra.id}">
                <button type="button" class="btn-pix" onclick="ClienteCompras.gerarQRCodePix('${compra.id}', ${compra.valorTotal})">
                    <i class="fab fa-pix"></i> Gerar QR Code PIX
                </button>
                
                <div class="qr-code-container" id="qr-code-pix-${compra.id}">
                    <div class="qr-code-image" id="qr-image-${compra.id}">
                        <!-- QR Code será gerado aqui -->
                    </div>
                    <div class="qr-code-text" id="qr-text-${compra.id}">
                        <!-- Código PIX será exibido aqui -->
                    </div>
                    <button type="button" class="btn-continuar-pagamento" id="btn-continuar-pix-${compra.id}" onclick="ClienteCompras.processarPagamento('${compra.id}', 'pix')">
                        <i class="fas fa-check"></i> Continuar
                    </button>
                </div>
            </div>
        `;
        
        // Aguarda renderização e adiciona eventos
        setTimeout(() => {
            this.initPaymentMethods();
        }, 100);
    },
    
    // Inicializa eventos dos métodos de pagamento
    initPaymentMethods() {
        // Adiciona eventos aos inputs radio
        const inputs = document.querySelectorAll('.payment-method-input');
        inputs.forEach(input => {
            // Remove listeners anteriores se houver
            const newInput = input.cloneNode(true);
            input.parentNode.replaceChild(newInput, input);
            
            newInput.addEventListener('change', (e) => {
                const method = e.target.value;
                console.log(`💳 Método selecionado: ${method}`);
                
                // Remove classe active de todos os labels
                document.querySelectorAll('.payment-method-label').forEach(label => {
                    label.classList.remove('active');
                });
                
                // Adiciona classe active ao label selecionado
                const label = newInput.closest('.payment-method-label');
                if (label) {
                    label.classList.add('active');
                }
                
                // Esconde todos os formulários
                document.querySelectorAll('.payment-form').forEach(form => {
                    form.classList.remove('active');
                });
                
                // Esconde QR Code se estiver visível
                document.querySelectorAll('.qr-code-container').forEach(qr => {
                    qr.classList.remove('active');
                });
                
                // Esconde botão continuar do PIX
                document.querySelectorAll('#form-pix .btn-continuar-pagamento').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Mostra formulário do método selecionado
                const form = document.getElementById(`form-${method}`);
                if (form) {
                    form.classList.add('active');
                    console.log(`✅ Formulário ${method} ativado`);
                } else {
                    console.error(`❌ Formulário form-${method} não encontrado`);
                }
            });
            
            // Se já estiver selecionado, mostra o formulário
            if (newInput.checked) {
                newInput.dispatchEvent(new Event('change'));
            }
        });
    },
    
    // Gera QR Code PIX
    gerarQRCodePix(pedidoId, valor) {
        // Código PIX simulado (EMV QR Code format)
        const pixCode = `00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540${valor.toFixed(2)}5802BR5913BEIRAMAR PESCADOS6009FORTALEZA62070503***6304`;
        const qrText = `00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540${valor.toFixed(2)}5802BR5913BEIRAMAR PESCADOS6009FORTALEZA62070503***6304ABCD`;
        
        // Exibe código PIX
        const qrTextEl = document.getElementById(`qr-text-${pedidoId}`);
        if (qrTextEl) {
            qrTextEl.textContent = qrText;
        }
        
        // Gera QR Code usando uma biblioteca simples (ou API)
        // Para demonstração, vamos criar um QR code básico usando canvas
        const qrContainer = document.getElementById(`qr-code-pix-${pedidoId}`);
        if (qrContainer) {
            qrContainer.classList.add('active');
            
            // Gera QR Code usando API pública ou canvas simples
            // Para demonstração, cria um QR Code visual simples
            const qrImageEl = document.getElementById(`qr-image-${pedidoId}`);
            if (qrImageEl) {
                // Usa API pública para gerar QR Code (ou cria visual simples)
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
                qrImageEl.innerHTML = `<img src="${qrCodeUrl}" alt="QR Code PIX" style="width: 100%; height: 100%; object-fit: contain;">`;
            }
            
            // Mostra botão continuar
            const btnContinuar = document.getElementById(`btn-continuar-pix-${pedidoId}`);
            if (btnContinuar) {
                btnContinuar.classList.add('active');
            }
        }
    },
    
    // Processa pagamento
    processarPagamento(pedidoId, metodo) {
        console.log(`💳 Processando pagamento do pedido ${pedidoId} via ${metodo}`);
        
        // Atualiza status do pedido
        const compra = this.comprasCliente.find(c => c.id === pedidoId);
        if (compra) {
            compra.status = 'preparando';
            compra.metodoPagamento = this.getNomeMetodoPagamento(metodo);
            
            // Salva compras após modificação
            this.salvarCompras();
            
            // Atualiza contadores
            this.atualizarContadores();
            
            // Cria notificação sobre o pagamento
            this.criarNotificacaoPagamento();
            
            // Fecha modal de pagamento
            if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                window.BeiraMarModais.closeModal('modalPagamento');
            }
            
            // Mostra mensagem de sucesso
            if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                window.BeiraMarUtils.showToast('Pagamento realizado com sucesso!', 'success');
            } else {
                alert('Pagamento realizado com sucesso!');
            }
            
            // Recarrega modal "A Pagar" se ainda estiver aberto
            setTimeout(() => {
                if (window.BeiraMarModais && document.getElementById('modalAPagar').classList.contains('active')) {
                    this.abrirModalAPagar();
                }
            }, 500);
        }
    },
    
    // Cria notificação quando uma fatura é paga
    criarNotificacaoPagamento() {
        const comprasAPagar = this.getComprasPorStatus('a-pagar');
        const totalAPagar = comprasAPagar.length;
        
        let mensagem = '';
        if (totalAPagar === 0) {
            mensagem = 'Todas as suas faturas foram pagas! 🎉';
        } else if (totalAPagar === 1) {
            mensagem = '1 de suas faturas foi paga! Resta 1 fatura a ser paga.';
        } else {
            mensagem = `1 de suas faturas foi paga! Restam ${totalAPagar} faturas a serem pagas.`;
        }
        
        // Adiciona notificação no sistema de notificações
        if (window.BeiraMarNotificacoes && window.BeiraMarNotificacoes.addNotification) {
            window.BeiraMarNotificacoes.addNotification(
                'Pagamento Realizado',
                mensagem,
                'success'
            );
        } else if (window.ClienteNotificacoes && window.ClienteNotificacoes.adicionarNotificacao) {
            window.ClienteNotificacoes.adicionarNotificacao(
                'Pagamento Realizado',
                mensagem,
                'success',
                'compras'
            );
        }
        
        console.log('📢 Notificação de pagamento criada:', mensagem);
    },
    
    // Atualiza dados do cartão quando selecionado
    atualizarDadosCartao(pedidoId, tipo) {
        const cardNumber = document.getElementById(`card-number-${pedidoId}`);
        const cardExpiry = document.getElementById(`card-expiry-${pedidoId}`);
        const cardCvv = document.getElementById(`card-cvv-${pedidoId}`);
        
        if (tipo === 'visa') {
            if (cardNumber) cardNumber.value = '4111 1111 1111 1111';
            if (cardExpiry) cardExpiry.value = '12/25';
            if (cardCvv) cardCvv.value = '123';
        } else if (tipo === 'mastercard') {
            if (cardNumber) cardNumber.value = '5555 4444 3333 2222';
            if (cardExpiry) cardExpiry.value = '06/26';
            if (cardCvv) cardCvv.value = '456';
        }
    },
    
    // Obtém nome do método de pagamento
    getNomeMetodoPagamento(metodo) {
        const metodos = {
            'google': 'Google Pay',
            'apple': 'Apple Pay',
            'paypal': 'PayPal',
            'card': 'Cartão de Crédito',
            'pix': 'PIX'
        };
        return metodos[metodo] || metodo;
    },
    
    // Atualiza todos os contadores
    atualizarContadores() {
        const statuses = ['a-pagar', 'preparando', 'a-caminho', 'a-avaliar'];
        statuses.forEach(status => {
            const count = this.contarComprasPorStatus(status);
            const cardCount = document.querySelector(`[data-status="${status}"] .card-count`);
            if (cardCount) {
                cardCount.textContent = count;
            }
        });
    },
    
    // Atualiza notificações (usado pelo sistema de notificações do cliente)
    atualizarNotificacoes() {
        // As notificações são gerenciadas pelo ClienteNotificacoes
        // NÃO criar novas notificações aqui, apenas atualizar timers se necessário
        if (window.ClienteNotificacoes && window.ClienteNotificacoes.atualizarTimersNotificacoes) {
            window.ClienteNotificacoes.atualizarTimersNotificacoes();
        }
        
        // Atualiza badge do header se existir
        if (window.ClienteNotificacoes && window.ClienteNotificacoes.atualizarBadge) {
            window.ClienteNotificacoes.atualizarBadge();
        }
    },
    
    // Inicializa eventos
    
    init() {
        if (this.inicializado) {
            return;
        }
        
        // Carrega compras do localStorage antes de inicializar
        this.carregarCompras();
        
        this.inicializado = true;
        
        // Adiciona eventos de clique nos cards (delegação de eventos para funcionar mesmo após carregamento dinâmico)
        this.setupCardEvents();
        
        // Atualiza contadores e notificações ao carregar
        this.atualizarContadores();
        this.atualizarNotificacoes();
    },
    
    // Configura eventos dos cards de status
    setupCardEvents() {
        // Remove listener anterior se existir
        if (this._cardClickHandler) {
            document.removeEventListener('click', this._cardClickHandler);
        }
        
        // Cria novo handler
        this._cardClickHandler = (e) => {
            const card = e.target.closest('.compra-status-card');
            if (card) {
                e.preventDefault();
                e.stopPropagation();
                
                const status = card.getAttribute('data-status');
                
                if (status === 'a-pagar') {
                    this.abrirModalAPagar();
                } else if (status === 'preparando') {
                    this.abrirModalPreparando();
                } else if (status === 'a-caminho') {
                    this.abrirModalACaminho();
                } else if (status === 'a-avaliar') {
                    this.abrirModalAAvaliar();
                }
            }
        };
        
        // Adiciona listener
        document.addEventListener('click', this._cardClickHandler);
    }
};

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Tenta inicializar imediatamente
    if (document.getElementById('estoque') || document.querySelector('.compra-status-card')) {
        ClienteCompras.init();
    }
    
    // Tenta novamente após um delay (caso a página seja carregada dinamicamente)
    setTimeout(() => {
        if (!ClienteCompras.inicializado) {
            if (document.getElementById('estoque') || document.querySelector('.compra-status-card')) {
                ClienteCompras.init();
            }
        } else {
            // Se já inicializado, apenas reconfigura eventos (caso os cards tenham sido recarregados)
            ClienteCompras.setupCardEvents();
            ClienteCompras.atualizarContadores();
        }
    }, 1000);
});

// Exporta globalmente
window.ClienteCompras = ClienteCompras;

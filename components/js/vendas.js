// =========================================
// GESTÃO DE VENDAS - CLEAN UI AZUL (VISUAL DOS CARDS ATUALIZADO)
// =========================================

// Função para migrar pedidos antigos para novo formato
function migrarPedidoParaNovoFormato(pedido) {
    // Se já tem array de produtos, retorna como está
    if (pedido.produtos && Array.isArray(pedido.produtos) && pedido.produtos.length > 0) {
        return pedido;
    }

    // Converte estrutura antiga para nova
    const novoPedido = {
        ...pedido,
        produtos: [{
            produto: pedido.produto || '',
            qtd: pedido.qtd || 0,
            precoUnit: pedido.precoUnit || 0,
            valorTotal: pedido.valor || 0
        }]
    };

    return novoPedido;
}

// Funções para salvar/carregar do localStorage
function carregarVendasDoLocalStorage() {
    try {
        const vendasSalvas = localStorage.getItem('vendasData');
        if (vendasSalvas) {
            vendasData = JSON.parse(vendasSalvas);
            // Migra pedidos antigos para novo formato
            vendasData = vendasData.map(pedido => migrarPedidoParaNovoFormato(pedido));
            console.log('✅ [Vendas] Dados carregados do localStorage:', vendasData.length, 'pedidos');
        }
    } catch (e) {
        console.error('❌ [Vendas] Erro ao carregar do localStorage:', e);
    }
}

function salvarVendasNoLocalStorage() {
    try {
        localStorage.setItem('vendasData', JSON.stringify(vendasData));
        console.log('💾 [Vendas] Dados salvos no localStorage:', vendasData.length, 'pedidos');
    } catch (e) {
        console.error('❌ [Vendas] Erro ao salvar no localStorage:', e);
    }
}

// Lista de itens do pedido atual (para múltiplos itens)
let itensPedidoAtual = [];

// Dados Simulados de Vendas
// Estrutura: cada pedido pode ter múltiplos produtos no array 'produtos'
let vendasData = [
    { 
        id: 5001, 
        cliente: 'Restaurante Mar Azul', 
        valor: 1250.00, 
        status: 'Concluído', 
        data: 'Hoje, 10:30', 
        produtos: [
            { produto: 'Salmão Fresco', qtd: 20, precoUnit: 62.50, valorTotal: 1250.00 }
        ],
        itens: '20kg Salmão Fresco',
        pagamento: 'Pix',
        criadoPor: 'Administrador',
        // Mantém campos antigos para compatibilidade
        produto: 'Salmão Fresco',
        qtd: 20,
        precoUnit: 62.50
    },
    { 
        id: 5002, 
        cliente: 'Hotel Palace', 
        valor: 4500.00, 
        status: 'Pendente', 
        data: 'Hoje, 09:15', 
        produtos: [
            { produto: 'Tilápia Inteira', qtd: 375, precoUnit: 12.00, valorTotal: 4500.00 }
        ],
        itens: '375kg Tilápia Inteira',
        pagamento: 'Boleto 15 dias',
        criadoPor: 'Administrador',
        // Mantém campos antigos para compatibilidade
        produto: 'Tilápia Inteira',
        qtd: 375,
        precoUnit: 12.00
    }
];

// Tabela de Preços (Banco de Dados Simulado)
const tabelaPrecos = {
    'Tilápia Inteira': 12.00,
    'Filé de Tilápia': 38.00,
    'Salmão Fresco': 45.00,
    'Camarão Limpo': 65.00,
    'Camarão Inteiro': 35.00,
    'Lula Anéis': 42.00,
    'Sardinha': 9.50,
    'Outros': 0 // Permite digitação manual
};

// --- FUNÇÃO AUXILIAR: OBTER NÍVEL DE ACESSO DO USUÁRIO LOGADO ---
function obterNivelAcessoUsuarioVendas() {
    try {
        const email = sessionStorage.getItem('userEmail');
        if (!email) return null;
        
        // Garante que a lista de funcionários esteja disponível
        if (!window.funcionariosLista || window.funcionariosLista.length === 0) {
            // Tenta carregar do localStorage se disponível
            const funcionariosSalvos = localStorage.getItem('funcionariosLista');
            if (funcionariosSalvos) {
                window.funcionariosLista = JSON.parse(funcionariosSalvos);
            }
        }
        
        if (window.funcionariosLista && window.funcionariosLista.length > 0) {
            const funcionario = window.funcionariosLista.find(f => 
                f.email && f.email.toLowerCase() === email.toLowerCase()
            );
            return funcionario ? (funcionario.nivelAcesso || 'visualizador') : null;
        }
        
        return null;
    } catch (e) {
        console.error('Erro ao obter nível de acesso:', e);
        return null;
    }
}

// --- FUNÇÃO PARA MOSTRAR OVERLAY DE ACESSO NEGADO ---
function mostrarOverlayAcessoNegadoVendas() {
    const vendasPage = document.getElementById('vendas');
    if (!vendasPage) return;
    
    // Remove overlay anterior se existir
    const overlayAnterior = vendasPage.querySelector('.overlay-acesso-negado-vendas');
    if (overlayAnterior) {
        overlayAnterior.remove();
    }
    
    // Cria o overlay que cobre apenas a área de conteúdo
    const overlay = document.createElement('div');
    overlay.className = 'overlay-acesso-negado-vendas';
    overlay.style.cssText = `
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        min-height: calc(100vh - 80px);
        background: var(--bg-secondary, #f8fafc);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem 2rem;
        animation: fadeIn 0.3s ease;
        overflow: auto;
        box-sizing: border-box;
    `;
    
    overlay.innerHTML = `
        <div style="background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); max-width: 550px; width: 100%; padding: 3rem; text-align: center; border: 1px solid var(--border-color, #e2e8f0);">
            <div style="width: 100px; height: 100px; margin: 0 auto 2rem; border-radius: 50%; background: linear-gradient(135deg, #fee2e2, #fecaca); display: flex; align-items: center; justify-content: center; position: relative;">
                <div style="position: absolute; inset: -4px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #dc2626); opacity: 0.2; animation: pulse 2s infinite;"></div>
                <i class="fas fa-lock" style="font-size: 2.5rem; color: #ef4444; position: relative; z-index: 1;"></i>
            </div>
            
            <h2 style="margin: 0 0 1rem 0; color: var(--text-primary, #1e293b); font-size: 2rem; font-weight: 700;">
                Acesso Negado
            </h2>
            
            <p style="margin: 0 0 2.5rem 0; color: var(--text-secondary, #64748b); font-size: 1.1rem; line-height: 1.7;">
                Você não tem acesso a essa parte do sistema, seu nível é baixo
            </p>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; display: flex; align-items: start; gap: 1rem; text-align: left;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: #fee2e2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i class="fas fa-info-circle" style="color: #ef4444; font-size: 1.2rem;"></i>
                </div>
                <p style="margin: 0; color: #991b1b; font-size: 0.95rem; line-height: 1.6;">
                    Esta área é restrita para funcionários com nível de acesso superior ao seu.
                </p>
            </div>
            
            <button onclick="const overlay=document.querySelector('.overlay-acesso-negado-vendas');if(overlay)overlay.remove();if(window.BeiraMarNavigation&&window.BeiraMarNavigation.navigateToPage){window.BeiraMarNavigation.navigateToPage('dashboard');}" style="
                width: 100%;
                padding: 1rem 2rem;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
                <i class="fas fa-arrow-left"></i>
                <span>Voltar ao Dashboard</span>
            </button>
        </div>
    `;
    
    // Garante que a página tenha position relative e altura mínima
    if (getComputedStyle(vendasPage).position === 'static') {
        vendasPage.style.position = 'relative';
    }
    if (!vendasPage.style.minHeight) {
        vendasPage.style.minHeight = 'calc(100vh - 80px)';
    }
    
    vendasPage.appendChild(overlay);
    
    // Adiciona animações CSS se não existirem
    if (!document.getElementById('overlay-vendas-animations')) {
        const style = document.createElement('style');
        style.id = 'overlay-vendas-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.2; }
                50% { transform: scale(1.1); opacity: 0.3; }
            }
            .overlay-acesso-negado-vendas > div {
                animation: fadeIn 0.4s ease;
            }
            [data-theme="dark"] .overlay-acesso-negado-vendas {
                background: var(--bg-secondary, #1e293b) !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-vendas > div {
                background: #334155 !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-vendas h2 {
                color: #f1f5f9 !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-vendas p {
                color: #cbd5e1 !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-vendas div[style*="background: #fef2f2"] {
                background: rgba(239, 68, 68, 0.15) !important;
                border-color: rgba(239, 68, 68, 0.3) !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-vendas div[style*="color: #991b1b"] {
                color: #fca5a5 !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-vendas div[style*="background: #fee2e2"] {
                background: rgba(239, 68, 68, 0.2) !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-vendas i[style*="color: #ef4444"] {
                color: #fca5a5 !important;
            }
        `;
        document.head.appendChild(style);
    }
}

function loadVendasContent() {
    const vendasPage = document.getElementById('vendas');
    if (!vendasPage) return;
    
    // Carrega dados do localStorage ao inicializar
    carregarVendasDoLocalStorage();
    
    // Verifica permissões usando o novo sistema
    const userType = sessionStorage.getItem('userType');
    
    // Se for admin, tem acesso total
    if (userType === 'adm' || userType === 'admin') {
        // Remove overlay se existir
        const overlayExistente = vendasPage.querySelector('.overlay-acesso-negado-vendas');
        if (overlayExistente) {
            overlayExistente.remove();
        }
    } else if (userType === 'funcionario') {
        // Verifica se o funcionário tem acesso à página de vendas
        if (!window.BeiraMarPermissoes || !window.BeiraMarPermissoes.temAcesso('vendas')) {
            // Não tem acesso, mostra overlay
            vendasPage.innerHTML = '';
            mostrarOverlayAcessoNegadoVendas();
            return;
        }
        
        // Remove overlay se existir
        const overlayExistente = vendasPage.querySelector('.overlay-acesso-negado-vendas');
        if (overlayExistente) {
            overlayExistente.remove();
        }
    } else {
        // Outros tipos de usuário - remove overlay se existir
        const overlayExistente = vendasPage.querySelector('.overlay-acesso-negado-vendas');
        if (overlayExistente) {
            overlayExistente.remove();
        }
    }
    
    // Verifica permissões para mostrar/ocultar botões
    const podeAdicionar = (userType === 'adm' || userType === 'admin') || 
                         (window.BeiraMarPermissoes && window.BeiraMarPermissoes.podeAdicionar('vendas'));
    
    vendasPage.innerHTML = `
        <div class="module-header">
            <h2>Gestão de Vendas</h2>
            ${podeAdicionar ? `<button class="btn btn-primary" onclick="abrirModalNovoPedido()">
                <i class="fas fa-cart-plus"></i>
                Novo Pedido
            </button>` : ''}
        </div>

        <div class="vendas-summary">
            <div class="summary-card card-blue">
                <div class="card-content">
                    <h3>Vendas Hoje (Concluídas)</h3>
                    <p class="summary-number" id="sumVendasHoje">R$ 0,00</p>
                    <span>Faturamento diário real</span>
                </div>
                <div class="card-icon"><i class="fas fa-dollar-sign"></i></div>
            </div>
            
            <div class="summary-card card-purple">
                <div class="card-content">
                    <h3>Ticket Médio</h3>
                    <p class="summary-number" id="sumTicketMedio">R$ 0,00</p>
                    <span>Média por pedido</span>
                </div>
                <div class="card-icon"><i class="fas fa-chart-line"></i></div>
            </div>
            
            <div class="summary-card card-orange">
                <div class="card-content">
                    <h3>Pedidos Pendentes</h3>
                    <p class="summary-number" id="sumPendentes">0</p>
                    <span>Aguardando ação</span>
                </div>
                <div class="card-icon"><i class="fas fa-clock"></i></div>
            </div>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h3>Últimos Pedidos</h3>
                <input type="text" id="buscaVendas" class="clean-input" placeholder="Buscar cliente ou ID..." onkeyup="filtrarVendas()">
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="tabelaVendas">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Itens (Resumo)</th>
                            <th>Valor Total</th>
                            <th>Status</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="vendasTableBody">
                        </tbody>
                </table>
            </div>
        </div>

        <div id="modalNovoPedido" class="custom-modal-overlay" style="display: none;">
            <div class="custom-modal-content">
                <div class="modal-header">
                    <h3 id="tituloModalPedido"><i class="fas fa-file-invoice-dollar"></i> Novo Pedido</h3>
                    <button class="btn-close-modal" onclick="fecharModalNovoPedido()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="formNovoPedido">
                        <input type="hidden" id="editId">

                        <div class="vendas-row">
                            <div class="vendas-col">
                                <div class="form-group">
                                    <label>Cliente</label>
                                    <input type="text" id="npCliente" class="form-control" list="listaClientesVenda" placeholder="Selecione ou Digite" required>
                                    <datalist id="listaClientesVenda">
                                        <option value="Restaurante Mar Azul">
                                        <option value="Hotel Palace">
                                        <option value="Peixaria do Zé">
                                        <option value="Cliente Balcão">
                                    </datalist>
                                </div>
                            </div>
                            <div class="vendas-col">
                                <div class="form-group">
                                    <label>Status</label>
                                    <select id="npStatus" class="form-control">
                                        <option value="Pendente">Pendente</option>
                                        <option value="Concluído">Concluído (Pago)</option>
                                        <option value="Em Separação">Em Separação</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Forma de Pagamento</label>
                            <select id="npPagamento" class="form-control">
                                <option value="Pix">Pix</option>
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Cartão Crédito">Cartão Crédito</option>
                                <option value="Boleto">Boleto</option>
                            </select>
                        </div>

                        <hr class="vendas-separator"/>
                        
                        <h4 style="margin: 1rem 0; color: #0066cc; font-size: 1rem;">
                            <i class="fas fa-list"></i> Adicionar Itens ao Pedido
                        </h4>
                        
                        <div class="vendas-row">
                            <div class="vendas-col" style="flex: 2;">
                                <div class="form-group">
                                    <label>Produto</label>
                                    <select id="npProduto" class="form-control" onchange="atualizarPrecoUnitario()">
                                        <option value="">Selecione o produto...</option>
                                        <option value="Tilápia Inteira">Tilápia Inteira (R$ 12,00/kg)</option>
                                        <option value="Filé de Tilápia">Filé de Tilápia (R$ 38,00/kg)</option>
                                        <option value="Salmão Fresco">Salmão Fresco (R$ 45,00/kg)</option>
                                        <option value="Camarão Limpo">Camarão Limpo (R$ 65,00/kg)</option>
                                        <option value="Camarão Inteiro">Camarão Inteiro (R$ 35,00/kg)</option>
                                        <option value="Lula Anéis">Lula Anéis (R$ 42,00/kg)</option>
                                        <option value="Sardinha">Sardinha (R$ 9,50/kg)</option>
                                        <option value="Outros">Outros (Preço Manual)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="vendas-col">
                                <div class="form-group">
                                    <label>Preço/Kg</label>
                                    <input type="number" id="npPrecoUnit" class="form-control readonly-field" step="0.01" readonly>
                                </div>
                            </div>
                        </div>

                        <div class="vendas-row">
                            <div class="vendas-col">
                                <div class="form-group">
                                    <label>Quantidade (kg)</label>
                                    <input type="number" id="npQtd" class="form-control" step="0.1" placeholder="0.0" oninput="calcularTotalItem()">
                                </div>
                            </div>
                            <div class="vendas-col">
                                <div class="form-group">
                                    <label style="color: #0066cc;">Valor Total (R$)</label>
                                    <input type="number" id="npValorTotal" class="form-control readonly-field" step="0.01" placeholder="0.00" readonly>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <button type="button" class="btn btn-success" onclick="adicionarItemAoPedido()" style="width: 100%;">
                                <i class="fas fa-plus"></i> Adicionar Item à Lista
                            </button>
                        </div>

                        <hr class="vendas-separator"/>

                        <div id="listaItensPedido" style="margin: 1rem 0;">
                            <h4 style="margin-bottom: 1rem; color: #0066cc; font-size: 1rem;">
                                <i class="fas fa-shopping-cart"></i> Itens do Pedido (<span id="contadorItens">0</span>)
                            </h4>
                            <div id="itensLista" style="max-height: 300px; overflow-y: auto;">
                                <p style="text-align: center; color: #999; padding: 2rem; font-style: italic;">
                                    Nenhum item adicionado ainda. Adicione produtos acima.
                                </p>
                            </div>
                            <div id="totalGeralPedido" style="margin-top: 1rem; padding: 1rem; background: #f0f7ff; border-radius: 8px; display: none;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <strong style="font-size: 1.1rem; color: #0066cc;">Total Geral:</strong>
                                    <strong style="font-size: 1.3rem; color: #0066cc;" id="valorTotalGeral">R$ 0,00</strong>
                                </div>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="fecharModalNovoPedido()">Cancelar</button>
                            <button type="submit" class="btn btn-primary" id="btnSalvarPedido">Salvar Pedido(s)</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div id="modalDetalhesVenda" class="custom-modal-overlay" style="display: none;">
            <div class="custom-modal-content">
                <div class="modal-header">
                    <h3 id="detalheVendaTitulo">Pedido #000</h3>
                    <button class="btn-close-modal" onclick="fecharModalDetalhesVenda()">&times;</button>
                </div>
                <div class="modal-body" id="detalheVendaCorpo"></div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="fecharModalDetalhesVenda()">Fechar</button>
                    <button class="btn btn-primary" onclick="alert('Imprimir Comprovante')"><i class="fas fa-print"></i> Imprimir</button>
                </div>
            </div>
        </div>
    `;

    addVendasStyles();
    atualizarTabelaVendas();
    atualizarResumoFinanceiro();

    // Evento de Submit
    const form = document.getElementById('formNovoPedido');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarPedido();
        });
    }
}

// --- LÓGICA DE CÁLCULO DE PREÇO ---

window.atualizarPrecoUnitario = function() {
    const produtoSelect = document.getElementById('npProduto').value;
    const precoInput = document.getElementById('npPrecoUnit');
    
    if (tabelaPrecos[produtoSelect] !== undefined) {
        if (produtoSelect === 'Outros') {
            precoInput.value = '';
            precoInput.removeAttribute('readonly');
            precoInput.classList.remove('readonly-field');
            precoInput.focus();
            precoInput.oninput = calcularTotalPedido;
        } else {
            precoInput.value = tabelaPrecos[produtoSelect].toFixed(2);
            precoInput.setAttribute('readonly', true);
            precoInput.classList.add('readonly-field');
            precoInput.oninput = null;
        }
        calcularTotalPedido();
    }
}

window.calcularTotalPedido = function() {
    const qtd = parseFloat(document.getElementById('npQtd').value) || 0;
    const precoUnit = parseFloat(document.getElementById('npPrecoUnit').value) || 0;
    const total = qtd * precoUnit;
    document.getElementById('npValorTotal').value = total.toFixed(2);
}

window.calcularTotalItem = function() {
    calcularTotalPedido();
}

// Função para adicionar item à lista do pedido
window.adicionarItemAoPedido = function() {
    const produto = document.getElementById('npProduto').value;
    const qtd = parseFloat(document.getElementById('npQtd').value);
    const precoUnit = parseFloat(document.getElementById('npPrecoUnit').value);
    const valorTotal = parseFloat(document.getElementById('npValorTotal').value);

    if (!produto || isNaN(qtd) || qtd <= 0 || isNaN(precoUnit) || precoUnit <= 0) {
        if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
            window.BeiraMarUtils.showToast('Preencha todos os campos do produto corretamente!', 'error');
        } else {
            alert('Preencha todos os campos do produto corretamente!');
        }
        return;
    }

    const novoItem = {
        id: Date.now(),
        produto: produto,
        qtd: qtd,
        precoUnit: precoUnit,
        valorTotal: valorTotal
    };

    itensPedidoAtual.push(novoItem);
    atualizarListaItens();
    limparCamposItem();

    if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
        window.BeiraMarUtils.showToast('Item adicionado à lista!', 'success');
    }
}

// Função para remover item da lista
window.removerItemDoPedido = function(itemId) {
    itensPedidoAtual = itensPedidoAtual.filter(item => item.id !== itemId);
    atualizarListaItens();
    
    if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
        window.BeiraMarUtils.showToast('Item removido da lista!', 'success');
    }
}

// Função para obter o nome do funcionário logado
function obterNomeFuncionarioLogado() {
    try {
        const userType = sessionStorage.getItem('userType');
        
        // Se for admin, retorna "Administrador"
        if (userType === 'adm' || userType === 'admin') {
            return 'Administrador';
        }
        
        // Se for funcionário, busca o nome completo
        if (userType === 'funcionario' && window.BeiraMarPermissoes) {
            const funcionario = window.BeiraMarPermissoes.obterFuncionarioLogado();
            if (funcionario && funcionario.nome) {
                return funcionario.nome;
            }
        }
        
        // Fallback: usa o email
        const email = sessionStorage.getItem('userEmail');
        if (email) {
            const nome = email.split('@')[0];
            return nome.charAt(0).toUpperCase() + nome.slice(1);
        }
        
        return 'Sistema';
    } catch (e) {
        console.error('Erro ao obter nome do funcionário:', e);
        return 'Sistema';
    }
}

// Função para atualizar a exibição da lista de itens
function atualizarListaItens() {
    const listaContainer = document.getElementById('itensLista');
    const contador = document.getElementById('contadorItens');
    const totalGeralDiv = document.getElementById('totalGeralPedido');
    const valorTotalGeral = document.getElementById('valorTotalGeral');

    if (!listaContainer) return;

    contador.textContent = itensPedidoAtual.length;

    if (itensPedidoAtual.length === 0) {
        listaContainer.innerHTML = `
            <p style="text-align: center; color: #999; padding: 2rem; font-style: italic;">
                Nenhum item adicionado ainda. Adicione produtos acima.
            </p>
        `;
        totalGeralDiv.style.display = 'none';
        return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
    let totalGeral = 0;

    itensPedidoAtual.forEach((item, index) => {
        totalGeral += item.valorTotal;
        html += `
            <div class="item-pedido-linha" style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 0.8rem; 
                background: #f8f9fa; 
                border-radius: 8px; 
                border-left: 3px solid #0066cc;
            ">
                <div style="flex: 1;">
                    <strong>${item.produto}</strong><br>
                    <small style="color: #666;">
                        ${item.qtd}kg × R$ ${item.precoUnit.toFixed(2)} = 
                        <strong style="color: #0066cc;">R$ ${item.valorTotal.toFixed(2)}</strong>
                    </small>
                </div>
                <button 
                    type="button" 
                    onclick="removerItemDoPedido(${item.id})" 
                    class="btn-icon delete" 
                    style="margin-left: 1rem;"
                    title="Remover item"
                >
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    html += '</div>';
    listaContainer.innerHTML = html;

    valorTotalGeral.textContent = totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    totalGeralDiv.style.display = 'block';
}

// Função para limpar campos do item após adicionar
function limparCamposItem() {
    document.getElementById('npProduto').value = '';
    document.getElementById('npQtd').value = '';
    document.getElementById('npPrecoUnit').value = '';
    document.getElementById('npValorTotal').value = '';
    
    // Restaura readonly no preço
    const precoInput = document.getElementById('npPrecoUnit');
    precoInput.setAttribute('readonly', true);
    precoInput.classList.add('readonly-field');
}

// --- TABELA E DADOS ---

function atualizarTabelaVendas() {
    const tbody = document.getElementById('vendasTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const vendasSorted = [...vendasData].sort((a, b) => b.id - a.id);

    vendasSorted.forEach(venda => {
        const tr = document.createElement('tr');
        const badgeClass = getBadgeClass(venda.status);
        const valorFormatado = venda.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Verifica se tem array de produtos ou usa estrutura antiga
        let itensTexto = venda.itens || '';
        if (venda.produtos && Array.isArray(venda.produtos) && venda.produtos.length > 0) {
            // Usa o array de produtos
            itensTexto = venda.produtos.map(p => `${p.qtd}kg ${p.produto}`).join(', ');
        }

        tr.innerHTML = `
            <td>#${venda.id}</td>
            <td class="fw-bold">${venda.cliente}</td>
            <td>${itensTexto}</td>
            <td class="fw-bold text-blue">${valorFormatado}</td>
            <td><span class="status-badge ${badgeClass}">${venda.status}</span></td>
            <td class="text-muted">${venda.data}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="abrirModalEditarPedido(${venda.id})" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="abrirModalDetalhesVenda(${venda.id})" title="Ver Detalhes"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon delete" onclick="excluirPedido(${venda.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarResumoFinanceiro() {
    let totalHoje = 0;
    let pendentes = 0;
    let totalConcluidoGeral = 0;
    let countConcluidos = 0;

    vendasData.forEach(v => {
        // 1. Contagem de Pendentes
        if (v.status === 'Pendente' || v.status === 'Em Separação') {
            pendentes++;
        }

        // 2. Financeiro: Só conta se for CONCLUÍDO
        if (v.status === 'Concluído') {
            totalConcluidoGeral += v.valor;
            countConcluidos++;

            if (v.data.includes('Hoje')) {
                totalHoje += v.valor;
            }
        }
    });

    const ticketMedio = countConcluidos > 0 ? (totalConcluidoGeral / countConcluidos) : 0;

    document.getElementById('sumVendasHoje').textContent = totalHoje.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('sumTicketMedio').textContent = ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('sumPendentes').textContent = pendentes;
}

function filtrarVendas() {
    const termo = document.getElementById('buscaVendas').value.toLowerCase();
    const linhas = document.querySelectorAll('#vendasTableBody tr');
    linhas.forEach(linha => {
        const texto = linha.innerText.toLowerCase();
        linha.style.display = texto.includes(termo) ? '' : 'none';
    });
}

function getBadgeClass(status) {
    if (status === 'Concluído') return 'success';
    if (status === 'Pendente' || status === 'Em Separação') return 'warning';
    if (status === 'Cancelado') return 'danger';
    return 'neutral';
}

// --- CRUD: CREATE / UPDATE / DELETE ---

// Função para bloquear scroll do body
function bloquearScrollBody() {
    // Salva a posição atual do scroll
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Salva a posição para restaurar depois
    document.body.setAttribute('data-scroll-y', scrollY);
}

// Função para desbloquear scroll do body
function desbloquearScrollBody() {
    const scrollY = document.body.getAttribute('data-scroll-y') || '0';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // Restaura a posição do scroll
    window.scrollTo(0, parseInt(scrollY));
    document.body.removeAttribute('data-scroll-y');
}

// 1. CREATE (Novo)
window.abrirModalNovoPedido = function() {
    // Verifica permissão antes de abrir
    const userType = sessionStorage.getItem('userType');
    const podeAdicionar = (userType === 'adm' || userType === 'admin') || 
                         (window.BeiraMarPermissoes && window.BeiraMarPermissoes.podeAdicionar('vendas'));
    
    if (!podeAdicionar) {
        if(window.BeiraMarUtils) window.BeiraMarUtils.showToast('Você não tem permissão para adicionar pedidos!', 'error');
        return;
    }
    
    const modal = document.getElementById('modalNovoPedido');
    if(modal) {
        document.getElementById('formNovoPedido').reset();
        document.getElementById('editId').value = ''; 
        document.getElementById('tituloModalPedido').innerHTML = '<i class="fas fa-file-invoice-dollar"></i> Novo Pedido';
        document.getElementById('btnSalvarPedido').textContent = 'Salvar Pedido(s)';
        
        // Limpa a lista de itens
        itensPedidoAtual = [];
        atualizarListaItens();
        
        document.getElementById('npPrecoUnit').setAttribute('readonly', true);
        document.getElementById('npPrecoUnit').classList.add('readonly-field');
        
        // Bloqueia scroll do body
        bloquearScrollBody();
        document.body.classList.add('modal-aberto');
        
        modal.style.display = 'flex';
        setTimeout(() => document.getElementById('npCliente').focus(), 100);
    }
}

// 2. UPDATE (Editar)
window.abrirModalEditarPedido = function(id) {
    const venda = vendasData.find(v => v.id === id);
    if(!venda) return;

    const modal = document.getElementById('modalNovoPedido');
    if(modal) {
        document.getElementById('editId').value = venda.id;
        document.getElementById('npCliente').value = venda.cliente;
        document.getElementById('npStatus').value = venda.status;
        document.getElementById('npPagamento').value = venda.pagamento;

        // Carrega os produtos na lista de itens
        itensPedidoAtual = [];
        
        // Verifica se tem array de produtos ou usa estrutura antiga
        if (venda.produtos && Array.isArray(venda.produtos) && venda.produtos.length > 0) {
            // Usa o array de produtos
            itensPedidoAtual = venda.produtos.map(p => ({
                id: Date.now() + Math.random(), // ID temporário
                produto: p.produto,
                qtd: p.qtd,
                precoUnit: p.precoUnit,
                valorTotal: p.valorTotal || (p.qtd * p.precoUnit)
            }));
        } else {
            // Estrutura antiga - converte para novo formato
            itensPedidoAtual = [{
                id: Date.now(),
                produto: venda.produto || '',
                qtd: venda.qtd || 0,
                precoUnit: venda.precoUnit || 0,
                valorTotal: venda.valor || 0
            }];
        }

        atualizarListaItens();
        
        // Limpa campos de produto (não preenche automaticamente)
        document.getElementById('npProduto').value = '';
        document.getElementById('npQtd').value = '';
        document.getElementById('npPrecoUnit').value = '';
        document.getElementById('npValorTotal').value = '';
        
        document.getElementById('tituloModalPedido').innerHTML = `<i class="fas fa-edit"></i> Editar Pedido #${id}`;
        document.getElementById('btnSalvarPedido').textContent = 'Atualizar Pedido';

        // Bloqueia scroll do body
        bloquearScrollBody();
        document.body.classList.add('modal-aberto');

        modal.style.display = 'flex';
    }
}

// Lógica de Salvar
function salvarPedido() {
    const editId = document.getElementById('editId').value;
    
    const cliente = document.getElementById('npCliente').value;
    const status = document.getElementById('npStatus').value;
    const pagamento = document.getElementById('npPagamento').value;

    if (!cliente) {
        if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
            window.BeiraMarUtils.showToast('Preencha o nome do cliente!', 'error');
        } else {
            alert("Preencha o nome do cliente.");
        }
        return;
    }

    // Modo de edição (comportamento antigo para compatibilidade)
    if (editId) {
        // Modo de edição - usa itens da lista
        let produtosParaSalvar = [];
        
        if (itensPedidoAtual.length === 0) {
            // Fallback: tenta usar campos diretos
            const produto = document.getElementById('npProduto').value;
            const qtd = parseFloat(document.getElementById('npQtd').value);
            const precoUnit = parseFloat(document.getElementById('npPrecoUnit').value);
            const valorTotal = parseFloat(document.getElementById('npValorTotal').value);

            if (!produto || isNaN(qtd) || isNaN(valorTotal)) {
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast('Adicione pelo menos um item ao pedido!', 'error');
                } else {
                    alert("Adicione pelo menos um item ao pedido!");
                }
                return;
            }

            produtosParaSalvar.push({
                produto: produto,
                qtd: qtd,
                precoUnit: precoUnit,
                valorTotal: valorTotal
            });
        } else {
            produtosParaSalvar = [...itensPedidoAtual];
        }

        const index = vendasData.findIndex(v => v.id == editId);
        if (index !== -1) {
            // Calcula valor total
            const valorTotalPedido = produtosParaSalvar.reduce((total, item) => total + item.valorTotal, 0);
            const resumoItens = produtosParaSalvar.map(item => `${item.qtd}kg ${item.produto}`).join(', ');
            const primeiroProduto = produtosParaSalvar[0];

            // Obtém o nome do funcionário que está editando (ou mantém o original se não houver)
            const funcionarioAtualizador = obterNomeFuncionarioLogado();
            
            vendasData[index] = {
                ...vendasData[index],
                cliente: cliente,
                status: status,
                produtos: produtosParaSalvar,
                valor: valorTotalPedido,
                itens: resumoItens,
                pagamento: pagamento,
                atualizadoPor: funcionarioAtualizador, // Funcionário que atualizou
                // Mantém o criador original se existir
                criadoPor: vendasData[index].criadoPor || funcionarioAtualizador,
                // Compatibilidade
                produto: primeiroProduto.produto,
                qtd: primeiroProduto.qtd,
                precoUnit: primeiroProduto.precoUnit
            };
            salvarVendasNoLocalStorage();
            if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                window.BeiraMarUtils.showToast('Pedido atualizado!', 'success');
            }
        }
    } else {
        // Modo de criação - verifica se há itens na lista
        let produtosParaSalvar = [];
        
        if (itensPedidoAtual.length === 0) {
            // Fallback: tenta usar campos diretos (compatibilidade com código antigo)
            const produto = document.getElementById('npProduto').value;
            const qtd = parseFloat(document.getElementById('npQtd').value);
            const precoUnit = parseFloat(document.getElementById('npPrecoUnit').value);
            const valorTotal = parseFloat(document.getElementById('npValorTotal').value);

            if (!produto || isNaN(qtd) || isNaN(valorTotal)) {
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast('Adicione pelo menos um item ao pedido!', 'error');
                } else {
                    alert("Adicione pelo menos um item ao pedido!");
                }
                return;
            }

            // Adiciona produto único à lista
            produtosParaSalvar.push({
                produto: produto,
                qtd: qtd,
                precoUnit: precoUnit,
                valorTotal: valorTotal
            });
        } else {
            // Usa os itens da lista
            produtosParaSalvar = [...itensPedidoAtual];
        }

        // Cria UM ÚNICO pedido com todos os produtos
        const dataHora = 'Hoje, ' + new Date().toLocaleTimeString().slice(0,5);
        const novoId = 5000 + vendasData.length + 1;
        
        // Calcula valor total do pedido
        const valorTotalPedido = produtosParaSalvar.reduce((total, item) => total + item.valorTotal, 0);
        
        // Cria resumo dos itens
        const resumoItens = produtosParaSalvar.map(item => `${item.qtd}kg ${item.produto}`).join(', ');
        
        // Mantém compatibilidade com estrutura antiga (primeiro produto)
        const primeiroProduto = produtosParaSalvar[0];
        
        // Obtém o nome do funcionário que está criando a venda
        const funcionarioCriador = obterNomeFuncionarioLogado();
        
        const novaVenda = {
            id: novoId,
            cliente: cliente,
            valor: valorTotalPedido,
            status: status,
            data: dataHora,
            produtos: produtosParaSalvar, // Array com todos os produtos
            itens: resumoItens,
            pagamento: pagamento,
            criadoPor: funcionarioCriador, // Nome do funcionário que criou
            // Campos de compatibilidade (primeiro produto)
            produto: primeiroProduto.produto,
            qtd: primeiroProduto.qtd,
            precoUnit: primeiroProduto.precoUnit
        };
        
        vendasData.push(novaVenda);
        salvarVendasNoLocalStorage();
        
        if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
            window.BeiraMarUtils.showToast(`Pedido #${novoId} registrado com ${produtosParaSalvar.length} produto(s)!`, 'success');
        }
    }

    // Limpa a lista de itens após salvar
    itensPedidoAtual = [];
    atualizarTabelaVendas();
    atualizarResumoFinanceiro();
    fecharModalNovoPedido();
}

// 3. DELETE
window.excluirPedido = function(id) {
    if (window.BeiraMarModais && window.BeiraMarModais.showConfirm) {
        window.BeiraMarModais.showConfirm({
            title: 'Excluir Pedido',
            message: `Tem certeza que deseja excluir o pedido #${id}? Esta ação não pode ser desfeita.`,
            confirmText: 'Excluir',
            cancelText: 'Cancelar',
            icon: 'trash-alt',
            iconColor: '#ef4444',
            onConfirm: () => {
                vendasData = vendasData.filter(v => v.id !== id);
                salvarVendasNoLocalStorage(); // Salva após excluir
                atualizarTabelaVendas();
                atualizarResumoFinanceiro(); 
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast('Pedido excluído.', 'success');
                }
            }
        });
    } else {
        if(confirm(`Tem certeza que deseja excluir o pedido #${id}?`)) {
            vendasData = vendasData.filter(v => v.id !== id);
            atualizarTabelaVendas();
            atualizarResumoFinanceiro(); 
            if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                window.BeiraMarUtils.showToast('Pedido excluído.', 'success');
            }
        }
    }
}

// --- OUTROS MODAIS ---

window.fecharModalNovoPedido = function() {
    // Limpa a lista de itens ao fechar
    itensPedidoAtual = [];
    
    // Desbloqueia scroll do body
    desbloquearScrollBody();
    document.body.classList.remove('modal-aberto');
    
    if (document.getElementById('modalNovoPedido')) {
        document.getElementById('modalNovoPedido').style.display = 'none';
    }
}

window.abrirModalDetalhesVenda = function(id) {
    const venda = vendasData.find(v => v.id === id);
    if (!venda) return;

    const modal = document.getElementById('modalDetalhesVenda');
    
    // Bloqueia scroll do body
    bloquearScrollBody();
    document.body.classList.add('modal-aberto');
    
    document.getElementById('detalheVendaTitulo').textContent = `Pedido #${venda.id}`;
    const valorF = venda.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Verifica se tem array de produtos
    const produtos = (venda.produtos && Array.isArray(venda.produtos)) ? venda.produtos : 
                     [{ produto: venda.produto || '-', qtd: venda.qtd || 0, precoUnit: venda.precoUnit || 0, valorTotal: venda.valor || 0 }];

    let produtosHTML = '';
    if (produtos.length > 0) {
        produtosHTML = produtos.map((p, index) => `
            <div class="produto-card">
                <div class="detalhe-row"><strong>Produto ${produtos.length > 1 ? (index + 1) : ''}:</strong> <span>${p.produto}</span></div>
                <div class="detalhe-row"><strong>Quantidade:</strong> <span>${p.qtd} kg</span></div>
                <div class="detalhe-row"><strong>Preço/Kg:</strong> <span>R$ ${p.precoUnit.toFixed(2)}</span></div>
                <div class="detalhe-row"><strong>Subtotal:</strong> <span class="produto-subtotal">R$ ${p.valorTotal.toFixed(2)}</span></div>
            </div>
        `).join('');
    }

    // Informações do funcionário
    const funcionarioInfo = venda.criadoPor ? 
        `<div class="detalhe-row criado-por-row">
            <strong>Criado por:</strong> 
            <span class="criado-por-badge">
                <i class="fas fa-user"></i> 
                <span class="criado-por-nome">${venda.criadoPor}</span>
            </span>
        </div>` : 
        '';
    const atualizadoInfo = venda.atualizadoPor && venda.atualizadoPor !== venda.criadoPor ? 
        `<div class="detalhe-row"><strong>Atualizado por:</strong> <span style="color: #8e44ad; font-weight: 600;"><i class="fas fa-user-edit"></i> ${venda.atualizadoPor}</span></div>` : 
        '';

    document.getElementById('detalheVendaCorpo').innerHTML = `
        <div class="detalhe-grid">
            <div class="detalhe-row"><strong>Cliente:</strong> <span>${venda.cliente}</span></div>
            <div class="detalhe-row"><strong>Data/Hora:</strong> <span>${venda.data}</span></div>
            <div class="detalhe-row"><strong>Status:</strong> <span class="status-badge ${getBadgeClass(venda.status)}">${venda.status}</span></div>
            ${funcionarioInfo}
            ${atualizadoInfo}
            <hr class="vendas-separator"/>
            <div style="margin-bottom: 1rem;">
                <strong style="display: block; margin-bottom: 0.5rem; color: #0066cc;">Produtos (${produtos.length}):</strong>
                ${produtosHTML}
            </div>
            <hr class="vendas-separator"/>
            <div class="detalhe-row"><strong>Pagamento:</strong> <span>${venda.pagamento}</span></div>
            <div class="detalhe-row big-total"><strong>Total:</strong> <span>${valorF}</span></div>
        </div>
    `;
    modal.style.display = 'flex';
}

window.fecharModalDetalhesVenda = function() {
    // Desbloqueia scroll do body
    desbloquearScrollBody();
    document.body.classList.remove('modal-aberto');
    
    if (document.getElementById('modalDetalhesVenda')) {
        document.getElementById('modalDetalhesVenda').style.display = 'none';
    }
}

window.onclick = function(event) {
    const m1 = document.getElementById('modalNovoPedido');
    const m2 = document.getElementById('modalDetalhesVenda');
    if (event.target == m1) {
        fecharModalNovoPedido();
    }
    if (event.target == m2) {
        fecharModalDetalhesVenda();
    }
}

// --- CSS ATUALIZADO (CARDS COM GLOW E BORDA) ---

function addVendasStyles() {
    if (!document.getElementById('vendas-styles')) {
        const styles = document.createElement('style');
        styles.id = 'vendas-styles';
        styles.textContent = `
            :root {
                --vendas-primary: #0066cc;
                --vendas-bg: #f4f7f9;
                --vendas-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }

            #vendas .module-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 2rem; background: white; padding: 1.5rem;
                border-radius: 12px; box-shadow: var(--vendas-shadow);
            }
            #vendas .module-header h2 {
                margin: 0; color: #2c3e50; font-weight: 700; font-size: 1.5rem;
                border-left: 5px solid var(--vendas-primary); padding-left: 1rem;
            }

            #vendas .btn-primary {
                background: linear-gradient(135deg, #0066cc, #0052a3);
                color: white; border: none; padding: 0.7rem 1.4rem; border-radius: 50px;
                font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
                box-shadow: 0 4px 10px rgba(0, 102, 204, 0.2); transition: 0.2s;
            }
            #vendas .btn-primary:hover { transform: translateY(-2px); }

            /* --- CARDS RESUMO NOVO ESTILO --- */
            .vendas-summary {
                display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem; margin-bottom: 2rem;
            }
            .summary-card {
                background: white; padding: 1.5rem; border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;
                display: flex; justify-content: space-between; align-items: center;
                border-left: 5px solid #ccc; transition: transform 0.2s;
            }
            .summary-card:hover { transform: translateY(-4px); }
            
            /* Cores Específicas dos Cards */
            .card-blue { border-left-color: #0066cc; }
            .card-purple { border-left-color: #8e44ad; }
            .card-orange { border-left-color: #f39c12; }

            .card-content h3 { margin: 0; font-size: 0.9rem; color: #7f8c8d; text-transform: uppercase; letter-spacing: 0.5px; }
            .summary-number { margin: 5px 0; font-size: 1.8rem; font-weight: 800; color: #2c3e50; }
            .card-content span { font-size: 0.8rem; color: #95a5a6; }

            /* Ícone de Fundo (Marca d'água) */
            .card-icon {
                font-size: 3rem; opacity: 0.1; position: absolute; right: 15px; bottom: 10px; color: #333;
            }

            /* Tabela */
            .table-container { background: white; border-radius: 12px; box-shadow: var(--vendas-shadow); padding: 1.5rem; }
            .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
            .table-header h3 { margin: 0; color: #2c3e50; }
            
            .clean-input { padding: 0.6rem 1rem; border: 1px solid #eee; border-radius: 50px; background: #f8fafc; width: 250px; }
            .clean-input:focus { outline: none; border-color: var(--vendas-primary); background: white; }

            .modern-table { width: 100%; border-collapse: collapse; }
            .modern-table th { text-align: left; padding: 1rem; color: #7f8c8d; font-size: 0.85rem; border-bottom: 2px solid #f0f0f0; text-transform: uppercase; }
            .modern-table td { padding: 1rem; border-bottom: 1px solid #f9f9f9; color: #333; vertical-align: middle; }
            .modern-table tr:hover { background-color: #f8fbff; }

            .status-badge { 
                padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; 
                font-weight: 700; display: inline-block; white-space: nowrap; 
            }
            .status-badge.success { background: #d4edda; color: #155724; }
            .status-badge.warning { background: #fff3cd; color: #856404; }
            .status-badge.danger { background: #f8d7da; color: #721c24; }

            .btn-icon { background: #eef2f7; border: none; width: 32px; height: 32px; border-radius: 8px; color: #555; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; margin-right: 4px;}
            .btn-icon:hover { background: var(--vendas-primary); color: white; }
            .btn-icon.delete:hover { background: #dc3545; color: white; }

            .action-buttons { display: flex; gap: 4px; }

            .custom-modal-overlay { 
                position: fixed; 
                top: 0; 
                left: 0; 
                width: 100vw; 
                height: 100vh; 
                background: rgba(0,30,60,0.4); 
                z-index: 9999; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                backdrop-filter: blur(5px);
                overflow-y: auto;
                padding: 1rem;
                box-sizing: border-box;
                overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
            }
            
            /* Previne scroll no overlay quando o modal está aberto */
            body.modal-aberto {
                overflow: hidden !important;
                height: 100vh !important;
            }
            .custom-modal-content { 
                background: white; 
                width: 100%; 
                max-width: 600px; 
                max-height: calc(100vh - 2rem);
                border-radius: 16px; 
                overflow: hidden; 
                box-shadow: 0 20px 40px rgba(0,0,0,0.2); 
                animation: slideUp 0.3s ease;
                display: flex;
                flex-direction: column;
                margin: auto;
                position: relative;
            }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

            .modal-header { background: linear-gradient(135deg, #0066cc, #004499); padding: 1.2rem; display: flex; justify-content: space-between; align-items: center; color: white; }
            .modal-header h3 { margin: 0; font-size: 1.1rem; display: flex; gap: 0.5rem; align-items: center; }
            .btn-close-modal { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; opacity: 0.8; }
            .btn-close-modal:hover { opacity: 1; color: #ffcccc; }

            .modal-body { 
                padding: 2rem; 
                overflow-y: auto;
                overflow-x: hidden;
                flex: 1;
                max-height: calc(100vh - 180px);
                overscroll-behavior: contain;
            }
            
            .modal-body::-webkit-scrollbar {
                width: 8px;
            }
            
            .modal-body::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }
            
            .modal-body::-webkit-scrollbar-thumb {
                background: #0066cc;
                border-radius: 10px;
            }
            
            .modal-body::-webkit-scrollbar-thumb:hover {
                background: #0052a3;
            }
            .modal-footer { padding: 1rem 2rem; background: #f9f9f9; text-align: right; display: flex; justify-content: flex-end; gap: 1rem; }

            .form-group { margin-bottom: 1rem; }
            .form-group label { display: block; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.85rem; color: #555; }
            .form-control { width: 100%; padding: 0.7rem; border: 2px solid #eee; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; }
            .form-control:focus { border-color: var(--vendas-primary); outline: none; }
            .readonly-field { background-color: #e9ecef; color: #666; cursor: not-allowed; }

            .vendas-row { display: flex; gap: 1rem; }
            .vendas-col { flex: 1; }
            .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; border-top: 1px dashed #eee; padding-top: 1rem; }

            .btn-secondary { background: #edf2f7; color: #555; border: none; padding: 0.7rem 1.4rem; border-radius: 50px; font-weight: 600; cursor: pointer; }
            .btn-secondary:hover { background: #e2e8f0; }

            .detalhe-row { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
            .detalhe-box { background: #f8f9fa; padding: 1rem; border-radius: 8px; font-size: 0.9rem; color: #555; border: 1px solid #eee; }
            .big-total { font-size: 1.2rem; color: #0066cc; font-weight: 700; margin-top: 1rem; }
            
            /* Estilo para cards de produtos */
            .produto-card {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 0.5rem;
                border-left: 3px solid #0066cc;
                transition: all 0.3s ease;
            }
            .produto-card:hover {
                box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
            }
            .produto-subtotal {
                color: #0066cc;
                font-weight: 600;
            }
            
            /* Estilo para "Criado por" */
            .criado-por-row {
                margin-bottom: 0.75rem;
                padding: 0.75rem 1rem;
                background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
                border-radius: 10px;
                border-left: 4px solid #0066cc;
                box-shadow: 0 2px 4px rgba(0, 102, 204, 0.08);
                transition: all 0.3s ease;
            }
            .criado-por-row:hover {
                box-shadow: 0 4px 8px rgba(0, 102, 204, 0.12);
                transform: translateY(-1px);
            }
            .criado-por-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                color: #0066cc;
                font-weight: 600;
                font-size: 0.95rem;
                padding: 0.4rem 0.8rem;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 20px;
                box-shadow: 0 1px 3px rgba(0, 102, 204, 0.15);
            }
            .criado-por-badge i {
                font-size: 0.9rem;
                color: #0066cc;
                opacity: 0.9;
            }
            .criado-por-nome {
                letter-spacing: 0.3px;
            }
            .vendas-separator { border: 0; border-top: 1px dashed #eee; margin: 1rem 0; }
            .fw-bold { font-weight: 600; }
            .text-blue { color: #0066cc; }
            .text-muted { color: #888; font-size: 0.85rem; }

            @media (max-width: 768px) {
                .vendas-row { flex-direction: column; gap: 0; }
                .vendas-summary { grid-template-columns: 1fr; }
                
                .custom-modal-overlay {
                    padding: 0.5rem;
                    align-items: flex-start;
                    padding-top: 1rem;
                }
                
                .custom-modal-overlay {
                    padding: 0.5rem;
                    align-items: flex-start;
                    padding-top: 1rem;
                }
                
                .custom-modal-content {
                    max-width: 100%;
                    max-height: calc(100vh - 1rem);
                    border-radius: 12px;
                    margin: 0;
                }
                
                .modal-body {
                    padding: 1.5rem;
                    max-height: calc(100vh - 140px);
                }
                
                .modal-header {
                    padding: 1rem;
                }
                
                .modal-header h3 {
                    font-size: 1rem;
                }
                
                .form-actions {
                    flex-direction: column;
                }
                
                .form-actions button {
                    width: 100%;
                }
            }

            /* =========================================
               TEMA ESCURO - VENDAS E MODAIS
               ========================================= */

            [data-theme="dark"] #vendas .module-header {
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] #vendas .module-header h2 {
                color: #f1f5f9;
            }

            [data-theme="dark"] .summary-card {
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .summary-card:hover {
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
            }

            [data-theme="dark"] .card-content h3 {
                color: #cbd5e1;
            }

            [data-theme="dark"] .summary-number {
                color: #f1f5f9;
            }

            [data-theme="dark"] .card-content span {
                color: #94a3b8;
            }

            [data-theme="dark"] .card-icon {
                color: #475569;
                opacity: 0.3;
            }

            /* Container da Tabela - Tema Escuro */
            [data-theme="dark"] .table-container {
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .table-header h3 {
                color: #f1f5f9;
            }

            [data-theme="dark"] .clean-input {
                background: #334155;
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #f1f5f9;
            }

            [data-theme="dark"] .clean-input:focus {
                background: #475569;
                border-color: #60a5fa;
            }

            [data-theme="dark"] .clean-input::placeholder {
                color: #94a3b8;
            }

            /* Tabela - Tema Escuro */
            [data-theme="dark"] .modern-table th {
                background-color: #334155;
                color: #cbd5e1;
                border-bottom: 2px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .modern-table td {
                color: #f1f5f9;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            /* 6ª coluna (Data) - Tema Escuro - Força cor branca */
            [data-theme="dark"] .modern-table td:nth-child(6),
            [data-theme="dark"] .modern-table td.text-muted {
                color: #f1f5f9 !important;
            }

            [data-theme="dark"] .modern-table tr:hover {
                background-color: rgba(255, 255, 255, 0.05);
            }

            /* Badges de Status - Ajuste para tema escuro */
            [data-theme="dark"] .status-badge.success {
                background: rgba(16, 185, 129, 0.2);
                color: #6ee7b7;
            }

            [data-theme="dark"] .status-badge.warning {
                background: rgba(251, 191, 36, 0.2);
                color: #fcd34d;
            }

            [data-theme="dark"] .status-badge.danger {
                background: rgba(239, 68, 68, 0.2);
                color: #fca5a5;
            }

            /* Botões de Ação - Tema Escuro */
            [data-theme="dark"] .btn-icon {
                background: #334155;
                color: #cbd5e1;
            }

            [data-theme="dark"] .btn-icon:hover {
                background: #3b82f6;
                color: white;
            }

            [data-theme="dark"] .btn-icon.delete:hover {
                background: #ef4444;
                color: white;
            }

            /* Modais - Tema Escuro */
            [data-theme="dark"] .custom-modal-overlay {
                background: rgba(0, 0, 0, 0.6);
            }

            [data-theme="dark"] .custom-modal-content {
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .modal-body {
                background: #1e293b;
                color: #f1f5f9;
            }

            [data-theme="dark"] .modal-footer {
                background: #1e293b;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            /* Formulários - Tema Escuro */
            [data-theme="dark"] .form-group label {
                color: #cbd5e1;
            }

            [data-theme="dark"] .form-control {
                background: #334155;
                border: 2px solid rgba(255, 255, 255, 0.1);
                color: #f1f5f9;
            }

            [data-theme="dark"] .form-control:focus {
                background: #475569;
                border-color: #60a5fa;
            }

            [data-theme="dark"] .readonly-field {
                background: #475569;
                color: #94a3b8;
                border-color: rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .form-control::placeholder {
                color: #94a3b8;
            }

            [data-theme="dark"] #vendas .btn-secondary {
                background: #334155;
                color: #cbd5e1;
            }

            [data-theme="dark"] #vendas .btn-secondary:hover {
                background: #475569;
            }

            /* Detalhes - Tema Escuro */
            [data-theme="dark"] .detalhe-row {
                color: #f1f5f9;
            }

            [data-theme="dark"] .detalhe-box {
                background: #334155;
                color: #f1f5f9;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .big-total {
                color: #60a5fa;
            }

            [data-theme="dark"] .vendas-separator {
                border-top-color: rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .form-actions {
                border-top-color: rgba(255, 255, 255, 0.1);
            }

            /* Estilo "Criado por" - Tema Escuro */
            [data-theme="dark"] .criado-por-row {
                background: linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(30, 64, 175, 0.2) 100%);
                border-left-color: #60a5fa;
                box-shadow: 0 2px 4px rgba(96, 165, 250, 0.15);
            }
            [data-theme="dark"] .criado-por-row:hover {
                box-shadow: 0 4px 8px rgba(96, 165, 250, 0.25);
            }
            [data-theme="dark"] .criado-por-badge {
                color: #60a5fa;
                background: rgba(30, 58, 138, 0.4);
                box-shadow: 0 1px 3px rgba(96, 165, 250, 0.2);
            }
            [data-theme="dark"] .criado-por-badge i {
                color: #60a5fa;
            }

            /* Estilo cards de produtos - Tema Escuro */
            [data-theme="dark"] .produto-card {
                background: #334155;
                border-left-color: #60a5fa;
                color: #f1f5f9;
            }
            [data-theme="dark"] .produto-card:hover {
                box-shadow: 0 2px 8px rgba(96, 165, 250, 0.2);
                background: #3d4a5f;
            }
            [data-theme="dark"] .produto-card .detalhe-row {
                color: #f1f5f9;
            }
            [data-theme="dark"] .produto-card .detalhe-row strong {
                color: #cbd5e1;
            }
            [data-theme="dark"] .produto-card .detalhe-row span {
                color: #e2e8f0;
            }
            [data-theme="dark"] .produto-subtotal {
                color: #60a5fa;
            }

            [data-theme="dark"] .text-blue {
                color: #60a5fa;
            }

            [data-theme="dark"] .text-muted {
                color: #94a3b8;
            }

            /* Estilos para lista de itens do pedido */
            .item-pedido-linha {
                transition: all 0.2s ease;
            }
            .item-pedido-linha:hover {
                background: #e8f4ff !important;
                transform: translateX(4px);
            }
            [data-theme="dark"] .item-pedido-linha {
                background: #334155 !important;
                border-left-color: #60a5fa !important;
            }
            [data-theme="dark"] .item-pedido-linha:hover {
                background: #475569 !important;
            }
            [data-theme="dark"] .item-pedido-linha strong {
                color: #f1f5f9;
            }
            [data-theme="dark"] .item-pedido-linha small {
                color: #cbd5e1;
            }

            #listaItensPedido {
                margin: 1rem 0;
            }

            #itensLista {
                max-height: 300px;
                overflow-y: auto;
                padding: 0.5rem;
            }

            #itensLista::-webkit-scrollbar {
                width: 6px;
            }

            #itensLista::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }

            #itensLista::-webkit-scrollbar-thumb {
                background: #0066cc;
                border-radius: 10px;
            }

            #itensLista::-webkit-scrollbar-thumb:hover {
                background: #0052a3;
            }

            [data-theme="dark"] #itensLista::-webkit-scrollbar-track {
                background: #334155;
            }

            [data-theme="dark"] #itensLista::-webkit-scrollbar-thumb {
                background: #60a5fa;
            }

            #totalGeralPedido {
                border: 2px solid #0066cc;
            }

            [data-theme="dark"] #totalGeralPedido {
                background: #1e3a5f !important;
                border-color: #60a5fa;
            }

            .btn-success {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border: none;
                padding: 0.7rem 1.4rem;
                border-radius: 50px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);
                transition: 0.2s;
            }

            .btn-success:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
            }

            [data-theme="dark"] .btn-success {
                background: linear-gradient(135deg, #059669, #047857);
            }
        `;
        document.head.appendChild(styles);
    }
}

window.BeiraMarVendas = { loadVendasContent, addVendasStyles };

// ==========================================================
// AUTO-CARREGAMENTO DE VENDAS (GARANTE QUE A PÁGINA NÃO FIQUE VAZIA)
// ==========================================================
function verificarECarregarVendas() {
    const vendasPage = document.getElementById('vendas');
    if (!vendasPage) return;
    
    const isVisible = vendasPage.classList.contains('active') || 
                     vendasPage.style.display === 'block';
    const temLoading = vendasPage.querySelector('.vendas-loading');
    const temOverlay = document.querySelector('.overlay-acesso-negado-vendas');
    
    // Se já tem overlay de acesso negado, não recarrega
    if (temOverlay) return;
    
    // Verifica o acesso quando a página fica visível
    if (isVisible) {
        const nivelAcesso = obterNivelAcessoUsuarioVendas();
        if (nivelAcesso === 'operador' || nivelAcesso === 'visualizador') {
            // Se não tem overlay ainda, adiciona
            if (!temOverlay) {
                mostrarOverlayAcessoNegadoVendas();
            }
            return;
        }
    }
    
    if (isVisible && temLoading) {
        console.log('💰 Auto-carregando conteúdo de Vendas...');
        loadVendasContent();
    }
}

const vendasObserver = new MutationObserver(function() {
    verificarECarregarVendas();
});

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const vendasPage = document.getElementById('vendas');
        if (vendasPage) {
            vendasObserver.observe(vendasPage, { attributes: true, attributeFilter: ['class', 'style'] });
            verificarECarregarVendas();
        }
    }, 500);
});

setInterval(verificarECarregarVendas, 500);
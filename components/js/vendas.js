// =========================================
// GESTÃO DE VENDAS - CLEAN UI AZUL (VISUAL DOS CARDS ATUALIZADO)
// =========================================

// Funções para salvar/carregar do localStorage
function carregarVendasDoLocalStorage() {
    try {
        const vendasSalvas = localStorage.getItem('vendasData');
        if (vendasSalvas) {
            vendasData = JSON.parse(vendasSalvas);
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

// Dados Simulados de Vendas
let vendasData = [
    { 
        id: 5001, 
        cliente: 'Restaurante Mar Azul', 
        valor: 1250.00, 
        status: 'Concluído', 
        data: 'Hoje, 10:30', 
        produto: 'Salmão Fresco', 
        itens: '20kg Salmão Fresco',
        pagamento: 'Pix',
        qtd: 20,
        precoUnit: 62.50
    },
    { 
        id: 5002, 
        cliente: 'Hotel Palace', 
        valor: 4500.00, 
        status: 'Pendente', 
        data: 'Hoje, 09:15', 
        produto: 'Tilápia Inteira',
        itens: '375kg Tilápia Inteira',
        pagamento: 'Boleto 15 dias',
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
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h4 style="margin: 0; color: #2c3e50; font-size: 1.1rem;">Itens do Pedido</h4>
                            <button type="button" class="btn btn-primary" onclick="adicionarItemPedido()" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
                                <i class="fas fa-plus"></i> Adicionar Item
                            </button>
                        </div>

                        <div id="listaItensPedido" style="margin-bottom: 1.5rem;">
                            <!-- Itens serão adicionados aqui dinamicamente -->
                        </div>

                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border: 2px solid #0066cc;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong style="font-size: 1.1rem; color: #2c3e50;">Total do Pedido:</strong>
                                <span id="totalGeralPedido" style="font-size: 1.5rem; font-weight: 700; color: #0066cc;">R$ 0,00</span>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="fecharModalNovoPedido()">Cancelar</button>
                            <button type="submit" class="btn btn-primary" id="btnSalvarPedido">Salvar Pedido</button>
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

// --- LÓGICA DE MÚLTIPLOS ITENS ---

// Garante que contadorItens seja global
if(typeof window.contadorItens === 'undefined') {
    window.contadorItens = 0;
}
let contadorItens = window.contadorItens;

window.adicionarItemPedido = function() {
    const listaItens = document.getElementById('listaItensPedido');
    if (!listaItens) {
        console.error('❌ Lista de itens não encontrada ao adicionar item!');
        return;
    }
    
    // Incrementa contador (garante que seja global)
    if(typeof window.contadorItens === 'undefined') {
        window.contadorItens = 0;
    }
    window.contadorItens++;
    contadorItens = window.contadorItens;
    const itemId = `item_${contadorItens}`;
    
    const itemHTML = `
        <div class="item-pedido" id="${itemId}" style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border: 1px solid #e0e0e0; position: relative;">
            <button type="button" onclick="removerItemPedido('${itemId}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #dc3545; color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;" title="Remover item">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="vendas-row">
                <div class="vendas-col" style="flex: 2;">
                    <div class="form-group">
                        <label>Produto</label>
                        <select class="form-control item-produto" onchange="atualizarPrecoItem('${itemId}')" required>
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
                        <input type="number" class="form-control item-preco readonly-field" step="0.01" readonly>
                    </div>
                </div>
            </div>

            <div class="vendas-row">
                <div class="vendas-col">
                    <div class="form-group">
                        <label>Quantidade (kg)</label>
                        <input type="number" class="form-control item-qtd" step="0.1" placeholder="0.0" oninput="calcularTotalItem('${itemId}'); calcularTotalGeralPedido();" required>
                    </div>
                </div>
                <div class="vendas-col">
                    <div class="form-group">
                        <label style="color: #0066cc;">Subtotal (R$)</label>
                        <input type="number" class="form-control item-total readonly-field" step="0.01" placeholder="0.00" readonly>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    listaItens.insertAdjacentHTML('beforeend', itemHTML);
}

window.removerItemPedido = function(itemId) {
    const item = document.getElementById(itemId);
    if (item) {
        item.remove();
        calcularTotalGeralPedido();
    }
}

window.atualizarPrecoItem = function(itemId) {
    const item = document.getElementById(itemId);
    if (!item) return;
    
    const produtoSelect = item.querySelector('.item-produto').value;
    const precoInput = item.querySelector('.item-preco');
    
    if (tabelaPrecos[produtoSelect] !== undefined) {
        if (produtoSelect === 'Outros') {
            precoInput.value = '';
            precoInput.removeAttribute('readonly');
            precoInput.classList.remove('readonly-field');
            precoInput.focus();
            precoInput.oninput = function() {
                calcularTotalItem(itemId);
                calcularTotalGeralPedido();
            };
        } else {
            precoInput.value = tabelaPrecos[produtoSelect].toFixed(2);
            precoInput.setAttribute('readonly', true);
            precoInput.classList.add('readonly-field');
            precoInput.oninput = null;
        }
        calcularTotalItem(itemId);
        calcularTotalGeralPedido();
    }
}

window.calcularTotalItem = function(itemId) {
    const item = document.getElementById(itemId);
    if (!item) return;
    
    const qtd = parseFloat(item.querySelector('.item-qtd').value) || 0;
    const precoUnit = parseFloat(item.querySelector('.item-preco').value) || 0;
    const total = qtd * precoUnit;
    item.querySelector('.item-total').value = total.toFixed(2);
}

window.calcularTotalGeralPedido = function() {
    const totalGeral = document.getElementById('totalGeralPedido');
    if (!totalGeral) return;
    
    let soma = 0;
    const itens = document.querySelectorAll('.item-pedido');
    
    itens.forEach(item => {
        const totalItem = parseFloat(item.querySelector('.item-total').value) || 0;
        soma += totalItem;
    });
    
    totalGeral.textContent = soma.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- LÓGICA DE CÁLCULO DE PREÇO (mantida para compatibilidade) ---

window.atualizarPrecoUnitario = function() {
    // Função mantida para compatibilidade, mas não é mais usada no novo formato
    const produtoSelect = document.getElementById('npProduto');
    if (produtoSelect) {
        const produtoValue = produtoSelect.value;
        const precoInput = document.getElementById('npPrecoUnit');
        if (precoInput && tabelaPrecos[produtoValue] !== undefined) {
            if (produtoValue === 'Outros') {
                precoInput.value = '';
                precoInput.removeAttribute('readonly');
                precoInput.classList.remove('readonly-field');
            } else {
                precoInput.value = tabelaPrecos[produtoValue].toFixed(2);
                precoInput.setAttribute('readonly', true);
                precoInput.classList.add('readonly-field');
            }
        }
    }
}

window.calcularTotalPedido = function() {
    // Função mantida para compatibilidade
    calcularTotalGeralPedido();
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

        tr.innerHTML = `
            <td>#${venda.id}</td>
            <td class="fw-bold">${venda.cliente}</td>
            <td>${venda.itens}</td>
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
    if(!modal) {
        console.error('❌ Modal não encontrado!');
        if(window.BeiraMarUtils) window.BeiraMarUtils.showToast('Erro ao abrir modal. Recarregue a página.', 'error');
        return;
    }

    // Garante que o formulário existe
    const form = document.getElementById('formNovoPedido');
    if(!form) {
        console.error('❌ Formulário não encontrado!');
        if(window.BeiraMarUtils) window.BeiraMarUtils.showToast('Erro ao abrir formulário. Recarregue a página.', 'error');
        return;
    }

    try {
        form.reset();
        const editIdInput = document.getElementById('editId');
        if(editIdInput) editIdInput.value = '';
        
        const tituloModal = document.getElementById('tituloModalPedido');
        if(tituloModal) tituloModal.innerHTML = '<i class="fas fa-file-invoice-dollar"></i> Novo Pedido';
        
        const btnSalvar = document.getElementById('btnSalvarPedido');
        if(btnSalvar) btnSalvar.textContent = 'Registrar Venda';
        
        // Limpa a lista de itens
        const listaItens = document.getElementById('listaItensPedido');
        if (listaItens) {
            listaItens.innerHTML = '';
        } else {
            console.error('❌ Lista de itens não encontrada!');
        }
        
        // Reseta o contador
        if(typeof contadorItens !== 'undefined') {
            contadorItens = 0;
        } else {
            window.contadorItens = 0;
        }
        
        // Adiciona o primeiro item automaticamente (com delay para garantir que o DOM está pronto)
        setTimeout(() => {
            if(typeof window.adicionarItemPedido === 'function') {
                window.adicionarItemPedido();
            } else {
                console.error('❌ Função adicionarItemPedido não encontrada!');
            }
            
            // Atualiza o total geral
            if(typeof window.calcularTotalGeralPedido === 'function') {
                window.calcularTotalGeralPedido();
            }
        }, 50);
        
        modal.style.display = 'flex';
        
        // Bloqueia scroll do body quando modal está aberto
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Foca no campo cliente
        setTimeout(() => {
            const clienteInput = document.getElementById('npCliente');
            if(clienteInput) clienteInput.focus();
        }, 150);
    } catch(error) {
        console.error('❌ Erro ao abrir modal:', error);
        if(window.BeiraMarUtils) window.BeiraMarUtils.showToast('Erro ao abrir modal. Tente novamente.', 'error');
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

        // Limpa a lista de itens
        const listaItens = document.getElementById('listaItensPedido');
        if (listaItens) {
            listaItens.innerHTML = '';
        }
        contadorItens = 0;

        // Se tiver itens detalhados (novo formato), carrega todos
        if (venda.itensDetalhados && Array.isArray(venda.itensDetalhados)) {
            venda.itensDetalhados.forEach(item => {
                adicionarItemPedido();
                const ultimoItem = document.querySelectorAll('.item-pedido');
                const itemAtual = ultimoItem[ultimoItem.length - 1];
                
                if (itemAtual) {
                    itemAtual.querySelector('.item-produto').value = item.produto;
                    itemAtual.querySelector('.item-qtd').value = item.qtd;
                    itemAtual.querySelector('.item-preco').value = item.precoUnit.toFixed(2);
                    itemAtual.querySelector('.item-total').value = item.subtotal.toFixed(2);
                    
                    // Se for "Outros", permite editar o preço
                    if (item.produto === 'Outros') {
                        const precoInput = itemAtual.querySelector('.item-preco');
                        precoInput.removeAttribute('readonly');
                        precoInput.classList.remove('readonly-field');
                    }
                }
            });
        } else {
            // Modo compatibilidade - carrega item único (estrutura antiga)
            adicionarItemPedido();
            const itemAtual = document.querySelector('.item-pedido');
            if (itemAtual && venda.produto) {
                itemAtual.querySelector('.item-produto').value = venda.produto;
                itemAtual.querySelector('.item-qtd').value = venda.qtd || 0;
                itemAtual.querySelector('.item-preco').value = (venda.precoUnit || 0).toFixed(2);
                const subtotal = (venda.qtd || 0) * (venda.precoUnit || 0);
                itemAtual.querySelector('.item-total').value = subtotal.toFixed(2);
            }
        }

        calcularTotalGeralPedido();
        document.getElementById('tituloModalPedido').innerHTML = `<i class="fas fa-edit"></i> Editar Pedido #${id}`;
        document.getElementById('btnSalvarPedido').textContent = 'Atualizar Pedido';

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
        if(window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
            window.BeiraMarUtils.showToast('Preencha o nome do cliente!', 'error');
        } else {
            alert("Preencha o nome do cliente.");
        }
        return;
    }

    // Coleta todos os itens do pedido
    const itens = [];
    const itensDOM = document.querySelectorAll('.item-pedido');
    
    if (itensDOM.length === 0) {
        if(window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
            window.BeiraMarUtils.showToast('Adicione pelo menos um item ao pedido!', 'error');
        } else {
            alert("Adicione pelo menos um item ao pedido.");
        }
        return;
    }

    let valorTotal = 0;
    let resumoItens = [];
    
    itensDOM.forEach((item, index) => {
        const produto = item.querySelector('.item-produto').value;
        const qtd = parseFloat(item.querySelector('.item-qtd').value) || 0;
        const precoUnit = parseFloat(item.querySelector('.item-preco').value) || 0;
        const subtotal = parseFloat(item.querySelector('.item-total').value) || 0;

        if (!produto || qtd <= 0 || precoUnit <= 0) {
            if(window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                window.BeiraMarUtils.showToast(`Item ${index + 1}: Preencha todos os campos corretamente!`, 'error');
            } else {
                alert(`Item ${index + 1}: Preencha todos os campos corretamente.`);
            }
            return;
        }

        itens.push({
            produto: produto,
            qtd: qtd,
            precoUnit: precoUnit,
            subtotal: subtotal
        });

        resumoItens.push(`${qtd}kg ${produto}`);
        valorTotal += subtotal;
    });

    if (itens.length === 0) {
        if(window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
            window.BeiraMarUtils.showToast('Adicione pelo menos um item válido ao pedido!', 'error');
        } else {
            alert("Adicione pelo menos um item válido ao pedido.");
        }
        return;
    }

    const resumoItensTexto = resumoItens.join(', ');

    if (editId) {
        // Modo edição - mantém compatibilidade com estrutura antiga
        const index = vendasData.findIndex(v => v.id == editId);
        if (index !== -1) {
            const vendaAntiga = vendasData[index];
            vendasData[index] = {
                ...vendaAntiga,
                cliente: cliente,
                status: status,
                valor: valorTotal,
                itens: resumoItensTexto,
                pagamento: pagamento,
                itensDetalhados: itens, // Nova propriedade para múltiplos itens
                // Mantém compatibilidade com estrutura antiga
                produto: itens[0].produto,
                qtd: itens[0].qtd,
                precoUnit: itens[0].precoUnit
            };
            salvarVendasNoLocalStorage();
            if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                window.BeiraMarUtils.showToast('Pedido atualizado!', 'success');
            }
        }
    } else {
        // Novo pedido
        const novoId = 5000 + vendasData.length + 1;
        
        // Verifica se é funcionário (não admin) para salvar quem fez a adição
        const userType = sessionStorage.getItem('userType');
        let funcionarioAdicionou = null;
        
        if (userType === 'funcionario') {
            // Busca o nome do funcionário
            const email = sessionStorage.getItem('userEmail');
            if (email && window.funcionariosLista) {
                const funcionario = window.funcionariosLista.find(f => 
                    f.email && f.email.toLowerCase() === email.toLowerCase()
                );
                if (funcionario) {
                    funcionarioAdicionou = funcionario.nome || email.split('@')[0];
                } else {
                    // Se não encontrar, usa o email como fallback
                    funcionarioAdicionou = email.split('@')[0];
                }
            } else if (email) {
                funcionarioAdicionou = email.split('@')[0];
            }
        }
        
        const novaVenda = {
            id: novoId,
            cliente: cliente,
            valor: valorTotal,
            status: status,
            data: 'Hoje, ' + new Date().toLocaleTimeString().slice(0,5),
            itens: resumoItensTexto,
            pagamento: pagamento,
            itensDetalhados: itens, // Array com todos os itens
            // Mantém compatibilidade com estrutura antiga (usa o primeiro item)
            produto: itens[0].produto,
            qtd: itens[0].qtd,
            precoUnit: itens[0].precoUnit,
            // Adiciona informação do funcionário que fez a venda (se não for admin)
            funcionarioAdicionou: funcionarioAdicionou
        };
        vendasData.push(novaVenda);
        salvarVendasNoLocalStorage();
        if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
            window.BeiraMarUtils.showToast(`Pedido com ${itens.length} item(ns) registrado com sucesso!`, 'success');
        }
    }

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
    const modal = document.getElementById('modalNovoPedido');
    if (modal) {
        modal.style.display = 'none';
        
        // Restaura scroll do body quando modal fecha
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        // Limpa a lista de itens ao fechar
        const listaItens = document.getElementById('listaItensPedido');
        if (listaItens) {
            listaItens.innerHTML = '';
        }
        // Reseta o contador (garante que seja global)
        window.contadorItens = 0;
        contadorItens = 0;
        // Reseta o formulário
        const form = document.getElementById('formNovoPedido');
        if (form) {
            form.reset();
        }
        // Reseta o total geral
        const totalGeral = document.getElementById('totalGeralPedido');
        if (totalGeral) {
            totalGeral.textContent = 'R$ 0,00';
        }
    }
}

window.abrirModalDetalhesVenda = function(id) {
    const venda = vendasData.find(v => v.id === id);
    if (!venda) return;

    const modal = document.getElementById('modalDetalhesVenda');
    document.getElementById('detalheVendaTitulo').textContent = `Pedido #${venda.id}`;
    const valorF = venda.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    let itensHTML = '';
    
    // Se tiver itens detalhados (novo formato), mostra todos
    if (venda.itensDetalhados && Array.isArray(venda.itensDetalhados)) {
        itensHTML = '<div style="margin: 1rem 0;"><strong style="display: block; margin-bottom: 0.5rem;">Itens do Pedido:</strong>';
        venda.itensDetalhados.forEach((item, index) => {
            const subtotal = item.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            itensHTML += `
                <div style="background: #f8f9fa; padding: 0.8rem; border-radius: 6px; margin-bottom: 0.5rem; border-left: 3px solid #0066cc;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${index + 1}. ${item.produto}</strong><br>
                            <span style="color: #666; font-size: 0.9rem;">${item.qtd} kg × R$ ${item.precoUnit.toFixed(2)}/kg</span>
                        </div>
                        <strong style="color: #0066cc;">${subtotal}</strong>
                    </div>
                </div>
            `;
        });
        itensHTML += '</div>';
    } else {
        // Modo compatibilidade - mostra item único
        itensHTML = `
            <div class="detalhe-row"><strong>Produto:</strong> <span>${venda.produto || '-'}</span></div>
            <div class="detalhe-row"><strong>Quantidade:</strong> <span>${venda.qtd || '-'} kg</span></div>
            <div class="detalhe-row"><strong>Preço/Kg:</strong> <span>R$ ${venda.precoUnit ? venda.precoUnit.toFixed(2) : '-'}</span></div>
        `;
    }

    // Verifica se é admin para mostrar o funcionário que adicionou
    const userType = sessionStorage.getItem('userType');
    let funcionarioInfo = '';
    
    if ((userType === 'adm' || userType === 'admin') && venda.funcionarioAdicionou) {
        funcionarioInfo = `
            <hr class="vendas-separator"/>
            <div class="detalhe-row">
                <strong style="color: #0066cc;">
                    <i class="fas fa-user-tag" style="margin-right: 0.5rem;"></i>Adicionado por:
                </strong> 
                <span style="color: #666;">${venda.funcionarioAdicionou}</span>
            </div>
        `;
    }

    document.getElementById('detalheVendaCorpo').innerHTML = `
        <div class="detalhe-grid">
            <div class="detalhe-row"><strong>Cliente:</strong> <span>${venda.cliente}</span></div>
            <div class="detalhe-row"><strong>Data/Hora:</strong> <span>${venda.data}</span></div>
            <div class="detalhe-row"><strong>Status:</strong> <span class="status-badge ${getBadgeClass(venda.status)}">${venda.status}</span></div>
            <hr class="vendas-separator"/>
            ${itensHTML}
            <hr class="vendas-separator"/>
            <div class="detalhe-row"><strong>Pagamento:</strong> <span>${venda.pagamento}</span></div>
            ${funcionarioInfo}
            <div class="detalhe-row big-total"><strong>Total:</strong> <span>${valorF}</span></div>
        </div>
    `;
    modal.style.display = 'flex';
    
    // Bloqueia scroll do body quando modal está aberto
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

window.fecharModalDetalhesVenda = function() {
    const modal = document.getElementById('modalDetalhesVenda');
    if (modal) {
        modal.style.display = 'none';
        
        // Restaura scroll do body quando modal fecha
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
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
                align-items: flex-start;
                justify-content: center; 
                backdrop-filter: blur(5px);
                overflow-y: auto;
                overflow-x: hidden;
                padding: 2rem 1rem;
            }
            .custom-modal-content { 
                background: white; 
                width: 95%; 
                max-width: 600px; 
                border-radius: 16px; 
                overflow: hidden; 
                box-shadow: 0 20px 40px rgba(0,0,0,0.2); 
                animation: slideUp 0.3s ease;
                display: flex;
                flex-direction: column;
                max-height: calc(100vh - 4rem);
                margin: 0 auto;
            }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

            .modal-header { 
                background: linear-gradient(135deg, #0066cc, #004499); 
                padding: 1.2rem; 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                color: white;
                flex-shrink: 0;
            }
            .modal-header h3 { margin: 0; font-size: 1.1rem; display: flex; gap: 0.5rem; align-items: center; }
            .btn-close-modal { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; opacity: 0.8; transition: all 0.2s ease; }
            .btn-close-modal:hover { opacity: 1; color: white !important; background: rgba(255, 255, 255, 0.1); border-radius: 4px; }

            .modal-body { 
                padding: 2rem; 
                overflow-y: auto;
                overflow-x: hidden;
                flex: 1;
                -webkit-overflow-scrolling: touch;
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
            .vendas-separator { border: 0; border-top: 1px dashed #eee; margin: 1rem 0; }
            .fw-bold { font-weight: 600; }
            .text-blue { color: #0066cc; }
            .text-muted { color: #888; font-size: 0.85rem; }

            /* Estilos para itens do pedido */
            .item-pedido {
                transition: all 0.2s ease;
            }
            .item-pedido:hover {
                border-color: #0066cc !important;
                box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
            }
            .item-pedido button[onclick*="removerItemPedido"] {
                transition: all 0.2s ease;
            }
            .item-pedido button[onclick*="removerItemPedido"]:hover {
                background: #c82333 !important;
                transform: scale(1.1);
            }

            @media (max-width: 768px) {
                .vendas-row { flex-direction: column; gap: 0; }
                .vendas-summary { grid-template-columns: 1fr; }
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

            [data-theme="dark"] .text-blue {
                color: #60a5fa;
            }

            [data-theme="dark"] .text-muted {
                color: #94a3b8;
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
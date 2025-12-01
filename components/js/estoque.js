// =========================================
// ESTOQUE - CLEAN UI AZUL (ORDEM CORRIGIDA: NOVOS NO TOPO)
// =========================================

// Configuração de Memória (RAM Only)
function salvarEstoque(estoque) { console.log('💾 Dados em RAM'); }
function carregarEstoque() { return []; }
function limparEstoque() { estoqueGlobal = []; }

// Variável global
let estoqueGlobal = [];

// Itens Padrão
const itensPadroes = [
    { name: 'Salmão Fresco', category: 'Peixe Fresco', quantity: 0.5, status: 'Normal', location: 'Câmara Fria A', price: 45.00, obs: 'Sobras do dia' },
    { name: 'Tilápia Inteira', category: 'Peixe Inteiro', quantity: 25, status: 'Crítico', location: 'Câmara Fria B', price: 12.00, obs: '' },
    { name: 'Camarão Médio', category: 'Crustáceo', quantity: 120, status: 'Normal', location: 'Freezer 1', price: 65.00, obs: 'Estoque alto' }
];

// Catálogo de Produtos
const catalogoEstoque = {
    'Salmão Fresco': { cat: 'Peixe Fresco', preco: 45.00 },
    'Tilápia Inteira': { cat: 'Peixe Inteiro', preco: 12.00 },
    'Filé de Tilápia': { cat: 'Peixe Fresco', preco: 38.00 },
    'Camarão Rosa': { cat: 'Crustáceo', preco: 65.00 },
    'Camarão Cinza': { cat: 'Crustáceo', preco: 40.00 },
    'Camarão Médio': { cat: 'Crustáceo', preco: 65.00 },
    'Lula Anéis': { cat: 'Molusco', preco: 42.00 },
    'Polvo Inteiro': { cat: 'Molusco', preco: 85.00 },
    'Sardinha': { cat: 'Peixe Inteiro', preco: 9.50 }
};

// Inicializa com padrões (será usado para lógica de fallback se necessário)
let estoqueAtual = [...itensPadroes]; 

function loadEstoqueContent() {
    const estoquePage = document.getElementById('estoque');
    
    estoquePage.innerHTML = `
        <div class="module-header">
            <h2>Controle de Estoque</h2>
            <button class="btn btn-primary" id="btnAdicionarItem">
                <i class="fas fa-plus"></i> Novo Item
            </button>
        </div>
        
        <div class="estoque-summary">
            <div class="summary-card card-blue">
                <div class="card-content">
                    <h3>Volume Total</h3>
                    <p class="summary-number" id="estoqueTotalNumber">0 kg</p>
                    <span>Kg totais em estoque</span>
                </div>
                <div class="card-icon"><i class="fas fa-weight-hanging"></i></div>
            </div>
            
            <div class="summary-card card-green">
                <div class="card-content">
                    <h3>Valor Patrimonial</h3>
                    <p class="summary-number" id="estoqueValorTotal">R$ 0,00</p>
                    <span>Custo total inventariado</span>
                </div>
                <div class="card-icon"><i class="fas fa-money-bill-wave"></i></div>
            </div>
            
            <div class="summary-card card-red">
                <div class="card-content">
                    <h3>Produtos Críticos</h3>
                    <p class="summary-number" id="estoqueCriticosNumber">0</p>
                    <span>Abaixo do mínimo</span>
                </div>
                <div class="card-icon"><i class="fas fa-siren-on"></i></div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h3>Inventário Atual</h3>
                <div class="header-actions">
                    <input type="text" id="estoqueSearch" class="clean-input" placeholder="Buscar produto...">
                    <button class="btn btn-secondary-outline" id="btnExportCSV">
                        <i class="fas fa-file-export"></i> CSV
                    </button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="modern-table" id="estoqueTable">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Categoria</th>
                            <th>Volume (Qtd)</th>
                            <th>Status</th>
                            <th>Localização</th>
                            <th>Valor Total</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        </tbody>
                </table>
            </div>
        </div>

        <div id="itemModal" class="custom-modal-overlay" style="display: none;">
            <div class="custom-modal-content">
                <div class="modal-header">
                    <h3 id="modalTitle"><i class="fas fa-box-open"></i> Gerenciar Estoque</h3>
                    <button class="btn-close-modal" id="closeItemModal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="itemForm">
                        <input type="hidden" id="editIndex">

                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="form-group">
                                    <label>Produto</label>
                                    <select id="itemName" class="form-control" required>
                                        <option value="">Selecione...</option>
                                        ${gerarOpcoesProdutos()}
                                        <option value="Outros">Outros (Manual)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="form-group">
                                    <label>Categoria</label>
                                    <input type="text" id="itemCategory" class="form-control readonly-field" readonly required>
                                </div>
                            </div>
                        </div>

                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="form-group">
                                    <label>Quantidade (kg)</label>
                                    <input type="number" id="itemQuantity" class="form-control" step="0.1" min="0.1" placeholder="0.0" required>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="form-group">
                                    <label>Custo Unitário (R$/kg)</label>
                                    <input type="number" id="itemPrice" class="form-control readonly-field" step="0.01" min="0" readonly required>
                                </div>
                            </div>
                        </div>

                        <div class="total-display-container">
                            <label>Custo Total do Lote</label>
                            <div class="total-wrapper">
                                <div class="total-value-box">
                                    <span class="currency-symbol">R$</span>
                                    <input type="text" id="itemTotalValue" class="total-input" readonly value="0,00">
                                </div>
                            </div>
                        </div>

                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="form-group">
                                    <label>Localização</label>
                                    <select id="itemLocation" class="form-control" required>
                                        <option value="">Selecione...</option>
                                        <option value="Câmara Fria A">Câmara Fria A</option>
                                        <option value="Câmara Fria B">Câmara Fria B</option>
                                        <option value="Freezer 1">Freezer 1</option>
                                        <option value="Freezer 2">Freezer 2</option>
                                        <option value="Estoque Seco">Estoque Seco</option>
                                    </select>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="form-group">
                                    <label>Status</label>
                                    <select id="itemStatus" class="form-control" required>
                                        <option value="Normal">Normal</option>
                                        <option value="Crítico">Crítico</option>
                                        <option value="Excedente">Excedente</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Observação (Opcional)</label>
                            <textarea id="itemObs" class="form-control" rows="2" placeholder="Detalhes..."></textarea>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="btnCancelItem">Cancelar</button>
                            <button type="submit" class="btn btn-primary" id="btnSaveItem">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div id="viewModal" class="custom-modal-overlay" style="display: none;">
            <div class="custom-modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-info-circle"></i> Detalhes do Produto</h3>
                    <button class="btn-close-modal" id="closeViewModal">&times;</button>
                </div>
                <div class="modal-body" id="viewModalBody"></div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="btnCloseView">Fechar</button>
                </div>
            </div>
        </div>
    `;
    
    addEstoqueStyles();
    preencherTabelaComDados();
    updateEstoqueSummary();
    setupEstoqueEvents();
}

// --- LÓGICA DO ESTOQUE ---

function gerarOpcoesProdutos() {
    return Object.keys(catalogoEstoque).map(prod => `<option value="${prod}">${prod}</option>`).join('');
}

function formatarDisplayUnidade(qtd) {
    const q = parseFloat(qtd);
    if (isNaN(q) || q <= 0) return '0 kg';

    if (q < 1) {
        return `${(q * 1000).toFixed(0)}g`;
    } else {
        return `${q.toFixed(2).replace('.', ',').replace(',00', '')} kg`;
    }
}

// *** AQUI ESTÁ A MÁGICA DA ORDEM ***
function getListaCombinada() {
    // Retorna: [NOVOS ITENS (Invertido) + ITENS PADRÃO]
    // Assim, o item mais novo aparece no topo da tabela.
    return [...estoqueGlobal, ...itensPadroes];
}

function preencherTabelaComDados() {
    const tableBody = document.querySelector('#estoqueTable tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    const todosOsItens = getListaCombinada();

    todosOsItens.forEach((item, index) => {
        const row = document.createElement('tr');
        const badgeClass = getStatusBadgeClass(item.status);
        
        const qtdDisplay = formatarDisplayUnidade(item.quantity);
        const totalVal = (item.quantity * item.price).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        
        row.innerHTML = `
            <td class="fw-bold">${item.name}</td>
            <td>${item.category}</td>
            <td style="font-weight:600; color:#2c3e50;">${qtdDisplay}</td>
            <td><span class="status-badge ${badgeClass}">${item.status}</span></td>
            <td>${item.location}</td>
            <td>${totalVal}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="abrirModalEditar(${index})" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="abrirModalDetalhes(${index})" title="Ver Detalhes"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon delete" onclick="excluirItem(${index})" title="Excluir"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Atualiza a variável global que o Dashboard lê
    window.estoqueAtual = todosOsItens;
}

function updateEstoqueSummary() {
    const todos = getListaCombinada();
    let totalKg = 0;
    let valorTotal = 0;
    let criticos = 0;

    todos.forEach(item => {
        const qtd = parseFloat(item.quantity) || 0;
        const preco = parseFloat(item.price) || 0;
        
        totalKg += qtd;
        valorTotal += qtd * preco;
        
        if (item.status === 'Crítico') criticos++;
    });

    document.getElementById('estoqueTotalNumber').textContent = formatarDisplayUnidade(totalKg);
    document.getElementById('estoqueValorTotal').textContent = valorTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    document.getElementById('estoqueCriticosNumber').textContent = criticos;
}

function getStatusBadgeClass(status) {
    if (status === 'Normal') return 'success';
    if (status === 'Crítico') return 'danger';
    return 'warning';
}

// --- EVENTOS ---

function setupEstoqueEvents() {
    const modal = document.getElementById('itemModal');
    const form = document.getElementById('itemForm');

    document.getElementById('btnAdicionarItem').onclick = () => {
        form.reset();
        document.getElementById('editIndex').value = ''; 
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-box-open"></i> Adicionar Item';
        
        document.getElementById('itemCategory').setAttribute('readonly', true);
        document.getElementById('itemPrice').setAttribute('readonly', true);
        document.getElementById('itemCategory').classList.add('readonly-field');
        document.getElementById('itemPrice').classList.add('readonly-field');
        document.getElementById('itemTotalValue').value = '0,00';
        modal.style.display = 'flex';
    };

    const fechar = () => {
        modal.style.display = 'none';
        document.getElementById('viewModal').style.display = 'none';
    };
    document.getElementById('closeItemModal').onclick = fechar;
    document.getElementById('btnCancelItem').onclick = fechar;
    document.getElementById('closeViewModal').onclick = fechar;
    document.getElementById('btnCloseView').onclick = fechar;

    document.getElementById('itemName').onchange = function() {
        const prod = this.value;
        const catInput = document.getElementById('itemCategory');
        const priceInput = document.getElementById('itemPrice');

        if (catalogoEstoque[prod]) {
            catInput.value = catalogoEstoque[prod].cat;
            priceInput.value = catalogoEstoque[prod].preco;
            catInput.setAttribute('readonly', true);
            priceInput.setAttribute('readonly', true); 
            catInput.classList.add('readonly-field');
            priceInput.classList.add('readonly-field');
            calcTotal();
        } else if (prod === 'Outros') {
            catInput.value = '';
            priceInput.value = '';
            catInput.removeAttribute('readonly');
            priceInput.removeAttribute('readonly');
            catInput.classList.remove('readonly-field');
            priceInput.classList.remove('readonly-field');
            calcTotal();
        }
    };

    const calcTotal = () => {
        let qtd = parseFloat(document.getElementById('itemQuantity').value) || 0;
        let preco = parseFloat(document.getElementById('itemPrice').value) || 0;
        if (qtd < 0) qtd = 0;
        document.getElementById('itemTotalValue').value = (qtd * preco).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    };

    document.getElementById('itemQuantity').oninput = calcTotal;
    document.getElementById('itemPrice').oninput = calcTotal;

    form.onsubmit = (e) => {
        e.preventDefault();
        const index = document.getElementById('editIndex').value;
        
        const novoItem = {
            name: document.getElementById('itemName').value,
            category: document.getElementById('itemCategory').value,
            quantity: parseFloat(document.getElementById('itemQuantity').value),
            price: parseFloat(document.getElementById('itemPrice').value),
            location: document.getElementById('itemLocation').value,
            status: document.getElementById('itemStatus').value,
            obs: document.getElementById('itemObs').value
        };

        if (index !== '') {
            // Edição: Precisa saber se é Custom ou Padrão
            // Lista combinada: [Custom1, Custom2, Padrao1, Padrao2, Padrao3]
            // Se Index < estoqueGlobal.length -> É custom
            if (index < estoqueGlobal.length) {
                estoqueGlobal[index] = novoItem;
            } else {
                // É padrão
                itensPadroes[index - estoqueGlobal.length] = novoItem;
            }
            if(window.BeiraMarUtils) window.BeiraMarUtils.showToast('Item atualizado!', 'success');
        } else {
            // Novo: Adiciona no INÍCIO do array global
            estoqueGlobal.unshift(novoItem);
            if(window.BeiraMarUtils) window.BeiraMarUtils.showToast('Item adicionado!', 'success');
        }

        fechar();
        preencherTabelaComDados();
        updateEstoqueSummary();
    };

    document.getElementById('estoqueSearch').oninput = function() {
        const q = this.value.toLowerCase();
        document.querySelectorAll('#estoqueTable tbody tr').forEach(r => {
            r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
        });
    };
}

// Globais
window.abrirModalEditar = function(index) {
    const todos = getListaCombinada();
    const item = todos[index];
    if (!item) return;

    document.getElementById('editIndex').value = index;
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Editar Item';
    
    const selectName = document.getElementById('itemName');
    let exists = false;
    for(let opt of selectName.options){ if(opt.value === item.name) exists = true; }
    selectName.value = exists ? item.name : 'Outros';

    const event = new Event('change');
    selectName.dispatchEvent(event);

    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemLocation').value = item.location;
    document.getElementById('itemStatus').value = item.status;
    document.getElementById('itemObs').value = item.obs || '';
    
    const qtd = parseFloat(item.quantity) || 0;
    const prc = parseFloat(item.price) || 0;
    document.getElementById('itemTotalValue').value = (qtd * prc).toLocaleString('pt-BR', {minimumFractionDigits: 2});

    document.getElementById('itemModal').style.display = 'flex';
};

window.abrirModalDetalhes = function(index) {
    const todos = getListaCombinada();
    const item = todos[index];
    if (!item) return;

    const modalBody = document.getElementById('viewModalBody');
    const totalVal = (item.quantity * item.price).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    const unitVal = item.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    const qtdFormatada = formatarDisplayUnidade(item.quantity);

    modalBody.innerHTML = `
        <div class="detalhe-grid">
            <div class="detalhe-row"><strong>Produto:</strong> <span>${item.name}</span></div>
            <div class="detalhe-row"><strong>Categoria:</strong> <span>${item.category}</span></div>
            <hr class="prod-separator"/>
            <div class="detalhe-row"><strong>Volume:</strong> <span style="font-weight:bold; color:#0066cc;">${qtdFormatada}</span></div>
            <div class="detalhe-row"><strong>Custo Unitário:</strong> <span>${unitVal}</span></div>
            <div class="detalhe-row"><strong>Valor Total:</strong> <span style="font-weight:bold; font-size:1.1rem; color:#28a745;">${totalVal}</span></div>
            <hr class="prod-separator"/>
            <div class="detalhe-row"><strong>Local:</strong> <span>${item.location}</span></div>
            <div class="detalhe-row"><strong>Status:</strong> <span class="status-badge ${getStatusBadgeClass(item.status)}">${item.status}</span></div>
            <div class="detalhe-row"><strong>Obs:</strong> <span>${item.obs || '-'}</span></div>
        </div>
    `;
    document.getElementById('viewModal').style.display = 'flex';
};

window.excluirItem = function(index) {
    // Lógica Invertida: Se index < tamanho do global, é item novo (pode excluir)
    // Se index >= tamanho do global, é item padrão (não pode excluir)
    
    if (index >= estoqueGlobal.length) {
        alert("Itens padrão do sistema não podem ser excluídos. Tente adicionar novos itens.");
        return;
    }
    
    if (confirm("Confirma a exclusão deste item do estoque?")) {
        estoqueGlobal.splice(index, 1);
        preencherTabelaComDados();
        updateEstoqueSummary();
        if(window.BeiraMarUtils) window.BeiraMarUtils.showToast('Item excluído.', 'success');
    }
};

window.onclick = function(event) {
    const m1 = document.getElementById('itemModal');
    const m2 = document.getElementById('viewModal');
    if (event.target == m1) m1.style.display = 'none';
    if (event.target == m2) m2.style.display = 'none';
};

// --- CSS ---

function addEstoqueStyles() {
    if (!document.getElementById('estoque-styles')) {
        const styles = document.createElement('style');
        styles.id = 'estoque-styles';
        styles.textContent = `
            :root {
                --est-primary: #0066cc;
                --est-bg: #f4f7f9;
                --est-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }

            #estoque .module-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 2rem; background: white; padding: 1.5rem;
                border-radius: 12px; box-shadow: var(--est-shadow);
            }
            #estoque .module-header h2 {
                margin: 0; color: #2c3e50; font-weight: 700; border-left: 5px solid var(--est-primary);
                padding-left: 1rem; font-size: 1.5rem;
            }

            #estoque .btn-primary {
                background: linear-gradient(135deg, #0066cc, #0052a3); color: white; border: none;
                padding: 0.7rem 1.4rem; border-radius: 50px; font-weight: 600; cursor: pointer;
                box-shadow: 0 4px 10px rgba(0,102,204,0.2); transition: 0.2s;
                display: flex; gap: 0.5rem; align-items: center;
            }
            #estoque .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,102,204,0.3); }

            #estoque .btn-secondary-outline {
                background: white; border: 1px solid #ccc; color: #666; padding: 0.5rem 1rem;
                border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
                transition: 0.2s;
            }
            #estoque .btn-secondary-outline:hover { border-color: var(--est-primary); color: var(--est-primary); }

            .estoque-summary {
                display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;
            }
            .summary-card {
                background: white; padding: 1.5rem; border-radius: 12px; 
                box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden;
                display: flex; justify-content: space-between; align-items: center;
                border-left: 5px solid #ccc; transition: transform 0.2s;
            }
            .summary-card:hover { transform: translateY(-4px); }
            
            /* --- CORREÇÃO DAS CORES DAS BORDAS --- */
            .summary-card.card-blue {
                border-left-color: #0066cc !important;
            }
            .summary-card.card-green {
                border-left-color: #28a745 !important;
            }
            .summary-card.card-red {
                border-left-color: #dc3545 !important;
            }

            .card-content h3 { margin: 0; font-size: 0.9rem; color: #7f8c8d; text-transform: uppercase; letter-spacing: 0.5px; }
            .summary-number { margin: 5px 0; font-size: 1.8rem; font-weight: 800; color: #2c3e50; }
            .card-content span { font-size: 0.8rem; color: #95a5a6; }

            .card-icon {
                font-size: 3rem; opacity: 0.1; position: absolute; right: 15px; bottom: 10px; color: #333;
            }
            
            .table-container { background: white; border-radius: 12px; box-shadow: var(--est-shadow); padding: 1.5rem; }
            .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
            .table-header h3 { margin: 0; color: #2c3e50; font-size: 1.2rem; }
            .header-actions { display: flex; gap: 1rem; }
            
            .clean-input { padding: 0.6rem 1rem; border: 1px solid #eee; border-radius: 50px; background: #f8fafc; width: 250px; }
            .clean-input:focus { outline: none; border-color: var(--est-primary); background: white; }

            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 1rem; color: #7f8c8d; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; border-bottom: 2px solid #f0f0f0; }
            td { padding: 1rem; vertical-align: middle; border-bottom: 1px solid #f9f9f9; color: #333; }
            tr:hover { background: #f8fbff; }
            
            .status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; display: inline-block; white-space: nowrap; }
            .status-badge.success { background: #d4edda; color: #155724; }
            .status-badge.warning { background: #fff3cd; color: #856404; }
            .status-badge.danger { background: #f8d7da; color: #721c24; }

            .action-buttons { display: flex; gap: 0.5rem; }
            .btn-icon { background: #eef2f7; border: none; width: 32px; height: 32px; border-radius: 8px; color: #555; cursor: pointer; transition: 0.2s; display: inline-flex; align-items: center; justify-content: center; }
            .btn-icon:hover { background: #0066cc; color: white; }
            .btn-icon.delete:hover { background: #dc3545; color: white; }
            .fw-bold { font-weight: 600; }

            .custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,30,60,0.4); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
            .custom-modal-content { background: white; width: 95%; max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: slideUp 0.3s ease; display: flex; flex-direction: column; max-height: 90vh; }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

            .modal-header { background: linear-gradient(135deg, #0066cc, #004499); padding: 1.2rem; display: flex; justify-content: space-between; align-items: center; color: white; }
            .modal-header h3 { margin: 0; font-size: 1.1rem; display: flex; gap: 0.5rem; align-items: center; }
            .btn-close-modal { background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; opacity: 0.8; }
            .btn-close-modal:hover { opacity: 1; color: #ffcccc; }

            .modal-body { padding: 2rem; overflow-y: auto; }
            .modal-footer { padding: 1.2rem 2rem; background: #f9f9f9; text-align: right; display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid #eee; }

            .form-group { margin-bottom: 1rem; }
            .form-group label { display: block; margin-bottom: 0.4rem; font-weight: 600; font-size: 0.85rem; color: #555; text-transform: uppercase; }
            .form-control { width: 100%; padding: 0.7rem; border: 2px solid #edf2f7; border-radius: 8px; font-size: 0.95rem; box-sizing: border-box; background: #f8fafc; }
            .form-control:focus { border-color: var(--est-primary); outline: none; background: white; }
            .readonly-field { background-color: #e9ecef; color: #666; cursor: not-allowed; }

            /* --- TOTAL VALUE BOX (CENTRALIZAÇÃO PERFEITA) --- */
            .total-display-container { margin-bottom: 1.5rem; text-align: center; }
            .total-display-container label { color: var(--est-primary); font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; display: block; }
            
            .total-wrapper {
                display: flex;
                justify-content: center;
                width: 100%;
            }

            .total-value-box {
                display: inline-flex; 
                align-items: center; 
                justify-content: center;
                background: #f0f7ff;
                border: 2px solid var(--est-primary); 
                border-radius: 12px; padding: 1rem 2rem;
                min-width: 250px;
            }
            .currency-symbol { font-weight: 800; color: var(--est-primary); font-size: 2rem; margin-right: 0.5rem; }
            
            .total-input {
                width: 160px; /* Largura controlada */
                border: none; background: transparent; 
                font-size: 2.5rem; font-weight: 800; color: var(--est-primary);
                outline: none; text-align: left; /* Cola no R$ */
                padding: 0; margin: 0;
            }

            .prod-row { display: flex; gap: 1rem; }
            .prod-col-half { flex: 1; }

            .btn-secondary { background: #edf2f7; color: #555; border: none; padding: 0.7rem 1.4rem; border-radius: 50px; font-weight: 600; cursor: pointer; }
            .btn-secondary:hover { background: #e2e8f0; }
            
            .detalhe-row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px; }
            .prod-separator { border: 0; border-top: 1px solid #eee; margin: 1.5rem 0; }

            @media (max-width: 768px) {
                .prod-row { flex-direction: column; gap: 0.5rem; }
                .estoque-summary { grid-template-columns: 1fr; }
                .header-actions { flex-direction: column; }
                .clean-input { width: 100%; }
                .custom-modal-content { height: 100%; max-height: 100%; border-radius: 0; }
                .total-input { font-size: 2rem; width: 140px; }
            }
        `;
        document.head.appendChild(styles);
    }
}

// =========================================
// CORREÇÃO DAS CORES - APENAS ISSO FOI ADICIONADO
// =========================================

// Função para corrigir as cores dos cards
function fixCardColors() {
    const cards = document.querySelectorAll('.summary-card');
    cards.forEach(card => {
        // Remove classes de cor cinza que possam estar conflitando
        card.classList.remove('card-gray', 'card-grey', 'card-default', 'card-neutral');
        
        // Aplica estilos inline como backup
        if (card.classList.contains('card-blue')) {
            card.style.borderLeft = '5px solid #0066cc';
        }
        if (card.classList.contains('card-green')) {
            card.style.borderLeft = '5px solid #28a745';
        }
        if (card.classList.contains('card-red')) {
            card.style.borderLeft = '5px solid #dc3545';
        }
    });
}

// Executa a correção quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixCardColors, 100);
    // Corrige a cada 2 segundos para prevenir o bug
    setInterval(fixCardColors, 2000);
});

// Corrige quando novos elementos são adicionados
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            setTimeout(fixCardColors, 150);
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

window.BeiraMarEstoque = { loadEstoqueContent, addEstoqueStyles, salvarEstoque, carregarEstoque, limparEstoque };

// ==========================================================
// FIX DE INTEGRAÇÃO COM DASHBOARD (COLE NO FINAL DO ARQUIVO)
// ==========================================================

// 1. Garante que os dados (648 itens) estejam carregados na memória
if (typeof estoqueGlobal !== 'undefined' && estoqueGlobal.length === 0) {
    estoqueGlobal = [
        { name: 'Salmão Fresco', category: 'Peixe Fresco', quantity: 48, status: 'Normal', location: 'Câmara Fria A', price: 45.00 },
        { name: 'Tilápia Inteira', category: 'Peixe Inteiro', quantity: 200, status: 'Normal', location: 'Câmara Fria B', price: 12.00 },
        { name: 'Camarão Médio', category: 'Crustáceo', quantity: 400, status: 'Normal', location: 'Freezer 1', price: 65.00 }
    ];
}

// 2. Expõe a função que o Dashboard precisa para ler esses dados
window.BeiraMarEstoque = {
    // Mantém as funções que já existiam no seu arquivo (load, add, remove, etc)
    ...window.BeiraMarEstoque,
    
    // Adiciona a função de leitura que faltava
    getEstoque: function() {
        return estoqueGlobal;
    }
};

// 3. Se o Dashboard já estiver rodando, manda ele atualizar os números agora
if (window.BeiraMarDashboard && window.BeiraMarDashboard.updateDashboardData) {
    window.BeiraMarDashboard.updateDashboardData();
}
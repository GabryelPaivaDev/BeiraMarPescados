// =========================================
// PRODUÇÃO & LOGÍSTICA - DADOS E INTERATIVIDADE (VALIDAÇÃO RIGOROSA)
// =========================================

// Dados Simulados - PRODUÇÃO
let producaoItems = [
    { 
        id: 'prod-001', 
        coluna: 'recebimento', 
        titulo: 'LOTE-2024-001 - Salmão', 
        resumo: '100kg • Fornecedor Andes', 
        data: 'Hoje, 08:30',
        detalhes: { responsavel: 'João Silva', temperatura: '-2°C', nf: 'NF-554902', obs: 'Peixe chegou com gelo adequado.' }
    },
    { 
        id: 'prod-002', 
        coluna: 'processamento', 
        titulo: 'LOTE-2024-002 - Tilápia', 
        resumo: '50kg • Pesca Local', 
        data: 'Em andamento',
        detalhes: { responsavel: 'Carlos Corte', inicio: '10:00', previsao: '14:00', corte: 'Filé sem espinha' }
    },
    { 
        id: 'prod-003', 
        coluna: 'embalagem', 
        titulo: 'LOTE-2024-003 - Camarão', 
        resumo: '30kg • Limpo Vácuo', 
        data: 'Iniciado 11:00',
        detalhes: { responsavel: 'Ana Embalagens', tipo: 'Pacote 500g', etiqueta: 'Pendente', loteOrigem: 'LOTE-ANTIGO-88' }
    },
    { 
        id: 'prod-004', 
        coluna: 'pronto', 
        titulo: 'LOTE-2024-004 - Lula Anéis', 
        resumo: '20kg • Aprovado', 
        data: 'Ontem, 16:00',
        detalhes: { responsavel: 'Qualidade', local: 'Freezer 02', validade: '12/2024', status: 'Liberado para venda' }
    }
];

// Dados Simulados - LOGÍSTICA
let logisticaItems = [
    { 
        id: 'log-001', 
        coluna: 'transporte', 
        titulo: 'Carga #789', 
        resumo: 'Camarão 50kg', 
        data: 'Em trânsito',
        detalhes: { cliente: 'CD Central', destino: 'Zona Industrial', motorista: 'Pedro Transportes', veiculo: 'Fiorino', placa: 'ABC-1234' }
    },
    { 
        id: 'log-002', 
        coluna: 'recebimento', 
        titulo: 'Carga #795', 
        resumo: 'Devolução Parcial', 
        data: 'Chegando',
        detalhes: { cliente: 'Restaurante Mar Azul', destino: 'Docas Beira Mar', motivo: 'Erro no pedido', conferente: 'Aguardando' }
    },
    { 
        id: 'log-003', 
        coluna: 'expedicao', 
        titulo: 'Entrega #1300', 
        resumo: 'Salmão Premium', 
        data: 'Separando',
        detalhes: { cliente: 'Hotel Palace', destino: 'Av. Beira Mar, 100', itens: 'Salmão Premium', prioridade: 'Alta' }
    },
    { 
        id: 'log-004', 
        coluna: 'entregue', 
        titulo: 'Entrega #1290', 
        resumo: 'Tilápia Fresca', 
        data: 'Hoje, 09:15',
        detalhes: { cliente: 'Mercado Central', destino: 'Box 45', recebidoPor: 'Gerente Marcos', assinatura: 'Digital', obs: 'Entregue sem avarias' }
    }
];

function loadProducaoContent() {
    const producaoPage = document.getElementById('producao');
    
    producaoPage.innerHTML = `
        <div class="module-header">
            <h2>Produção (Chão de Fábrica)</h2>
            <button class="btn btn-primary" onclick="abrirModalNovoLote()">
                <i class="fas fa-plus"></i>
                Novo Lote
            </button>
        </div>
        
        <section class="producao-section">
            <div class="producao-kanban">
                <div class="kanban-board" id="boardProducao"></div>
            </div>
        </section>
        
        <section class="logistica-section">
            <div class="section-title">
                <h3>Logística e Entregas</h3>
                <button class="btn btn-secondary-outline" onclick="abrirModalNovaLogistica()">
                    <i class="fas fa-truck"></i>
                    Nova Entrega
                </button>
            </div>
            <div class="logistica-kanban">
                <div class="kanban-board" id="boardLogistica"></div>
            </div>
        </section>

        <div id="modalDetalheProd" class="custom-modal-overlay" style="display: none;">
            <div class="custom-modal-content">
                <div class="modal-header">
                    <h3 id="modalDetalheTitulo">Detalhes do Item</h3>
                    <button class="btn-close-modal" onclick="fecharModalDetalhe()">&times;</button>
                </div>
                <div class="modal-body" id="modalDetalheCorpo"></div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="fecharModalDetalhe()">Fechar</button>
                </div>
            </div>
        </div>

        <div id="modalNovoLote" class="custom-modal-overlay" style="display: none;">
            <div class="custom-modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-box-open"></i> Entrada de Lote</h3>
                    <button class="btn-close-modal" onclick="fecharModalNovoLote()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="formNovoLote">
                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>ID do Lote (Automático)</label>
                                    <input type="text" id="nlTituloAuto" class="prod-form-control readonly-field" readonly>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Nota Fiscal (Gerada)</label>
                                    <input type="text" id="nlNFAuto" class="prod-form-control readonly-field" readonly>
                                </div>
                            </div>
                        </div>

                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Produto / Tipo</label>
                                    <select id="nlProduto" class="prod-form-control" required>
                                        <option value="">Selecione...</option>
                                        <option value="Salmão Fresco">Salmão Fresco</option>
                                        <option value="Tilápia Inteira">Tilápia Inteira</option>
                                        <option value="Camarão Rosa">Camarão Rosa</option>
                                        <option value="Lula Anéis">Lula Anéis</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Fornecedor</label>
                                    <select id="nlFornecedor" class="prod-form-control" required>
                                        <option value="">Selecione...</option>
                                        <option value="Pescados Andes">Pescados Andes (Chile)</option>
                                        <option value="Mar Azul Ltda">Mar Azul Ltda</option>
                                        <option value="Pesca Local">Cooperativa Local</option>
                                        <option value="Importadora Oceano">Importadora Oceano</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Quantidade (kg)</label>
                                    <div class="input-suffix-group">
                                        <input type="number" id="nlQtd" class="prod-form-control" placeholder="0.00" step="0.1" required>
                                        <span class="suffix">kg</span>
                                    </div>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Temp. Chegada (°C)</label>
                                    <input type="number" id="nlTemp" class="prod-form-control" value="-2" step="1">
                                </div>
                            </div>
                        </div>

                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Responsável</label>
                                    <input type="text" id="nlResp" class="prod-form-control" list="listaResponsaveis" placeholder="Nome do funcionário" required>
                                    <datalist id="listaResponsaveis">
                                        <option value="João Silva">
                                        <option value="Maria Oliveira">
                                        <option value="Carlos Corte">
                                        <option value="Ana Embalagens">
                                    </datalist>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Etapa Inicial</label>
                                    <select id="nlColuna" class="prod-form-control">
                                        <option value="recebimento">Recebimento</option>
                                        <option value="processamento">Processamento</option>
                                        <option value="embalagem">Embalagem</option>
                                        <option value="pronto">Pronto</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="prod-form-group">
                            <label>Observações</label>
                            <textarea id="nlObs" class="prod-form-control" rows="2" placeholder="Observações de qualidade..."></textarea>
                        </div>
                        
                        <div class="prod-form-actions">
                            <button type="button" class="btn btn-secondary" onclick="fecharModalNovoLote()">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar Lote</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div id="modalNovaLogistica" class="custom-modal-overlay" style="display: none;">
            <div class="custom-modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-truck"></i> Nova Logística</h3>
                    <button class="btn-close-modal" onclick="fecharModalNovaLogistica()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="formNovaLogistica">
                        
                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>ID Carga (Automático)</label>
                                    <input type="text" id="nlogIdAuto" class="prod-form-control readonly-field" readonly>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Tipo de Operação</label>
                                    <select id="nlogTipo" class="prod-form-control" required>
                                        <option value="transporte">Transporte (Chegando)</option>
                                        <option value="recebimento">Recebimento (Docas)</option>
                                        <option value="expedicao">Expedição (Saindo)</option>
                                        <option value="entregue">Entrega Finalizada</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Tipo de Carga</label>
                                    <select id="nlogResumo" class="prod-form-control" required>
                                        <option value="">Selecione o Conteúdo...</option>
                                        <option value="Salmão Fresco">Salmão Fresco</option>
                                        <option value="Tilápia">Tilápia</option>
                                        <option value="Camarão">Camarão</option>
                                        <option value="Lula/Polvo">Lula/Polvo</option>
                                        <option value="Insumos/Embalagens">Insumos/Embalagens</option>
                                        <option value="Devolução">Devolução</option>
                                        <option value="Carga Mista">Carga Mista</option>
                                    </select>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Cliente</label>
                                    <select id="nlogCliente" class="prod-form-control" required>
                                        <option value="">Selecione...</option>
                                        <option value="Hotel Palace">Hotel Palace</option>
                                        <option value="Restaurante Mar Azul">Restaurante Mar Azul</option>
                                        <option value="Mercado Central">Mercado Central</option>
                                        <option value="Peixaria do Zé">Peixaria do Zé</option>
                                        <option value="CD Central">CD Central (Interno)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Destino / Endereço</label>
                                    <input type="text" id="nlogDestino" class="prod-form-control" list="listaDestinos" placeholder="Endereço ou Região" required>
                                    <datalist id="listaDestinos">
                                        <option value="Centro">
                                        <option value="Zona Norte">
                                        <option value="Zona Sul - Orla">
                                        <option value="Região Metropolitana">
                                        <option value="Filial 02">
                                    </datalist>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Veículo</label>
                                    <select id="nlogVeiculo" class="prod-form-control" required>
                                        <option value="">Selecione...</option>
                                        <option value="Fiorino">Fiorino</option>
                                        <option value="Caminhão Refrigerado">Caminhão Refrigerado</option>
                                        <option value="Moto">Moto</option>
                                        <option value="Van">Van</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Placa</label>
                                    <input type="text" id="nlogPlaca" class="prod-form-control" list="listaPlacas" placeholder="ABC-1234" required>
                                    <datalist id="listaPlacas">
                                        <option value="ABC-1234 (Fiorino)">
                                        <option value="XYZ-9876 (Caminhão)">
                                        <option value="MMM-5555 (Van)">
                                    </datalist>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Motorista</label>
                                    <input type="text" id="nlogMotorista" class="prod-form-control" list="listaMotoristas" placeholder="Nome do motorista" required>
                                    <datalist id="listaMotoristas">
                                        <option value="Pedro Transportes">
                                        <option value="João da Van">
                                        <option value="Transportadora Frio">
                                    </datalist>
                                </div>
                            </div>
                        </div>

                        <div class="prod-form-actions">
                            <button type="button" class="btn btn-secondary" onclick="fecharModalNovaLogistica()">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar Logística</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    addProducaoStyles();
    atualizarKanbanProducao();
    renderKanbanBoard('boardLogistica', logisticaItems, ['transporte', 'recebimento', 'expedicao', 'entregue'], ['Transporte', 'Recebimento', 'Expedição', 'Entregue']);

    // Configura eventos dos formulários
    const formLote = document.getElementById('formNovoLote');
    if(formLote) {
        formLote.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarNovoLote();
        });
    }

    const formLog = document.getElementById('formNovaLogistica');
    if(formLog) {
        formLog.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarNovaLogistica();
        });
    }
}

function atualizarKanbanProducao() {
    renderKanbanBoard('boardProducao', producaoItems, ['recebimento', 'processamento', 'embalagem', 'pronto'], ['Recebimento', 'Processamento', 'Embalagem', 'Pronto']);
}

function renderKanbanBoard(containerId, items, colunasKeys, colunasTitulos) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';
    colunasKeys.forEach((key, index) => {
        const titulo = colunasTitulos[index];
        const itensDaColuna = items.filter(i => i.coluna === key);
        
        html += `
            <div class="kanban-column">
                <div class="column-header">
                    <h3>${titulo}</h3>
                    <span class="item-count">${itensDaColuna.length}</span>
                </div>
                <div class="kanban-items">
                    ${itensDaColuna.map(item => createCardHTML(item)).join('')}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function createCardHTML(item) {
    return `
        <div class="kanban-item">
            <div class="d-flex justify-content-between align-items-start">
                <div class="kanban-item-content">
                    <h4>${item.titulo}</h4>
                    <p>${item.resumo}</p>
                </div>
                <button class="btn-icon-eye" onclick="abrirModalDetalhe('${item.id}')" title="Ver Detalhes">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <span class="item-date">${item.data}</span>
        </div>
    `;
}

// =========================================
// FUNÇÕES - NOVO LOTE (PRODUÇÃO)
// =========================================

window.abrirModalNovoLote = function() {
    const modal = document.getElementById('modalNovoLote');
    if(modal) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const ano = new Date().getFullYear();
        document.getElementById('nlTituloAuto').value = `LOTE-${ano}-${randomNum}`;
        document.getElementById('nlNFAuto').value = `NF-${Math.floor(Math.random() * 1000000)}`;
        modal.style.display = 'flex';
    }
}

window.fecharModalNovoLote = function() {
    const modal = document.getElementById('modalNovoLote');
    if(modal) modal.style.display = 'none';
    document.getElementById('formNovoLote').reset();
}

function salvarNovoLote() {
    const idLote = document.getElementById('nlTituloAuto').value;
    const nfAuto = document.getElementById('nlNFAuto').value;
    const produto = document.getElementById('nlProduto').value;
    const fornecedor = document.getElementById('nlFornecedor').value;
    const qtd = document.getElementById('nlQtd').value;
    const resp = document.getElementById('nlResp').value;
    const temp = document.getElementById('nlTemp').value;
    const coluna = document.getElementById('nlColuna').value;
    const obs = document.getElementById('nlObs').value;

    // VALIDAÇÃO: Todos os campos importantes são obrigatórios
    if (!produto || !fornecedor || !qtd || !resp) {
        alert("Por favor, preencha todos os campos obrigatórios (incluindo Responsável)!");
        return;
    }

    const novoLote = {
        id: 'prod-' + Date.now(),
        coluna: coluna,
        titulo: `${idLote} - ${produto}`, 
        resumo: `${qtd}kg • ${fornecedor}`,
        data: 'Hoje, ' + new Date().toLocaleTimeString().slice(0,5),
        detalhes: {
            responsavel: resp,
            temperatura: temp ? `${temp}°C` : '-',
            nf: nfAuto,
            produto: produto,
            fornecedor: fornecedor,
            obs: obs || '-'
        }
    };

    producaoItems.push(novoLote);
    atualizarKanbanProducao();
    fecharModalNovoLote();
    
    if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
        window.BeiraMarUtils.showToast('Lote registrado com sucesso!', 'success');
    }
}

// =========================================
// FUNÇÕES - NOVA LOGÍSTICA
// =========================================

window.abrirModalNovaLogistica = function() {
    const modal = document.getElementById('modalNovaLogistica');
    if(modal) {
        const randomNum = Math.floor(100 + Math.random() * 900);
        document.getElementById('nlogIdAuto').value = `CARGA-#${randomNum}`;
        modal.style.display = 'flex';
    }
}

window.fecharModalNovaLogistica = function() {
    const modal = document.getElementById('modalNovaLogistica');
    if(modal) modal.style.display = 'none';
    document.getElementById('formNovaLogistica').reset();
}

function salvarNovaLogistica() {
    const idCarga = document.getElementById('nlogIdAuto').value;
    const tipo = document.getElementById('nlogTipo').value;
    const resumo = document.getElementById('nlogResumo').value;
    const cliente = document.getElementById('nlogCliente').value;
    const destino = document.getElementById('nlogDestino').value;
    const placa = document.getElementById('nlogPlaca').value;
    const veiculo = document.getElementById('nlogVeiculo').value;
    const motorista = document.getElementById('nlogMotorista').value;

    // VALIDAÇÃO RIGOROSA: Tudo obrigatório
    if (!resumo || !cliente || !destino || !placa || !veiculo || !motorista) {
        alert("Todos os campos da logística são obrigatórios!");
        return;
    }

    const novaLogistica = {
        id: 'log-' + Date.now(),
        coluna: tipo,
        titulo: `${idCarga}`, 
        resumo: `${resumo}`,
        data: 'Hoje, ' + new Date().toLocaleTimeString().slice(0,5),
        detalhes: {
            cliente: cliente,
            destino: destino,
            motorista: motorista,
            veiculo: veiculo,
            placa: placa,
            tipoOperacao: tipo
        }
    };

    logisticaItems.push(novaLogistica);
    renderKanbanBoard('boardLogistica', logisticaItems, ['transporte', 'recebimento', 'expedicao', 'entregue'], ['Transporte', 'Recebimento', 'Expedição', 'Entregue']);
    
    fecharModalNovaLogistica();
    
    if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
        window.BeiraMarUtils.showToast('Logística registrada com sucesso!', 'success');
    }
}

// =========================================
// FUNÇÕES - DETALHES GERAIS
// =========================================

window.abrirModalDetalhe = function(id) {
    const item = producaoItems.find(i => i.id === id) || logisticaItems.find(i => i.id === id);
    if (!item) return;

    const modal = document.getElementById('modalDetalheProd');
    const titulo = document.getElementById('modalDetalheTitulo');
    const corpo = document.getElementById('modalDetalheCorpo');

    titulo.textContent = item.titulo;
    
    let detalhesHtml = `<div class="detalhe-grid">`;
    detalhesHtml += `
        <div class="detalhe-row"><strong>Status:</strong> <span>${item.coluna.toUpperCase()}</span></div>
        <div class="detalhe-row"><strong>Resumo:</strong> <span>${item.resumo}</span></div>
        <hr class="prod-separator"/>
    `;

    for (const [key, value] of Object.entries(item.detalhes)) {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        detalhesHtml += `<div class="detalhe-row"><strong>${label}:</strong> <span>${value}</span></div>`;
    }
    detalhesHtml += `</div>`;

    corpo.innerHTML = detalhesHtml;
    modal.style.display = 'flex';
};

window.fecharModalDetalhe = function() {
    const modal = document.getElementById('modalDetalheProd');
    if (modal) modal.style.display = 'none';
};

window.onclick = function(event) {
    const modalDet = document.getElementById('modalDetalheProd');
    const modalNew = document.getElementById('modalNovoLote');
    const modalLog = document.getElementById('modalNovaLogistica');
    
    if (event.target == modalDet) modalDet.style.display = 'none';
    if (event.target == modalNew) modalNew.style.display = 'none';
    if (event.target == modalLog) modalLog.style.display = 'none';
};

// =========================================
// CSS ESTILOS (RESPONSIVO E FIXADO)
// =========================================
function addProducaoStyles() {
    if (!document.getElementById('producao-styles')) {
        const styles = document.createElement('style');
        styles.id = 'producao-styles';
        styles.textContent = `
            :root {
                --prod-primary: #0066cc;
                --prod-primary-hover: #0052a3;
                --prod-bg: #f4f7f9;
                --prod-card-bg: #ffffff;
                --prod-text-dark: #2c3e50;
                --prod-text-light: #7f8c8d;
                --prod-border: #e2e8f0;
                --prod-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                --prod-shadow-hover: 0 10px 15px rgba(0, 0, 0, 0.08);
            }

            #producao .module-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 2rem; background: white; padding: 1.5rem;
                border-radius: 12px; box-shadow: var(--prod-shadow);
            }
            #producao .module-header h2 {
                margin: 0; color: var(--prod-text-dark); font-weight: 700; font-size: 1.5rem;
                display: flex; align-items: center; gap: 0.5rem;
            }
            #producao .module-header h2::before {
                content: ''; display: block; width: 6px; height: 24px;
                background: var(--prod-primary); border-radius: 4px;
            }

            #producao .btn-primary {
                background: linear-gradient(135deg, var(--prod-primary), var(--prod-primary-hover));
                color: white; border: none; padding: 0.7rem 1.4rem; border-radius: 50px;
                font-weight: 600; cursor: pointer; transition: transform 0.2s;
                display: flex; align-items: center; gap: 0.5rem;
                box-shadow: 0 4px 10px rgba(0, 102, 204, 0.2);
            }
            #producao .btn-primary:hover { transform: translateY(-2px); }

            #producao .btn-secondary-outline {
                background: white; border: 2px solid #a0aec0; color: #718096; padding: 0.5rem 1rem;
                border-radius: 50px; cursor: pointer; transition: 0.2s;
                display: flex; align-items: center; gap: 0.5rem; font-weight: 600;
            }
            #producao .btn-secondary-outline:hover {
                border-color: var(--prod-primary); color: var(--prod-primary); background: #f0f7ff;
            }

            #producao .section-title {
                display: flex; justify-content: space-between; align-items: center;
                margin: 2rem 0 1rem 0;
            }
            #producao .section-title h3 {
                margin: 0; color: var(--prod-text-dark); font-size: 1.1rem;
                text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;
                border-bottom: 3px solid #e2e8f0; padding-bottom: 5px;
            }

            #producao .kanban-board {
                display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;
            }
            #producao .kanban-column {
                background: #ebf0f5; border-radius: 12px; padding: 1rem; min-height: 450px;
            }
            #producao .column-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid rgba(0,0,0,0.05);
            }
            #producao .column-header h3 { font-size: 0.95rem; font-weight: 700; color: #555; margin: 0; }
            #producao .item-count {
                background: white; padding: 2px 10px; border-radius: 20px;
                font-weight: bold; font-size: 0.75rem; color: var(--prod-primary);
            }

            #producao .kanban-items { display: flex; flex-direction: column; gap: 1rem; }
            #producao .kanban-item {
                background: white; padding: 1.2rem; border-radius: 12px;
                box-shadow: var(--prod-shadow); border-left: 4px solid transparent;
                transition: all 0.3s ease; position: relative;
            }
            #producao .kanban-item:hover {
                transform: translateY(-4px); box-shadow: var(--prod-shadow-hover);
                border-left-color: var(--prod-primary);
            }
            #producao .kanban-item h4 { margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 700; color: var(--prod-text-dark); }
            #producao .kanban-item p { margin: 0 0 0.8rem 0; font-size: 0.9rem; color: var(--prod-text-light); }
            #producao .item-date { font-size: 0.75rem; color: #95a5a6; display: block; text-align: right; font-style: italic; }
            #producao .btn-icon-eye {
                background: #f0f7ff; border: none; color: var(--prod-primary);
                width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
                display: flex; align-items: center; justify-content: center; transition: all 0.2s;
            }
            #producao .btn-icon-eye:hover { background: var(--prod-primary); color: white; }
            
            /* MODAL E RESPONSIVIDADE CORRIGIDA */
            .custom-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 30, 60, 0.4); z-index: 9999;
                display: flex; align-items: center; justify-content: center;
                backdrop-filter: blur(5px);
            }
            
            .custom-modal-content {
                background: white; width: 95%; max-width: 650px;
                border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                overflow: hidden; display: flex; flex-direction: column;
                animation: slideUpFade 0.3s ease-out;
                max-height: 90vh; /* Permite ver o fundo e centraliza */
            }
            
            @keyframes slideUpFade {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            #producao .modal-header {
                background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
                padding: 1.2rem 1.5rem; display: flex; justify-content: space-between; align-items: center; color: white;
            }
            #producao .modal-header h3 { margin: 0; font-size: 1.1rem; color: white; display: flex; align-items: center; gap: 0.5rem; }
            #producao .btn-close-modal { background: none; border: none; font-size: 1.75rem; color: rgba(255,255,255,0.8); cursor: pointer; padding: 0; line-height: 1; }
            #producao .btn-close-modal:hover { color: white; }
            
            .modal-body { padding: 2rem; overflow-y: auto; background: #fcfcfc; }
            .modal-footer { padding: 1.2rem 2rem; background: white; border-top: 1px solid #edf2f7; display: flex; justify-content: flex-end; gap: 1rem; }
            
            .prod-form-group { margin-bottom: 1.2rem; }
            .prod-form-group label { font-size: 0.85rem; text-transform: uppercase; color: #7f8c8d; font-weight: 700; margin-bottom: 0.4rem; display: block; }
            .prod-form-control { width: 100%; padding: 0.8rem; border: 2px solid #edf2f7; border-radius: 8px; font-size: 0.95rem; background: #f8fafc; box-sizing: border-box; }
            .prod-form-control:focus { border-color: var(--prod-primary); background: white; outline: none; }
            .readonly-field { background: #e9ecef; color: #666; border-color: #dee2e6; }

            .prod-row { display: flex; gap: 1rem; }
            .prod-col-half { flex: 1; }
            .prod-form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #eee; }
            .input-suffix-group { position: relative; }
            .input-suffix-group input { padding-right: 2rem; }
            .input-suffix-group .suffix { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #888; font-size: 0.85rem; pointer-events: none; }

            #producao .btn-secondary { background: #edf2f7; color: #4a5568; border: none; padding: 0.7rem 1.4rem; border-radius: 50px; font-weight: 600; cursor: pointer; }
            #producao .btn-secondary:hover { background: #e2e8f0; }

            .detalhe-row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px; }
            .prod-separator { border: 0; border-top: 1px solid #eee; margin: 1.5rem 0; }

            /* MOBILE FIXES */
            @media (max-width: 768px) {
                #producao .kanban-board { grid-template-columns: 1fr; }
                .prod-row { flex-direction: column; gap: 0.5rem; }
                .prod-col-half { width: 100%; }
                
                /* Modal flutuante no mobile, não tela cheia */
                .custom-modal-content {
                    width: 95%;
                    max-height: 90vh;
                    margin: 1rem auto;
                    border-radius: 12px;
                }
                .modal-body { padding: 1rem; }
                .modal-footer { flex-direction: column-reverse; gap: 0.5rem; padding: 1rem; }
                .modal-footer button { width: 100%; }
            }
        `;
        document.head.appendChild(styles);
    }
}

window.BeiraMarProducao = { loadProducaoContent, addProducaoStyles };
// =========================================
// FLUXO DE TRABALHO - KANBAN DINÂMICO (CLEAN UI AZUL + PRIORIDADES)
// =========================================

// Dados simulados do Fluxo
let fluxoItems = [
    // COMPRA
    { 
        id: 'fluxo-001', 
        coluna: 'compra', 
        titulo: 'Salmão Premium', 
        resumo: 'Negociação • Fornecedor Chile', 
        data: 'Hoje, 08:00',
        detalhes: {
            fornecedor: 'Pescados Andes S.A.',
            quantidade: '500kg',
            prioridade: 'Alta', // Prioridade definida
            previsaoChegada: '15/11/2024'
        }
    },
    { 
        id: 'fluxo-002', 
        coluna: 'compra', 
        titulo: 'Embalagens Vácuo', 
        resumo: 'Reposição Estoque', 
        data: 'Ontem, 14:00',
        detalhes: {
            fornecedor: 'Plásticos BR',
            quantidade: '2000 un',
            prioridade: 'Urgente', // Prioridade definida
            obs: 'Urgentíssima'
        }
    },
    // TRANSPORTE
    { 
        id: 'fluxo-003', 
        coluna: 'transporte', 
        titulo: 'Carga #990 - Camarão', 
        resumo: 'Vindo do Ceará', 
        data: 'Em trânsito',
        detalhes: {
            transportadora: 'FrioTrans',
            prioridade: 'Normal', // Prioridade definida
            motorista: 'Sr. Roberto'
        }
    },
    // PROCESSAMENTO INTERNO
    { 
        id: 'fluxo-004', 
        coluna: 'processamento', 
        titulo: 'Filetagem Tilápia', 
        resumo: 'Equipe Manhã', 
        data: 'Em andamento',
        detalhes: {
            loteOrigem: '#L-2024-55',
            prioridade: 'Normal',
            meta: 'Transformar 100kg em filé'
        }
    },
    // VENDA / SAÍDA
    { 
        id: 'fluxo-005', 
        coluna: 'venda', 
        titulo: 'Pedido #5540', 
        resumo: 'Restaurante O Marujo', 
        data: 'Aguard. Faturamento',
        detalhes: {
            cliente: 'O Marujo Ltda',
            prioridade: 'Alta',
            valorTotal: 'R$ 2.450,00'
        }
    }
];

// Montagem do conteúdo principal
function loadFluxoContent() {
    const fluxoPage = document.getElementById('fluxo');
    
    fluxoPage.innerHTML = `
        <div class="module-header">
            <h2>Fluxo de Trabalho Geral</h2>
            <button class="btn btn-primary" onclick="abrirModalNovaTarefa()">
                <i class="fas fa-plus"></i>
                Nova Tarefa
            </button>
        </div>
        
        <div class="fluxo-container">
            <div class="kanban-board" id="boardFluxo">
                </div>
        </div>

        <div id="modalDetalheFluxo" class="custom-modal-overlay" style="display: none;">
            <div class="custom-modal-content">
                <div class="modal-header">
                    <h3 id="modalFluxoTitulo">Detalhes</h3>
                    <button class="btn-close-modal" onclick="fecharModalFluxo()">&times;</button>
                </div>
                <div class="modal-body" id="modalFluxoCorpo"></div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="fecharModalFluxo()">Fechar</button>
                </div>
            </div>
        </div>

        <div id="modalNovaTarefa" class="custom-modal-overlay" style="display: none;">
            <div class="custom-modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-tasks"></i> Nova Tarefa</h3>
                    <button class="btn-close-modal" onclick="fecharModalNovaTarefa()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="formNovaTarefa">
                        
                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>ID Tarefa (Auto)</label>
                                    <input type="text" id="ntIdAuto" class="prod-form-control readonly-field" readonly>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Fase / Coluna</label>
                                    <select id="ntColuna" class="prod-form-control" required>
                                        <option value="compra">Compra / Suprimentos</option>
                                        <option value="transporte">Transporte</option>
                                        <option value="processamento">Processamento</option>
                                        <option value="venda">Venda / Expedição</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="prod-form-group">
                            <label>Título da Tarefa</label>
                            <input type="text" id="ntTitulo" class="prod-form-control" placeholder="Ex: Comprar Embalagens Extras" required>
                        </div>

                        <div class="prod-form-group">
                            <label>Resumo / Descrição Curta</label>
                            <input type="text" id="ntResumo" class="prod-form-control" placeholder="Ex: 500 unidades para estoque" required>
                        </div>

                        <hr class="fluxo-separator"/>

                        <div class="prod-row">
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Responsável</label>
                                    <input type="text" id="ntResp" class="prod-form-control" list="listaResponsaveisFluxo" placeholder="Selecione ou digite">
                                    <datalist id="listaResponsaveisFluxo">
                                        <option value="Gerente de Compras">
                                        <option value="Logística">
                                        <option value="Produção">
                                        <option value="Vendas">
                                    </datalist>
                                </div>
                            </div>
                            <div class="prod-col-half">
                                <div class="prod-form-group">
                                    <label>Prioridade</label>
                                    <select id="ntPrioridade" class="prod-form-control">
                                        <option value="Normal">Normal</option>
                                        <option value="Alta">Alta</option>
                                        <option value="Urgente">Urgente</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="prod-form-group">
                            <label>Observações Detalhadas</label>
                            <textarea id="ntObs" class="prod-form-control" rows="2" placeholder="Detalhes adicionais..."></textarea>
                        </div>

                        <div class="prod-form-actions">
                            <button type="button" class="btn btn-secondary" onclick="fecharModalNovaTarefa()">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar Tarefa</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    addFluxoStyles();
    
    // Renderiza o Kanban Inicial
    atualizarKanbanFluxo();

    // Evento de Submit do Formulário
    const form = document.getElementById('formNovaTarefa');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            salvarNovaTarefa();
        });
    }
}

function atualizarKanbanFluxo() {
    // Define as colunas do fluxo
    const colunas = [
        { key: 'compra', titulo: 'Compra / Suprimentos' },
        { key: 'transporte', titulo: 'Transporte / Logística' },
        { key: 'processamento', titulo: 'Processamento Interno' },
        { key: 'venda', titulo: 'Venda / Expedição' }
    ];

    renderFluxoKanban('boardFluxo', fluxoItems, colunas);
}

function renderFluxoKanban(containerId, items, colunasDefs) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let html = '';
    colunasDefs.forEach(col => {
        const itensDaColuna = items.filter(i => i.coluna === col.key);
        html += `
            <div class="kanban-column">
                <div class="column-header">
                    <h3>${col.titulo}</h3>
                    <span class="item-count">${itensDaColuna.length}</span>
                </div>
                <div class="kanban-items">
                    ${itensDaColuna.map(item => createFluxoCard(item)).join('')}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function createFluxoCard(item) {
    // Define a prioridade padrão como Normal se não existir
    const prioridade = item.detalhes && item.detalhes.prioridade ? item.detalhes.prioridade : 'Normal';
    
    // Injetamos o data-prioridade para o CSS pegar
    return `
        <div class="kanban-item" data-prioridade="${prioridade}">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h4>${item.titulo}</h4>
                    <p>${item.resumo}</p>
                </div>
                <button class="btn-icon-eye" onclick="abrirModalFluxo('${item.id}')" title="Ver Detalhes">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="card-footer-info">
                <span class="badge-prioridade">${prioridade}</span>
                <span class="item-date">${item.data}</span>
            </div>
        </div>
    `;
}

// --- LÓGICA DO MODAL DETALHES ---
window.abrirModalFluxo = function(id) {
    const item = fluxoItems.find(i => i.id === id);
    if (!item) return;

    const modal = document.getElementById('modalDetalheFluxo');
    const titulo = document.getElementById('modalFluxoTitulo');
    const corpo = document.getElementById('modalFluxoCorpo');

    titulo.textContent = item.titulo;
    
    let detalhesHtml = `<div class="detalhe-grid">`;
    detalhesHtml += `
        <div class="detalhe-row"><strong>Fase Atual:</strong> <span>${item.coluna.toUpperCase()}</span></div>
        <div class="detalhe-row"><strong>Resumo:</strong> <span>${item.resumo}</span></div>
        <hr class="fluxo-separator"/>
    `;
    for (const [key, value] of Object.entries(item.detalhes)) {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        detalhesHtml += `<div class="detalhe-row"><strong>${label}:</strong> <span>${value}</span></div>`;
    }
    detalhesHtml += `</div>`;

    corpo.innerHTML = detalhesHtml;
    modal.style.display = 'flex';
};

window.fecharModalFluxo = function() {
    const modal = document.getElementById('modalDetalheFluxo');
    if (modal) modal.style.display = 'none';
};

// --- LÓGICA DO MODAL NOVA TAREFA ---
window.abrirModalNovaTarefa = function() {
    const modal = document.getElementById('modalNovaTarefa');
    if(modal) {
        // Gera ID aleatório
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        document.getElementById('ntIdAuto').value = `TASK-${randomNum}`;
        modal.style.display = 'flex';
        // Foco no título
        setTimeout(() => document.getElementById('ntTitulo').focus(), 100);
    }
}

window.fecharModalNovaTarefa = function() {
    const modal = document.getElementById('modalNovaTarefa');
    if(modal) modal.style.display = 'none';
    document.getElementById('formNovaTarefa').reset();
}

function salvarNovaTarefa() {
    const idTarefa = document.getElementById('ntIdAuto').value;
    const coluna = document.getElementById('ntColuna').value;
    const titulo = document.getElementById('ntTitulo').value;
    const resumo = document.getElementById('ntResumo').value;
    
    const resp = document.getElementById('ntResp').value;
    const prioridade = document.getElementById('ntPrioridade').value;
    const obs = document.getElementById('ntObs').value;

    if (!titulo || !resumo) {
        alert("Preencha o Título e o Resumo!");
        return;
    }

    const novaTarefa = {
        id: 'fluxo-' + Date.now(),
        coluna: coluna,
        titulo: titulo,
        resumo: resumo,
        data: 'Hoje, ' + new Date().toLocaleTimeString().slice(0,5),
        detalhes: {
            idTarefa: idTarefa,
            responsavel: resp || 'Não informado',
            prioridade: prioridade,
            obs: obs || '-'
        }
    };

    fluxoItems.push(novaTarefa);
    atualizarKanbanFluxo();
    fecharModalNovaTarefa();
    
    if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
        window.BeiraMarUtils.showToast('Tarefa criada com sucesso!', 'success');
    }
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modalDetalhe = document.getElementById('modalDetalheFluxo');
    const modalNova = document.getElementById('modalNovaTarefa');
    
    if (event.target == modalDetalhe) modalDetalhe.style.display = 'none';
    if (event.target == modalNova) modalNova.style.display = 'none';
};

// --- ESTILOS MODERNOS (AZUL + HOVER COLORIDO) ---
function addFluxoStyles() {
    if (!document.getElementById('fluxo-styles')) {
        const styles = document.createElement('style');
        styles.id = 'fluxo-styles';
        styles.textContent = `
            /* Variáveis de Tema (AZUL Padrão) */
            :root {
                --fluxo-primary: #0066cc;
                --fluxo-primary-dark: #0052a3;
                --fluxo-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }

            /* BLINDAGEM CSS: Tudo dentro de #fluxo */
            #fluxo .module-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 2rem; background: white; padding: 1.5rem;
                border-radius: 12px; box-shadow: var(--fluxo-shadow);
            }
            #fluxo .module-header h2 {
                margin: 0; color: #2c3e50; font-weight: 700; font-size: 1.5rem;
                display: flex; align-items: center; gap: 0.5rem;
            }
            #fluxo .module-header h2::before {
                content: ''; display: block; width: 6px; height: 24px;
                background: var(--fluxo-primary); border-radius: 4px;
            }

            #fluxo .btn-primary {
                background: linear-gradient(135deg, var(--fluxo-primary), var(--fluxo-primary-dark));
                color: white; border: none; padding: 0.7rem 1.4rem; border-radius: 50px;
                font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;
                box-shadow: 0 4px 10px rgba(0, 102, 204, 0.2); transition: transform 0.2s;
            }
            #fluxo .btn-primary:hover { transform: translateY(-2px); }

            #fluxo .kanban-board {
                display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;
            }
            #fluxo .kanban-column {
                background: #ebf0f5; border-radius: 12px; padding: 1rem; min-height: 450px;
            }
            #fluxo .column-header {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 1rem; border-bottom: 2px solid rgba(0,0,0,0.05); padding-bottom: 0.5rem;
            }
            #fluxo .column-header h3 { font-size: 0.95rem; font-weight: 700; color: #555; margin: 0; }
            #fluxo .item-count {
                background: white; padding: 2px 10px; border-radius: 20px;
                font-size: 0.75rem; font-weight: bold; color: var(--fluxo-primary);
            }

            #fluxo .kanban-items { display: flex; flex-direction: column; gap: 1rem; }
            
            /* --- CARD BASE --- */
            #fluxo .kanban-item {
                background: white; padding: 1.2rem; border-radius: 12px;
                box-shadow: var(--fluxo-shadow); 
                border-left: 5px solid transparent; /* Borda invisível padrão */
                transition: all 0.3s ease;
                position: relative;
            }
            
            /* --- HOVER COLORS MECÂNICA SOLICITADA --- */
            
            /* Prioridade: Normal (Azul) */
            #fluxo .kanban-item[data-prioridade="Normal"]:hover {
                border-left-color: #0066cc;
                background-color: #f0f7ff;
                transform: translateY(-4px);
                box-shadow: 0 10px 15px rgba(0, 102, 204, 0.1);
            }

            /* Prioridade: Alta (Amarelo/Laranja) */
            #fluxo .kanban-item[data-prioridade="Alta"]:hover {
                border-left-color: #f1c40f;
                background-color: #fffae6;
                transform: translateY(-4px);
                box-shadow: 0 10px 15px rgba(241, 196, 15, 0.15);
            }

            /* Prioridade: Urgente (Vermelho) */
            #fluxo .kanban-item[data-prioridade="Urgente"]:hover {
                border-left-color: #e74c3c;
                background-color: #fff5f5;
                transform: translateY(-4px);
                box-shadow: 0 10px 15px rgba(231, 76, 60, 0.15);
            }

            #fluxo .kanban-item h4 { margin: 0 0 0.5rem 0; font-size: 1rem; color: #2c3e50; }
            #fluxo .kanban-item p { margin: 0 0 0.8rem 0; font-size: 0.9rem; color: #7f8c8d; }
            
            #fluxo .card-footer-info {
                display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;
            }
            #fluxo .item-date { font-size: 0.75rem; color: #95a5a6; font-style: italic; }
            #fluxo .badge-prioridade {
                font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: #eee; color: #555;
            }

            /* Botão Olho */
            #fluxo .btn-icon-eye {
                background: #e9f7ef; border: none; color: var(--fluxo-primary);
                width: 32px; height: 32px; border-radius: 50%; cursor: pointer;
                display: flex; align-items: center; justify-content: center; transition: 0.2s;
            }
            #fluxo .btn-icon-eye:hover { background: var(--fluxo-primary); color: white; }

            /* Modais e Forms */
            .custom-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,30,60,0.4); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
            .custom-modal-content { background: white; width: 95%; max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); animation: slideUp 0.3s ease; }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            
            /* Header com gradiente AZUL */
            .modal-header {
                background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
                padding: 1.2rem 1.5rem; display: flex; justify-content: space-between; align-items: center; color: white;
            }
            .modal-header h3 { margin: 0; font-size: 1.1rem; color: white; display: flex; gap: 0.5rem; align-items: center; }
            .btn-close-modal { background: none; border: none; color: white; font-size: 1.75rem; cursor: pointer; opacity: 0.8; transition: 0.2s; padding: 0; line-height: 1; }
            .btn-close-modal:hover { opacity: 1; transform: scale(1.1); color: #ffcccc; }
            
            .modal-body { padding: 2rem; overflow-y: auto; max-height: 80vh; }
            .modal-footer { padding: 1rem 2rem; background: #f9f9f9; text-align: right; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 1rem; }
            
            /* Inputs Estilizados */
            .prod-form-group { margin-bottom: 1.2rem; }
            .prod-form-group label { display: block; margin-bottom: 0.3rem; font-weight: 600; font-size: 0.85rem; color: #7f8c8d; text-transform: uppercase; }
            .prod-form-control { width: 100%; padding: 0.8rem; border: 2px solid #edf2f7; border-radius: 8px; font-size: 0.95rem; background: #f8fafc; box-sizing: border-box; }
            .prod-form-control:focus { border-color: var(--fluxo-primary); outline: none; background: white; }
            .readonly-field { background: #e9ecef; color: #666; cursor: not-allowed; }

            .prod-row { display: flex; gap: 1rem; }
            .prod-col-half { flex: 1; }
            .prod-form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #eee; }

            .btn-secondary {
                background: #edf2f7; color: #4a5568; border: none; padding: 0.7rem 1.4rem;
                border-radius: 50px; font-weight: 600; cursor: pointer;
            }
            .btn-secondary:hover { background: #e2e8f0; }

            .detalhe-row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; border-bottom: 1px dashed #eee; padding-bottom: 5px; }
            .fluxo-separator { border: 0; border-top: 1px solid #eee; margin: 1.5rem 0; }
            
            @media (max-width: 768px) { 
                #fluxo .kanban-board { grid-template-columns: 1fr; } 
                .prod-row { flex-direction: column; gap: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Exporta a API pública do módulo de Fluxo de Trabalho
window.BeiraMarFluxo = {
    loadFluxoContent,
    addFluxoStyles
};
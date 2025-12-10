// =========================================
// FLUXO DE TRABALHO - KANBAN DINÂMICO (CLEAN UI AZUL + PRIORIDADES)
// =========================================

// Funções para salvar/carregar do localStorage
function carregarFluxoDoLocalStorage() {
    try {
        const fluxoSalvo = localStorage.getItem('fluxoItems');
        if (fluxoSalvo) {
            fluxoItems = JSON.parse(fluxoSalvo);
            console.log('✅ [Fluxo] Dados carregados do localStorage:', fluxoItems.length, 'tarefas');
        }
    } catch (e) {
        console.error('❌ [Fluxo] Erro ao carregar do localStorage:', e);
    }
}

function salvarFluxoNoLocalStorage() {
    try {
        localStorage.setItem('fluxoItems', JSON.stringify(fluxoItems));
        console.log('💾 [Fluxo] Dados salvos no localStorage:', fluxoItems.length, 'tarefas');
    } catch (e) {
        console.error('❌ [Fluxo] Erro ao salvar no localStorage:', e);
    }
}

// Dados simulados do Fluxo
let fluxoItems = [
    // COMPRA
    { 
        id: 'fluxo-001', 
        coluna: 'compra', 
        titulo: 'Salmão Premium', 
        resumo: 'Negociação • Fornecedor Chile', 
        data: 'Hoje, 08:00',
        funcionarioId: 1,
        funcionarioNome: 'Maria Silva',
        detalhes: {
            fornecedor: 'Pescados Andes S.A.',
            quantidade: '500kg',
            prioridade: 'Alta',
            funcionario: 'Maria Silva',
            previsaoChegada: '15/11/2024'
        }
    },
    { 
        id: 'fluxo-002', 
        coluna: 'compra', 
        titulo: 'Embalagens Vácuo', 
        resumo: 'Reposição Estoque', 
        data: 'Ontem, 14:00',
        funcionarioId: 5,
        funcionarioNome: 'Fernanda Lima',
        detalhes: {
            fornecedor: 'Plásticos BR',
            quantidade: '2000 un',
            prioridade: 'Urgente',
            funcionario: 'Fernanda Lima',
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
        funcionarioId: 2,
        funcionarioNome: 'João Santos',
        detalhes: {
            transportadora: 'FrioTrans',
            prioridade: 'Normal',
            funcionario: 'João Santos',
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
        funcionarioId: 3,
        funcionarioNome: 'Ana Costa',
        detalhes: {
            loteOrigem: '#L-2024-55',
            prioridade: 'Normal',
            funcionario: 'Ana Costa',
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
        funcionarioId: 5,
        funcionarioNome: 'Fernanda Lima',
        detalhes: {
            cliente: 'O Marujo Ltda',
            prioridade: 'Alta',
            funcionario: 'Fernanda Lima',
            valorTotal: 'R$ 2.450,00'
        }
    }
];

// Montagem do conteúdo principal
function loadFluxoContent() {
    const fluxoPage = document.getElementById('fluxo');
    if (!fluxoPage) return;
    
    // Verifica permissões usando o novo sistema
    const userType = sessionStorage.getItem('userType');
    
    // Se for admin, tem acesso total
    if (userType === 'adm' || userType === 'admin') {
        // Remove overlay se existir
        const overlayExistente = fluxoPage.querySelector('.overlay-acesso-negado-fluxo');
        if (overlayExistente) {
            overlayExistente.remove();
        }
    } else if (userType === 'funcionario') {
        // Verifica se o sistema de permissões está disponível
        if (!window.BeiraMarPermissoes) {
            console.error('❌ [Fluxo] Sistema de permissões não disponível!');
            fluxoPage.innerHTML = '';
            mostrarOverlayAcessoNegadoFluxo();
            return;
        }
        
        // Força recarregamento das permissões antes de verificar
        window.BeiraMarPermissoes.recarregarFuncionarios();
        
        // Verifica se o funcionário tem acesso à página de fluxo
        const temAcesso = window.BeiraMarPermissoes.temAcesso('fluxo');
        console.log(`🔍 [Fluxo] Verificando acesso: ${temAcesso}`);
        
        if (!temAcesso) {
            // Não tem acesso, mostra overlay
            console.log('❌ [Fluxo] Acesso negado - sem permissões');
            fluxoPage.innerHTML = '';
            mostrarOverlayAcessoNegadoFluxo();
            return;
        }
        
        console.log('✅ [Fluxo] Acesso permitido');
        
        // Remove overlay se existir
        const overlayExistente = fluxoPage.querySelector('.overlay-acesso-negado-fluxo');
        if (overlayExistente) {
            overlayExistente.remove();
        }
    } else {
        // Outros tipos de usuário - remove overlay se existir
        const overlayExistente = fluxoPage.querySelector('.overlay-acesso-negado-fluxo');
        if (overlayExistente) {
            overlayExistente.remove();
        }
    }
    
    // Carrega dados do localStorage ao inicializar
    carregarFluxoDoLocalStorage();
    
    // Verifica permissões para mostrar/ocultar botões
    const podeAdicionar = (userType === 'adm' || userType === 'admin') || 
                         (window.BeiraMarPermissoes && window.BeiraMarPermissoes.podeAdicionar('fluxo'));
    
    fluxoPage.innerHTML = `
        <div class="module-header">
            <h2>Fluxo de Trabalho Geral</h2>
            ${podeAdicionar ? `<button class="btn btn-primary" onclick="abrirModalNovaTarefa()">
                <i class="fas fa-plus"></i>
                Nova Tarefa
            </button>` : ''}
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
                                    <label><i class="fas fa-user me-1"></i> Funcionário Responsável</label>
                                    <select id="ntFuncionario" class="prod-form-control" required>
                                        <option value="">Selecione o funcionário...</option>
                                    </select>
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
    
    // Aguarda um pouco para garantir que o DOM foi atualizado
    setTimeout(() => {
        addFluxoStyles();
        
        // Verifica se o elemento boardFluxo existe antes de renderizar
        const boardFluxo = document.getElementById('boardFluxo');
        if (!boardFluxo) {
            console.error('❌ [Fluxo] Elemento boardFluxo não encontrado! Tentando novamente...');
            setTimeout(() => {
                atualizarKanbanFluxo();
                preencherSelectFuncionarios();
            }, 200);
            return;
        }
        
        // Preenche o select de funcionários
        preencherSelectFuncionarios();
        
        // Renderiza o Kanban Inicial
        atualizarKanbanFluxo();
        console.log('✅ [Fluxo] Conteúdo renderizado com sucesso');

        // Evento de Submit do Formulário
        const form = document.getElementById('formNovaTarefa');
        if(form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                salvarNovaTarefa();
            });
        }
    }, 100);
}

function preencherSelectFuncionarios() {
    const select = document.getElementById('ntFuncionario');
    if (!select) return;
    
    // Limpa opções existentes (exceto a primeira)
    select.innerHTML = '<option value="">Selecione o funcionário...</option>';
    
    // Busca a lista de funcionários
    const funcionarios = window.funcionariosLista || [];
    
    if (funcionarios.length === 0) {
        select.innerHTML += '<option value="" disabled>Nenhum funcionário cadastrado</option>';
        return;
    }
    
    // Adiciona cada funcionário como opção
    funcionarios.forEach(func => {
        const option = document.createElement('option');
        option.value = func.id;
        option.textContent = `${func.nome} - ${func.cargo || 'Sem cargo'}`;
        select.appendChild(option);
    });
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
    if (!container) {
        console.error(`❌ [Fluxo] Container ${containerId} não encontrado!`);
        return;
    }
    
    console.log(`✅ [Fluxo] Renderizando kanban em ${containerId} com ${items.length} itens`);
    
    let html = '';
    colunasDefs.forEach(col => {
        const itensDaColuna = items.filter(i => i.coluna === col.key);
        html += `
            <div class="kanban-column" data-col="${col.key}">
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
    console.log(`✅ [Fluxo] Kanban renderizado com sucesso`);
    // Drag & drop removido - só funciona em Produção
}

function createFluxoCard(item) {
    // Define a prioridade padrão como Normal se não existir
    const prioridade = item.detalhes && item.detalhes.prioridade ? item.detalhes.prioridade : 'Normal';
    
    // Busca o nome do funcionário
    const funcionarioNome = item.funcionarioNome || item.detalhes?.funcionario || 'Não atribuído';
    
    // Injetamos o data-prioridade para o CSS pegar
    return `
        <div class="kanban-item" data-id="${item.id}" data-prioridade="${prioridade}">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h4>${item.titulo}</h4>
                    <p>${item.resumo}</p>
                    <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #64748b;">
                        <i class="fas fa-user" style="color: #3b82f6;"></i>
                        <span>${funcionarioNome}</span>
                    </div>
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
    
    // Busca o nome do funcionário
    const funcionarioNome = item.funcionarioNome || item.detalhes?.funcionario || 'Não atribuído';
    
    let detalhesHtml = `<div class="detalhe-grid">`;
    detalhesHtml += `
        <div class="detalhe-row"><strong>Fase Atual:</strong> <span>${item.coluna.toUpperCase()}</span></div>
        <div class="detalhe-row"><strong>Resumo:</strong> <span>${item.resumo}</span></div>
        <div class="detalhe-row"><strong>Funcionário Responsável:</strong> <span style="color: #3b82f6; font-weight: 600;"><i class="fas fa-user me-1"></i>${funcionarioNome}</span></div>
        <hr class="fluxo-separator"/>
    `;
    for (const [key, value] of Object.entries(item.detalhes)) {
        // Pula o campo funcionário se já foi exibido acima
        if (key === 'funcionario') continue;
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

// --- FUNÇÃO AUXILIAR: OBTER NÍVEL DE ACESSO DO USUÁRIO LOGADO ---
function obterNivelAcessoUsuario() {
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

// --- FUNÇÃO PARA MOSTRAR ALERTA ESTILIZADO DE ACESSO NEGADO ---
function mostrarAlertaAcessoNegado() {
    // Remove alerta anterior se existir
    const alertaAnterior = document.getElementById('alerta-acesso-negado-fluxo');
    if (alertaAnterior) {
        alertaAnterior.remove();
    }
    
    // Cria o overlay
    const overlay = document.createElement('div');
    overlay.id = 'alerta-acesso-negado-fluxo';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    // Cria o modal de alerta
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 100%;
        padding: 0;
        overflow: hidden;
        animation: slideUp 0.3s ease;
        border: 1px solid rgba(239, 68, 68, 0.2);
    `;
    
    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); padding: 2rem; text-align: center; border-bottom: 2px solid #ef4444;">
            <div style="width: 80px; height: 80px; margin: 0 auto 1rem; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #dc2626); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);">
                <i class="fas fa-lock" style="font-size: 2rem; color: white;"></i>
            </div>
            <h3 style="margin: 0 0 0.5rem 0; color: #991b1b; font-size: 1.5rem; font-weight: 700;">Acesso Negado</h3>
            <p style="margin: 0; color: #7f1d1d; font-size: 0.95rem; font-weight: 500;">Você não tem permissão para esta ação</p>
        </div>
        <div style="padding: 2rem;">
            <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: #fef2f2; border-radius: 12px; border-left: 4px solid #ef4444;">
                <i class="fas fa-exclamation-triangle" style="color: #ef4444; font-size: 1.5rem; margin-top: 0.2rem; flex-shrink: 0;"></i>
                <div>
                    <p style="margin: 0; color: #1e293b; font-size: 1rem; line-height: 1.6; font-weight: 500;">
                        Você só tem o acesso de visualizador para está página
                    </p>
                </div>
            </div>
            <button onclick="this.closest('[id=\\'alerta-acesso-negado-fluxo\\']').remove()" style="
                width: 100%;
                padding: 0.875rem 1.5rem;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(239, 68, 68, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(239, 68, 68, 0.3)'">
                <i class="fas fa-times me-2"></i> Entendi
            </button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Fecha ao clicar no overlay (fora do modal)
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
    
    // Adiciona animações CSS se não existirem
    if (!document.getElementById('alerta-fluxo-animations')) {
        const style = document.createElement('style');
        style.id = 'alerta-fluxo-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            [data-theme="dark"] #alerta-acesso-negado-fluxo > div {
                background: #1e293b !important;
                border-color: rgba(239, 68, 68, 0.3) !important;
            }
            [data-theme="dark"] #alerta-acesso-negado-fluxo h3 {
                color: #fca5a5 !important;
            }
            [data-theme="dark"] #alerta-acesso-negado-fluxo p {
                color: #cbd5e1 !important;
            }
            [data-theme="dark"] #alerta-acesso-negado-fluxo div[style*="background: #fef2f2"] {
                background: rgba(239, 68, 68, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// --- LÓGICA DO MODAL NOVA TAREFA ---
window.abrirModalNovaTarefa = function() {
    // Verifica permissão usando o novo sistema
    const userType = sessionStorage.getItem('userType');
    const podeAdicionar = (userType === 'adm' || userType === 'admin') || 
                         (window.BeiraMarPermissoes && window.BeiraMarPermissoes.podeAdicionar('fluxo'));
    
    if (!podeAdicionar) {
        mostrarAlertaAcessoNegado();
        return;
    }
    
    const modal = document.getElementById('modalNovaTarefa');
    if(modal) {
        // Gera ID aleatório
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        document.getElementById('ntIdAuto').value = `TASK-${randomNum}`;
        
        // Atualiza a lista de funcionários antes de abrir
        preencherSelectFuncionarios();
        
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
    
    const funcionarioId = document.getElementById('ntFuncionario').value;
    const prioridade = document.getElementById('ntPrioridade').value;
    const obs = document.getElementById('ntObs').value;

    if (!titulo || !resumo) {
        alert("Preencha o Título e o Resumo!");
        return;
    }
    
    if (!funcionarioId) {
        alert("Selecione um funcionário responsável!");
        return;
    }

    // Busca os dados do funcionário
    const funcionarios = window.funcionariosLista || [];
    const funcionario = funcionarios.find(f => f.id == funcionarioId);
    const nomeFuncionario = funcionario ? funcionario.nome : 'Funcionário não encontrado';

    const novaTarefa = {
        id: 'fluxo-' + Date.now(),
        coluna: coluna,
        titulo: titulo,
        resumo: resumo,
        data: 'Hoje, ' + new Date().toLocaleTimeString().slice(0,5),
        funcionarioId: funcionarioId,
        funcionarioNome: nomeFuncionario,
        detalhes: {
            idTarefa: idTarefa,
            funcionario: nomeFuncionario,
            prioridade: prioridade,
            obs: obs || '-'
        }
    };

    fluxoItems.push(novaTarefa);
    salvarFluxoNoLocalStorage(); // Salva após adicionar
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
                transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
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

            /* Estado enquanto está sendo arrastado */
            #fluxo .kanban-item.dragging {
                opacity: 0.8;
                transform: scale(1.02);
            }

            /* Colunas que aceitam drop (quando está segurando um card) */
            #fluxo .kanban-column.drop-available {
                background: #e1edff;
                box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.25);
            }

            /* Coluna em foco (hover do drop) */
            #fluxo .kanban-column.drop-over {
                background: #d2e5ff;
                box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.6);
                transform: translateY(-2px);
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

            /* =========================================
               TEMA ESCURO - FLUXO E MODAIS
               ========================================= */

            [data-theme="dark"] #fluxo .module-header {
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] #fluxo .module-header h2 {
                color: #f1f5f9;
            }

            [data-theme="dark"] #fluxo .kanban-column {
                background: #334155;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] #fluxo .column-header {
                border-bottom-color: rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] #fluxo .column-header h3 {
                color: #cbd5e1;
            }

            [data-theme="dark"] #fluxo .item-count {
                background: #475569;
                color: #60a5fa;
            }

            [data-theme="dark"] #fluxo .kanban-item {
                background: #475569;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            /* Hover estados no tema escuro */
            [data-theme="dark"] #fluxo .kanban-item[data-prioridade="Normal"]:hover {
                background: #526280;
                box-shadow: 0 10px 15px rgba(0, 0, 0, 0.4);
            }

            [data-theme="dark"] #fluxo .kanban-item[data-prioridade="Alta"]:hover {
                background: #526280;
                box-shadow: 0 10px 15px rgba(251, 191, 36, 0.2);
            }

            [data-theme="dark"] #fluxo .kanban-item[data-prioridade="Urgente"]:hover {
                background: #526280;
                box-shadow: 0 10px 15px rgba(239, 68, 68, 0.2);
            }

            [data-theme="dark"] #fluxo .kanban-item h4 {
                color: #f1f5f9;
            }

            [data-theme="dark"] #fluxo .kanban-item p {
                color: #cbd5e1;
            }

            [data-theme="dark"] #fluxo .item-date {
                color: #94a3b8;
            }

            [data-theme="dark"] #fluxo .badge-prioridade {
                background: #334155;
                color: #cbd5e1;
            }

            [data-theme="dark"] #fluxo .btn-icon-eye {
                background: rgba(96, 165, 250, 0.2);
                color: #60a5fa;
            }

            [data-theme="dark"] #fluxo .btn-icon-eye:hover {
                background: #3b82f6;
                color: white;
            }

            /* Colunas de drop em tema escuro */
            [data-theme="dark"] #fluxo .kanban-column.drop-available {
                background: #1e3a5f;
                box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.3);
            }

            [data-theme="dark"] #fluxo .kanban-column.drop-over {
                background: #1e4a7f;
                box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.6);
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

            [data-theme="dark"] .prod-form-group label {
                color: #cbd5e1;
            }

            [data-theme="dark"] .prod-form-control {
                background: #334155;
                border: 2px solid rgba(255, 255, 255, 0.1);
                color: #f1f5f9;
            }

            [data-theme="dark"] .prod-form-control:focus {
                background: #475569;
                border-color: #60a5fa;
            }

            [data-theme="dark"] .readonly-field {
                background: #475569;
                color: #94a3b8;
                border-color: rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .btn-secondary {
                background: #334155;
                color: #cbd5e1;
            }

            [data-theme="dark"] .btn-secondary:hover {
                background: #475569;
            }

            [data-theme="dark"] .detalhe-row {
                color: #f1f5f9;
                border-bottom-color: rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .fluxo-separator {
                border-top-color: rgba(255, 255, 255, 0.1);
            }

            [data-theme="dark"] .prod-form-actions {
                border-top-color: rgba(255, 255, 255, 0.1);
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

// ==========================================================
// AUTO-CARREGAMENTO DO FLUXO (GARANTE QUE A PÁGINA NÃO FIQUE VAZIA)
// ==========================================================
function verificarECarregarFluxo() {
    const fluxoPage = document.getElementById('fluxo');
    if (!fluxoPage) return;
    
    const isVisible = fluxoPage.classList.contains('active') || 
                     fluxoPage.style.display === 'block';
    const temLoading = fluxoPage.querySelector('.fluxo-loading');
    
    if (isVisible && temLoading) {
        console.log('📊 Auto-carregando conteúdo do Fluxo...');
        loadFluxoContent();
    }
}

const fluxoObserver = new MutationObserver(function() {
    verificarECarregarFluxo();
});

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const fluxoPage = document.getElementById('fluxo');
        if (fluxoPage) {
            fluxoObserver.observe(fluxoPage, { attributes: true, attributeFilter: ['class', 'style'] });
            verificarECarregarFluxo();
        }
    }, 500);
});

setInterval(verificarECarregarFluxo, 500);
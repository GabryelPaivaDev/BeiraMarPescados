// =========================================
// SISTEMA DE MODAIS E USUÁRIO (FINAL)
// =========================================

const UserSystem = {
    // Função para formatar cargo para exibição
    formatarCargo(cargo) {
        if (!cargo) return '';
        const formatacoes = {
            'carregador': 'Carregador',
            'gerente': 'Gerente',
            'gerente-vendas': 'Gerente de Vendas',
            'gerente-producao': 'Gerente de Produção',
            'entregador': 'Entregador',
            'logistica': 'Logística'
        };
        return formatacoes[cargo.toLowerCase()] || cargo.charAt(0).toUpperCase() + cargo.slice(1);
    },
    
    // Função para formatar departamento para exibição
    formatarDepartamento(departamento) {
        if (!departamento) return '';
        const formatacoes = {
            'producao': 'Produção',
            'vendas': 'Vendas',
            'estoque': 'Estoque',
            'logistica': 'Logística'
        };
        return formatacoes[departamento.toLowerCase()] || departamento.charAt(0).toUpperCase() + departamento.slice(1);
    },
    
    // FUNÇÃO PRINCIPAL: Abre o modal de perfil
    openProfile() {
        console.log("👤 Abrindo perfil...");
        
        const email = sessionStorage.getItem('userEmail') || 'usuario@beiramar.com';
        const type = sessionStorage.getItem('userType') || 'visitante';
        
        // Extrai e formata o nome do email
        let name = email.split('@')[0];
        // Remove números do final (como "12" em "Fernanda12") e capitaliza
        name = name.replace(/\d+$/, '').trim();
        // Se não tiver nome, usa o email inteiro
        if (!name) {
            name = email.split('@')[0];
        }
        // Capitaliza primeira letra
        name = name.charAt(0).toUpperCase() + name.slice(1);

        const roles = {
            'admin': 'Administrador',
            'funcionario': 'Funcionário',
            'cliente': 'Cliente'
        };
        const roleName = roles[type] || 'Visitante';

        // Nome completo (simulado baseado no email)
        const fullName = name === 'Fernanda' ? 'Fernanda Aragão' : name;
        
        // Data de criação (simulada - em produção viria do backend)
        const createdAt = sessionStorage.getItem('accountCreatedAt') || '15/01/2025';
        
        // Busca informações do funcionário se for funcionário
        let cargo = '';
        let departamento = '';
        console.log("🔍 Verificando tipo de usuário:", type);
        console.log("📧 Email do usuário:", email);
        
        if (type === 'funcionario') {
            console.log("🔍 Tentando buscar dados do funcionário...");
            
            // Garante que a lista completa esteja disponível
            // Primeiro verifica se já existe a lista completa (de funcionarios.js)
            if (!window.funcionariosLista || window.funcionariosLista.length === 0) {
                console.warn("⚠️ Lista de funcionários não disponível, tentando inicializar...");
                
                // Tenta carregar do localStorage primeiro
                try {
                    const funcionariosSalvos = localStorage.getItem('funcionariosLista');
                    if (funcionariosSalvos) {
                        window.funcionariosLista = JSON.parse(funcionariosSalvos);
                        console.log("✅ Lista de funcionários carregada do localStorage.");
                    }
                } catch (e) {
                    console.error("❌ Erro ao carregar lista do localStorage:", e);
                }
                
                // Se ainda não tiver, inicializa a lista padrão completa (com todos os campos)
                if (!window.funcionariosLista || window.funcionariosLista.length === 0) {
                    console.warn("⚠️ Inicializando lista padrão completa...");
                    window.funcionariosLista = [
                        {
                            id: 1,
                            nome: 'Maria Silva',
                            email: 'maria.silva@beiramar.com',
                            cargo: 'gerente',
                            departamento: 'vendas'
                        },
                        {
                            id: 2,
                            nome: 'João Santos',
                            email: 'joao.santos@beiramar.com',
                            cargo: 'entregador',
                            departamento: 'logistica'
                        },
                        {
                            id: 3,
                            nome: 'Ana Costa',
                            email: 'ana.costa@beiramar.com',
                            cargo: 'carregador',
                            departamento: 'producao'
                        },
                        {
                            id: 4,
                            nome: 'Carlos Oliveira',
                            email: 'carlos.oliveira@beiramar.com',
                            cargo: 'logistica',
                            departamento: 'logistica'
                        },
                        {
                            id: 5,
                            nome: 'Fernanda Lima',
                            email: 'fernanda.lima@beiramar.com',
                            cargo: 'gerente-vendas',
                            departamento: 'vendas'
                        }
                    ];
                    console.log("✅ Lista padrão de funcionários inicializada.");
                }
            }
            
            // Verifica se a lista tem os campos necessários
            if (window.funcionariosLista && window.funcionariosLista.length > 0) {
                const primeiroFuncionario = window.funcionariosLista[0];
                console.log("📋 Exemplo de funcionário na lista:", primeiroFuncionario);
                console.log("📋 Tem cargo?", !!primeiroFuncionario.cargo);
                console.log("📋 Tem departamento?", !!primeiroFuncionario.departamento);
            }
            
            console.log("📋 Lista de funcionários disponível:", !!window.funcionariosLista);
            console.log("📊 Total de funcionários:", window.funcionariosLista ? window.funcionariosLista.length : 0);
            
            if (window.funcionariosLista && window.funcionariosLista.length > 0) {
                const funcionario = window.funcionariosLista.find(f => {
                    const emailFunc = (f.email || '').toLowerCase().trim();
                    const emailUser = email.toLowerCase().trim();
                    console.log("🔍 Comparando:", emailFunc, "com", emailUser);
                    return emailFunc === emailUser;
                });
                
                console.log("👤 Funcionário encontrado:", !!funcionario);
                if (funcionario) {
                    console.log("📝 Dados do funcionário:", funcionario);
                    console.log("📝 Cargo bruto:", funcionario.cargo);
                    console.log("📝 Departamento bruto:", funcionario.departamento);
                    
                    // Se cargo ou departamento estiverem undefined, tenta buscar da lista completa
                    if (!funcionario.cargo || !funcionario.departamento) {
                        console.warn("⚠️ Cargo ou departamento ausente, tentando buscar da lista completa...");
                        
                        // Tenta carregar funcionarios.js se ainda não foi carregado
                        if (typeof BeiraMarFuncionarios === 'undefined' && !window.funcionariosListaCompleta) {
                            // Se funcionarios.js não foi carregado, tenta usar a lista padrão completa
                            const listaCompleta = [
                                { id: 1, nome: 'Maria Silva', email: 'maria.silva@beiramar.com', cargo: 'gerente', departamento: 'vendas' },
                                { id: 2, nome: 'João Santos', email: 'joao.santos@beiramar.com', cargo: 'entregador', departamento: 'logistica' },
                                { id: 3, nome: 'Ana Costa', email: 'ana.costa@beiramar.com', cargo: 'carregador', departamento: 'producao' },
                                { id: 4, nome: 'Carlos Oliveira', email: 'carlos.oliveira@beiramar.com', cargo: 'logistica', departamento: 'logistica' },
                                { id: 5, nome: 'Fernanda Lima', email: 'fernanda.lima@beiramar.com', cargo: 'gerente-vendas', departamento: 'vendas' }
                            ];
                            
                            const funcionarioCompleto = listaCompleta.find(f => 
                                f.email && f.email.toLowerCase().trim() === email.toLowerCase().trim()
                            );
                            
                            if (funcionarioCompleto) {
                                console.log("✅ Funcionário completo encontrado na lista padrão:", funcionarioCompleto);
                                if (!funcionario.cargo && funcionarioCompleto.cargo) {
                                    funcionario.cargo = funcionarioCompleto.cargo;
                                    console.log("✅ Cargo atualizado:", funcionario.cargo);
                                }
                                if (!funcionario.departamento && funcionarioCompleto.departamento) {
                                    funcionario.departamento = funcionarioCompleto.departamento;
                                    console.log("✅ Departamento atualizado:", funcionario.departamento);
                                }
                            }
                        } else {
                            // Busca na lista completa (que pode ter sido carregada de funcionarios.js)
                            const funcionarioCompleto = window.funcionariosLista.find(f => 
                                f.email && f.email.toLowerCase().trim() === email.toLowerCase().trim() &&
                                (f.cargo || f.departamento)
                            );
                            if (funcionarioCompleto) {
                                console.log("✅ Funcionário completo encontrado com cargo/departamento:", funcionarioCompleto);
                                if (!funcionario.cargo && funcionarioCompleto.cargo) {
                                    funcionario.cargo = funcionarioCompleto.cargo;
                                    console.log("✅ Cargo atualizado:", funcionario.cargo);
                                }
                                if (!funcionario.departamento && funcionarioCompleto.departamento) {
                                    funcionario.departamento = funcionarioCompleto.departamento;
                                    console.log("✅ Departamento atualizado:", funcionario.departamento);
                                }
                            }
                        }
                    }
                    
                    // Formata cargo e departamento para exibição
                    cargo = this.formatarCargo(funcionario.cargo) || '-';
                    departamento = this.formatarDepartamento(funcionario.departamento) || '-';
                    console.log("💼 Cargo formatado:", cargo);
                    console.log("🏢 Departamento formatado:", departamento);
                } else {
                    console.warn("⚠️ Funcionário não encontrado na lista. Emails na lista:", 
                        window.funcionariosLista.map(f => f.email));
                }
            } else {
                console.warn("⚠️ Lista de funcionários vazia ou não disponível após tentativa de carregamento.");
            }
        }
        
        const nameEl = document.getElementById('modalProfileName');
        const roleEl = document.getElementById('modalProfileRole');
        const emailEl = document.getElementById('modalProfileEmail');
        const dateEl = document.getElementById('modalProfileDate');
        const fullNameEl = document.getElementById('modalProfileFullName');
        const cargoEl = document.getElementById('modalProfileCargo');
        const departamentoEl = document.getElementById('modalProfileDepartamento');
        const cargoContainer = document.getElementById('modalProfileCargoContainer');
        const departamentoContainer = document.getElementById('modalProfileDepartamentoContainer');
        
        if (nameEl) nameEl.textContent = name;
        if (roleEl) roleEl.textContent = roleName;
        if (emailEl) emailEl.textContent = email;
        if (dateEl) dateEl.textContent = createdAt;
        if (fullNameEl) fullNameEl.textContent = fullName;
        
        // Mostra/esconde campos de cargo e departamento apenas para funcionários
        console.log("🎯 Mostrando campos para tipo:", type);
        console.log("💼 Cargo encontrado:", cargo);
        console.log("🏢 Departamento encontrado:", departamento);
        if (type === 'funcionario') {
            console.log("✅ É funcionário, mostrando campos");
            
            // Aguarda um pouco para garantir que o modal foi renderizado
            setTimeout(() => {
                const cargoElAtualizado = document.getElementById('modalProfileCargo');
                const departamentoElAtualizado = document.getElementById('modalProfileDepartamento');
                const cargoContainerAtualizado = document.getElementById('modalProfileCargoContainer');
                const departamentoContainerAtualizado = document.getElementById('modalProfileDepartamentoContainer');
                
                if (cargoElAtualizado) {
                    cargoElAtualizado.textContent = cargo || '-';
                    console.log("✅ Campo cargo preenchido:", cargo, "no elemento:", cargoElAtualizado);
                } else {
                    console.error("❌ Elemento cargoEl não encontrado após timeout");
                }
                if (departamentoElAtualizado) {
                    departamentoElAtualizado.textContent = departamento || '-';
                    console.log("✅ Campo departamento preenchido:", departamento, "no elemento:", departamentoElAtualizado);
                } else {
                    console.error("❌ Elemento departamentoEl não encontrado após timeout");
                }
                if (cargoContainerAtualizado) {
                    cargoContainerAtualizado.style.display = 'flex';
                    console.log("✅ Container cargo mostrado");
                } else {
                    console.error("❌ Container cargo não encontrado após timeout");
                }
                if (departamentoContainerAtualizado) {
                    departamentoContainerAtualizado.style.display = 'flex';
                    console.log("✅ Container departamento mostrado");
                } else {
                    console.error("❌ Container departamento não encontrado após timeout");
                }
            }, 100);
            
            // Também preenche imediatamente (caso o modal já esteja renderizado)
            if (cargoEl) {
                cargoEl.textContent = cargo || '-';
                console.log("✅ Campo cargo preenchido imediatamente:", cargo);
            } else {
                console.error("❌ Elemento cargoEl não encontrado");
            }
            if (departamentoEl) {
                departamentoEl.textContent = departamento || '-';
                console.log("✅ Campo departamento preenchido imediatamente:", departamento);
            } else {
                console.error("❌ Elemento departamentoEl não encontrado");
            }
            if (cargoContainer) {
                cargoContainer.style.display = 'flex';
                console.log("✅ Container cargo mostrado");
            } else {
                console.error("❌ Container cargo não encontrado");
            }
            if (departamentoContainer) {
                departamentoContainer.style.display = 'flex';
                console.log("✅ Container departamento mostrado");
            } else {
                console.error("❌ Container departamento não encontrado");
            }
        } else {
            console.log("❌ Não é funcionário, escondendo campos. Tipo:", type);
            if (cargoContainer) cargoContainer.style.display = 'none';
            if (departamentoContainer) departamentoContainer.style.display = 'none';
        }

        ModalSystem.openModal('profileModal');
    },

    // REDE DE SEGURANÇA: Se o código antigo chamar handleUserClick, mandamos para openProfile
    handleUserClick() {
        this.openProfile();
    },

    // LOGOUT: Abre modal de confirmação
    logout() {
        if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
            window.BeiraMarModais.openModal('logoutConfirmModal');
        }
    },
    
    // Confirma e executa o logout
    confirmLogout() {
        console.log("🚪 Saindo do sistema...");
        sessionStorage.clear();
        // Redirecionamento correto para a pasta de login
        window.location.href = 'components/html/login.html';
    },
    
    // Abre página de Contato
    openContato() {
        if (window.BeiraMarModais) {
            window.BeiraMarModais.closeModal('profileModal');
        }
        if (window.BeiraMarNavigation && window.BeiraMarNavigation.navigateToPage) {
            window.BeiraMarNavigation.navigateToPage('contato');
        }
    },
    
    // Abre página de Sede Local
    openSedeLocal() {
        if (window.BeiraMarModais) {
            window.BeiraMarModais.closeModal('profileModal');
        }
        if (window.BeiraMarNavigation && window.BeiraMarNavigation.navigateToPage) {
            window.BeiraMarNavigation.navigateToPage('sedelocal');
        }
    },
    
    // Abre página de Chat Bot
    openChatBot() {
        if (window.BeiraMarModais) {
            window.BeiraMarModais.closeModal('profileModal');
        }
        if (window.BeiraMarNavigation && window.BeiraMarNavigation.navigateToPage) {
            window.BeiraMarNavigation.navigateToPage('chatbot');
        }
    }
};

const ModalSystem = {
    setup() {
        this.initListeners();
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        } else {
            console.error(`❌ Modal não encontrado: ${modalId}`);
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    },
    
    // Sistema genérico de confirmação
    showConfirm(options) {
        const {
            title = 'Confirmar Ação',
            message = 'Tem certeza que deseja continuar?',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            icon = 'question-circle',
            iconColor = '#3b82f6',
            onConfirm = () => {},
            onCancel = () => {}
        } = options;
        
        const modal = document.getElementById('genericConfirmModal');
        if (!modal) {
            console.error('❌ Modal genérico de confirmação não encontrado');
            return;
        }
        
        // Atualiza conteúdo do modal
        const titleEl = modal.querySelector('.confirm-modal-title');
        const messageEl = modal.querySelector('.confirm-modal-message');
        const iconEl = modal.querySelector('.confirm-modal-icon i');
        const confirmBtn = modal.querySelector('.btn-confirm-action');
        const cancelBtn = modal.querySelector('.btn-cancel-action');
        
        if (titleEl) titleEl.innerHTML = `<i class="fas fa-${icon}"></i> ${title}`;
        if (messageEl) messageEl.textContent = message;
        if (iconEl) {
            iconEl.className = `fas fa-${icon}`;
            iconEl.parentElement.style.setProperty('--icon-color', iconColor);
        }
        if (confirmBtn) confirmBtn.textContent = confirmText;
        if (cancelBtn) cancelBtn.textContent = cancelText;
        
        // Remove listeners anteriores
        const newConfirmBtn = confirmBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        // Adiciona novos listeners
        newConfirmBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeModal('genericConfirmModal');
            setTimeout(() => onConfirm(), 300);
        });
        
        newCancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeModal('genericConfirmModal');
            setTimeout(() => onCancel(), 300);
        });
        
        // Abre o modal
        this.openModal('genericConfirmModal');
    },

    initListeners() {
        document.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('.modal-close');
            if (closeBtn) {
                const modalId = closeBtn.getAttribute('data-modal');
                // Se o botão tiver o atributo data-modal, fecha ele
                // Se não tiver (como no seu caso que usa onclick no HTML), o onclick resolve
                if (modalId) this.closeModal(modalId);
            }
            
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
        
        this.setupForms();
    },

    setupForms() {
        // Configurações extras de formulários (adicionar item, etc)
        const form = document.getElementById('addItemForm');
        if (form) {
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Lógica de adicionar item...
                if (window.BeiraMarUtils) window.BeiraMarUtils.showToast("Item salvo!", "success");
                this.closeModal('addItemModal');
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ModalSystem.setup();
});

window.BeiraMarUser = UserSystem;
window.BeiraMarModais = ModalSystem;
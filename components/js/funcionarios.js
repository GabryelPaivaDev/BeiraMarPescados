// =========================================
// GESTÃO DE FUNCIONÁRIOS - REFEITO DO ZERO
// =========================================

// Armazena funcionários em memória (simula banco de dados)
window.funcionariosLista = window.funcionariosLista || [
    {
        id: 1,
        nome: 'Maria Silva',
        cpf: '123.456.789-00',
        email: 'maria.silva@beiramar.com',
        telefone: '(79) 99999-1111',
        senha: 'senha123',
        cargo: 'gerente',
        departamento: 'vendas',
        dataAdmissao: '15/01/2020',
        salario: '5.500,00',
        turnos: ['manha', 'tarde'],
        acessos: [], // Removido - agora usa apenas permissoes
        permissoes: {
            estoque: [],
            producao: [],
            vendas: [],
            logistica: [],
            fluxo: []
        },
        nivelAcesso: 'gerente',
        status: 'ativo',
        endereco: 'Rua das Flores, 123, Centro, Aracaju-SE',
        observacoes: 'Funcionária dedicada e experiente.'
    },
    {
        id: 2,
        nome: 'João Santos',
        cpf: '987.654.321-00',
        email: 'joao.santos@beiramar.com',
        telefone: '(79) 98888-2222',
        senha: 'senha456',
        cargo: 'entregador',
        departamento: 'logistica',
        dataAdmissao: '20/03/2021',
        salario: '2.800,00',
        turnos: ['manha'],
        acessos: [], // Removido - agora usa apenas permissoes
        permissoes: {
            estoque: [],
            producao: [],
            vendas: [],
            logistica: []
        },
        nivelAcesso: 'operador',
        status: 'ativo',
        endereco: 'Av. Beira Mar, 456, Atalaia, Aracaju-SE',
        observacoes: 'Bom relacionamento com clientes.'
    },
    {
        id: 3,
        nome: 'Ana Costa',
        cpf: '111.222.333-44',
        email: 'ana.costa@beiramar.com',
        telefone: '(79) 97777-3333',
        senha: 'senha789',
        cargo: 'carregador',
        departamento: 'producao',
        dataAdmissao: '10/05/2022',
        salario: '2.200,00',
        turnos: ['tarde'],
        acessos: [], // Removido - agora usa apenas permissoes
        permissoes: {
            estoque: [],
            producao: [],
            vendas: [],
            logistica: []
        },
        nivelAcesso: 'operador',
        status: 'ativo',
        endereco: 'Rua do Comércio, 789, São José, Aracaju-SE',
        observacoes: 'Eficiente na linha de produção.'
    },
    {
        id: 4,
        nome: 'Carlos Oliveira',
        cpf: '555.666.777-88',
        email: 'carlos.oliveira@beiramar.com',
        telefone: '(79) 96666-4444',
        senha: 'senha321',
        cargo: 'logistica',
        departamento: 'logistica',
        dataAdmissao: '05/08/2023',
        salario: '2.000,00',
        turnos: ['manha', 'tarde'],
        acessos: [], // Removido - agora usa apenas permissoes
        permissoes: {
            estoque: [],
            producao: [],
            vendas: [],
            logistica: []
        },
        nivelAcesso: 'supervisor',
        status: 'ativo',
        endereco: 'Rua dos Trabalhadores, 321, Industrial, Aracaju-SE',
        observacoes: 'Organizado e atento ao controle de estoque.'
    },
    {
        id: 5,
        nome: 'Fernanda Lima',
        cpf: '999.888.777-66',
        email: 'fernanda.lima@beiramar.com',
        telefone: '(79) 95555-5555',
        senha: 'senha654',
        cargo: 'gerente-vendas',
        departamento: 'vendas',
        dataAdmissao: '12/11/2023',
        salario: '2.500,00',
        turnos: ['manha'],
        acessos: [], // Removido - agora usa apenas permissoes
        permissoes: {
            estoque: [],
            producao: [],
            vendas: [],
            logistica: [],
            fluxo: []
        },
        nivelAcesso: 'gerente',
        status: 'ativo',
        endereco: 'Av. Ivo do Prado, 654, Centro, Aracaju-SE',
        observacoes: 'Recém contratada, em treinamento.'
    }
];

const BeiraMarFuncionarios = {
    init() {
        console.log("👥 Sistema de Funcionários inicializado");
        
        // Carrega funcionários do localStorage se existirem
        this.carregarFuncionariosDoLocalStorage();
        
        // Atualiza funcionários com nível "administrador" para "gerente"
        this.atualizarNiveisAdministrador();
        
        // Corrige cargos e departamentos de todos os funcionários
        this.corrigirCargosEDepartamentos();
        
        // Atualiza funcionários existentes para incluir campo permissoes
        this.atualizarPermissoesFuncionarios();
        
        // Salva a lista atualizada no localStorage
        this.salvarFuncionariosNoLocalStorage();
        
        // Inicializa credenciais dos funcionários padrão
        this.inicializarCredenciaisFuncionarios();
        
        this.setupEventListeners();
        this.setupMasks();
        // Renderiza a lista imediatamente
        setTimeout(() => {
            this.renderFuncionarios();
            console.log("📋 Lista inicial renderizada. Total:", window.funcionariosLista.length);
        }, 200);
    },
    
    // Função para carregar funcionários do localStorage
    carregarFuncionariosDoLocalStorage() {
        try {
            const funcionariosSalvos = localStorage.getItem('funcionariosListaCompleta');
            if (funcionariosSalvos) {
                const funcionarios = JSON.parse(funcionariosSalvos);
                if (Array.isArray(funcionarios) && funcionarios.length > 0) {
                    window.funcionariosLista = funcionarios;
                    console.log("✅ Funcionários carregados do localStorage:", funcionarios.length);
                    return;
                }
            }
            console.log("ℹ️ Nenhum funcionário salvo encontrado no localStorage, usando lista padrão");
        } catch (e) {
            console.error('Erro ao carregar funcionários do localStorage:', e);
        }
    },
    
    // Função para salvar funcionários no localStorage
    salvarFuncionariosNoLocalStorage() {
        try {
            localStorage.setItem('funcionariosListaCompleta', JSON.stringify(window.funcionariosLista));
            console.log("💾 Funcionários salvos no localStorage:", window.funcionariosLista.length);
        } catch (e) {
            console.error('Erro ao salvar funcionários no localStorage:', e);
        }
    },
    
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
    
    // Função para corrigir cargos e departamentos de todos os funcionários
    corrigirCargosEDepartamentos() {
        const mapeamentoCargos = {
            'Gerente': 'gerente',
            'Entregador': 'entregador',
            'Carregador': 'carregador',
            'Logística': 'logistica',
            'Gerente de Vendas': 'gerente-vendas',
            'gerente de vendas': 'gerente-vendas',
            'Gerente de Produção': 'gerente-producao',
            'gerente de produção': 'gerente-producao'
        };
        
        const mapeamentoDepartamentos = {
            'Produção': 'producao',
            'Vendas': 'vendas',
            'Estoque': 'estoque',
            'Logística': 'logistica'
        };
        
        let corrigidos = 0;
        window.funcionariosLista.forEach(func => {
            // Corrige cargo
            if (func.cargo) {
                const cargoOriginal = func.cargo;
                const cargoCorrigido = mapeamentoCargos[func.cargo] || func.cargo.toLowerCase();
                if (cargoOriginal !== cargoCorrigido) {
                    func.cargo = cargoCorrigido;
                    corrigidos++;
                    console.log(`✅ Cargo corrigido para "${func.nome}": "${cargoOriginal}" -> "${cargoCorrigido}"`);
                }
            }
            
            // Corrige departamento
            if (func.departamento) {
                const deptOriginal = func.departamento;
                const deptCorrigido = mapeamentoDepartamentos[func.departamento] || func.departamento.toLowerCase();
                if (deptOriginal !== deptCorrigido) {
                    func.departamento = deptCorrigido;
                    corrigidos++;
                    console.log(`✅ Departamento corrigido para "${func.nome}": "${deptOriginal}" -> "${deptCorrigido}"`);
                }
            }
        });
        
        if (corrigidos > 0) {
            console.log(`🔄 ${corrigidos} campo(s) de cargo/departamento corrigido(s).`);
        }
    },
    
    atualizarNiveisAdministrador() {
        try {
            let atualizados = 0;
            window.funcionariosLista.forEach(func => {
                if (func.nivelAcesso === 'administrador') {
                    func.nivelAcesso = 'gerente';
                    atualizados++;
                    console.log(`✅ Nível de acesso atualizado para "${func.nome}" (de administrador para gerente)`);
                }
            });
            
            if (atualizados > 0) {
                console.log(`✅ Total de ${atualizados} funcionário(s) atualizado(s)`);
            }
        } catch (e) {
            console.error('Erro ao atualizar níveis de acesso:', e);
        }
    },
    
    // Função para atualizar funcionários existentes com campo permissoes
    atualizarPermissoesFuncionarios() {
        try {
            let atualizados = 0;
            window.funcionariosLista.forEach(func => {
                // Se não tiver o campo permissoes, adiciona
                if (!func.permissoes) {
                    func.permissoes = {
                        estoque: [],
                        producao: [],
                        vendas: [],
                        logistica: []
                    };
                    atualizados++;
                }
                // Limpa acessos antigos (agora usa apenas permissoes)
                if (func.acessos && func.acessos.length > 0) {
                    func.acessos = [];
                    atualizados++;
                }
            });
            
            if (atualizados > 0) {
                console.log(`✅ Permissões atualizadas para ${atualizados} funcionário(s)`);
            }
        } catch (e) {
            console.error('Erro ao atualizar permissões dos funcionários:', e);
        }
    },
    
    inicializarCredenciaisFuncionarios() {
        try {
            const credenciaisFuncionarios = localStorage.getItem('credenciaisFuncionarios');
            let funcionariosCredenciais = credenciaisFuncionarios ? JSON.parse(credenciaisFuncionarios) : [];
            
            // Para cada funcionário, verifica se já existe nas credenciais e atualiza
            window.funcionariosLista.forEach(func => {
                if (!func.email || !func.senha) return; // Pula se não tiver email ou senha
                
                // Busca pelo email (mais confiável que ID)
                const index = funcionariosCredenciais.findIndex(f => 
                    f.email && f.email.toLowerCase() === func.email.toLowerCase()
                );
                
                if (index !== -1) {
                    // Atualiza credenciais existentes - SEMPRE atualiza a senha
                    funcionariosCredenciais[index].id = func.id;
                    funcionariosCredenciais[index].password = func.senha;
                    funcionariosCredenciais[index].nome = func.nome;
                    console.log(`✅ Credenciais atualizadas para ${func.email}`);
                } else {
                    // Adiciona novas credenciais
                    funcionariosCredenciais.push({
                        id: func.id,
                        email: func.email,
                        password: func.senha,
                        nome: func.nome
                    });
                    console.log(`✅ Novas credenciais adicionadas para ${func.email}`);
                }
            });
            
            localStorage.setItem('credenciaisFuncionarios', JSON.stringify(funcionariosCredenciais));
            console.log("✅ Credenciais dos funcionários padrão inicializadas");
        } catch (e) {
            console.error('Erro ao inicializar credenciais dos funcionários:', e);
        }
    },

    setupEventListeners() {
        // Event delegation para botão adicionar
        document.addEventListener('click', (e) => {
            if (e.target.closest('#btnAdicionarFuncionario')) {
                e.preventDefault();
                this.openAddModal();
            }
        });

        // Event delegation para submit do formulário - UMA ÚNICA VEZ
        if (!this._submitHandlerAdded) {
            const submitHandler = (e) => {
                const form = e.target.closest ? e.target.closest('#addFuncionarioForm') : 
                            (e.target.id === 'addFuncionarioForm' ? e.target : 
                            (e.target.form && e.target.form.id === 'addFuncionarioForm' ? e.target.form : null));
                
                if (form) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log("🚫 PreventDefault aplicado - formulário não vai recarregar");
                    
                    // Verifica se está em modo de edição
                    const editId = form.dataset.editId;
                    if (editId) {
                        const id = parseInt(editId);
                        console.log("✏️ Modo edição detectado no handler global. ID:", id);
                        this.handleUpdateFuncionario(form, id);
                    } else {
                        console.log("➕ Modo adicionar detectado no handler global");
                        this.handleAddFuncionario(form);
                    }
                    return false;
                }
            };
            
            document.addEventListener('submit', submitHandler, true); // Use capture phase
            this._submitHandlerAdded = true;
        }

        // Event delegation para botão submit dentro do formulário - REMOVIDO para evitar duplicação
        // O onsubmit do form já cuida disso
    },

    setupMasks() {
        // Máscara para CPF
        document.addEventListener('input', (e) => {
            if (e.target.id === 'funcionarioCPF') {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    e.target.value = value;
                } else {
                    e.target.value = e.target.value.slice(0, 14);
                }
            }

            // Máscara para Telefone
            if (e.target.id === 'funcionarioTelefone') {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    if (value.length <= 10) {
                        value = value.replace(/(\d{2})(\d)/, '($1) $2');
                        value = value.replace(/(\d{4})(\d)/, '$1-$2');
                    } else {
                        value = value.replace(/(\d{2})(\d)/, '($1) $2');
                        value = value.replace(/(\d{5})(\d)/, '$1-$2');
                    }
                    e.target.value = value;
                } else {
                    e.target.value = e.target.value.slice(0, 15);
                }
            }

            // Máscara para Data
            if (e.target.id === 'funcionarioDataAdmissao') {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                    if (value.length > 2) {
                        value = value.replace(/(\d{2})(\d)/, '$1/$2');
                    }
                    if (value.length > 5) {
                        value = value.replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
                    }
                    e.target.value = value;
                } else {
                    e.target.value = e.target.value.slice(0, 10);
                }
            }

            // Formatação de Salário - APENAS PERMITE NÚMEROS, FORMATA APENAS NO BLUR
            if (e.target.id === 'funcionarioSalario') {
                // Remove tudo que não é número, mas mantém o valor sem formatação durante a digitação
                let valorNumerico = e.target.value.replace(/\D/g, '');
                
                // Se não tem números, limpa
                if (!valorNumerico) {
                    e.target.value = '';
                    return;
                }
                
                // Limita a 12 dígitos
                if (valorNumerico.length > 12) {
                    valorNumerico = valorNumerico.substring(0, 12);
                }
                
                // Mantém apenas números durante a digitação (sem formatação)
                // A formatação só acontece no blur
                if (e.target.value.replace(/\D/g, '') !== valorNumerico) {
                    e.target.value = valorNumerico;
                }
            }
        });

        // Função para formatar salário (reutilizável)
        const formatarSalario = (input) => {
            // Evita processamento duplicado
            if (input._processandoBlur) return;
            input._processandoBlur = true;
            
            // Pega o valor atual e remove TUDO que não é número
            let valorAtual = input.value;
            let valorNumerico = valorAtual.replace(/\D/g, '');
            
            // Se não tem números, limpa
            if (!valorNumerico) {
                input.value = '';
                input._processandoBlur = false;
                return;
            }
            
            // Limita a 12 dígitos
            if (valorNumerico.length > 12) {
                valorNumerico = valorNumerico.substring(0, 12);
            }
            
            // Converte para número (NÃO divide por 100 - o número digitado é o valor em reais)
            const numero = Number(valorNumerico);
            
            if (isNaN(numero) || numero === 0) {
                input.value = '';
                input._processandoBlur = false;
                return;
            }
            
            // Formata: 150 → 150,00 | 1250 → 1.250,00
            const formatado = numero.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            
            input.value = formatado;
            
            // Libera o flag
            setTimeout(() => {
                input._processandoBlur = false;
            }, 100);
        };

        // Formatação de salário ao sair do campo (blur)
        document.addEventListener('blur', (e) => {
            if (e.target.id === 'funcionarioSalario') {
                formatarSalario(e.target);
            }
        }, true);

        // Formatação de salário ao pressionar Enter
        document.addEventListener('keydown', (e) => {
            if (e.target.id === 'funcionarioSalario' && e.key === 'Enter') {
                e.preventDefault(); // Evita submit do formulário
                formatarSalario(e.target);
                // Move o foco para o próximo campo
                const form = e.target.closest('form');
                if (form) {
                    const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
                    const currentIndex = inputs.indexOf(e.target);
                    if (currentIndex < inputs.length - 1) {
                        inputs[currentIndex + 1].focus();
                    }
                }
            }
        }, true);
    },

    openAddModal() {
        console.log("📝 Abrindo modal de adicionar funcionário");
        
        const modal = document.getElementById('addFuncionarioModal');
        if (!modal) {
            console.error("❌ Modal não encontrado");
            return;
        }

        // Limpa o formulário apenas se não estiver em modo de edição
        const form = document.getElementById('addFuncionarioForm');
        if (form) {
            // Se não estiver editando, limpa o formulário
            if (!form.dataset.editId) {
                form.reset();
                form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            }
            
            // Adiciona listener direto no formulário como garantia EXTRA
            // Mas só se não estiver em modo de edição (o editarFuncionario já configura)
            if (!form.dataset.editId) {
                form.onsubmit = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log("🚫 PreventDefault no onsubmit do form (modo adicionar)");
                    
                    // Verifica se é edição ou adição
                    if (form.dataset.editId) {
                        const editId = parseInt(form.dataset.editId);
                        console.log("✏️ Modo edição detectado. ID:", editId);
                        this.handleUpdateFuncionario(form, editId);
                    } else {
                        console.log("➕ Modo adicionar detectado");
                        this.handleAddFuncionario(form);
                    }
                    return false;
                };
            }
        }

        // Abre o modal
        if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
            window.BeiraMarModais.openModal('addFuncionarioModal');
        } else {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 10);
        }
    },

    handleAddFuncionario(form) {
        // FLAG PARA EVITAR DUPLICAÇÃO
        if (form._processando) {
            console.log("⚠️ Formulário já está sendo processado, ignorando...");
            return;
        }
        form._processando = true;
        
        console.log("💾 Processando adição de funcionário...");
        
        if (!form) {
            console.error("❌ Formulário não encontrado!");
            form._processando = false;
            return;
        }

        const formData = new FormData(form);
        
        // Pega turnos selecionados
        const turnos = [];
        form.querySelectorAll('input[name="turnos"]:checked').forEach(cb => {
            turnos.push(cb.value);
        });
        
        // Pega departamentos com acesso (mantido para compatibilidade)
        const acessos = [];
        form.querySelectorAll('input[name="acessoDepartamentos"]:checked').forEach(cb => {
            acessos.push(cb.value);
        });
        
        // Pega permissões por página (estoque, producao, vendas, logistica, fluxo)
        const permissoes = {
            estoque: [],
            producao: [],
            vendas: [],
            logistica: [],
            fluxo: []
        };
        
        // Coleta permissões usando o padrão permissoes[pagina][]
        const permissoesCheckboxes = form.querySelectorAll('input[name^="permissoes["]:checked');
        permissoesCheckboxes.forEach(cb => {
            const name = cb.name; // Ex: permissoes[estoque][]
            const pageMatch = name.match(/permissoes\[(.*?)\]/);
            if (pageMatch && pageMatch[1]) {
                const page = pageMatch[1];
                if (permissoes[page]) {
                    permissoes[page].push(cb.value);
                }
            }
        });
        
        console.log("📋 Permissões coletadas:", permissoes);
        
        // Validação de senha
        const senha = formData.get('funcionarioSenha');
        const senhaConfirmar = formData.get('funcionarioSenhaConfirmar');
        
        if (!senha || senha.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres.');
            document.getElementById('funcionarioSenha').focus();
            return;
        }
        
        if (senha !== senhaConfirmar) {
            alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
            document.getElementById('funcionarioSenhaConfirmar').focus();
            return;
        }

        // Garante que o nível de acesso não seja "administrador"
        let nivelAcesso = formData.get('funcionarioNivelAcesso');
        if (nivelAcesso === 'administrador') {
            nivelAcesso = 'gerente';
            console.log("⚠️ Nível de acesso 'administrador' não permitido. Alterado para 'gerente'.");
        }
        
        const funcionario = {
            id: Date.now(), // ID único simples
            nome: formData.get('funcionarioNome'),
            cpf: formData.get('funcionarioCPF'),
            email: formData.get('funcionarioEmail'),
            telefone: formData.get('funcionarioTelefone'),
            senha: senha, // Senha do funcionário
            cargo: formData.get('funcionarioCargo'),
            departamento: formData.get('funcionarioDepartamento'),
            dataAdmissao: formData.get('funcionarioDataAdmissao'),
            salario: formData.get('funcionarioSalario'),
            turnos: turnos,
            acessos: acessos,
            permissoes: permissoes, // Permissões específicas por página
            nivelAcesso: nivelAcesso, // Garantido que não será "administrador"
            status: formData.get('funcionarioStatus'),
            endereco: formData.get('funcionarioEndereco'),
            observacoes: formData.get('funcionarioObservacoes')
        };

        // Validação básica
        if (!funcionario.nome || !funcionario.cpf || !funcionario.email) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Adiciona à lista
        window.funcionariosLista.push(funcionario);
        console.log("✅ Funcionário adicionado:", funcionario);
        
        // Salva no localStorage
        this.salvarFuncionariosNoLocalStorage();
        
        // Salva as credenciais do funcionário para login
        try {
            const credenciaisFuncionarios = localStorage.getItem('credenciaisFuncionarios');
            let funcionariosCredenciais = credenciaisFuncionarios ? JSON.parse(credenciaisFuncionarios) : [];
            
            // Busca pelo email (mais confiável)
            const index = funcionariosCredenciais.findIndex(f => 
                f.email && f.email.toLowerCase() === funcionario.email.toLowerCase()
            );
            
            if (index !== -1) {
                // Atualiza credenciais existentes
                funcionariosCredenciais[index].id = funcionario.id;
                funcionariosCredenciais[index].password = funcionario.senha; // SEMPRE atualiza a senha
                funcionariosCredenciais[index].nome = funcionario.nome;
                localStorage.setItem('credenciaisFuncionarios', JSON.stringify(funcionariosCredenciais));
                console.log(`✅ Credenciais do funcionário ${funcionario.email} atualizadas`);
            } else {
                // Adiciona novas credenciais
                funcionariosCredenciais.push({
                    id: funcionario.id,
                    email: funcionario.email,
                    password: funcionario.senha,
                    nome: funcionario.nome
                });
                localStorage.setItem('credenciaisFuncionarios', JSON.stringify(funcionariosCredenciais));
                console.log(`✅ Credenciais do funcionário ${funcionario.email} salvas para login`);
            }
        } catch (e) {
            console.error('Erro ao salvar credenciais do funcionário:', e);
        }

        // Atualiza a tela IMEDIATAMENTE
        setTimeout(() => {
            this.renderFuncionarios();
            console.log("✅ Lista renderizada. Total de funcionários:", window.funcionariosLista.length);
        }, 100);

        // Mostra mensagem de sucesso
        this.showSuccessMessage();

        // Fecha o modal e limpa o formulário
        setTimeout(() => {
            if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                window.BeiraMarModais.closeModal('addFuncionarioModal');
            } else {
                const modal = document.getElementById('addFuncionarioModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
            form.reset();
            form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            form._processando = false; // Libera o flag
        }, 1500);
    },

    renderFuncionarios() {
        const container = document.querySelector('.funcionarios-container');
        if (!container) return;

        const funcionarios = window.funcionariosLista || [];

        if (funcionarios.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Gestão de Funcionários</h3>
                    <p>Nenhum funcionário cadastrado ainda. Clique em "Adicionar Funcionário" para começar.</p>
                </div>
            `;
            return;
        }

        // Renderiza a lista de funcionários
        let html = `
            <div style="display: grid; gap: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--border-color, #e2e8f0);">
                    <h3 style="margin: 0; font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #1e293b); display: flex; align-items: center; gap: 0.75rem;">
                        <i class="fas fa-users" style="color: #3b82f6;"></i>
                        Total: ${funcionarios.length} funcionário(s)
                    </h3>
                </div>
        `;

        funcionarios.forEach(func => {
            const turnosStr = func.turnos && func.turnos.length > 0 
                ? func.turnos.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
                : 'Não informado';
            
            // Formata permissões para exibição
            const temPermissoes = func.permissoes && (
                (func.permissoes.estoque && func.permissoes.estoque.length > 0) ||
                (func.permissoes.producao && func.permissoes.producao.length > 0) ||
                (func.permissoes.vendas && func.permissoes.vendas.length > 0) ||
                (func.permissoes.logistica && func.permissoes.logistica.length > 0) ||
                (func.permissoes.fluxo && func.permissoes.fluxo.length > 0)
            );
            
            const acessosStr = temPermissoes ? 'Configurado' : 'Nenhum';

            const statusColor = func.status === 'ativo' ? '#10b981' : 
                               func.status === 'inativo' ? '#ef4444' : 
                               func.status === 'ferias' ? '#f59e0b' : 
                               func.status === 'licenca' ? '#3b82f6' : '#6b7280';
            
            const statusText = func.status === 'ativo' ? 'Ativo' : 
                              func.status === 'inativo' ? 'Inativo' : 
                              func.status === 'ferias' ? 'Férias' : 
                              func.status === 'licenca' ? 'Licença' : 'Indefinido';
            
            // Sistema de cores por nível de acesso
            const nivelAcesso = func.nivelAcesso || 'visualizador';
            const nivelCores = {
                'gerente': {
                    cor: '#3b82f6',
                    corClara: '#dbeafe',
                    corEscura: '#1e40af',
                    nome: 'Gerente',
                    icone: 'fa-crown'
                },
                'supervisor': {
                    cor: '#8b5cf6',
                    corClara: '#ede9fe',
                    corEscura: '#6d28d9',
                    nome: 'Supervisor',
                    icone: 'fa-user-shield'
                },
                'operador': {
                    cor: '#10b981',
                    corClara: '#d1fae5',
                    corEscura: '#059669',
                    nome: 'Operador',
                    icone: 'fa-user-cog'
                },
                'visualizador': {
                    cor: '#6b7280',
                    corClara: '#f3f4f6',
                    corEscura: '#4b5563',
                    nome: 'Visualizador',
                    icone: 'fa-eye'
                }
            };
            
            const nivelInfo = nivelCores[nivelAcesso] || nivelCores['visualizador'];

            html += `
                <div class="funcionario-card" style="background: var(--bg-secondary, #ffffff); border-radius: 16px; padding: 1.75rem; border: 1px solid var(--border-color, #e2e8f0); border-left: 5px solid ${nivelInfo.cor}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); transition: all 0.3s ease; margin-bottom: 1.5rem; position: relative; overflow: hidden;">
                    <!-- Indicador de nível de acesso no topo -->
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${nivelInfo.cor} 0%, ${nivelInfo.corEscura} 100%);"></div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 2px solid var(--border-color, #e2e8f0); padding-top: 0.5rem;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 0.5rem 0; font-size: 1.25rem; font-weight: 700; color: var(--text-primary, #1e293b); display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-user-circle" style="color: ${nivelInfo.cor}; font-size: 1.5rem;"></i>
                                ${func.nome || 'Sem nome'}
                            </h4>
                            <p style="margin: 0; color: var(--text-secondary, #64748b); font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-briefcase" style="color: #64748b; font-size: 0.85rem;"></i>
                                ${this.formatarCargo(func.cargo) || 'Sem cargo'} - ${this.formatarDepartamento(func.departamento) || 'Sem departamento'}
                            </p>
                            <!-- Badge de nível de acesso -->
                            <div style="margin-top: 0.75rem; display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.9rem; background: ${nivelInfo.corClara}; border-radius: 8px; border: 1px solid ${nivelInfo.cor};">
                                <i class="fas ${nivelInfo.icone}" style="color: ${nivelInfo.cor}; font-size: 0.9rem;"></i>
                                <span style="color: ${nivelInfo.corEscura}; font-size: 0.85rem; font-weight: 600;">${nivelInfo.nome}</span>
                            </div>
                        </div>
                        <span style="padding: 0.4rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; background: ${statusColor}; color: white; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            ${statusText}
                        </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; font-size: 0.9rem; margin-bottom: 1.25rem;">
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; align-items: start; gap: 0.5rem;">
                                <i class="fas fa-id-card" style="color: #3b82f6; margin-top: 0.2rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong style="color: var(--text-primary, #1e293b);">CPF:</strong><br>
                                    <span style="color: var(--text-secondary, #64748b);">${func.cpf || 'Não informado'}</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 0.5rem;">
                                <i class="fas fa-envelope" style="color: #3b82f6; margin-top: 0.2rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong style="color: var(--text-primary, #1e293b);">Email:</strong><br>
                                    <span style="color: var(--text-secondary, #64748b);">${func.email || 'Não informado'}</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 0.5rem;">
                                <i class="fas fa-phone" style="color: #3b82f6; margin-top: 0.2rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong style="color: var(--text-primary, #1e293b);">Telefone:</strong><br>
                                    <span style="color: var(--text-secondary, #64748b);">${func.telefone || 'Não informado'}</span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; align-items: start; gap: 0.5rem;">
                                <i class="fas fa-dollar-sign" style="color: #10b981; margin-top: 0.2rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong style="color: var(--text-primary, #1e293b);">Salário:</strong><br>
                                    <span style="color: var(--text-secondary, #64748b);">R$ ${func.salario || 'Não informado'}</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 0.5rem;">
                                <i class="fas fa-calendar-alt" style="color: #3b82f6; margin-top: 0.2rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong style="color: var(--text-primary, #1e293b);">Data Admissão:</strong><br>
                                    <span style="color: var(--text-secondary, #64748b);">${func.dataAdmissao || 'Não informada'}</span>
                                </div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 0.5rem;">
                                <i class="fas fa-clock" style="color: #3b82f6; margin-top: 0.2rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong style="color: var(--text-primary, #1e293b);">Turno(s):</strong><br>
                                    <span style="color: var(--text-secondary, #64748b);">${turnosStr}</span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <div style="display: flex; align-items: start; gap: 0.5rem;">
                                <i class="fas fa-key" style="color: #3b82f6; margin-top: 0.2rem; font-size: 0.9rem;"></i>
                                <div style="flex: 1;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        <strong style="color: var(--text-primary, #1e293b);">Acesso a:</strong>
                                        <span style="color: var(--text-secondary, #64748b);">${acessosStr}</span>
                                    </div>
                                    <button onclick="BeiraMarFuncionarios.mostrarDetalhesPermissoes(${func.id})" style="
                                        padding: 0.4rem 0.75rem;
                                        background: linear-gradient(135deg, #3b82f6, #2563eb);
                                        color: white;
                                        border: none;
                                        border-radius: 8px;
                                        font-size: 0.85rem;
                                        font-weight: 600;
                                        cursor: pointer;
                                        display: inline-flex;
                                        align-items: center;
                                        gap: 0.5rem;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(59, 130, 246, 0.3)'">
                                        <i class="fas fa-info-circle"></i>
                                        Ver Detalhamento
                                    </button>
                                </div>
                            </div>
                            ${func.endereco ? `
                            <div style="display: flex; align-items: start; gap: 0.5rem;">
                                <i class="fas fa-map-marker-alt" style="color: #3b82f6; margin-top: 0.2rem; font-size: 0.9rem;"></i>
                                <div>
                                    <strong style="color: var(--text-primary, #1e293b);">Endereço:</strong><br>
                                    <span style="color: var(--text-secondary, #64748b);">${func.endereco}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    ${func.observacoes ? `
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color, #e2e8f0);">
                        <div style="display: flex; align-items: start; gap: 0.5rem;">
                            <i class="fas fa-sticky-note" style="color: #3b82f6; margin-top: 0.2rem;"></i>
                            <div>
                                <strong style="color: var(--text-primary, #1e293b);">Observações:</strong><br>
                                <span style="color: var(--text-secondary, #64748b);">${func.observacoes}</span>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 2px solid var(--border-color, #e2e8f0); justify-content: flex-end;">
                        <button class="btn-funcionario btn-detalhes" onclick="BeiraMarFuncionarios.verDetalhes(${func.id})" style="padding: 0.6rem 1.25rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
                            <i class="fas fa-eye"></i>
                            Detalhes
                        </button>
                        <button class="btn-funcionario btn-editar" onclick="BeiraMarFuncionarios.editarFuncionario(${func.id})" style="padding: 0.6rem 1.25rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                        <button class="btn-funcionario btn-excluir" onclick="BeiraMarFuncionarios.excluirFuncionario(${func.id})" style="padding: 0.6rem 1.25rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3); transition: all 0.3s ease; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(239, 68, 68, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(239, 68, 68, 0.3)'">
                            <i class="fas fa-trash-alt"></i>
                            Excluir
                        </button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    },

    verDetalhes(id) {
        const funcionario = window.funcionariosLista.find(f => f.id === id);
        if (!funcionario) {
            alert('Funcionário não encontrado!');
            return;
        }
        
        // Sistema de cores por nível de acesso
        const nivelAcesso = funcionario.nivelAcesso || 'visualizador';
        const nivelCores = {
            'gerente': {
                cor: '#3b82f6',
                corClara: '#dbeafe',
                corEscura: '#1e40af',
                nome: 'Gerente',
                icone: 'fa-crown'
            },
            'supervisor': {
                cor: '#8b5cf6',
                corClara: '#ede9fe',
                corEscura: '#6d28d9',
                nome: 'Supervisor',
                icone: 'fa-user-shield'
            },
            'operador': {
                cor: '#10b981',
                corClara: '#d1fae5',
                corEscura: '#059669',
                nome: 'Operador',
                icone: 'fa-user-cog'
            },
            'visualizador': {
                cor: '#6b7280',
                corClara: '#f3f4f6',
                corEscura: '#4b5563',
                nome: 'Visualizador',
                icone: 'fa-eye'
            }
        };
        
        const nivelInfo = nivelCores[nivelAcesso] || nivelCores['visualizador'];
        
        const turnosStr = funcionario.turnos && funcionario.turnos.length > 0 
            ? funcionario.turnos.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
            : 'Não informado';
        
        // Formata permissões para exibição
        const temPermissoes = funcionario.permissoes && (
            (funcionario.permissoes.estoque && funcionario.permissoes.estoque.length > 0) ||
            (funcionario.permissoes.producao && funcionario.permissoes.producao.length > 0) ||
            (funcionario.permissoes.vendas && funcionario.permissoes.vendas.length > 0) ||
            (funcionario.permissoes.logistica && funcionario.permissoes.logistica.length > 0) ||
            (funcionario.permissoes.fluxo && funcionario.permissoes.fluxo.length > 0)
        );
        
        const acessosStr = temPermissoes ? 'Configurado' : 'Nenhum';
        
        // Função auxiliar para formatar permissões
        const formatarPermissoes = (permissoes) => {
            if (!permissoes) return '<span style="color: var(--text-secondary, #64748b);">Nenhuma permissão configurada</span>';
            const paginas = {
                estoque: { nome: 'Estoque', icone: 'fa-boxes', cor: '#3b82f6' },
                producao: { nome: 'Produção', icone: 'fa-industry', cor: '#10b981' },
                vendas: { nome: 'Vendas', icone: 'fa-shopping-cart', cor: '#f59e0b' },
                logistica: { nome: 'Logística', icone: 'fa-truck', cor: '#8b5cf6' },
                fluxo: { nome: 'Fluxo', icone: 'fa-project-diagram', cor: '#6366f1' }
            };
            const acoes = {
                adicionar: { nome: 'Adicionar', icone: 'fa-plus', cor: '#10b981' },
                editar: { nome: 'Editar', icone: 'fa-edit', cor: '#3b82f6' },
                visualizar: { nome: 'Visualizar', icone: 'fa-eye', cor: '#6366f1' },
                excluir: { nome: 'Excluir', icone: 'fa-trash', cor: '#ef4444' }
            };
            
            let html = '';
            Object.keys(paginas).forEach(pagina => {
                if (permissoes[pagina] && permissoes[pagina].length > 0) {
                    const paginaInfo = paginas[pagina];
                    html += `
                        <div style="background: var(--bg-secondary, #ffffff); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; border: 1px solid var(--border-color, #e2e8f0); border-left: 4px solid ${paginaInfo.cor};">
                        <h6 style="margin: 0 0 1rem 0; font-weight: 600; color: var(--text-primary, #1e293b); display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas ${paginaInfo.icone}" style="color: ${paginaInfo.cor};"></i>
                            Tela de ${paginaInfo.nome}
                        </h6>
                            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                ${permissoes[pagina].map(acao => {
                                    const acaoInfo = acoes[acao];
                                    return `
                                        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: ${acaoInfo.cor}15; border-radius: 8px; border: 1px solid ${acaoInfo.cor}40;">
                                            <i class="fas ${acaoInfo.icone}" style="color: ${acaoInfo.cor}; font-size: 0.85rem;"></i>
                                            <span style="color: var(--text-primary, #1e293b); font-size: 0.85rem; font-weight: 600;">${acaoInfo.nome}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }
            });
            return html || '<span style="color: var(--text-secondary, #64748b);">Nenhuma permissão configurada</span>';
        };

        const statusColor = funcionario.status === 'ativo' ? '#10b981' : 
                           funcionario.status === 'inativo' ? '#ef4444' : 
                           funcionario.status === 'ferias' ? '#f59e0b' : 
                           funcionario.status === 'licenca' ? '#3b82f6' : '#6b7280';
        
        const statusText = funcionario.status === 'ativo' ? 'Ativo' : 
                          funcionario.status === 'inativo' ? 'Inativo' : 
                          funcionario.status === 'ferias' ? 'Férias' : 
                          funcionario.status === 'licenca' ? 'Licença' : 'Indefinido';

        const content = document.getElementById('detalhesFuncionarioContent');
        if (!content) {
            alert('Modal de detalhes não encontrado!');
            return;
        }

        content.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Header do Funcionário -->
                <div style="background: linear-gradient(135deg, ${nivelInfo.corClara}, ${nivelInfo.corClara}); border-radius: 12px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border: 2px solid ${nivelInfo.cor}; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${nivelInfo.cor} 0%, ${nivelInfo.corEscura} 100%);"></div>
                    <div style="display: flex; align-items: center; gap: 1rem; padding-top: 0.5rem;">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, ${nivelInfo.cor}, ${nivelInfo.corEscura}); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700; box-shadow: 0 4px 12px ${nivelInfo.cor}40;">
                            ${(funcionario.nome || 'F').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 style="margin: 0 0 0.25rem 0; font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #1e293b);">${funcionario.nome || 'Sem nome'}</h3>
                            <p style="margin: 0; color: var(--text-secondary, #64748b); font-size: 1rem;">
                                <i class="fas fa-briefcase" style="margin-right: 0.5rem;"></i>
                                ${this.formatarCargo(funcionario.cargo) || 'Sem cargo'} - ${this.formatarDepartamento(funcionario.departamento) || 'Sem departamento'}
                            </p>
                        </div>
                    </div>
                    <span style="padding: 0.5rem 1.25rem; border-radius: 10px; font-size: 0.9rem; font-weight: 600; background: ${statusColor}; color: white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">
                        ${statusText}
                    </span>
                </div>

                <!-- Informações Pessoais -->
                <div style="background: var(--bg-secondary, #ffffff); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color, #e2e8f0); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #1e293b); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-user" style="color: #3b82f6;"></i>
                        Informações Pessoais
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: var(--bg-tertiary, #f8fafc); border-radius: 8px;">
                            <i class="fas fa-id-card" style="color: #3b82f6; margin-top: 0.2rem; font-size: 1rem;"></i>
                            <div>
                                <strong style="color: var(--text-secondary, #64748b); font-size: 0.85rem;">CPF</strong><br>
                                <span style="color: var(--text-primary, #1e293b); font-size: 1rem; font-weight: 600;">${funcionario.cpf || 'Não informado'}</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: var(--bg-tertiary, #f8fafc); border-radius: 8px;">
                            <i class="fas fa-envelope" style="color: #3b82f6; margin-top: 0.2rem; font-size: 1rem;"></i>
                            <div>
                                <strong style="color: var(--text-secondary, #64748b); font-size: 0.85rem;">Email</strong><br>
                                <span style="color: var(--text-primary, #1e293b); font-size: 1rem; font-weight: 600;">${funcionario.email || 'Não informado'}</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: var(--bg-tertiary, #f8fafc); border-radius: 8px;">
                            <i class="fas fa-phone" style="color: #3b82f6; margin-top: 0.2rem; font-size: 1rem;"></i>
                            <div>
                                <strong style="color: var(--text-secondary, #64748b); font-size: 0.85rem;">Telefone</strong><br>
                                <span style="color: var(--text-primary, #1e293b); font-size: 1rem; font-weight: 600;">${funcionario.telefone || 'Não informado'}</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 8px; border: 2px solid #f59e0b;">
                            <i class="fas fa-lock" style="color: #f59e0b; margin-top: 0.2rem; font-size: 1rem;"></i>
                            <div style="flex: 1;">
                                <strong style="color: #92400e; font-size: 0.85rem; display: block; margin-bottom: 0.25rem;">Senha</strong>
                                <span style="color: #78350f; font-size: 1rem; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 3px; background: white; padding: 0.5rem 0.75rem; border-radius: 6px; display: inline-block; border: 1px solid #f59e0b;">
                                    ${funcionario.senha || 'Não informada'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Informações Profissionais -->
                <div style="background: var(--bg-secondary, #ffffff); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color, #e2e8f0); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #1e293b); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-briefcase" style="color: #3b82f6;"></i>
                        Informações Profissionais
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: var(--bg-tertiary, #f8fafc); border-radius: 8px;">
                            <i class="fas fa-dollar-sign" style="color: #10b981; margin-top: 0.2rem; font-size: 1rem;"></i>
                            <div>
                                <strong style="color: var(--text-secondary, #64748b); font-size: 0.85rem;">Salário</strong><br>
                                <span style="color: var(--text-primary, #1e293b); font-size: 1rem; font-weight: 600;">R$ ${funcionario.salario || 'Não informado'}</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: var(--bg-tertiary, #f8fafc); border-radius: 8px;">
                            <i class="fas fa-calendar-alt" style="color: #3b82f6; margin-top: 0.2rem; font-size: 1rem;"></i>
                            <div>
                                <strong style="color: var(--text-secondary, #64748b); font-size: 0.85rem;">Data de Admissão</strong><br>
                                <span style="color: var(--text-primary, #1e293b); font-size: 1rem; font-weight: 600;">${funcionario.dataAdmissao || 'Não informada'}</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: var(--bg-tertiary, #f8fafc); border-radius: 8px;">
                            <i class="fas fa-clock" style="color: #3b82f6; margin-top: 0.2rem; font-size: 1rem;"></i>
                            <div>
                                <strong style="color: var(--text-secondary, #64748b); font-size: 0.85rem;">Turno(s)</strong><br>
                                <span style="color: var(--text-primary, #1e293b); font-size: 1rem; font-weight: 600;">${turnosStr}</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: ${nivelInfo.corClara}; border-radius: 8px; border: 2px solid ${nivelInfo.cor};">
                            <i class="fas ${nivelInfo.icone}" style="color: ${nivelInfo.cor}; margin-top: 0.2rem; font-size: 1rem;"></i>
                            <div>
                                <strong style="color: ${nivelInfo.corEscura}; font-size: 0.85rem;">Nível de Acesso</strong><br>
                                <div style="display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                                    <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${nivelInfo.cor};"></span>
                                    <span style="color: ${nivelInfo.corEscura}; font-size: 1rem; font-weight: 700; text-transform: capitalize;">${nivelInfo.nome}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Permissões por Página -->
                <div style="background: var(--bg-secondary, #ffffff); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color, #e2e8f0); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #1e293b); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-key" style="color: #3b82f6;"></i>
                        Permissões por Página
                    </h4>
                    <div>
                        ${formatarPermissoes(funcionario.permissoes)}
                    </div>
                </div>

                ${funcionario.endereco ? `
                <!-- Endereço -->
                <div style="background: var(--bg-secondary, #ffffff); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color, #e2e8f0); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #1e293b); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-map-marker-alt" style="color: #3b82f6;"></i>
                        Endereço
                    </h4>
                    <div style="padding: 0.75rem; background: var(--bg-tertiary, #f8fafc); border-radius: 8px;">
                        <span style="color: var(--text-primary, #1e293b); font-size: 1rem; font-weight: 600;">${funcionario.endereco}</span>
                    </div>
                </div>
                ` : ''}

                ${funcionario.observacoes ? `
                <!-- Observações -->
                <div style="background: var(--bg-secondary, #ffffff); border-radius: 12px; padding: 1.5rem; border: 1px solid var(--border-color, #e2e8f0); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700; color: var(--text-primary, #1e293b); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-sticky-note" style="color: #3b82f6;"></i>
                        Observações
                    </h4>
                    <div style="padding: 0.75rem; background: var(--bg-tertiary, #f8fafc); border-radius: 8px;">
                        <span style="color: var(--text-primary, #1e293b); font-size: 1rem; line-height: 1.6;">${funcionario.observacoes}</span>
                    </div>
                </div>
                ` : ''}
                
                <!-- Botões de ação no modal de detalhes -->
                <div style="display: flex; gap: 0.75rem; justify-content: flex-end; padding-top: 1.5rem; border-top: 2px solid var(--border-color, #e2e8f0); margin-top: 1rem;">
                    <button onclick="BeiraMarFuncionarios.editarFuncionario(${funcionario.id}); window.BeiraMarModais.closeModal('detalhesFuncionarioModal');" style="padding: 0.75rem 1.5rem; border-radius: 10px; font-size: 0.95rem; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); transition: all 0.3s ease;">
                        <i class="fas fa-edit"></i>
                        Editar Funcionário
                    </button>
                    <button onclick="window.BeiraMarModais.closeModal('detalhesFuncionarioModal')" style="padding: 0.75rem 1.5rem; border-radius: 10px; font-size: 0.95rem; font-weight: 600; border: 2px solid var(--border-color, #e2e8f0); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; background: var(--bg-primary, #ffffff); color: var(--text-primary, #1e293b); transition: all 0.3s ease;">
                        <i class="fas fa-times"></i>
                        Fechar
                    </button>
                </div>
            </div>
        `;

        // Abre o modal
        if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
            window.BeiraMarModais.openModal('detalhesFuncionarioModal');
        } else {
            const modal = document.getElementById('detalhesFuncionarioModal');
            if (modal) {
                modal.style.display = 'flex';
                setTimeout(() => {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }, 10);
            }
        }
    },

    editarFuncionario(id) {
        const funcionario = window.funcionariosLista.find(f => f.id === id);
        if (!funcionario) {
            alert('Funcionário não encontrado!');
            return;
        }
        
        console.log("✏️ Editar funcionário:", funcionario);
        
        // Primeiro, obtém o formulário e define o editId ANTES de abrir o modal
        const form = document.getElementById('addFuncionarioForm');
        if (!form) {
            console.error("❌ Formulário não encontrado!");
            return;
        }
        
        // Define o ID de edição ANTES de abrir o modal
        form.dataset.editId = id.toString();
        console.log("✅ Edit ID definido:", form.dataset.editId);
        
        // Abre o modal de adicionar (que será usado para edição)
        this.openAddModal();
        
        // Preenche o formulário com os dados do funcionário
        setTimeout(() => {
            // Garante que o editId ainda está definido
            if (!form.dataset.editId) {
                form.dataset.editId = id.toString();
            }
            
            // Preenche campos básicos
            const nomeInput = document.getElementById('funcionarioNome');
            const cpfInput = document.getElementById('funcionarioCPF');
            const emailInput = document.getElementById('funcionarioEmail');
            const telefoneInput = document.getElementById('funcionarioTelefone');
            const cargoSelect = document.getElementById('funcionarioCargo');
            const deptSelect = document.getElementById('funcionarioDepartamento');
            const dataInput = document.getElementById('funcionarioDataAdmissao');
            const salarioInput = document.getElementById('funcionarioSalario');
            const nivelSelect = document.getElementById('funcionarioNivelAcesso');
            const statusSelect = document.getElementById('funcionarioStatus');
            const enderecoInput = document.getElementById('funcionarioEndereco');
            const obsTextarea = document.getElementById('funcionarioObservacoes');
            const senhaInput = document.getElementById('funcionarioSenha');
            const senhaConfirmInput = document.getElementById('funcionarioSenhaConfirmar');
            
            if (nomeInput) nomeInput.value = funcionario.nome || '';
            if (cpfInput) cpfInput.value = funcionario.cpf || '';
            if (emailInput) emailInput.value = funcionario.email || '';
            if (telefoneInput) telefoneInput.value = funcionario.telefone || '';
            if (cargoSelect) cargoSelect.value = funcionario.cargo || '';
            if (deptSelect) deptSelect.value = funcionario.departamento || '';
            if (dataInput) dataInput.value = funcionario.dataAdmissao || '';
            if (salarioInput) salarioInput.value = funcionario.salario || '';
            if (nivelSelect) nivelSelect.value = funcionario.nivelAcesso || '';
            if (statusSelect) statusSelect.value = funcionario.status || 'ativo';
            if (enderecoInput) enderecoInput.value = funcionario.endereco || '';
            if (obsTextarea) obsTextarea.value = funcionario.observacoes || '';
            if (senhaInput) senhaInput.value = funcionario.senha || '';
            if (senhaConfirmInput) senhaConfirmInput.value = funcionario.senha || '';
            
            // Marca checkboxes de turnos
            if (funcionario.turnos && funcionario.turnos.length > 0) {
                funcionario.turnos.forEach(turno => {
                    const checkbox = document.querySelector(`input[name="turnos"][value="${turno}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
            
            // Marca checkboxes de acessos
            console.log("🔍 Preenchendo checkboxes de acessos. Acessos do funcionário:", funcionario.acessos);
            if (funcionario.acessos && funcionario.acessos.length > 0) {
                funcionario.acessos.forEach(acesso => {
                    // Tenta encontrar dentro do formulário primeiro
                    let checkbox = form.querySelector(`input[name="acessoDepartamentos"][value="${acesso}"]`);
                    // Se não encontrar, tenta no documento todo
                    if (!checkbox) {
                        checkbox = document.querySelector(`input[name="acessoDepartamentos"][value="${acesso}"]`);
                    }
                    if (checkbox) {
                        checkbox.checked = true;
                        console.log(`  ✅ Checkbox de acesso "${acesso}" marcado`);
                    } else {
                        console.warn(`  ⚠️ Checkbox de acesso "${acesso}" não encontrado!`);
                    }
                });
            } else {
                console.log("  ℹ️ Nenhum acesso para preencher");
            }
            
            // Marca checkboxes de permissões
            if (funcionario.permissoes) {
                ['estoque', 'producao', 'vendas', 'logistica', 'fluxo'].forEach(pagina => {
                    if (funcionario.permissoes[pagina]) {
                        funcionario.permissoes[pagina].forEach(acao => {
                            const checkbox = form.querySelector(`input[name="permissoes[${pagina}][]"][value="${acao}"]`);
                            if (checkbox) {
                                checkbox.checked = true;
                                console.log(`  ✅ Permissão ${pagina}/${acao} marcada`);
                            }
                        });
                    }
                });
            }
            
            // Debug: verifica todos os checkboxes após preencher
            const todosAcessos = form.querySelectorAll('input[name="acessoDepartamentos"]');
            console.log("🔍 Estado dos checkboxes após preencher:", todosAcessos.length);
            todosAcessos.forEach(cb => {
                console.log(`  - ${cb.value}: ${cb.checked ? '✅ marcado' : '❌ desmarcado'}`);
            });
            
            // Altera o título do modal e o botão
            const modalTitle = document.querySelector('#addFuncionarioModal .modal-header h2');
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="fas fa-edit me-2"></i> Editar Funcionário';
            }
            
            const submitBtn = document.getElementById('btnSubmitFuncionario');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-save me-2"></i>Salvar Alterações';
                submitBtn.type = 'button'; // Muda para button para evitar submit automático
                
                // Remove TODOS os listeners anteriores clonando o botão
                const newSubmitBtn = submitBtn.cloneNode(true);
                submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
                
                // Remove o listener do modais.html se existir
                if (window.adicionarFuncionario) {
                    newSubmitBtn.removeEventListener('click', window.adicionarFuncionario);
                }
                
                // Adiciona novo listener usando a referência correta
                const self = this;
                const handlerEdicao = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    // Busca o form novamente para garantir que temos a referência correta
                    const formAtual = document.getElementById('addFuncionarioForm');
                    if (!formAtual) {
                        console.error("❌ Formulário não encontrado!");
                        return false;
                    }
                    
                    console.log("💾 Botão Salvar Alterações clicado. ID:", formAtual.dataset.editId);
                    const editId = parseInt(formAtual.dataset.editId);
                    if (!editId || isNaN(editId)) {
                        console.error("❌ Edit ID não encontrado ou inválido! Form dataset:", formAtual.dataset);
                        alert('Erro: ID de edição não encontrado. Por favor, tente novamente.');
                        return false;
                    }
                    console.log("✅ Chamando handleUpdateFuncionario com ID:", editId);
                    self.handleUpdateFuncionario(formAtual, editId);
                    return false;
                };
                
                // Adiciona o listener com capture phase e como não-cancelável
                newSubmitBtn.addEventListener('click', handlerEdicao, { capture: true, once: false });
                
                // Também adiciona como propriedade para garantir que seja chamado
                newSubmitBtn.onclick = handlerEdicao;
                
                // Armazena a referência para poder remover depois se necessário
                newSubmitBtn._handlerEdicao = handlerEdicao;
                
                console.log("✅ Botão de edição configurado. ID do formulário:", form.dataset.editId);
            } else {
                console.error("❌ Botão btnSubmitFuncionario não encontrado!");
            }
            
            // Remove o onsubmit inline do HTML que está interferindo
            form.removeAttribute('onsubmit');
            form.onsubmit = null;
            
            // Marca o formulário como em modo de edição para evitar que o script do modais.html interfira
            form.dataset.modoEdicao = 'true';
            
            // Garante que o handler de submit está configurado corretamente
            const self2 = this;
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.log("💾 Submit do formulário de edição detectado. ID:", form.dataset.editId);
                const editId = parseInt(form.dataset.editId);
                if (editId) {
                    self2.handleUpdateFuncionario(form, editId);
                } else {
                    console.error("❌ Edit ID não encontrado no formulário!");
                    alert('Erro: ID de edição não encontrado. Por favor, tente novamente.');
                }
                return false;
            }, true); // Use capture phase para garantir que seja executado primeiro
            
            // Desabilita o listener do modais.html se ele tentar adicionar novamente
            // Usa um intervalo para garantir que seja removido mesmo se o script do modais.html tentar adicionar depois
            const intervaloRemoverListener = setInterval(() => {
                const btn = document.getElementById('btnSubmitFuncionario');
                const formAtual = document.getElementById('addFuncionarioForm');
                if (btn && formAtual && formAtual.dataset.modoEdicao === 'true' && window.adicionarFuncionario) {
                    btn.removeEventListener('click', window.adicionarFuncionario);
                    console.log("✅ Listener do modais.html removido do botão de edição");
                } else if (formAtual && formAtual.dataset.modoEdicao !== 'true') {
                    // Se não estiver mais em modo de edição, para o intervalo
                    clearInterval(intervaloRemoverListener);
                }
            }, 200);
            
            // Para o intervalo após 10 segundos para evitar loop infinito
            setTimeout(() => {
                clearInterval(intervaloRemoverListener);
            }, 10000);
            
            console.log("✅ Formulário preenchido e handler configurado para edição");
        }, 300);
    },
    
    handleUpdateFuncionario(form, id) {
        // FLAG PARA EVITAR DUPLICAÇÃO
        if (form._processando) {
            console.log("⚠️ Formulário já está sendo processado, ignorando...");
            return;
        }
        
        // Garante que o form existe
        if (!form) {
            console.error("❌ Formulário não encontrado!");
            return;
        }
        
        form._processando = true;
        
        // Timeout de segurança para limpar o flag caso algo dê errado
        let timeoutId = setTimeout(() => {
            if (form._processando) {
                console.warn("⚠️ Flag de processamento não foi limpo, limpando agora...");
                form._processando = false;
            }
        }, 10000); // 10 segundos de timeout
        
        try {
        
        console.log("💾 Atualizando funcionário ID:", id);
        
        if (!form) {
            console.error("❌ Formulário não encontrado!");
            form._processando = false;
            return;
        }

        if (!id || isNaN(id)) {
            console.error("❌ ID inválido:", id);
            alert('Erro: ID de funcionário inválido. Por favor, tente novamente.');
            form._processando = false;
            return;
        }

        const formData = new FormData(form);
        
        // Validação de senha
        const senha = formData.get('funcionarioSenha');
        const senhaConfirmar = formData.get('funcionarioSenhaConfirmar');
        
        if (!senha || senha.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres.');
            const senhaInput = document.getElementById('funcionarioSenha');
            if (senhaInput) senhaInput.focus();
            form._processando = false;
            return;
        }
        
        if (senha !== senhaConfirmar) {
            alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
            const senhaConfirmInput = document.getElementById('funcionarioSenhaConfirmar');
            if (senhaConfirmInput) senhaConfirmInput.focus();
            form._processando = false;
            return;
        }
        
        console.log("✅ Validação de senha passou");
        
        // Pega turnos selecionados
        const turnos = [];
        const turnosCheckboxes = form.querySelectorAll('input[name="turnos"]:checked');
        console.log("🔄 Checkboxes de turnos encontrados:", turnosCheckboxes.length);
        turnosCheckboxes.forEach(cb => {
            turnos.push(cb.value);
            console.log("  ✅ Turno selecionado:", cb.value);
        });
        console.log("📋 Turnos coletados:", turnos);
        
        // Pega departamentos com acesso - TENTA MÚLTIPLAS FORMAS
        const acessos = [];
        
        // Método 1: Query dentro do form
        let acessosCheckboxes = form.querySelectorAll('input[name="acessoDepartamentos"]:checked');
        console.log("🔄 Método 1 - Checkboxes de acessos encontrados no form:", acessosCheckboxes.length);
        
        // Método 2: Se não encontrar, tenta no modal
        if (acessosCheckboxes.length === 0) {
            const modal = form.closest('#addFuncionarioModal') || document.getElementById('addFuncionarioModal');
            if (modal) {
                acessosCheckboxes = modal.querySelectorAll('input[name="acessoDepartamentos"]:checked');
                console.log("🔄 Método 2 - Checkboxes de acessos encontrados no modal:", acessosCheckboxes.length);
            }
        }
        
        // Método 3: Se ainda não encontrar, tenta no documento todo
        if (acessosCheckboxes.length === 0) {
            acessosCheckboxes = document.querySelectorAll('input[name="acessoDepartamentos"]:checked');
            console.log("🔄 Método 3 - Checkboxes de acessos encontrados no documento:", acessosCheckboxes.length);
        }
        
        acessosCheckboxes.forEach(cb => {
            acessos.push(cb.value);
            console.log("  ✅ Acesso selecionado:", cb.value);
        });
        console.log("📋 Acessos coletados:", acessos);
        
        // Pega permissões específicas por página
        const permissoes = {
            estoque: [],
            producao: [],
            vendas: [],
            logistica: [],
            fluxo: []
        };
        
        const permissoesCheckboxes = form.querySelectorAll('input[name^="permissoes["]:checked');
        console.log("🔄 Checkboxes de permissões por página encontrados:", permissoesCheckboxes.length);
        permissoesCheckboxes.forEach(cb => {
            const name = cb.name; // Ex: permissoes[estoque][]
            const pageMatch = name.match(/permissoes\[(.*?)\]/);
            if (pageMatch && pageMatch[1]) {
                const page = pageMatch[1];
                if (permissoes[page]) {
                    permissoes[page].push(cb.value);
                    console.log(`  ✅ Permissão selecionada para ${page}: ${cb.value}`);
                }
            }
        });
        console.log("📋 Permissões coletadas:", permissoes);
        
        // Debug: verifica todos os checkboxes de acesso (marcados e não marcados)
        let todosAcessos = form.querySelectorAll('input[name="acessoDepartamentos"]');
        if (todosAcessos.length === 0) {
            const modal = form.closest('#addFuncionarioModal') || document.getElementById('addFuncionarioModal');
            if (modal) {
                todosAcessos = modal.querySelectorAll('input[name="acessoDepartamentos"]');
                console.log("🔍 Todos os checkboxes de acesso no modal:", todosAcessos.length);
            }
        } else {
            console.log("🔍 Todos os checkboxes de acesso no formulário:", todosAcessos.length);
        }
        todosAcessos.forEach(cb => {
            console.log(`  - ${cb.value}: ${cb.checked ? '✅ marcado' : '❌ desmarcado'}`);
        });
        
        // Encontra o funcionário na lista
        const funcionarioIndex = window.funcionariosLista.findIndex(f => f.id === id);
        if (funcionarioIndex === -1) {
            console.error("❌ Funcionário não encontrado na lista. ID:", id);
            console.log("📋 Lista atual:", window.funcionariosLista);
            alert('Funcionário não encontrado!');
            form._processando = false;
            return;
        }
        
        console.log("✅ Funcionário encontrado no índice:", funcionarioIndex);
        console.log("📝 Dados antes da atualização:", window.funcionariosLista[funcionarioIndex]);
        
        // Garante que o nível de acesso não seja "administrador"
        let nivelAcesso = formData.get('funcionarioNivelAcesso');
        if (nivelAcesso === 'administrador') {
            nivelAcesso = 'gerente';
            console.log("⚠️ Nível de acesso 'administrador' não permitido. Alterado para 'gerente'.");
        }
        
        // Coleta todos os dados do formulário
        const dadosAtualizados = {
            id: id, // Mantém o mesmo ID
            nome: formData.get('funcionarioNome'),
            cpf: formData.get('funcionarioCPF'),
            email: formData.get('funcionarioEmail'),
            telefone: formData.get('funcionarioTelefone'),
            senha: senha,
            cargo: formData.get('funcionarioCargo'),
            departamento: formData.get('funcionarioDepartamento'),
            dataAdmissao: formData.get('funcionarioDataAdmissao'),
            salario: formData.get('funcionarioSalario'),
            turnos: turnos,
            acessos: acessos,
            permissoes: permissoes, // Permissões específicas por página
            nivelAcesso: nivelAcesso, // Garantido que não será "administrador"
            status: formData.get('funcionarioStatus'),
            endereco: formData.get('funcionarioEndereco'),
            observacoes: formData.get('funcionarioObservacoes')
        };
        
        console.log("📝 Dados coletados do formulário:", dadosAtualizados);
        
        // Atualiza os dados do funcionário
        window.funcionariosLista[funcionarioIndex] = dadosAtualizados;

        console.log("✅ Funcionário atualizado na lista:", window.funcionariosLista[funcionarioIndex]);
        console.log("📋 Total de funcionários na lista:", window.funcionariosLista.length);
        
        // Salva no localStorage
        this.salvarFuncionariosNoLocalStorage();
        
        // Atualiza as credenciais do funcionário
        try {
            const credenciaisFuncionarios = localStorage.getItem('credenciaisFuncionarios');
            let funcionariosCredenciais = credenciaisFuncionarios ? JSON.parse(credenciaisFuncionarios) : [];
            
            const email = formData.get('funcionarioEmail');
            // Busca pelo ID primeiro, depois pelo email (mais confiável)
            let index = funcionariosCredenciais.findIndex(f => f.id === id);
            if (index === -1 && email) {
                index = funcionariosCredenciais.findIndex(f => f.email && f.email.toLowerCase() === email.toLowerCase());
            }
            
            if (index !== -1) {
                // Atualiza credenciais existentes
                funcionariosCredenciais[index].password = senha;
                funcionariosCredenciais[index].nome = formData.get('funcionarioNome');
                if (email) funcionariosCredenciais[index].email = email;
                localStorage.setItem('credenciaisFuncionarios', JSON.stringify(funcionariosCredenciais));
                console.log(`✅ Credenciais do funcionário atualizadas`);
            } else {
                // Se não encontrou, adiciona novas credenciais
                if (email) {
                    funcionariosCredenciais.push({
                        id: id,
                        email: email,
                        password: senha,
                        nome: formData.get('funcionarioNome')
                    });
                    localStorage.setItem('credenciaisFuncionarios', JSON.stringify(funcionariosCredenciais));
                    console.log(`✅ Novas credenciais do funcionário adicionadas`);
                }
            }
        } catch (e) {
            console.error('Erro ao atualizar credenciais do funcionário:', e);
        }

        // Atualiza a tela IMEDIATAMENTE
        console.log("🔄 Renderizando lista atualizada...");
        setTimeout(() => {
            this.renderFuncionarios();
            console.log("✅ Lista renderizada. Total de funcionários:", window.funcionariosLista.length);
            
            // Verifica se o funcionário foi realmente atualizado
            const funcionarioAtualizado = window.funcionariosLista.find(f => f.id === id);
            if (funcionarioAtualizado) {
                console.log("✅ Funcionário encontrado após atualização:", funcionarioAtualizado);
                console.log("📋 Acessos salvos:", funcionarioAtualizado.acessos);
            } else {
                console.error("❌ Funcionário não encontrado após atualização!");
            }
        }, 100);

        // Mostra mensagem de sucesso
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
        `;
        successMsg.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
            <span>Funcionário atualizado com sucesso!</span>
        `;
        document.body.appendChild(successMsg);

        // Fecha o modal e limpa o formulário
        setTimeout(() => {
            if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                window.BeiraMarModais.closeModal('addFuncionarioModal');
            } else {
                const modal = document.getElementById('addFuncionarioModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
            
            // Restaura o título e botão originais
            const modalTitle = document.querySelector('#addFuncionarioModal .modal-header h2');
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="fas fa-user-plus me-2"></i> Adicionar Funcionário';
            }
            
            const submitBtn = document.getElementById('btnSubmitFuncionario');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Adicionar Funcionário';
            }
            
            // Limpa o formulário e remove o editId
            if (form) {
                form.reset();
                form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                delete form.dataset.editId;
                delete form.dataset.modoEdicao;
                form._processando = false; // IMPORTANTE: Limpa o flag de processamento
                // Remove o handler de edição
                form.onsubmit = null;
                console.log("✅ Formulário limpo e resetado para modo adicionar");
            }
            
            // Garante que o flag seja limpo mesmo se houver erro
            setTimeout(() => {
                if (form) {
                    form._processando = false;
                }
            }, 100);
            
            successMsg.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => successMsg.remove(), 300);
        }, 1500);
        
        } catch (error) {
            console.error("❌ Erro ao atualizar funcionário:", error);
            if (form) {
                form._processando = false; // Garante que o flag seja limpo mesmo em caso de erro
            }
            if (typeof timeoutId !== 'undefined') {
                clearTimeout(timeoutId);
            }
            alert('Erro ao atualizar funcionário. Por favor, tente novamente.');
        }
    },

    salvarEdicaoFuncionario(form, id) {
        if (form._processando) return;
        form._processando = true;
        
        console.log("💾 Salvando edição do funcionário ID:", id);
        
        const formData = new FormData(form);
        
        // Pega turnos selecionados
        const turnos = [];
        form.querySelectorAll('input[name="turnos"]:checked').forEach(cb => {
            turnos.push(cb.value);
        });
        
        // Pega departamentos com acesso
        const acessos = [];
        form.querySelectorAll('input[name="acessoDepartamentos"]:checked').forEach(cb => {
            acessos.push(cb.value);
        });
        
        // Pega permissões específicas por página
        const permissoes = {
            estoque: [],
            producao: [],
            vendas: [],
            logistica: [],
            fluxo: []
        };
        
        const permissoesCheckboxes = form.querySelectorAll('input[name^="permissoes["]:checked');
        console.log("🔄 [Edição] Checkboxes de permissões por página encontrados:", permissoesCheckboxes.length);
        permissoesCheckboxes.forEach(cb => {
            const name = cb.name;
            // Extrai o nome da página do atributo name (ex: "permissoes[estoque][]")
            const match = name.match(/permissoes\[(\w+)\]/);
            if (match) {
                const pagina = match[1];
                const acao = cb.value;
                if (permissoes[pagina]) {
                    permissoes[pagina].push(acao);
                    console.log(`  ✅ Permissão ${pagina}/${acao} coletada`);
                }
            }
        });
        console.log("📋 [Edição] Permissões coletadas:", permissoes);
        
        // Validação de senha (se foi alterada)
        const senha = formData.get('funcionarioSenha');
        const senhaConfirmar = formData.get('funcionarioSenhaConfirmar');
        
        if (senha && senha.length > 0) {
            if (senha.length < 6) {
                alert('A senha deve ter no mínimo 6 caracteres.');
                form._processando = false;
                return;
            }
            
            if (senha !== senhaConfirmar) {
                alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
                form._processando = false;
                return;
            }
        }
        
        // Encontra o funcionário na lista
        const funcionarioIndex = window.funcionariosLista.findIndex(f => f.id === id);
        if (funcionarioIndex === -1) {
            alert('Funcionário não encontrado!');
            form._processando = false;
            return;
        }
        
        // Garante que o nível de acesso não seja "administrador"
        let nivelAcesso = formData.get('funcionarioNivelAcesso');
        if (nivelAcesso === 'administrador') {
            nivelAcesso = 'gerente';
            console.log("⚠️ Nível de acesso 'administrador' não permitido. Alterado para 'gerente'.");
        }
        
        // Atualiza os dados do funcionário
        const funcionarioAtualizado = {
            ...window.funcionariosLista[funcionarioIndex],
            nome: formData.get('funcionarioNome'),
            cpf: formData.get('funcionarioCPF'),
            email: formData.get('funcionarioEmail'),
            telefone: formData.get('funcionarioTelefone'),
            cargo: formData.get('funcionarioCargo'),
            departamento: formData.get('funcionarioDepartamento'),
            dataAdmissao: formData.get('funcionarioDataAdmissao'),
            salario: formData.get('funcionarioSalario'),
            turnos: turnos,
            acessos: acessos,
            permissoes: permissoes, // Permissões específicas por página
            nivelAcesso: nivelAcesso, // Garantido que não será "administrador"
            status: formData.get('funcionarioStatus'),
            endereco: formData.get('funcionarioEndereco'),
            observacoes: formData.get('funcionarioObservacoes')
        };
        
        // Atualiza senha apenas se foi alterada
        if (senha && senha.length > 0) {
            funcionarioAtualizado.senha = senha;
        }
        
        // Atualiza na lista
        window.funcionariosLista[funcionarioIndex] = funcionarioAtualizado;
        
        console.log("✅ Funcionário atualizado:", funcionarioAtualizado);
        
        // Salva no localStorage
        this.salvarFuncionariosNoLocalStorage();
        console.log("💾 [Edição] Funcionário salvo. Permissões:", JSON.stringify(permissoes, null, 2));
        
        // Força recarregamento das permissões no sistema
        if (window.BeiraMarPermissoes && window.BeiraMarPermissoes.recarregarFuncionarios) {
            window.BeiraMarPermissoes.recarregarFuncionarios();
            console.log("🔄 [Edição] Permissões recarregadas no sistema");
        }
        
        // Atualiza a tela
        this.renderFuncionarios();
        
        // Mostra mensagem de sucesso
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
        `;
        successMsg.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
            <span>Funcionário atualizado com sucesso!</span>
        `;
        document.body.appendChild(successMsg);
        
        // Fecha o modal
        setTimeout(() => {
            if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                window.BeiraMarModais.closeModal('editarFuncionarioModal');
            } else {
                const modal = document.getElementById('editarFuncionarioModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
            form._processando = false;
            successMsg.remove();
        }, 2000);
    },

    excluirFuncionario(id) {
        const funcionario = window.funcionariosLista.find(f => f.id === id);
        if (!funcionario) {
            alert('Funcionário não encontrado!');
            return;
        }
        
        // Cria modal de confirmação estilizado
        const confirmModal = document.createElement('div');
        confirmModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        confirmModal.innerHTML = `
            <div style="background: white; border-radius: 16px; padding: 2rem; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #dc2626); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: white;"></i>
                    </div>
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #1e293b);">Confirmar Exclusão</h3>
                    <p style="margin: 0; color: var(--text-secondary, #64748b); font-size: 1rem;">
                        Tem certeza que deseja excluir o funcionário<br>
                        <strong style="color: var(--text-primary, #1e293b);">"${funcionario.nome}"</strong>?
                    </p>
                    <p style="margin: 1rem 0 0 0; color: #ef4444; font-size: 0.9rem; font-weight: 600;">
                        <i class="fas fa-exclamation-circle"></i> Esta ação não pode ser desfeita!
                    </p>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button id="btnCancelarExclusao" style="padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.95rem; font-weight: 600; border: 2px solid var(--border-color, #e2e8f0); background: var(--bg-secondary, #f8fafc); color: var(--text-primary, #1e293b); cursor: pointer; transition: all 0.3s ease;">
                        Cancelar
                    </button>
                    <button id="btnConfirmarExclusao" style="padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 0.95rem; font-weight: 600; border: none; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; cursor: pointer; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); transition: all 0.3s ease;">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmModal);
        
        // Event listeners
        confirmModal.querySelector('#btnCancelarExclusao').onclick = () => {
            confirmModal.remove();
        };
        
        confirmModal.querySelector('#btnConfirmarExclusao').onclick = () => {
                // Remove o funcionário da lista
                window.funcionariosLista = window.funcionariosLista.filter(f => f.id !== id);
                
                // Salva no localStorage
                this.salvarFuncionariosNoLocalStorage();
                
                // Remove as credenciais do funcionário
                try {
                    const credenciaisFuncionarios = localStorage.getItem('credenciaisFuncionarios');
                    if (credenciaisFuncionarios) {
                        let funcionariosCredenciais = JSON.parse(credenciaisFuncionarios);
                        funcionariosCredenciais = funcionariosCredenciais.filter(f => f.id !== id);
                        localStorage.setItem('credenciaisFuncionarios', JSON.stringify(funcionariosCredenciais));
                        console.log(`✅ Credenciais do funcionário removidas`);
                    }
                } catch (e) {
                    console.error('Erro ao remover credenciais do funcionário:', e);
                }
                
                // Remove o modal de confirmação
                confirmModal.remove();
            
            // Atualiza a tela
            this.renderFuncionarios();
            
            // Mostra mensagem de sucesso
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-weight: 600;
            `;
            successMsg.innerHTML = `
                <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
                <span>Funcionário excluído com sucesso!</span>
            `;
            document.body.appendChild(successMsg);

            setTimeout(() => {
                successMsg.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => successMsg.remove(), 300);
            }, 3000);
        };
        
        // Fecha ao clicar fora
        confirmModal.onclick = (e) => {
            if (e.target === confirmModal) {
                confirmModal.remove();
            }
        };
    },

    mostrarDetalhesPermissoes(id) {
        const funcionario = window.funcionariosLista.find(f => f.id === id);
        if (!funcionario) {
            alert('Funcionário não encontrado!');
            return;
        }
        
        const permissoes = funcionario.permissoes || {};
        const paginas = {
            estoque: { nome: 'Estoque', icone: 'fa-boxes', cor: '#3b82f6' },
            producao: { nome: 'Produção', icone: 'fa-industry', cor: '#10b981' },
            vendas: { nome: 'Vendas', icone: 'fa-shopping-cart', cor: '#f59e0b' },
            logistica: { nome: 'Logística', icone: 'fa-truck', cor: '#8b5cf6' },
            fluxo: { nome: 'Fluxo', icone: 'fa-project-diagram', cor: '#6366f1' }
        };
        const acoes = {
            adicionar: { nome: 'Adicionar', icone: 'fa-plus', cor: '#10b981' },
            editar: { nome: 'Editar', icone: 'fa-edit', cor: '#3b82f6' },
            visualizar: { nome: 'Visualizar', icone: 'fa-eye', cor: '#6366f1' },
            excluir: { nome: 'Excluir', icone: 'fa-trash', cor: '#ef4444' }
        };
        
        let permissoesHtml = '';
        let temPermissoes = false;
        
        // Mostra apenas as páginas que o funcionário tem acesso (com permissões configuradas)
        Object.keys(paginas).forEach(pagina => {
            if (permissoes[pagina] && permissoes[pagina].length > 0) {
                temPermissoes = true;
                const paginaInfo = paginas[pagina];
                permissoesHtml += `
                    <div style="background: var(--bg-secondary, #ffffff); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; border: 1px solid var(--border-color, #e2e8f0); border-left: 4px solid ${paginaInfo.cor};">
                        <h6 style="margin: 0 0 1rem 0; font-weight: 600; color: var(--text-primary, #1e293b); display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas ${paginaInfo.icone}" style="color: ${paginaInfo.cor};"></i>
                            Tela de ${paginaInfo.nome}
                        </h6>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            ${permissoes[pagina].map(acao => {
                                const acaoInfo = acoes[acao];
                                return `
                                    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: ${acaoInfo.cor}15; border-radius: 8px; border: 1px solid ${acaoInfo.cor}40;">
                                        <i class="fas ${acaoInfo.icone}" style="color: ${acaoInfo.cor}; font-size: 0.85rem;"></i>
                                        <span style="color: var(--text-primary, #1e293b); font-size: 0.85rem; font-weight: 600;">${acaoInfo.nome}</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
        });
        
        if (!temPermissoes) {
            permissoesHtml = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary, #64748b);">
                    <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p style="margin: 0;">Nenhuma permissão configurada para este funcionário.</p>
                </div>
            `;
        }
        
        // Cria modal de detalhamento
        const modal = document.createElement('div');
        modal.id = 'modalDetalhesPermissoes';
        modal.className = 'modal-detalhes-permissoes';
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            animation: fadeIn 0.3s ease;
        `;
        
        // Função para fechar o modal
        const fecharModal = () => {
            modal.remove();
            document.body.style.overflow = '';
        };
        
        modal.innerHTML = `
            <div style="
                background: var(--bg-primary, white);
                border-radius: 24px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                padding: 2.5rem;
                position: relative;
                border: 1px solid var(--border-color, #e2e8f0);
                animation: slideUp 0.3s ease;
            ">
                <button id="btnFecharModalPermissoes" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: var(--text-secondary, #64748b);
                    cursor: pointer;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                " onmouseover="this.style.background='var(--bg-secondary, #f1f5f9)'; this.style.color='var(--text-primary, #1e293b)'" onmouseout="this.style.background='none'; this.style.color='var(--text-secondary, #64748b)'">
                    <i class="fas fa-times"></i>
                </button>
                
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="
                        width: 80px;
                        height: 80px;
                        margin: 0 auto 1.5rem;
                        border-radius: 20px;
                        background: linear-gradient(135deg, #3b82f6, #2563eb);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
                    ">
                        <i class="fas fa-key" style="font-size: 2.5rem; color: white;"></i>
                    </div>
                    <h2 style="
                        color: var(--text-primary, #1e293b);
                        margin: 0 0 0.5rem 0;
                        font-size: 1.75rem;
                        font-weight: 700;
                    ">Permissões de ${funcionario.nome}</h2>
                    <p style="
                        color: var(--text-secondary, #64748b);
                        margin: 0;
                        font-size: 0.95rem;
                    ">Detalhamento das áreas e ações permitidas</p>
                </div>
                
                <div style="margin-top: 2rem;">
                    ${permissoesHtml}
                </div>
                
                <button id="btnFecharModalPermissoesFooter" style="
                    width: 100%;
                    margin-top: 2rem;
                    padding: 0.875rem 1.5rem;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
                    <i class="fas fa-check me-2"></i> Fechar
                </button>
            </div>
            
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                [data-theme="dark"] div[style*="background: var(--bg-primary, white)"] {
                    background: var(--bg-primary, #0f172a) !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                }
                [data-theme="dark"] h2 {
                    color: var(--text-primary, #f1f5f9) !important;
                }
                [data-theme="dark"] p {
                    color: var(--text-secondary, #94a3b8) !important;
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Adiciona event listeners aos botões de fechar
        setTimeout(() => {
            const btnFechar = document.getElementById('btnFecharModalPermissoes');
            const btnFecharFooter = document.getElementById('btnFecharModalPermissoesFooter');
            
            if (btnFechar) {
                btnFechar.addEventListener('click', fecharModal);
            }
            
            if (btnFecharFooter) {
                btnFecharFooter.addEventListener('click', fecharModal);
            }
        }, 100);
        
        // Fecha ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModal();
            }
        });
    },

    showSuccessMessage() {
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
        `;
        successMsg.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
            <span>Funcionário adicionado com sucesso!</span>
        `;
        document.body.appendChild(successMsg);

        setTimeout(() => {
            successMsg.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => successMsg.remove(), 300);
        }, 3000);
    }
};

// Exportação global
window.BeiraMarFuncionarios = BeiraMarFuncionarios;

// Inicialização automática
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const funcionariosPage = document.getElementById('funcionarios');
        if (funcionariosPage) {
            BeiraMarFuncionarios.init();
        }
    });
} else {
    const funcionariosPage = document.getElementById('funcionarios');
    if (funcionariosPage) {
        BeiraMarFuncionarios.init();
    }
}

// Observa quando a página de funcionários é ativada
if (!window.funcionariosObserver) {
    window.funcionariosObserver = new MutationObserver(() => {
        const funcionariosPage = document.getElementById('funcionarios');
        if (funcionariosPage && funcionariosPage.classList.contains('active')) {
            if (!window.BeiraMarFuncionariosInicializado) {
                BeiraMarFuncionarios.init();
                window.BeiraMarFuncionariosInicializado = true;
            }
            BeiraMarFuncionarios.renderFuncionarios();
        }
    });

    setTimeout(() => {
        const funcionariosPage = document.getElementById('funcionarios');
        if (funcionariosPage) {
            window.funcionariosObserver.observe(funcionariosPage, { 
                attributes: true, 
                attributeFilter: ['class'] 
            });
        }
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== 1. CREDENCIAIS ATUALIZADAS ========== 
    const userCredentials = {
        admin: { email: 'Altermiradm@gmail.com', password: '123' },
        funcionario: { email: 'Joãodasilva@gmail.com', password: '123' },
        cliente: { email: 'Fernanda12@gmail.com', password: '123' }
    };
    
    // ========== 1.1. INICIALIZA CREDENCIAIS DE USUÁRIOS REGISTRADOS ==========
    // Adiciona contas que foram criadas antes da implementação do sistema de salvamento
    try {
        const credenciaisSalvas = localStorage.getItem('usuariosRegistrados');
        let usuarios = credenciaisSalvas ? JSON.parse(credenciaisSalvas) : [];
        
        // Adiciona a conta do Gabryel se não existir
        const emailGabryel = 'gabryelpaiva7@gmail.com';
        const gabryelExiste = usuarios.some(u => u.email.toLowerCase() === emailGabryel);
        
        if (!gabryelExiste) {
            usuarios.push({
                email: emailGabryel,
                password: '123',
                nome: 'Gabryel Paiva',
                dataRegistro: new Date().toISOString()
            });
            localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
            console.log('✅ Conta do Gabryel adicionada às credenciais salvas');
        }
    } catch (e) {
        console.error('Erro ao inicializar credenciais:', e);
    }

    // ========== 2. ELEMENTOS ==========
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const alertMsg = document.getElementById('alertMsg');
    const rememberMe = document.getElementById('rememberMe');

    const registroForm = document.getElementById('registroForm');
    const alertMsgReg = document.getElementById('alertMsgReg');
    const nomeRegInput = document.getElementById('nomeReg');
    const emailRegInput = document.getElementById('emailReg');
    const passwordRegInput = document.getElementById('passwordReg');
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    const termsCheckbox = document.getElementById('termsCheckbox');

    // ========== 3. FUNÇÃO DE REDIRECIONAMENTO ==========
    function irParaHome(userType) {
        console.log('Redirecionando...');
        
        // Se for cliente, redireciona para tela de cliente
        if (userType === 'cliente') {
            window.location.href = '../../cliente.html';
        } else if (userType === 'funcionario') {
            // Funcionários vão para tela de funcionário
            window.location.href = '../../funcionario.html';
        } else {
            // Admin vai para o dashboard principal
            window.location.href = '../../index.html';
        }
    }

    // ========== 4. LÓGICA DE LOGIN ==========
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede recarregar a página errado

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                showAlert('Preencha todos os campos!', 'error', alertMsg);
                return;
            }

            // Verifica se o usuário existe nas credenciais (case-insensitive para email)
            let userType = null;
            const emailLower = email.toLowerCase();
            
            // Primeiro verifica nas credenciais hardcoded
            for (let type in userCredentials) {
                if (userCredentials[type].email.toLowerCase() === emailLower && userCredentials[type].password === password) {
                    userType = type;
                    break;
                }
            }
            
            // Se não encontrou, verifica nas credenciais salvas (usuários registrados)
            if (!userType) {
                try {
                    const credenciaisSalvas = localStorage.getItem('usuariosRegistrados');
                    if (credenciaisSalvas) {
                        const usuarios = JSON.parse(credenciaisSalvas);
                        const usuario = usuarios.find(u => u.email.toLowerCase() === emailLower && u.password === password);
                        if (usuario) {
                            userType = 'cliente'; // Usuários registrados são sempre clientes
                        }
                    }
                } catch (e) {
                    console.error('Erro ao verificar credenciais salvas:', e);
                }
            }
            
            // Se ainda não encontrou, verifica nas credenciais de funcionários
            if (!userType) {
                try {
                    const credenciaisFuncionarios = localStorage.getItem('credenciaisFuncionarios');
                    if (credenciaisFuncionarios) {
                        const funcionarios = JSON.parse(credenciaisFuncionarios);
                        const funcionario = funcionarios.find(f => f.email.toLowerCase() === emailLower && f.password === password);
                        if (funcionario) {
                            userType = 'funcionario'; // Funcionários vão para tela de funcionário
                        }
                    }
                } catch (e) {
                    console.error('Erro ao verificar credenciais de funcionários:', e);
                }
            }

            if (userType) {
                showAlert('Login realizado! Entrando...', 'success', alertMsg);
                
                // Salva a sessão
                sessionStorage.setItem('userAuthenticated', 'true');
                sessionStorage.setItem('userType', userType);
                sessionStorage.setItem('userEmail', email);
                
                // Migra dados antigos se for a Fernanda
                if (window.MigracaoDados && email.toLowerCase() === 'fernanda12@gmail.com') {
                    window.MigracaoDados.migrarDadosAntigos();
                }

                // Lembrar email se marcado
                if (rememberMe && rememberMe.checked) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }


                // Redireciona após 1 segundo (passa o tipo de usuário)
                setTimeout(() => irParaHome(userType), 1000);
            } else {
                showAlert('Email ou senha incorretos!', 'error', alertMsg);
            }
        });
    }

    // ========== 5. LÓGICA DE REGISTRO ==========
    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (passwordRegInput.value !== passwordConfirmInput.value) {
                showAlert('As senhas não coincidem!', 'error', alertMsgReg);
                return;
            }

            if (!termsCheckbox.checked) {
                showAlert('Aceite os termos!', 'error', alertMsgReg);
                return;
            }

            const email = emailRegInput.value.trim().toLowerCase();
            
            // Verifica se o email já está cadastrado
            // Verifica se há dados salvos (mesmo que vazios, se a chave existe, a conta foi criada)
            const chaveCarrinho = `clienteCarrinho_${email}`;
            const chaveCompras = `compras_${email}`;
            const chaveNotificacoes = `notificacoes_${email}`;
            
            const temCarrinho = localStorage.getItem(chaveCarrinho) !== null;
            const temCompras = localStorage.getItem(chaveCompras) !== null;
            const temNotificacoes = localStorage.getItem(chaveNotificacoes) !== null;
            
            // Se alguma chave existir, verifica se há dados reais
            let contaExiste = false;
            
            if (temCarrinho || temCompras || temNotificacoes) {
                // Verifica se há dados reais (não apenas arrays vazios)
                let temDadosReais = false;
                
                // Verifica carrinho
                if (temCarrinho) {
                    try {
                        const carrinho = JSON.parse(localStorage.getItem(chaveCarrinho));
                        if (carrinho && carrinho.length > 0) {
                            temDadosReais = true;
                        }
                    } catch (e) {}
                }
                
                // Verifica compras
                if (!temDadosReais && temCompras) {
                    try {
                        const compras = JSON.parse(localStorage.getItem(chaveCompras));
                        if (compras && compras.length > 0) {
                            temDadosReais = true;
                        }
                    } catch (e) {}
                }
                
                // Verifica notificações
                if (!temDadosReais && temNotificacoes) {
                    try {
                        const notificacoes = JSON.parse(localStorage.getItem(chaveNotificacoes));
                        if (notificacoes && notificacoes.length > 0) {
                            temDadosReais = true;
                        }
                    } catch (e) {}
                }
                
                // Se tem dados reais OU se todas as 3 chaves existem (conta completa criada), bloqueia
                if (temDadosReais || (temCarrinho && temCompras && temNotificacoes)) {
                    contaExiste = true;
                }
            }
            
            // Se já existir uma conta, impede o registro
            if (contaExiste) {
                showAlert('Você já possui uma conta! Faça login.', 'error', alertMsgReg);
                // Muda para a aba de login
                setTimeout(() => {
                    document.querySelectorAll('.tab-btn').forEach(btn => {
                        if (btn.dataset.tab === 'login') {
                            btn.classList.add('tab-active');
                        } else {
                            btn.classList.remove('tab-active');
                        }
                    });
                    document.querySelectorAll('.tab-content').forEach(content => {
                        if (content.dataset.tab === 'login') {
                            content.classList.add('active');
                        } else {
                            content.classList.remove('active');
                        }
                    });
                    // Preenche o email no campo de login
                    if (emailInput) {
                        emailInput.value = emailRegInput.value.trim();
                    }
                }, 500);
                return;
            }

            // Registro de novo cliente - salva na sessão e redireciona para tela de cliente
            showAlert('Conta criada! Entrando...', 'success', alertMsgReg);
            
            // Salva a sessão como cliente
            sessionStorage.setItem('userAuthenticated', 'true');
            sessionStorage.setItem('userType', 'cliente');
            sessionStorage.setItem('userEmail', email);
            
            // Salva as credenciais do novo usuário
            try {
                const credenciaisSalvas = localStorage.getItem('usuariosRegistrados');
                let usuarios = credenciaisSalvas ? JSON.parse(credenciaisSalvas) : [];
                
                // Verifica se o email já está nas credenciais salvas
                const emailJaExiste = usuarios.some(u => u.email.toLowerCase() === email);
                
                if (!emailJaExiste) {
                    // Adiciona o novo usuário
                    usuarios.push({
                        email: email,
                        password: passwordRegInput.value, // Salva a senha
                        nome: nomeRegInput.value.trim(),
                        dataRegistro: new Date().toISOString()
                    });
                    
                    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));
                    console.log(`✅ Credenciais do usuário ${email} salvas`);
                }
            } catch (e) {
                console.error('Erro ao salvar credenciais:', e);
            }
            
            // Inicializa dados vazios para novo usuário
            // Notificações vazias
            localStorage.setItem(`notificacoes_${email}`, JSON.stringify([]));
            // Compras vazias
            localStorage.setItem(`compras_${email}`, JSON.stringify([]));
            // Carrinho vazio
            localStorage.setItem(`clienteCarrinho_${email}`, JSON.stringify([]));
            
            console.log(`✅ Novo usuário ${email} inicializado com dados vazios`);

            // Redireciona para tela de cliente após 1 segundo
            setTimeout(() => {
                window.location.href = '../../cliente.html';
            }, 1000);
        });
    }

    // ========== 6. UTILITÁRIOS (Tabs, Senha, Tema) ==========
    
    // Alerta
    function showAlert(msg, type, element) {
        if(!element) return;
        element.textContent = msg;
        element.className = `alert show ${type}`;
        setTimeout(() => element.classList.remove('show'), 3000);
    }

    // Abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('tab-active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('tab-active');
            const content = document.querySelector(`.tab-content[data-tab="${btn.dataset.tab}"]`);
            if(content) content.classList.add('active');
        });
    });

    document.querySelectorAll('.switch-tab').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const btn = document.querySelector(`.tab-btn[data-tab="${link.dataset.tab}"]`);
            if(btn) btn.click();
        });
    });

    // Mostrar/Ocultar Senha
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                if (icon) {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            } else {
                input.type = 'password';
                if (icon) {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    });

    // Tema
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'dark';
        
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Restaurar Email Lembrado
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        if(rememberMe) rememberMe.checked = true;
    }

    // ========== 8. MODAL ESQUECEU A SENHA ==========
    const forgotLink = document.querySelector('.forgot-link');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const forgotPasswordFormContainer = document.getElementById('forgotPasswordFormContainer');
    const forgotPasswordSuccess = document.getElementById('forgotPasswordSuccess');
    const closeForgotPasswordModal = document.getElementById('closeForgotPasswordModal');

    // Função para abrir modal
    function openForgotPasswordModal() {
        if (forgotPasswordModal) {
            forgotPasswordModal.style.display = 'flex';
            setTimeout(() => {
                forgotPasswordModal.classList.add('active');
            }, 10);
            // Resetar formulário ao abrir
            if (forgotPasswordForm) {
                forgotPasswordForm.reset();
            }
            if (forgotPasswordFormContainer) {
                forgotPasswordFormContainer.style.display = 'block';
            }
            if (forgotPasswordSuccess) {
                forgotPasswordSuccess.style.display = 'none';
            }
        }
    }

    // Função para fechar modal
    function closeForgotPasswordModalFunc() {
        if (forgotPasswordModal) {
            forgotPasswordModal.classList.remove('active');
            setTimeout(() => {
                forgotPasswordModal.style.display = 'none';
            }, 300);
        }
    }

    // Abrir modal ao clicar em "Esqueceu a senha?"
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            openForgotPasswordModal();
        });
    }

    // Fechar modal ao clicar no botão X
    if (closeForgotPasswordModal) {
        closeForgotPasswordModal.addEventListener('click', closeForgotPasswordModalFunc);
    }

    // Fechar modal ao clicar no overlay
    if (forgotPasswordModal) {
        const overlay = forgotPasswordModal.querySelector('.forgot-password-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeForgotPasswordModalFunc);
        }
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && forgotPasswordModal && forgotPasswordModal.classList.contains('active')) {
            closeForgotPasswordModalFunc();
        }
    });

    // Submeter formulário de recuperação de senha
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgotPasswordEmail').value;
            
            if (email) {
                // Simular envio (aqui você faria a chamada real ao backend)
                setTimeout(() => {
                    // Esconder formulário
                    if (forgotPasswordFormContainer) {
                        forgotPasswordFormContainer.style.display = 'none';
                    }
                    // Mostrar animação de sucesso
                    if (forgotPasswordSuccess) {
                        forgotPasswordSuccess.style.display = 'flex';
                        // Resetar animação
                        const checkmark = forgotPasswordSuccess.querySelector('.checkmark');
                        if (checkmark) {
                            checkmark.style.animation = 'none';
                            setTimeout(() => {
                                checkmark.style.animation = '';
                            }, 10);
                        }
                    }
                }, 500);
            }
        });
    }

    // ========== 7. MODAL DE TERMOS E CONDIÇÕES ==========
    const termsLink = document.getElementById('termsLink');
    const termsModal = document.getElementById('termsModal');
    const closeTermsModal = document.getElementById('closeTermsModal');
    const acceptTermsBtn = document.getElementById('acceptTermsBtn');

    function openTermsModal() {
        if (termsModal) {
            termsModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Previne scroll da página
        }
    }

    function closeTermsModalFunc() {
        if (termsModal) {
            termsModal.classList.remove('show');
            document.body.style.overflow = ''; // Restaura scroll
        }
    }

    // Abrir modal ao clicar no link
    if (termsLink) {
        termsLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Previne que o checkbox seja marcado
            openTermsModal();
        });
    }

    // Fechar modal ao clicar no botão X
    if (closeTermsModal) {
        closeTermsModal.addEventListener('click', closeTermsModalFunc);
    }

    // Fechar modal ao clicar no botão "Fechar"
    if (acceptTermsBtn) {
        acceptTermsBtn.addEventListener('click', closeTermsModalFunc);
    }

    // Fechar modal ao clicar fora do conteúdo
    if (termsModal) {
        const overlay = termsModal.querySelector('.terms-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeTermsModalFunc);
        }

        // Fechar modal com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && termsModal.classList.contains('show')) {
                closeTermsModalFunc();
            }
        });
    }
});
// =========================================
// FORMULÁRIO DE FORNECEDOR
// =========================================

window.ClienteFornecedor = {
    inicializado: false,

    init() {
        if (this.inicializado) return;
        this.inicializado = true;

        console.log('📝 Inicializando formulário de fornecedor...');

        this.setupForm();
        this.setupMasks();
    },

    setupForm() {
        const form = document.getElementById('fornecedorForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    },

    setupMasks() {
        // Máscara para CNPJ
        const cnpjInput = document.getElementById('cnpj');
        if (cnpjInput) {
            cnpjInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 14) {
                    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                    value = value.replace(/(\d{4})(\d)/, '$1-$2');
                    e.target.value = value;
                }
            });
        }

        // Máscara para telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    if (value.length <= 10) {
                        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                        value = value.replace(/(\d{4})(\d)/, '$1-$2');
                    } else {
                        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
                        value = value.replace(/(\d{5})(\d)/, '$1-$2');
                    }
                    e.target.value = value;
                }
            });
        }
    },


    handleSubmit() {
        const form = document.getElementById('fornecedorForm');
        const formContainer = document.querySelector('.fornecedor-form-wrapper');
        const successDiv = document.getElementById('fornecedorSuccess');

        if (!form || !formContainer || !successDiv) return;

        // Validação básica
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Coleta os dados do formulário
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log('📧 Dados do formulário:', data);

        // Simula envio (aqui você faria a chamada real ao backend)
        setTimeout(() => {
            // Esconde o formulário
            form.style.display = 'none';
            
            // Mostra mensagem de sucesso
            successDiv.style.display = 'flex';
            
            // Resetar animação do checkmark
            const checkmark = successDiv.querySelector('.success-checkmark');
            if (checkmark) {
                checkmark.style.animation = 'none';
                setTimeout(() => {
                    checkmark.style.animation = '';
                }, 10);
            }
        }, 500);
    },

    resetForm() {
        const form = document.getElementById('fornecedorForm');
        const successDiv = document.getElementById('fornecedorSuccess');
        
        if (form) {
            form.reset();
            form.style.display = 'block';
        }
        
        if (successDiv) {
            successDiv.style.display = 'none';
        }
    }
};

// Inicialização automática quando a página estiver pronta
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos na página de fornecedor
    const fornecedorPage = document.getElementById('fornecedor');
    if (fornecedorPage && fornecedorPage.classList.contains('active')) {
        setTimeout(() => {
            if (window.ClienteFornecedor && !window.ClienteFornecedor.inicializado) {
                window.ClienteFornecedor.init();
            }
        }, 500);
    }
});


// Modais: abrir, fechar e atalhos de interação
function setupModals() {
    // Botão do perfil abre o modal de login
    const userMenuBtn = document.getElementById('userMenuBtn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            openModal('loginModal');
        });
    }
    
    // Botões de fechar dentro dos modais (incluindo X no header e botões cancelar)
    document.addEventListener('click', function(e) {
        // Botão X do modal
        if (e.target.closest('.modal-close')) {
            const button = e.target.closest('.modal-close');
            const modalId = button.getAttribute('data-modal');
            if (modalId) {
                e.preventDefault();
                closeModal(modalId);
            }
        }
        
        // Botões cancelar/fechar que têm data-modal
        if (e.target.closest('button[data-modal]') && !e.target.closest('.modal-close')) {
            const button = e.target.closest('button[data-modal]');
            const modalId = button.getAttribute('data-modal');
            if (modalId && (button.textContent.includes('Cancelar') || button.textContent.includes('Fechar'))) {
                e.preventDefault();
                closeModal(modalId);
            }
        }
    });
    
    // Fecha o modal ao clicar no fundo
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Fecha o modal ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
}


function openModal(modalId) {
    console.log(`🔓 Abrindo modal: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // ⭐ CRUCIAL: Configura formulário DEPOIS que modal abre
        if (modalId === 'addItemModal') {
            setTimeout(() => {
                console.log('⏳ Modal aberto, configurando formulário...');
                configureAddItemFormListeners();
            }, 100);
        }
    }
}


function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
        console.log(`🔒 Modal ${modalId} fechado`);
    }
}


// ⭐ FUNÇÃO CORRIGIDA: Configura listeners do formulário de adicionar
function configureAddItemFormListeners() {
    const addItemForm = document.getElementById('addItemForm');
    
    if (!addItemForm) {
        console.error('❌ addItemForm NÃO ENCONTRADO!');
        return;
    }
    
    console.log('✅ addItemForm ENCONTRADO! Configurando...');
    
    // Remove listeners antigos (clona e substitui)
    const newForm = addItemForm.cloneNode(true);
    addItemForm.parentNode.replaceChild(newForm, addItemForm);
    
    const freshForm = document.getElementById('addItemForm');
    
    // Eventos de mudança de preço
    document.getElementById('itemName')?.addEventListener('change', () => {
        if (window.BeiraMarEstoque && window.BeiraMarEstoque.calculateCurrentItemPrice) {
            window.BeiraMarEstoque.calculateCurrentItemPrice('itemName', 'itemQuantity', 'itemPrice');
        }
    });
    document.getElementById('itemQuantity')?.addEventListener('input', () => {
        if (window.BeiraMarEstoque && window.BeiraMarEstoque.calculateCurrentItemPrice) {
            window.BeiraMarEstoque.calculateCurrentItemPrice('itemName', 'itemQuantity', 'itemPrice');
        }
    });


    // Listener de submit
    freshForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('🚀 SUBMIT capturado!');
        
        const itemNameSelect = document.getElementById('itemName');
        const itemCategorySelect = document.getElementById('itemCategory');
        const itemLocationSelect = document.getElementById('itemLocation');
        const itemQuantity = document.getElementById('itemQuantity').value;
        const itemStatus = document.getElementById('itemStatus').value;
        const itemPrice = document.getElementById('itemPrice').value;


        if (!itemNameSelect) {
            console.error('❌ itemNameSelect não encontrado');
            return;
        }
        
        // ⭐ CORREÇÃO 1: Pega o TEXT (não o VALUE) dos selects
        const selectedNameOption = itemNameSelect.options[itemNameSelect.selectedIndex];
        const itemName = selectedNameOption ? selectedNameOption.text : '';
        
        const selectedCategoryOption = itemCategorySelect?.options[itemCategorySelect.selectedIndex];
        const itemCategory = selectedCategoryOption ? selectedCategoryOption.text : '';
        
        const selectedLocationOption = itemLocationSelect?.options[itemLocationSelect.selectedIndex];
        const itemLocation = selectedLocationOption ? selectedLocationOption.text : '';
        
        const itemValue = itemNameSelect.value;


        if (itemValue && itemQuantity) {
            console.log('✅ Validação OK! Adicionando item...');
            
            // ⭐ CORREÇÃO 2: Calcula preço UNITÁRIO (não total)
            const selectedOption = itemNameSelect.options[itemNameSelect.selectedIndex];
            const unitPrice = parseFloat(selectedOption?.dataset.price) || 0;
            
            const newItemData = {
                name: itemName,
                category: itemCategory,
                quantity: itemQuantity,
                status: itemStatus,
                location: itemLocation,
                price: unitPrice  // ⭐ Preço UNITÁRIO (não total)
            };
            
            console.log('📦 Dados do item:', newItemData);
            
            // Chama função do estoque.js
            if (window.BeiraMarEstoque && window.BeiraMarEstoque.addEstoqueTableRow) {
                window.BeiraMarEstoque.addEstoqueTableRow(newItemData);
            }
            
            closeModal('addItemModal');
            
            if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                window.BeiraMarUtils.showToast('Item adicionado com sucesso!', 'success');
            }
            
            this.reset();
            
            if (window.BeiraMarEstoque && window.BeiraMarEstoque.updateEstoqueSummary) {
                window.BeiraMarEstoque.updateEstoqueSummary();
            }
        } else {
            console.error('❌ Validação falhou!', {itemValue, itemQuantity});
            if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                window.BeiraMarUtils.showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
            }
        }
    });
}


// Exporta a API pública dos modais
window.BeiraMarModais = {
    setupModals,
    openModal,
    closeModal,
    configureAddItemFormListeners
};


// =========================================
// SISTEMA DE USUÁRIO E MODAIS
// =========================================


// SISTEMA DE USUÁRIO
const UserSystem = {
    currentUser: {
        name: 'Altemir',
        isLoggedIn: true
    },


    // Função única chamada por Header e Sidebar
    handleUserClick() {
        if (this.currentUser.isLoggedIn) {
            window.BeiraMarModais.openModal('profileModal');
        } else {
            window.BeiraMarModais.openModal('loginModal');
        }
    },


    login(e) {
        if(e) e.preventDefault();
        this.currentUser.isLoggedIn = true;
        this.currentUser.name = 'Altemir';
        this.updateInterface();
        window.BeiraMarModais.closeModal('loginModal');
        if(window.BeiraMarUtils) window.BeiraMarUtils.showToast('Login realizado!', 'success');
    },


    logout() {
        this.currentUser.isLoggedIn = false;
        this.currentUser.name = 'Convidado';
        this.updateInterface();
        window.BeiraMarModais.closeModal('profileModal');
        if(window.BeiraMarUtils) window.BeiraMarUtils.showToast('Você saiu.', 'info');
    },


    updateInterface() {
        // Atualiza Sidebar
        const sidebarName = document.getElementById('sidebarUserName');
        if (sidebarName) sidebarName.innerText = this.currentUser.name;
        
        // Atualiza Modal
        const modalName = document.getElementById('modalProfileName');
        if (modalName) modalName.innerText = this.currentUser.name;
    }
};


// SISTEMA DE MODAIS
const ModalSystem = {
    setup() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                ModalSystem.closeModal(e.target.id);
            }
        });
        this.setupForms();
    },


    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    },


    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    },


    setupForms() {
        const form = document.getElementById('addItemForm');
        if (form) {
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);


            newForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const itemData = {
                    name: document.getElementById('itemName').value,
                    category: document.getElementById('itemCategory').value,
                    quantity: parseFloat(document.getElementById('itemQuantity').value),
                    location: document.getElementById('itemLocation').value,
                    price: parseFloat(document.getElementById('itemValue').value.replace('R$', '').replace(',', '.')) || 0
                };


                if (window.BeiraMarEstoque) window.BeiraMarEstoque.addEstoqueTableRow(itemData);
                ModalSystem.closeModal('addItemModal');
                newForm.reset();
            });
        }
    }
};


document.addEventListener('DOMContentLoaded', () => {
    setupModals();
    ModalSystem.setup();
});


window.BeiraMarUser = UserSystem;
window.BeiraMarModais = ModalSystem;

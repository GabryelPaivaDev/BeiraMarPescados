// Formulários: validações, envio e utilitários
function setupForms() {
    // Formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simulação simples de login
            if (email && password) {
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast('Login realizado com sucesso!', 'success');
                }
                if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                    window.BeiraMarModais.closeModal('loginModal');
                }
                this.reset();
            }
        });
    }
    

    if (editItemForm) {
        const nameInput = document.getElementById('editItemName');
        const categoryInput = document.getElementById('editItemCategory');
        const priceInput = document.getElementById('editItemPrice');
        const quantityInput = document.getElementById('editItemQuantity');

        const updatePriceAndCategory = () => {
            const productName = nameInput.value;
            if (productName && window.BeiraMarUtils && window.BeiraMarUtils.ProductPriceStore) {
                const product = window.BeiraMarUtils.ProductPriceStore.getProduct(productName);
                if (product) {
                    if (categoryInput) categoryInput.value = product.category || '';
                    const unitPrice = product.price || 0;
                    const quantity = parseFloat(quantityInput.value) || 0;
                    if (priceInput) {
                        priceInput.value = (unitPrice * quantity).toFixed(2);
                        priceInput.dataset.unitPrice = unitPrice;
                    }
                }
            }
        };

        if (nameInput) {
            nameInput.addEventListener('change', updatePriceAndCategory);
        }

        if (quantityInput) {
            quantityInput.addEventListener('input', () => {
                const unitPrice = parseFloat(priceInput.dataset.unitPrice) || 0;
                const quantity = parseFloat(quantityInput.value) || 0;
                if (priceInput) {
                    priceInput.value = (unitPrice * quantity).toFixed(2);
                }
            });
        }

        editItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('editItemName')?.value;
            const price = document.getElementById('editItemPrice')?.value;
            const category = document.getElementById('editItemCategory')?.value;
            const quantity = document.getElementById('editItemQuantity')?.value;
            const status = document.getElementById('editItemStatus')?.value;
            const location = document.getElementById('editItemLocation')?.value;

            // Atualiza a linha na tabela
            const rowIndex = this.dataset.editingRow;
            if (rowIndex !== undefined) {
                const tableBody = document.querySelector('#estoqueTable tbody');
                const row = tableBody.children[rowIndex];
                if (row) {
                    const cells = row.querySelectorAll('td');
                    cells[0].textContent = name;
                    cells[1].textContent = category;
                    cells[2].textContent = `${quantity} kg`;
                    cells[3].innerHTML = `<span class="status-badge ${status === 'Baixo' ? 'warning' : 'success'}">${status}</span>`;
                    cells[4].textContent = location;
                }
            }
            
            if (name) {
                // Atualiza o preço fixo do produto se fornecido
                if (price && window.BeiraMarUtils && window.BeiraMarUtils.ProductPriceStore) {
                    const productValue = category ? category.toLowerCase().replace(/\s+/g, '-') : name.toLowerCase().replace(/\s+/g, '-');
                    window.BeiraMarUtils.ProductPriceStore.setPrice(name, productValue, price);
                }
                
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast(`Produto "${name}" atualizado com sucesso!`, 'success');
                }
                if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                    window.BeiraMarModais.closeModal('editItemModal');
                }
                this.reset();
            }
        });
    }
    
    // Formulário para criação de novo lote
    const newBatchForm = document.getElementById('newBatchForm');
    if (newBatchForm) {
        newBatchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const batchProduct = document.getElementById('batchProduct').value;
            const batchQuantity = document.getElementById('batchQuantity').value;
            
            if (batchProduct && batchQuantity) {
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast(`Lote de "${batchProduct}" criado com sucesso!`, 'success');
                }
                if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                    window.BeiraMarModais.closeModal('newBatchModal');
                }
                this.reset();
            }
        });
    }
    
    // Formulário para criação de novo pedido
    const newOrderForm = document.getElementById('newOrderForm');
    if (newOrderForm) {
        // Seleção de cliente pré-cadastrado 
        const clientSelect = document.getElementById('clientSelect');
        if (clientSelect) {
            clientSelect.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                if (selectedOption.value) {
                    const clientData = JSON.parse(selectedOption.getAttribute('data-client'));
                    fillClientData(clientData);
                } else {
                    clearClientData();
                }
            });
        }
        
        // Botão novo cliente
        const newClientBtn = document.getElementById('newClientBtn');
        if (newClientBtn) {
            newClientBtn.addEventListener('click', function() {
                if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
                    window.BeiraMarModais.openModal('newClientModal');
                }
            });
        }
        
        newOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const clientName = document.getElementById('clientName').value;
            
            if (clientName) {
                // Coleta os dados completos do pedido
                const order = collectOrderFormData(newOrderForm);

                // Deduz a quantidade vendida do estoque central
                if (order.products && order.products.length > 0 && window.BeiraMarUtils && window.BeiraMarUtils.InventoryStore) {
                    const totalKgSold = order.products.reduce((acc, p) => acc + (p.quantity || 0), 0);
                    if (totalKgSold > 0) {
                        window.BeiraMarUtils.InventoryStore.adjustKg(-totalKgSold);
                    }
                }
                
                // Renderiza o pedido na aba de vendas (se aberta)
                renderOrderOnVendas(order);
                
                // Atualiza estatísticas da página de vendas
                updateVendasStats(order);
                
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast(`Pedido para "${clientName}" criado com sucesso!`, 'success');
                }
                if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                    window.BeiraMarModais.closeModal('newOrderModal');
                }
                this.reset();
                clearClientData();
            }
        });
        
        // Adiciona/Remove produtos dinamicamente
        setupProductList(newOrderForm);
        
        // Preenche preço automaticamente ao selecionar produto nos produtos existentes
        const existingProductSelects = newOrderForm.querySelectorAll('.product-select');
        existingProductSelects.forEach(select => {
            const productItem = select.closest('.product-item');
            const priceInput = productItem.querySelector('.product-price-input');
            const quantityInput = productItem.querySelector('input[name="quantity[]"]');
            const applySubtotal = (unitPrice) => {
                const q = parseFloat(quantityInput?.value) || 1;
                const subtotal = (Number(unitPrice) || 0) * q;
                if (window.BeiraMarUtils && window.BeiraMarUtils.formatCurrencyBR) {
                    priceInput.value = window.BeiraMarUtils.formatCurrencyBR(subtotal);
                } else {
                    priceInput.value = `R$ ${Number(subtotal).toFixed(2).replace('.', ',')}`;
                }
                priceInput.dataset.unitPrice = String(unitPrice || 0);
            };

            if (select && priceInput && window.BeiraMarUtils && window.BeiraMarUtils.ProductPriceStore) {
                select.addEventListener('change', function() {
                    const selectedValue = this.value;
                    if (selectedValue) {
                        const unitPrice = window.BeiraMarUtils.ProductPriceStore.getPrice(selectedValue);
                        if (unitPrice !== null) {
                            applySubtotal(unitPrice);
                        } else {
                            priceInput.value = '';
                            delete priceInput.dataset.unitPrice;
                        }
                    } else {
                        priceInput.value = '';
                        delete priceInput.dataset.unitPrice;
                    }
                });

                // recalcula quando a quantidade muda
                if (quantityInput) {
                    quantityInput.addEventListener('input', function() {
                        const unit = parseFloat(priceInput.dataset.unitPrice) || 0;
                        const q = parseFloat(this.value) || 0;
                        const subtotal = unit * q;
                        if (window.BeiraMarUtils && window.BeiraMarUtils.formatCurrencyBR) {
                            priceInput.value = window.BeiraMarUtils.formatCurrencyBR(subtotal);
                        } else {
                            priceInput.value = `R$ ${Number(subtotal).toFixed(2).replace('.', ',')}`;
                        }
                    });
                }
            }
        });

        // Máscara de moeda para campos de preço
        newOrderForm.addEventListener('input', function(e) {
            const target = e.target;
            if (target && target.name === 'price[]') {
                // Não formata durante digitação para não atrapalhar, apenas normaliza número
                target.value = target.value.replace(/[^0-9.,]/g, '');
            }
        });
        newOrderForm.addEventListener('blur', function(e) {
            const target = e.target;
            if (target && target.name === 'price[]') {
                const raw = target.value.replace(/[^0-9,.-]/g, '').replace('.', '').replace(',', '.');
                const num = Number(raw) || 0;
                if (window.BeiraMarUtils && window.BeiraMarUtils.formatCurrencyBR) {
                    target.value = num; // mantém numérico internamente; exibição fica para leitura
                }
            }
        }, true);

        // Validação de datas: entrega >= pedido
        const orderDateInput = document.getElementById('orderDate');
        const deliveryDateInput = document.getElementById('deliveryDate');
        function validateDates() {
            if (!orderDateInput || !deliveryDateInput) return true;
            const d1 = new Date(orderDateInput.value);
            const d2 = new Date(deliveryDateInput.value);
            const ok = !isNaN(d1) && !isNaN(d2) && d2 >= d1;
            deliveryDateInput.setCustomValidity(ok ? '' : 'A data de entrega deve ser igual ou posterior à data do pedido.');
            return ok;
        }
        orderDateInput?.addEventListener('change', validateDates);
        deliveryDateInput?.addEventListener('change', validateDates);
    }
    
    // Formulário para editar pedido
    const editOrderForm = document.getElementById('editOrderForm');
    if (editOrderForm) {
        // Seleção de cliente pré-cadastrado
        const editClientSelect = document.getElementById('editClientSelect');
        if (editClientSelect) {
            editClientSelect.addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                if (selectedOption.value) {
                    const clientData = JSON.parse(selectedOption.getAttribute('data-client'));
                    fillEditClientData(clientData);
                } else {
                    clearEditClientData();
                }
            });
        }
        
        // Botão novo cliente no modal de edição
        const editNewClientBtn = document.getElementById('editNewClientBtn');
        if (editNewClientBtn) {
            editNewClientBtn.addEventListener('click', function() {
                if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
                    window.BeiraMarModais.openModal('newClientModal');
                }
            });
        }
        
        // Botão adicionar produto
        const addProductEditBtn = editOrderForm.querySelector('.btn-add-product-edit');
        const editProductList = document.getElementById('editProductList');
        if (addProductEditBtn && editProductList) {
            addProductEditBtn.addEventListener('click', function() {
                const newProductItem = createProductItemForEdit();
                editProductList.appendChild(newProductItem);
            });
            
            // Delegação de eventos para os botões de remover
            editProductList.addEventListener('click', function(e) {
                if (e.target.closest('.btn-remove-product')) {
                    const productItem = e.target.closest('.product-item');
                    if (editProductList.children.length > 1) {
                        productItem.remove();
                    } else {
                        // Se for o último item, limpa os campos ao invés de remover
                        const select = productItem.querySelector('.product-select');
                        const quantityInput = productItem.querySelector('input[name="quantity[]"]');
                        const priceInput = productItem.querySelector('.product-price-input');
                        if (select) select.value = '';
                        if (quantityInput) quantityInput.value = '';
                        if (priceInput) priceInput.value = '';
                    }
                }
            });
        }
        
        editOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const orderId = document.getElementById('editOrderId').value;
            const clientName = document.getElementById('editClientName').value;
            
            if (orderId && clientName) {
                // Coleta os dados completos do pedido editado usando os IDs corretos do formulário de edição
                const editedOrder = collectOrderFormData(editOrderForm, {
                    clientNameId: 'editClientName',
                    clientTypeId: 'editClientType',
                    orderDateId: 'editOrderDate',
                    deliveryDateId: 'editDeliveryDate',
                    notesId: 'editOrderNotes',
                    productListId: 'editProductList'
                });
                editedOrder.id = orderId; // Mantém o ID original
                
                // Atualiza o pedido na lista de vendas
                updateOrderOnVendas(editedOrder);
                
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast(`Pedido ${orderId} atualizado com sucesso!`, 'success');
                }
                if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                    window.BeiraMarModais.closeModal('editOrderModal');
                }
            }
        });
        
        // Validação de datas: entrega >= pedido
        const editOrderDateInput = document.getElementById('editOrderDate');
        const editDeliveryDateInput = document.getElementById('editDeliveryDate');
        function validateEditDates() {
            if (!editOrderDateInput || !editDeliveryDateInput) return true;
            const d1 = new Date(editOrderDateInput.value);
            const d2 = new Date(editDeliveryDateInput.value);
            const ok = !isNaN(d1) && !isNaN(d2) && d2 >= d1;
            editDeliveryDateInput.setCustomValidity(ok ? '' : 'A data de entrega deve ser igual ou posterior à data do pedido.');
            return ok;
        }
        editOrderDateInput?.addEventListener('change', validateEditDates);
        editDeliveryDateInput?.addEventListener('change', validateEditDates);
    }
    
    // Formulário para criar novo cliente
    const newClientForm = document.getElementById('newClientForm');
    if (newClientForm) {
        newClientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const clientName = document.getElementById('newClientName').value;
            const clientType = document.getElementById('newClientType').value;
            
            if (clientName && clientType) {
                // Simula adição do cliente ao banco de dados
                addClientToSelect(clientName, clientType);
                
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast(`Cliente "${clientName}" cadastrado com sucesso!`, 'success');
                }
                if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                    window.BeiraMarModais.closeModal('newClientModal');
                }
                
                // Preenche o formulário de pedido com o novo cliente
                const clientSelect = document.getElementById('clientSelect');
                if (clientSelect) {
                    clientSelect.value = clientSelect.options.length - 1;
                    clientSelect.dispatchEvent(new Event('change'));
                }
                
                this.reset();
            }
        });
        
        // Botão cancelar novo cliente
        const cancelNewClientBtn = document.getElementById('cancelNewClientBtn');
        if (cancelNewClientBtn) {
            cancelNewClientBtn.addEventListener('click', function() {
                if (window.BeiraMarModais && window.BeiraMarModais.closeModal) {
                    window.BeiraMarModais.closeModal('newClientModal');
                }
                newClientForm.reset();
            });
        }
    }
}

// Preenche os dados do cliente no formulário
function fillClientData(clientData) {
    const clientNameInput = document.getElementById('clientName');
    const clientTypeSelect = document.getElementById('clientType');
    
    if (clientNameInput) {
        clientNameInput.value = clientData.name;
        clientNameInput.removeAttribute('readonly');
    }
    
    if (clientTypeSelect) {
        clientTypeSelect.value = clientData.type;
    }
}

// Limpa os dados do cliente
function clearClientData() {
    const clientNameInput = document.getElementById('clientName');
    const clientTypeSelect = document.getElementById('clientType');
    
    if (clientNameInput) {
        clientNameInput.value = '';
        clientNameInput.setAttribute('readonly', 'readonly');
    }
    
    if (clientTypeSelect) {
        clientTypeSelect.value = '';
    }
}

// Preenche os dados do cliente no formulário de edição
function fillEditClientData(clientData) {
    const clientNameInput = document.getElementById('editClientName');
    const clientTypeSelect = document.getElementById('editClientType');
    
    if (clientNameInput) {
        clientNameInput.value = clientData.name;
        clientNameInput.removeAttribute('readonly');
    }
    
    if (clientTypeSelect) {
        clientTypeSelect.value = clientData.type;
    }
}

// Limpa os dados do cliente no formulário de edição
function clearEditClientData() {
    const clientNameInput = document.getElementById('editClientName');
    const clientTypeSelect = document.getElementById('editClientType');
    
    if (clientNameInput) {
        clientNameInput.value = '';
        clientNameInput.setAttribute('readonly', 'readonly');
    }
    
    if (clientTypeSelect) {
        clientTypeSelect.value = '';
    }
}

// Atualiza um pedido existente na lista de vendas
function updateOrderOnVendas(editedOrder) {
    const vendasPage = document.getElementById('vendas');
    if (!vendasPage) return;
    
    // Busca o elemento do pedido pelo ID (tenta variações caso não encontre)
    let orderElement = vendasPage.querySelector(`[data-order-id="${editedOrder.id}"]`);
    if (!orderElement && String(editedOrder.id).startsWith('#')) {
        // tenta sem o '#'
        const idNoHash = String(editedOrder.id).replace(/^#/, '');
        orderElement = vendasPage.querySelector(`[data-order-id="${idNoHash}"]`);
    }
    if (!orderElement) {
        // tenta procurar por título "Pedido <id>" dentro dos itens
        const possible = Array.from(vendasPage.querySelectorAll('.pedido-item, .pedido-card'))
            .find(el => {
                const h4 = el.querySelector('h4');
                return h4 && h4.textContent.replace(/\s+/g, ' ').trim().includes(String(editedOrder.id));
            });
        if (possible) orderElement = possible;
    }
    if (!orderElement) return;
    
    // Adiciona animação de atualização
    orderElement.style.transition = 'all 0.3s ease';
    orderElement.style.transform = 'scale(0.95)';
    orderElement.style.opacity = '0.7';

    setTimeout(() => {
        // Se for um card com .card-body, atualiza o card (layout antigo)
        const cardBody = orderElement.querySelector('.card-body');
        if (cardBody) {
            cardBody.innerHTML = `
                <div class="pedido-header d-flex justify-content-between align-items-center mb-3">
                    <h4 class="h6 mb-0">Pedido ${editedOrder.id}</h4>
                    <span class="badge bg-warning text-dark">Pendente</span>
                </div>
                <p class="mb-2"><strong>Cliente:</strong> ${editedOrder.clientName}</p>
                <p class="mb-2"><strong>Produtos:</strong> ${editedOrder.products.map(p => `${p.name} (${p.quantity}kg)`).join(', ')}</p>
                <p class="mb-2"><strong>Valor:</strong> ${formatBRL(editedOrder.total)}</p>
                <p class="mb-3"><strong>Entrega:</strong> ${editedOrder.deliveryDate || '-'}</p>
                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-sm btn-outline-primary btn-edit-order" data-order='${JSON.stringify(editedOrder).replace(/'/g, "&apos;")}' title="Editar pedido">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            `;

            // Adiciona evento de edição ao botão novamente
            const editBtn = cardBody.querySelector('.btn-edit-order');
            if (editBtn) {
                editBtn.addEventListener('click', function() {
                    const orderDataStr = this.getAttribute('data-order');
                    try {
                        const orderToEdit = JSON.parse(orderDataStr.replace(/&apos;/g, "'"));
                        openEditOrderModal(orderToEdit);
                    } catch (e) {
                        console.error('Erro ao parsear dados do pedido:', e);
                    }
                });
            }
        }

        // Se for um item de lista simples (.pedido-item), atualiza os elementos internos
        const infoEl = orderElement.querySelector('.pedido-info');
        const valueEl = orderElement.querySelector('.pedido-value');
        if (infoEl && valueEl) {
            // atualiza informações do lado esquerdo
            const h4 = infoEl.querySelector('h4');
            if (h4) h4.textContent = `Pedido ${editedOrder.id}`;
            const pClient = infoEl.querySelector('p');
            if (pClient) pClient.textContent = editedOrder.clientName || '';
            const timeEl = infoEl.querySelector('.pedido-time');
            if (timeEl) timeEl.textContent = editedOrder.orderDate || '';

            // atualiza lado direito (valor, status e botões)
            valueEl.innerHTML = `
                <p>${formatBRL(editedOrder.total)}</p>
                <span class="status-badge warning">Pendente</span>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary btn-edit-order" data-order='${JSON.stringify(editedOrder).replace(/'/g, "&apos;")}' title="Editar pedido">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-delete-order" title="Excluir pedido">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Reanexa eventos
            const editBtnList = valueEl.querySelector('.btn-edit-order');
            if (editBtnList) {
                editBtnList.addEventListener('click', function() {
                    const orderDataStr = this.getAttribute('data-order');
                    try {
                        const orderToEdit = JSON.parse(orderDataStr.replace(/&apos;/g, "'"));
                        openEditOrderModal(orderToEdit);
                    } catch (e) {
                        console.error('Erro ao parsear dados do pedido:', e);
                    }
                });
            }

            const deleteBtn = valueEl.querySelector('.btn-delete-order');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    orderElement.remove();
                    if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                        window.BeiraMarUtils.showToast('Pedido excluído com sucesso', 'success');
                    }
                });
            }
        }

        // Atualiza todos os botões de edição que contenham este pedido no atributo data-order
        try {
            const allEditBtns = Array.from(document.querySelectorAll('.btn-edit-order'));
            allEditBtns.forEach(btn => {
                const dataStr = btn.getAttribute('data-order');
                if (!dataStr) return;
                try {
                    const parsed = JSON.parse(dataStr.replace(/&apos;/g, "'"));
                    if (parsed && String(parsed.id) === String(editedOrder.id)) {
                        btn.setAttribute('data-order', JSON.stringify(editedOrder).replace(/'/g, "&apos;"));
                    }
                } catch (_) {
                    // ignora
                }
            });
        } catch (e) {
            // ignora erros de atualização de botões
        }

        // Animação de volta ao normal
        orderElement.style.transform = 'scale(1)';
        orderElement.style.opacity = '1';
    }, 150);
}

// Adiciona novo cliente ao select
function addClientToSelect(name, type) {
    const clientSelect = document.getElementById('clientSelect');
    if (!clientSelect) return;
    
    const newOption = document.createElement('option');
    const newId = clientSelect.options.length;
    const clientData = {
        id: newId,
        name: name,
        type: type,
        email: '',
        phone: '',
        address: ''
    };
    
    newOption.value = newId;
    newOption.textContent = name;
    newOption.setAttribute('data-client', JSON.stringify(clientData));
    clientSelect.appendChild(newOption);
}

// Configura a lista de produtos no modal de novo pedido
function setupProductList(form) {
    const addProductBtn = form.querySelector('.btn-add-product');
    const productList = form.querySelector('.product-list');
    
    if (addProductBtn && productList) {
        addProductBtn.addEventListener('click', function() {
            const newProductItem = createProductItem();
            productList.appendChild(newProductItem);
        });
        
        // Delegação de eventos para os botões de remover
        productList.addEventListener('click', function(e) {
            if (e.target.closest('.btn-remove-product')) {
                const productItem = e.target.closest('.product-item');
                if (productList.children.length > 1) {
                    productItem.remove();
                }
            }
        });
    }
}

function createProductItem() {
    const productItem = document.createElement('div');
    productItem.className = 'product-item mb-2';
    productItem.innerHTML = `
        <div class="product-row d-flex gap-2 align-items-end">
            <select class="form-select flex-grow-1 product-select" name="product[]" required>
                <option value="">Selecione o produto...</option>
                <option value="salmao-fresco">Salmão Fresco</option>
                <option value="tilapia-inteira">Tilápia Inteira</option>
                <option value="camarao-medio">Camarão Médio</option>
                <option value="file-tilapia">Filé de Tilápia</option>
            </select>
            <div class="qty-group d-flex flex-column align-items-center">
                <h2 class="kg-h2">(Kg)</h2>
                <input type="number" class="form-control" style="width: 120px;" name="quantity[]" placeholder="(Kg)" min="1" step="0.1" value="1" required>
            </div>
            <input type="text" class="form-control product-price-input" style="width: 140px; background-color: #f8f9fa;" name="price[]" placeholder="Preço" readonly>
            <button type="button" class="btn btn-danger btn-remove-product">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Adiciona evento para preencher preço automaticamente ao selecionar produto
    const productSelect = productItem.querySelector('.product-select');
    const priceInput = productItem.querySelector('.product-price-input');
    const quantityInput = productItem.querySelector('input[name="quantity[]"]');
    
    const recalcFromUnit = (unit) => {
        const q = parseFloat(quantityInput?.value) || 1;
        const subtotal = (Number(unit) || 0) * q;
        if (window.BeiraMarUtils && window.BeiraMarUtils.formatCurrencyBR) {
            priceInput.value = window.BeiraMarUtils.formatCurrencyBR(subtotal);
        } else {
            priceInput.value = `R$ ${Number(subtotal).toFixed(2).replace('.', ',')}`;
        }
        priceInput.dataset.unitPrice = String(unit || 0);
    };

    if (productSelect && priceInput && window.BeiraMarUtils && window.BeiraMarUtils.ProductPriceStore) {
        productSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            if (selectedValue) {
                const unitPrice = window.BeiraMarUtils.ProductPriceStore.getPrice(selectedValue);
                if (unitPrice !== null) {
                    recalcFromUnit(unitPrice);
                } else {
                    priceInput.value = '';
                    delete priceInput.dataset.unitPrice;
                }
            } else {
                priceInput.value = '';
                delete priceInput.dataset.unitPrice;
            }
        });

        if (quantityInput) {
            quantityInput.addEventListener('input', function() {
                const unit = parseFloat(priceInput.dataset.unitPrice) || 0;
                const q = parseFloat(this.value) || 0;
                const subtotal = unit * q;
                if (window.BeiraMarUtils && window.BeiraMarUtils.formatCurrencyBR) {
                    priceInput.value = window.BeiraMarUtils.formatCurrencyBR(subtotal);
                } else {
                    priceInput.value = `R$ ${Number(subtotal).toFixed(2).replace('.', ',')}`;
                }
            });
        }
    }
    
    return productItem;
}

// ====== NOVO: utilitários de pedido de venda ======
function collectOrderFormData(form, options = {}) {
    // Permite customizar os IDs dos campos para usar com formulários diferentes
    const clientNameId = options.clientNameId || 'clientName';
    const clientTypeId = options.clientTypeId || 'clientType';
    const orderDateId = options.orderDateId || 'orderDate';
    const deliveryDateId = options.deliveryDateId || 'deliveryDate';
    const notesId = options.notesId || 'orderNotes';
    const productListSelector = options.productListId ? `#${options.productListId}` : '.product-list';
    
    const clientName = form.querySelector(`#${clientNameId}`)?.value || '';
    const clientType = form.querySelector(`#${clientTypeId}`)?.value || '';
    const orderDate = form.querySelector(`#${orderDateId}`)?.value || '';
    const deliveryDate = form.querySelector(`#${deliveryDateId}`)?.value || '';
    const notes = form.querySelector(`#${notesId}`)?.value || '';

    const productRows = Array.from(form.querySelectorAll(`${productListSelector} .product-item`));
    const products = [];
    let total = 0;

    productRows.forEach((row) => {
        const select = row.querySelector('.product-select');
        const quantityInput = row.querySelector('input[name="quantity[]"]');

        if (!select || !quantityInput) return; // Pula linha de produto malformada

        const productValue = select.value;
        const productName = select.options[select.selectedIndex]?.text || productValue;
        const quantity = parseFloat(quantityInput.value || '0');
        
        // Sempre busca o preço unitário canônico da store para garantir a correção
        const unitPrice = (window.BeiraMarUtils && window.BeiraMarUtils.ProductPriceStore.getPrice(productValue)) || 0;

        if (productValue && quantity > 0 && unitPrice >= 0) {
            const sub = quantity * unitPrice;
            total += sub;
            products.push({ name: productName, value: productValue, quantity, price: unitPrice, subtotal: sub });
        }
    });

    // Gera um ID simples para o pedido (apenas se não for edição)
    let id = options.id || null;
    if (!id) {
        const now = new Date();
        id = `#${now.getFullYear()}-${now.getMonth() + 1}${now.getDate()}${now.getHours()}${now.getMinutes()}`;
    }

    return { id, clientName, clientType, orderDate, deliveryDate, notes, products, total };
}

function formatBRL(value) {
    try {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch (_) {
        return `R$ ${Number(value).toFixed(2)}`;
    }
}

function renderOrderOnVendas(order) {
    const vendasPage = document.getElementById('vendas');
    if (!vendasPage) return;

    // Armazena o pedido em um atributo data para recuperação posterior
    const orderData = JSON.stringify(order);

    // Layout Bootstrap (cards em colunas)
    const row = vendasPage.querySelector('.pedidos-recentes .row');
    if (row) {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.setAttribute('data-order-id', order.id);
        const productsText = order.products.map(p => `${p.name} (${p.quantity}${p.quantity % 1 === 0 ? '' : ''}${''}${'kg' in p ? '' : ''})`).join(', ');
        col.innerHTML = `
            <div class="pedido-card card shadow-sm border-0 h-100">
                <div class="card-body">
                    <div class="pedido-header d-flex justify-content-between align-items-center mb-3">
                        <h4 class="h6 mb-0">Pedido ${order.id}</h4>
                        <span class="badge bg-warning text-dark">Pendente</span>
                    </div>
                    <p class="mb-2"><strong>Cliente:</strong> ${order.clientName}</p>
                    <p class="mb-2"><strong>Produtos:</strong> ${order.products.map(p => `${p.name} (${p.quantity}kg)`).join(', ')}</p>
                    <p class="mb-2"><strong>Valor:</strong> ${formatBRL(order.total)}</p>
                    <p class="mb-3"><strong>Entrega:</strong> ${order.deliveryDate || '-'}</p>
                    <div class="d-flex gap-2 justify-content-end">
                        ${(() => {
                            const userType = sessionStorage.getItem('userType');
                            const podeEditar = (userType === 'adm' || userType === 'admin') || 
                                              (window.BeiraMarPermissoes && window.BeiraMarPermissoes.podeEditar('vendas'));
                            const podeExcluir = (userType === 'adm' || userType === 'admin') || 
                                               (window.BeiraMarPermissoes && window.BeiraMarPermissoes.podeExcluir('vendas'));
                            let html = '';
                            if (podeEditar) {
                                html += `<button class="btn btn-sm btn-outline-primary btn-edit-order" data-order='${orderData.replace(/'/g, "&apos;")}' title="Editar pedido">
                                    <i class="fas fa-edit"></i>
                                </button>`;
                            }
                            if (podeExcluir) {
                                html += `<button class="btn btn-sm btn-outline-danger btn-delete-order" title="Excluir pedido">
                                    <i class="fas fa-trash"></i>
                                </button>`;
                            }
                            return html;
                        })()}
                    </div>
                </div>
            </div>`;
        row.prepend(col);
        
        // Adiciona evento de edição ao botão
        const editBtn = col.querySelector('.btn-edit-order');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                const orderDataStr = this.getAttribute('data-order');
                try {
                    const orderToEdit = JSON.parse(orderDataStr.replace(/&apos;/g, "'"));
                    openEditOrderModal(orderToEdit);
                } catch (e) {
                    console.error('Erro ao parsear dados do pedido:', e);
                }
            });
        }
        const deleteBtn = col.querySelector('.btn-delete-order');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                col.remove();
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast('Pedido excluído com sucesso', 'success');
                }
            });
        }
        return;
    }

    // Layout antigo (lista flex)
    const list = vendasPage.querySelector('.pedidos-list');
    if (list) {
        const item = document.createElement('div');
        item.className = 'pedido-item';
        item.setAttribute('data-order-id', order.id);
        item.innerHTML = `
            <div class="pedido-info">
                <h4>Pedido ${order.id}</h4>
                <p>${order.clientName}</p>
                <span class="pedido-time">${order.orderDate || ''}</span>
            </div>
            <div class="pedido-value">
                <p>${formatBRL(order.total)}</p>
                <span class="status-badge warning">Pendente</span>
                <button class="btn btn-sm btn-outline-primary btn-edit-order mt-2" data-order='${orderData.replace(/'/g, "&apos;")}'>
                    <i class="fas fa-edit me-1"></i>Editar
                </button>
                <button class="btn btn-sm btn-outline-danger btn-delete-order mt-2 ms-1" title="Excluir pedido">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`;
        list.prepend(item);
        
        // Adiciona evento de edição ao botão
        const editBtn = item.querySelector('.btn-edit-order');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                const orderDataStr = this.getAttribute('data-order');
                try {
                    const orderToEdit = JSON.parse(orderDataStr.replace(/&apos;/g, "'"));
                    openEditOrderModal(orderToEdit);
                } catch (e) {
                    console.error('Erro ao parsear dados do pedido:', e);
                }
            });
        }
        const deleteBtnList = item.querySelector('.btn-delete-order');
        if (deleteBtnList) {
            deleteBtnList.addEventListener('click', function() {
                item.remove();
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast('Pedido excluído com sucesso', 'success');
                }
            });
        }
    }
}

function updateVendasStats(order) {
    const vendasPage = document.getElementById('vendas');
    if (!vendasPage) return;

    // Atualiza "Pedidos Hoje"
    const pedidosHojeEl = Array.from(vendasPage.querySelectorAll('.stat-number')).find(el => el.previousElementSibling && /Pedidos Hoje/i.test(el.previousElementSibling.textContent || ''));
    if (pedidosHojeEl) {
        const current = parseInt(pedidosHojeEl.textContent.replace(/\D/g, '') || '0', 10);
        pedidosHojeEl.textContent = String(current + 1);
    }

    // Atualiza "Faturamento"
    const faturamentoEl = Array.from(vendasPage.querySelectorAll('.stat-card .card-body .stat-number')).find(el => el.previousElementSibling && /Faturamento/i.test(el.previousElementSibling.textContent || ''));
    if (faturamentoEl) {
        const onlyDigits = (str) => Number((str || '').replace(/[^0-9,.-]/g, '').replace('.', '').replace(',', '.')) || 0;
        const currentValue = onlyDigits(faturamentoEl.textContent);
        const newValue = currentValue + Number(order.total || 0);
        faturamentoEl.textContent = formatBRL(newValue);
    }

    // Atualiza "Pendentes"
    const pendentesEl = Array.from(vendasPage.querySelectorAll('.stat-card .card-body .stat-number')).find(el => el.previousElementSibling && /Pendentes/i.test(el.previousElementSibling.textContent || ''));
    if (pendentesEl) {
        const current = parseInt(pendentesEl.textContent.replace(/\D/g, '') || '0', 10);
        pendentesEl.textContent = String(current + 1);
    }
}

// Abre o modal de edição de pedido com os dados do pedido
function openEditOrderModal(order) {
    if (!order) return;
    
    const modal = document.getElementById('editOrderModal');
    if (!modal) return;
    
    // Preenche os campos do formulário
    document.getElementById('editOrderId').value = order.id || '';
    document.getElementById('editClientName').value = order.clientName || '';
    document.getElementById('editClientType').value = order.clientType || '';
    document.getElementById('editOrderDate').value = order.orderDate || '';
    document.getElementById('editDeliveryDate').value = order.deliveryDate || '';
    document.getElementById('editOrderNotes').value = order.notes || '';
    
    // Preenche os produtos
    const productList = document.getElementById('editProductList');
    if (productList && order.products) {
        productList.innerHTML = '';
        order.products.forEach(product => {
            const productItem = createProductItemForEdit();
            const select = productItem.querySelector('.product-select');
            const quantityInput = productItem.querySelector('input[name="quantity[]"]');
            const priceInput = productItem.querySelector('.product-price-input');
            
            // Encontra o produto no select
            if (select) {
                const options = Array.from(select.options);
                const option = options.find(opt => opt.text === product.name || opt.value === product.value);
                if (option) {
                    select.value = option.value;
                    select.dispatchEvent(new Event('change'));
                }
            }
            
            if (quantityInput) quantityInput.value = product.quantity || '';
            if (priceInput && product.price) {
                // product.price is expected to be unit price; armazena em dataset e exibe subtotal
                priceInput.dataset.unitPrice = String(product.price || 0);
                const q = parseFloat(quantityInput?.value) || 1;
                const subtotal = (Number(product.price) || 0) * q;
                if (window.BeiraMarUtils && window.BeiraMarUtils.formatCurrencyBR) {
                    priceInput.value = window.BeiraMarUtils.formatCurrencyBR(subtotal);
                } else {
                    priceInput.value = `R$ ${Number(subtotal).toFixed(2).replace('.', ',')}`;
                }
            }
            
            productList.appendChild(productItem);
        });
    }
    
    // Abre o modal
    if (window.BeiraMarModais && window.BeiraMarModais.openModal) {
        window.BeiraMarModais.openModal('editOrderModal');
    }
}

// Cria um item de produto para edição (similar ao createProductItem mas para o modal de edição)
function createProductItemForEdit() {
    const productItem = document.createElement('div');
    productItem.className = 'product-item mb-2';
    productItem.innerHTML = `
        <div class="product-row d-flex gap-2 align-items-end">
            <select class="form-select flex-grow-1 product-select" name="product[]" required>
                <option value="">Selecione o produto...</option>
                <option value="salmao-fresco">Salmão Fresco</option>
                <option value="tilapia-inteira">Tilápia Inteira</option>
                <option value="camarao-medio">Camarão Médio</option>
                <option value="file-tilapia">Filé de Tilápia</option>
            </select>
            <div class="qty-group d-flex flex-column align-items-center">
                <h2 class="kg-h2">(Kg)</h2>
                <input type="number" class="form-control" style="width: 120px;" name="quantity[]" placeholder="(Kg)" min="1" step="0.1" value="1" required>
            </div>
            <input type="text" class="form-control product-price-input" style="width: 140px; background-color: #f8f9fa;" name="price[]" placeholder="Preço" readonly>
            <button type="button" class="btn btn-danger btn-remove-product">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // Adiciona evento para preencher preço automaticamente ao selecionar produto e recalcular subtotal
    const productSelect = productItem.querySelector('.product-select');
    const priceInput = productItem.querySelector('.product-price-input');
    const quantityInput = productItem.querySelector('input[name="quantity[]"]');
    const recalcFromUnit = (unit) => {
        const q = parseFloat(quantityInput?.value) || 1;
        const subtotal = (Number(unit) || 0) * q;
        if (window.BeiraMarUtils && window.BeiraMarUtils.formatCurrencyBR) {
            priceInput.value = window.BeiraMarUtils.formatCurrencyBR(subtotal);
        } else {
            priceInput.value = `R$ ${Number(subtotal).toFixed(2).replace('.', ',')}`;
        }
        priceInput.dataset.unitPrice = String(unit || 0);
    };

    if (productSelect && priceInput && window.BeiraMarUtils && window.BeiraMarUtils.ProductPriceStore) {
        productSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            if (selectedValue) {
                const unitPrice = window.BeiraMarUtils.ProductPriceStore.getPrice(selectedValue);
                if (unitPrice !== null) {
                    recalcFromUnit(unitPrice);
                } else {
                    priceInput.value = '';
                    delete priceInput.dataset.unitPrice;
                }
            } else {
                priceInput.value = '';
                delete priceInput.dataset.unitPrice;
            }
        });

        if (quantityInput) {
            quantityInput.addEventListener('input', function() {
                const unit = parseFloat(priceInput.dataset.unitPrice) || 0;
                const q = parseFloat(this.value) || 0;
                const subtotal = unit * q;
                if (window.BeiraMarUtils && window.BeiraMarUtils.formatCurrencyBR) {
                    priceInput.value = window.BeiraMarUtils.formatCurrencyBR(subtotal);
                } else {
                    priceInput.value = `R$ ${Number(subtotal).toFixed(2).replace('.', ',')}`;
                }
            });
        }
    }
    
    return productItem;
}

// Configura eventos para os botões de editar pedido na página de vendas
function setupVendasEditOrderButtons() {
    // Usa delegação de eventos para capturar cliques nos botões de editar
    document.addEventListener('click', function(e) {
        const editBtn = e.target.closest('.btn-edit-order');
        if (editBtn) {
            const orderId = editBtn.getAttribute('data-order-id');
            const orderData = editBtn.getAttribute('data-order');
            
            // Se tiver data-order, usa direto (pedido recém criado)
            if (orderData) {
                try {
                    const orderToEdit = JSON.parse(orderData.replace(/&apos;/g, "'"));
                    openEditOrderModal(orderToEdit);
                } catch (e) {
                    console.error('Erro ao parsear dados do pedido:', e);
                }
            } 
            // Se tiver apenas order-id, tenta buscar dados do card (pedidos estáticos)
            else if (orderId) {
                // Para pedidos estáticos na página, pode precisar criar um objeto básico
                // ou buscar do card. Por enquanto, apenas mostra uma mensagem
                if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                    window.BeiraMarUtils.showToast('Funcionalidade de edição para pedidos estáticos em desenvolvimento', 'info');
                }
            }
        }
    });
}

// Exporta a API pública de formulários
window.BeiraMarForms = {
    setupForms,
    setupProductList,
    createProductItem,
    openEditOrderModal,
    setupVendasEditOrderButtons
};

// =========================================
// SISTEMA DE CARRINHO - CLIENTE
// =========================================

const ClienteCarrinho = {
    itens: [],
    inicializado: false,
    
    // Inicializa o carrinho
    init() {
        // Previne múltiplas inicializações
        if (this.inicializado) {
            console.log('⚠️ Carrinho já inicializado, pulando...');
            return;
        }
        
        console.log('✅ Inicializando carrinho...');
        
        // Obtém email do usuário atual
        const email = sessionStorage.getItem('userEmail') || '';
        
        // Tenta migrar dados antigos primeiro (se for a Fernanda)
        if (window.MigracaoDados) {
            window.MigracaoDados.migrarCarrinho(email);
        }
        
        const chave = email ? `clienteCarrinho_${email}` : 'clienteCarrinho';
        
        // Carrega itens salvos no localStorage (específico por usuário)
        const saved = localStorage.getItem(chave);
        if (saved) {
            try {
                const itensCarregados = JSON.parse(saved);
                // Remove duplicatas
                const itensUnicos = [];
                const nomesVistos = new Set();
                
                itensCarregados.forEach(item => {
                    // Filtra itens inválidos (sem name ou name undefined)
                    if (!item || !item.name || item.name === 'undefined' || item.name === undefined) {
                        console.warn('⚠️ Item inválido encontrado no carrinho, removendo:', item);
                        return;
                    }
                    
                    if (!nomesVistos.has(item.name)) {
                        nomesVistos.add(item.name);
                        itensUnicos.push({
                            ...item,
                            quantidade: parseInt(item.quantidade) || 1
                        });
                    } else {
                        const existente = itensUnicos.find(i => i.name === item.name);
                        if (existente) {
                            existente.quantidade = (parseInt(existente.quantidade) || 1) + (parseInt(item.quantidade) || 1);
                        }
                    }
                });
                
                // Filtra itens inválidos finais
                const itensFinais = itensUnicos.filter(item => {
                    return item && item.name && item.name !== 'undefined' && item.name !== undefined && 
                           item.price !== undefined && item.price !== null && !isNaN(item.price);
                });
                
                this.itens = itensFinais;
                
                // Salva versão limpa se havia duplicatas ou itens inválidos
                if (itensCarregados.length !== itensFinais.length || itensUnicos.length !== itensFinais.length) {
                    this.salvar();
                }
            } catch (e) {
                console.error('Erro ao carregar carrinho:', e);
                this.itens = [];
            }
        } else {
            this.itens = [];
        }
        
        this.atualizarBadge();
        this.inicializado = true;
        console.log(`✅ Carrinho inicializado com ${this.itens.length} itens`);
    },
    
    // Adiciona item ao carrinho
    adicionarItem(produto) {
        // Previne múltiplas chamadas simultâneas
        if (this._adicionandoItem) {
            console.log('⚠️ [BLOQUEADO] Já está adicionando um item, aguardando...');
            return;
        }
        
        this._adicionandoItem = true;
        console.log(`🛒 [1x] Adicionando item ao carrinho: ${produto.name}`);
        
        // Garante inicialização
        if (!this.inicializado) {
            this.init();
        }
        
        // Garante que os itens estejam carregados antes de adicionar
        if (this.itens.length === 0) {
            const email = sessionStorage.getItem('userEmail') || '';
            const chave = email ? `clienteCarrinho_${email}` : 'clienteCarrinho';
            const saved = localStorage.getItem(chave);
            if (saved) {
                try {
                    this.itens = JSON.parse(saved);
                } catch (e) {
                    this.itens = [];
                }
            }
        }
        
        // Verifica se o produto já existe no carrinho
        const itemExistente = this.itens.find(item => item.name === produto.name);
        
        let quantidadeAnterior = 0;
        if (itemExistente) {
            quantidadeAnterior = parseInt(itemExistente.quantidade) || 1;
            // Se já existe, aumenta a quantidade em 1
            itemExistente.quantidade = quantidadeAnterior + 1;
            console.log(`✅ Item existente: ${quantidadeAnterior} -> ${itemExistente.quantidade}`);
        } else {
            // Se não existe, adiciona novo item
            this.itens.push({
                name: produto.name,
                category: produto.category,
                price: produto.price,
                descricao: produto.descricao || '',
                quantidade: 1
            });
            console.log('✅ Novo item adicionado (quantidade: 1)');
        }
        
        this.salvar();
        this.atualizarBadge();
        
        // Atualiza a tela do carrinho se estiver aberta
        const carrinhoPage = document.getElementById('carrinho');
        if (carrinhoPage && carrinhoPage.classList.contains('active')) {
            this.renderCarrinho();
        }
        
        // Libera o bloqueio após um delay maior para evitar cliques rápidos
        setTimeout(() => {
            this._adicionandoItem = false;
            console.log('🔓 Bloqueio liberado, pode adicionar novo item');
        }, 500);
    },
    
    // Remove item do carrinho
    removerItem(nome) {
        this.itens = this.itens.filter(item => item.name !== nome);
        this.salvar();
        this.atualizarBadge();
        this.renderCarrinho();
    },
    
    // Atualiza quantidade de um item
    atualizarQuantidade(nome, quantidade) {
        const item = this.itens.find(item => item.name === nome);
        if (item) {
            if (quantidade <= 0) {
                this.removerItem(nome);
            } else {
                item.quantidade = quantidade;
                this.salvar();
                this.atualizarBadge();
                this.renderCarrinho();
            }
        }
    },
    
    // Limpa o carrinho
    limparCarrinho() {
        this.itens = [];
        this.salvar();
        this.atualizarBadge();
        this.renderCarrinho();
    },
    
    // Calcula o total
    calcularTotal() {
        // Filtra itens inválidos antes de calcular
        const itensValidos = this.itens.filter(item => {
            return item && item.name && item.name !== 'undefined' && item.name !== undefined && 
                   item.price !== undefined && item.price !== null && !isNaN(item.price) &&
                   item.quantidade !== undefined && item.quantidade !== null && !isNaN(item.quantidade);
        });
        
        return itensValidos.reduce((total, item) => {
            const preco = parseFloat(item.price) || 0;
            const quantidade = parseInt(item.quantidade) || 1;
            return total + (preco * quantidade);
        }, 0);
    },
    
    // Salva no localStorage (específico por usuário)
    salvar() {
        const email = sessionStorage.getItem('userEmail') || '';
        const chave = email ? `clienteCarrinho_${email}` : 'clienteCarrinho';
        localStorage.setItem(chave, JSON.stringify(this.itens));
    },
    
    // Atualiza badge no sidebar
    atualizarBadge() {
        // Garante que os itens estejam carregados
        if (this.itens.length === 0) {
            const email = sessionStorage.getItem('userEmail') || '';
            const chave = email ? `clienteCarrinho_${email}` : 'clienteCarrinho';
            const saved = localStorage.getItem(chave);
            if (saved) {
                try {
                    this.itens = JSON.parse(saved);
                } catch (e) {
                    this.itens = [];
                }
            }
        }
        
        // Filtra itens inválidos antes de calcular
        const itensValidos = this.itens.filter(item => {
            return item && item.name && item.name !== 'undefined' && item.name !== undefined && 
                   item.price !== undefined && item.price !== null && !isNaN(item.price);
        });
        
        const totalItens = itensValidos.reduce((sum, item) => {
            // Garante que quantidade seja um número
            const qtd = parseInt(item.quantidade) || 1;
            return sum + qtd;
        }, 0);
        
        // Se houver itens inválidos, remove e salva
        if (itensValidos.length !== this.itens.length) {
            console.warn(`⚠️ Removendo ${this.itens.length - itensValidos.length} itens inválidos do carrinho (atualizarBadge)`);
            this.itens = itensValidos;
            this.salvar();
        }
        
        console.log(`🔢 Atualizando badge: ${totalItens} itens`);
        
        // Atualiza todos os badges de carrinho
        const badges = document.querySelectorAll('#carrinhoBadge, .carrinho-badge');
        badges.forEach(badge => {
            if (badge) {
                badge.textContent = totalItens;
                badge.style.display = totalItens > 0 ? 'flex' : 'none';
                console.log(`✅ Badge atualizado: ${totalItens}`);
            }
        });
        
        // Se não encontrou badges específicos, tenta pelo ID
        if (badges.length === 0) {
            const badgeById = document.getElementById('carrinhoBadge');
            if (badgeById) {
                badgeById.textContent = totalItens;
                badgeById.style.display = totalItens > 0 ? 'flex' : 'none';
            }
        }
    },
    
    // Formata preço
    formatarPreco(preco) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco || 0);
    },
    
    // Obtém imagem do produto
    getImagemProduto(nome) {
        const imagens = {
            'Salmão Fresco': 'Salmão-Fresco.jpg',
            'Tilápia Inteira': 'Tilapia-Inteira.jpeg',
            'Camarão Médio': 'Camarão-médio.jpg',
            'Camarão Rosa': 'Camarão-Rosa.png',
            'Camarão Cinza': 'Camarão-Cinza.png',
            'Filé de Tilápia': 'File-de-Tilapia.jpg',
            'Atum Fresco': 'Atum-Fresco.png',
            'Lula Anéis': 'Aneis-de-Lula.png',
            'Polvo Inteiro': 'Polvo-Inteiro.png',
            'Sardinha': 'Sardinha.png',
            'Pescada': 'Pescada.png',
            'Robalo': 'Robalo.png',
            'Dourado': 'Dourado.png',
            'Cavala': 'Cavala.png',
            'Ostras': 'Ostras.png',
            'Mexilhão': 'Mexilhão.png',
            'Lagosta': 'Lagosta.png',
            'Siri': 'Siri.png',
            'Caranguejo': 'Caranguejo.png',
            'Corvina': 'Corvina.png'
        };
        
        const arquivo = imagens[nome];
        return arquivo ? `assets/Peixes/${arquivo}` : null;
    },
    
    // Renderiza o carrinho na página
    renderCarrinho() {
        // Só renderiza se estiver na página do carrinho
        const page = document.getElementById('carrinho');
        if (!page) {
            return;
        }
        
        // Só renderiza se a página estiver ativa
        if (!page.classList.contains('active')) {
            console.log('⚠️ Carrinho não está ativo, pulando renderização...');
            return;
        }
        
        console.log('🔄 Renderizando carrinho na página...');
        
        // Força visibilidade da página apenas se estiver ativa
        if (page.classList.contains('active')) {
            page.style.display = 'block';
            page.style.visibility = 'visible';
            page.style.opacity = '1';
        }
        
        // Busca elementos dentro da página
        const container = page.querySelector('#carrinhoItensContainer');
        const resumo = page.querySelector('#carrinhoResumo');
        const carrinhoContainer = page.querySelector('.carrinho-container');
        
        console.log(`📦 Container encontrado: ${!!container}`);
        console.log(`📦 Resumo encontrado: ${!!resumo}`);
        console.log(`📦 Carrinho container encontrado: ${!!carrinhoContainer}`);
        
        if (!container) {
            console.error('❌ Container do carrinho não encontrado');
            console.error('Page innerHTML length:', page.innerHTML.length);
            console.error('Page innerHTML preview:', page.innerHTML.substring(0, 500));
            setTimeout(() => this.renderCarrinho(), 500);
            return;
        }
        
        // Garante visibilidade do container principal
        if (carrinhoContainer) {
            carrinhoContainer.style.display = 'block';
            carrinhoContainer.style.visibility = 'visible';
            carrinhoContainer.style.opacity = '1';
        }
        
        // Recarrega itens do localStorage para garantir sincronização
        const email = sessionStorage.getItem('userEmail') || '';
        const chave = email ? `clienteCarrinho_${email}` : 'clienteCarrinho';
        const saved = localStorage.getItem(chave);
        if (saved) {
            try {
                const itensCarregados = JSON.parse(saved);
                // Garante que não haja duplicatas - remove duplicados por nome
                const itensUnicos = [];
                const nomesVistos = new Set();
                
                itensCarregados.forEach(item => {
                    if (!nomesVistos.has(item.name)) {
                        nomesVistos.add(item.name);
                        itensUnicos.push({
                            ...item,
                            quantidade: parseInt(item.quantidade) || 1
                        });
                    } else {
                        // Se já existe, soma as quantidades
                        const existente = itensUnicos.find(i => i.name === item.name);
                        if (existente) {
                            existente.quantidade = (parseInt(existente.quantidade) || 1) + (parseInt(item.quantidade) || 1);
                        }
                    }
                });
                
                this.itens = itensUnicos;
                // Salva a versão sem duplicatas
                if (itensCarregados.length !== itensUnicos.length) {
                    this.salvar();
                }
            } catch (e) {
                console.error('Erro ao carregar carrinho:', e);
                this.itens = [];
            }
        } else {
            this.itens = [];
        }
        
        this.atualizarBadge();
        
        // Força o display do container
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        container.style.minHeight = '200px';
        container.style.gap = '1rem';
        
        if (this.itens.length === 0) {
            const emptyHTML = `
                <div class="carrinho-empty" style="display: block !important; visibility: visible !important; opacity: 1 !important;">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Seu carrinho está vazio</h3>
                    <p>Adicione produtos do catálogo para começar</p>
                    <button class="btn-voltar-catalogo" onclick="if(window.BeiraMarNavigation) window.BeiraMarNavigation.navigateToPage('dashboard');">
                        <i class="fas fa-arrow-left"></i> Ver Produtos
                    </button>
                </div>
            `;
            
            container.innerHTML = emptyHTML;
            
            if (resumo) {
                resumo.style.display = 'none';
            }
            
            // Verifica se o empty state foi inserido
            setTimeout(() => {
                const emptyState = container.querySelector('.carrinho-empty');
                console.log(`📦 Empty state inserido: ${!!emptyState}`);
                if (emptyState) {
                    emptyState.style.display = 'block';
                    emptyState.style.visibility = 'visible';
                    emptyState.style.opacity = '1';
                    console.log('✅ Empty state visível');
                } else {
                    console.error('❌ Empty state não encontrado após inserção!');
                }
            }, 100);
            
            console.log(`✅ ${this.itens.length} itens (vazio) renderizado na página`);
            return;
        }
        
        if (resumo) {
            resumo.style.display = 'block';
            resumo.style.visibility = 'visible';
            resumo.style.opacity = '1';
        }
        
        // Filtra itens inválidos antes de renderizar
        const itensValidos = this.itens.filter(item => {
            return item && item.name && item.name !== 'undefined' && item.name !== undefined && 
                   item.price !== undefined && item.price !== null && !isNaN(item.price) &&
                   item.quantidade !== undefined && item.quantidade !== null && !isNaN(item.quantidade);
        });
        
        // Se houver itens inválidos, remove do array e salva
        if (itensValidos.length !== this.itens.length) {
            console.warn(`⚠️ Removendo ${this.itens.length - itensValidos.length} itens inválidos do carrinho`);
            this.itens = itensValidos;
            this.salvar();
        }
        
        // Se não houver itens válidos, mostra estado vazio
        if (itensValidos.length === 0) {
            const emptyHTML = `
                <div class="carrinho-empty" style="display: block !important; visibility: visible !important; opacity: 1 !important;">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Seu carrinho está vazio</h3>
                    <p>Adicione produtos do catálogo para começar</p>
                    <button class="btn-voltar-catalogo" onclick="if(window.BeiraMarNavigation) window.BeiraMarNavigation.navigateToPage('dashboard');">
                        <i class="fas fa-arrow-left"></i> Ver Produtos
                    </button>
                </div>
            `;
            container.innerHTML = emptyHTML;
            
            if (resumo) {
                resumo.style.display = 'none';
            }
            
            this.atualizarResumo();
            return;
        }
        
        // Garante que o resumo está visível quando há itens
        if (resumo) {
            resumo.style.display = 'block';
            resumo.style.visibility = 'visible';
            resumo.style.opacity = '1';
        }
        
        // Renderiza itens
        const html = itensValidos.map(item => {
            const imagemPath = this.getImagemProduto(item.name);
            const subtotal = (item.price || 0) * (item.quantidade || 1);
            
            return `
                <div class="carrinho-item">
                    ${imagemPath ? `
                        <div class="item-imagem">
                            <img src="${imagemPath}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="imagem-placeholder" style="display: none;">
                                <i class="fas fa-fish"></i>
                            </div>
                        </div>
                    ` : `
                        <div class="item-imagem">
                            <div class="imagem-placeholder">
                                <i class="fas fa-fish"></i>
                            </div>
                        </div>
                    `}
                    
                    <div class="item-info">
                        <h4 class="item-nome">${item.name}</h4>
                        <p class="item-categoria">${item.category}</p>
                        ${item.descricao ? `<p class="item-descricao">${item.descricao}</p>` : ''}
                        <div class="item-preco-unitario">
                            ${this.formatarPreco(item.price)} / kg
                        </div>
                    </div>
                    
                    <div class="item-controles">
                        <div class="quantidade-control">
                            <button class="btn-qtd" onclick="ClienteCarrinho.atualizarQuantidade('${item.name}', ${item.quantidade - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="qtd-value">${item.quantidade}</span>
                            <button class="btn-qtd" onclick="ClienteCarrinho.atualizarQuantidade('${item.name}', ${item.quantidade + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        
                        <div class="item-subtotal">
                            <span class="subtotal-label">Subtotal</span>
                            <span class="subtotal-value">${this.formatarPreco(subtotal)}</span>
                        </div>
                        
                        <button class="btn-remover" onclick="ClienteCarrinho.removerItem('${item.name}')" title="Remover item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Limpa e insere HTML diretamente
        container.innerHTML = html;
        
        console.log(`📋 Container HTML inserido: ${container.innerHTML.length} caracteres`);
        
        // Força display nos items imediatamente
        setTimeout(() => {
            const items = container.querySelectorAll('.carrinho-item');
            console.log(`📊 Items encontrados após inserção: ${items.length}`);
            
            items.forEach((item, index) => {
                item.style.display = 'flex';
                item.style.visibility = 'visible';
                item.style.opacity = '1';
                console.log(`✅ Item ${index + 1} estilizado`);
            });
            
            console.log(`✅ ${items.length} itens renderizados no carrinho`);
            
            if (items.length === 0 && this.itens.length > 0) {
                console.error('❌ ERRO: HTML inserido mas items não encontrados!');
                console.error('HTML inserido preview:', container.innerHTML.substring(0, 1000));
                // Tenta inserir novamente
                container.innerHTML = html;
                const itemsRetry = container.querySelectorAll('.carrinho-item');
                console.log(`🔄 Retry: ${itemsRetry.length} items após nova inserção`);
            } else if (items.length > 0) {
                console.log(`✅ SUCESSO! ${items.length} itens visíveis no carrinho!`);
            }
        }, 100);
        
        // Atualiza resumo
        this.atualizarResumo();
        
        console.log(`✅ Renderização concluída para ${this.itens.length} itens`);
    },
    
    // Atualiza o resumo do pedido
    atualizarResumo() {
        // Remove itens inválidos antes de calcular
        const itensValidos = this.itens.filter(item => {
            return item && item.name && item.name !== 'undefined' && item.name !== undefined && 
                   item.price !== undefined && item.price !== null && !isNaN(item.price);
        });
        
        // Se houver itens inválidos, remove e salva
        if (itensValidos.length !== this.itens.length) {
            console.warn(`⚠️ Removendo ${this.itens.length - itensValidos.length} itens inválidos do carrinho`);
            this.itens = itensValidos;
            this.salvar();
        }
        
        const subtotal = this.calcularTotal();
        const total = subtotal; // Por enquanto sem frete
        
        const subtotalEl = document.getElementById('resumoSubtotal');
        const totalEl = document.getElementById('resumoTotal');
        
        if (subtotalEl) {
            subtotalEl.textContent = this.formatarPreco(subtotal);
        }
        if (totalEl) {
            totalEl.textContent = this.formatarPreco(total);
        }
        
        console.log(`💰 Resumo atualizado - Subtotal: ${this.formatarPreco(subtotal)}, Total: ${this.formatarPreco(total)}`);
    },
    
    // Limpa carrinho com confirmação
    limparCarrinhoConfirmado() {
        if (window.BeiraMarModais && window.BeiraMarModais.showConfirm) {
            window.BeiraMarModais.showConfirm({
                title: 'Limpar Carrinho',
                message: 'Tem certeza que deseja limpar o carrinho? Todos os itens serão removidos.',
                confirmText: 'Limpar',
                cancelText: 'Cancelar',
                icon: 'trash-alt',
                iconColor: '#ef4444',
                onConfirm: () => {
                    this.limparCarrinho();
                    if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                        window.BeiraMarUtils.showToast('Carrinho limpo!', 'success');
                    }
                }
            });
        }
    },
    
    // Gera ID único para pedido
    gerarIdPedido() {
        const numero = String(this.getProximoNumeroPedido()).padStart(3, '0');
        return `PED-${numero}`;
    },
    
    // Obtém próximo número de pedido
    getProximoNumeroPedido() {
        if (!window.ClienteCompras) return 6;
        
        const todosPedidos = window.ClienteCompras.comprasCliente || [];
        if (todosPedidos.length === 0) return 6;
        
        // Extrai números dos IDs no formato PED-XXX
        const numeros = todosPedidos
            .map(pedido => {
                if (!pedido.id) return 0;
                const match = pedido.id.match(/PED-0*(\d+)/);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(num => num > 0);
        
        return numeros.length > 0 ? Math.max(...numeros) + 1 : 6;
    },
    
    // Finaliza o pedido
    finalizarPedido() {
        if (this.itens.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        const total = this.calcularTotal();
        const totalFormatado = this.formatarPreco(total);
        
        if (window.BeiraMarModais && window.BeiraMarModais.showConfirm) {
            window.BeiraMarModais.showConfirm({
                title: 'Finalizar Pedido',
                message: `Finalizar pedido?\n\nTotal: ${totalFormatado}\n\nO pedido será adicionado em "A Pagar".`,
                confirmText: 'Finalizar',
                cancelText: 'Cancelar',
                icon: 'check-circle',
                iconColor: '#10b981',
                onConfirm: () => {
                    this.processarFinalizacao(total, totalFormatado);
                },
                onCancel: () => {
                    return;
                }
            });
            return;
        }
        
        // Fallback se o modal não estiver disponível
        if (!confirm(`Finalizar pedido?\n\nTotal: ${totalFormatado}\n\nO pedido será adicionado em "A Pagar".`)) {
            return;
        }
        
        this.processarFinalizacao(total, totalFormatado);
    },
    
    processarFinalizacao(total, totalFormatado) {
        // Gera ID único para o pedido
        const pedidoId = this.gerarIdPedido();
        
        // Formata data atual
        const hoje = new Date();
        const dataFormatada = hoje.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        // Prepara produtos do pedido
        const produtos = this.itens.map(item => ({
            nome: item.name,
            quantidade: item.quantidade,
            precoUnit: item.price,
            total: item.price * item.quantidade
        }));
        
        // Cria o novo pedido
        const novoPedido = {
            id: pedidoId,
            data: dataFormatada,
            produtos: produtos,
            valorTotal: total,
            status: 'a-pagar',
            metodoPagamento: 'Pix',
            dataCriacao: Date.now() // Timestamp atual (24 horas para pagar)
        };
        
        // Adiciona pedido ao sistema de compras
        if (window.ClienteCompras) {
            // Garante que comprasCliente seja um array
            if (!window.ClienteCompras.comprasCliente) {
                window.ClienteCompras.comprasCliente = [];
            }
            
            window.ClienteCompras.comprasCliente.push(novoPedido);
            
            // Salva compras após adicionar novo pedido
            if (window.ClienteCompras.salvarCompras) {
                window.ClienteCompras.salvarCompras();
            }
            
            // Atualiza contadores
            if (window.ClienteCompras.atualizarContadores) {
                window.ClienteCompras.atualizarContadores();
            }
            
            // Cria notificação usando a função adicionarNotificacao (que já salva automaticamente)
            if (window.ClienteNotificacoes && window.ClienteNotificacoes.adicionarNotificacao) {
                window.ClienteNotificacoes.adicionarNotificacao(
                    'Novo Pedido para Pagar',
                    `Você tem um novo pedido (${pedidoId}) aguardando pagamento`,
                    'error',
                    'apagar',
                    pedidoId
                );
            }
            
            // Limpa o carrinho
            this.limparCarrinho();
            
            // Mostra mensagem de sucesso
            if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                window.BeiraMarUtils.showToast('Pedido criado com sucesso!', 'success');
            } else {
                alert('Pedido criado com sucesso!');
            }
            
            // Navega para a página de compras
            setTimeout(() => {
                if (window.BeiraMarNavigation && window.BeiraMarNavigation.navigateToPage) {
                    window.BeiraMarNavigation.navigateToPage('estoque');
                }
            }, 1000);
            
            console.log('✅ Pedido criado:', novoPedido);
        } else {
            console.error('❌ Sistema de compras não disponível');
            
            // Tenta inicializar o ClienteCompras se não estiver disponível
            if (!window.ClienteCompras && typeof ClienteCompras !== 'undefined') {
                window.ClienteCompras = ClienteCompras;
                if (window.ClienteCompras.init) {
                    window.ClienteCompras.init();
                }
                // Tenta novamente após inicializar
                setTimeout(() => {
                    if (window.ClienteCompras && window.ClienteCompras.comprasCliente) {
                        window.ClienteCompras.comprasCliente.push(novoPedido);
                        if (window.ClienteCompras.salvarCompras) {
                            window.ClienteCompras.salvarCompras();
                        }
                        if (window.ClienteCompras.atualizarContadores) {
                            window.ClienteCompras.atualizarContadores();
                        }
                        this.limparCarrinho();
                        if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                            window.BeiraMarUtils.showToast('Pedido criado com sucesso!', 'success');
                        }
                        return;
                    }
                    alert('Erro: Sistema de compras não disponível. Recarregue a página e tente novamente.');
                }, 500);
            } else {
                alert('Erro: Sistema de compras não disponível. Recarregue a página e tente novamente.');
            }
        }
    }
};

// Exporta globalmente
window.ClienteCarrinho = ClienteCarrinho;


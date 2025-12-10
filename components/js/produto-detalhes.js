// =========================================
// DETALHAMENTO DE PRODUTO
// =========================================

const ProdutoDetalhes = {
    produtoAtual: null,
    quantidade: 1,
    quantidadeMaxima: 50, // kg máximo por produto
    
    // Avaliações e comentários fixos
    avaliacoes: {
        'Salmão Fresco': {
            media: 4.8,
            total: 127,
            comentarios: [
                { nome: 'Maria Silva', data: '15/01/2024', estrelas: 5, texto: 'Excelente qualidade! O salmão estava muito fresco e saboroso. Recomendo!' },
                { nome: 'João Santos', data: '12/01/2024', estrelas: 5, texto: 'Sempre compro aqui. Produto de primeira qualidade e entrega rápida.' },
                { nome: 'Ana Costa', data: '10/01/2024', estrelas: 4, texto: 'Muito bom, mas achei um pouco caro. A qualidade compensa.' },
                { nome: 'Carlos Oliveira', data: '08/01/2024', estrelas: 5, texto: 'Perfeito para sashimi! Frescor incomparável.' }
            ]
        },
        'Tilápia Inteira': {
            media: 4.5,
            total: 89,
            comentarios: [
                { nome: 'Pedro Lima', data: '14/01/2024', estrelas: 5, texto: 'Tilápia muito fresca! Ideal para fritar.' },
                { nome: 'Fernanda Alves', data: '11/01/2024', estrelas: 4, texto: 'Boa qualidade, preço justo.' },
                { nome: 'Roberto Souza', data: '09/01/2024', estrelas: 5, texto: 'Sempre fresca e bem embalada.' }
            ]
        },
        'Camarão Médio': {
            media: 4.7,
            total: 156,
            comentarios: [
                { nome: 'Juliana Ferreira', data: '16/01/2024', estrelas: 5, texto: 'Camarões perfeitos! Limpos e saborosos.' },
                { nome: 'Marcos Rocha', data: '13/01/2024', estrelas: 5, texto: 'Melhor camarão que já comprei. Recomendo!' },
                { nome: 'Patricia Mendes', data: '10/01/2024', estrelas: 4, texto: 'Muito bom, mas poderia ter mais desconto.' }
            ]
        }
    },
    
    // Carrega detalhes do produto
    carregarProduto(nomeProduto) {
        if (!window.ClienteDashboard) {
            console.error('ClienteDashboard não encontrado');
            return;
        }
        const produto = window.ClienteDashboard.catalogoProdutos.find(p => p.name === nomeProduto);
        
        if (!produto) {
            console.error('Produto não encontrado:', nomeProduto);
            this.voltar();
            return;
        }
        
        this.produtoAtual = produto;
        this.quantidade = 1;
        
        // Verifica se já existe compra com quantidade máxima
        this.verificarQuantidadeMaxima();
        
        this.renderizar();
        
        // Atualiza preço total após renderizar
        setTimeout(() => {
            this.atualizarPrecoTotal();
        }, 100);
    },
    
    // Verifica se já existe compra com quantidade máxima
    verificarQuantidadeMaxima() {
        if (!this.produtoAtual) return;
        
        let quantidadeTotal = 0;
        
        if (window.ClienteCompras) {
            const compras = window.ClienteCompras.getComprasPorStatus('a-pagar');
            compras.forEach(compra => {
                compra.produtos.forEach(prod => {
                    if (prod.nome === this.produtoAtual.name) {
                        quantidadeTotal += prod.quantidade;
                    }
                });
            });
        }
        
        // Verifica também no carrinho
        if (window.ClienteCarrinho && window.ClienteCarrinho.itens) {
            const itemCarrinho = window.ClienteCarrinho.itens.find(item => item.name === this.produtoAtual.name);
            if (itemCarrinho) {
                quantidadeTotal += itemCarrinho.quantidade;
            }
        }
        
        // Se já atingiu o limite, desabilita o produto
        if (quantidadeTotal >= this.quantidadeMaxima) {
            this.produtoAtual.disponivel = false;
            if (window.BeiraMarNotificacoes) {
                window.BeiraMarNotificacoes.addNotification(
                    'Limite Atingido',
                    `Você já possui ${this.quantidadeMaxima}kg de ${this.produtoAtual.name} em suas compras. O produto está temporariamente indisponível.`,
                    'warning'
                );
            }
        }
    },
    
    // Renderiza a página de detalhes
    renderizar() {
        if (!this.produtoAtual) return;
        
        const container = document.getElementById('produtoDetalhesContainer');
        if (!container) return;
        
        const avaliacao = this.avaliacoes[this.produtoAtual.name] || {
            media: 4.5,
            total: 0,
            comentarios: [
                { nome: 'Cliente Satisfeito', data: '01/01/2024', estrelas: 5, texto: 'Produto de excelente qualidade!' },
                { nome: 'Comprador Fiel', data: '01/01/2024', estrelas: 4, texto: 'Sempre compro aqui, recomendo!' }
            ]
        };
        
        const produtosRecomendados = this.getProdutosRecomendados();
        const quantidadeDisponivel = this.getQuantidadeDisponivel();
        const limiteAtingido = quantidadeDisponivel <= 0;
        
        container.innerHTML = `
            <div class="produto-detalhes-content">
                <!-- Imagem do Produto -->
                <div class="produto-imagem-grande">
                    ${this.getImagemProduto(this.produtoAtual.name)}
                </div>
                
                <!-- Informações do Produto -->
                <div class="produto-info">
                    <h1 class="produto-nome-detalhes">${this.produtoAtual.name}</h1>
                    <p class="produto-categoria-detalhes">${this.produtoAtual.category}</p>
                    
                    <!-- Avaliação com Estrelas -->
                    <div class="avaliacao-media">
                        <div class="estrelas-container">
                            ${this.renderizarEstrelas(avaliacao.media)}
                        </div>
                        <div>
                            <div class="avaliacao-numero">${avaliacao.media.toFixed(1)}</div>
                            <div class="avaliacao-total">(${avaliacao.comentarios.length} avaliações)</div>
                        </div>
                    </div>
                    
                    <div class="produto-preco-container">
                        <div class="produto-preco-unitario">${this.formatarPreco(this.produtoAtual.price)} / kg</div>
                        <div class="produto-preco-total" id="precoTotalDetalhes">Total: ${this.formatarPreco(this.produtoAtual.price * this.quantidade)}</div>
                    </div>
                    
                    <p class="produto-descricao-detalhes">${this.produtoAtual.descricao || 'Produto fresco e de qualidade premium.'}</p>
                    
                    <!-- Controle de Quantidade -->
                    <div class="quantidade-section">
                        <label class="quantidade-label">Quantidade (kg)</label>
                        <div class="quantidade-controls">
                            <button class="btn-quantidade" onclick="ProdutoDetalhes.alterarQuantidade(-1)" ${this.quantidade <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantidade-value" id="quantidadeValue">${this.quantidade}</span>
                            <button class="btn-quantidade" onclick="ProdutoDetalhes.alterarQuantidade(1)" ${limiteAtingido || this.quantidade >= quantidadeDisponivel ? 'disabled' : ''}>
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div class="quantidade-maxima ${limiteAtingido ? 'quantidade-limite-atingido' : ''}">
                            ${limiteAtingido 
                                ? `⚠️ Limite máximo atingido (${this.quantidadeMaxima}kg). Este produto está temporariamente indisponível.`
                                : `Máximo: ${this.quantidadeMaxima}kg | Disponível: ${quantidadeDisponivel}kg`
                            }
                        </div>
                    </div>
                    
                    <!-- Botões de Ação -->
                    <div class="acoes-produto">
                        <button class="btn-acao btn-adicionar-carrinho" onclick="ProdutoDetalhes.adicionarAoCarrinho()" ${limiteAtingido ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            Adicionar ao Carrinho
                        </button>
                        <button class="btn-acao btn-comprar-agora" onclick="ProdutoDetalhes.comprarAgora()" ${limiteAtingido ? 'disabled' : ''}>
                            <i class="fas fa-bolt"></i>
                            Comprar Agora
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Produtos Recomendados -->
            ${produtosRecomendados.length > 0 ? `
                <div class="produtos-recomendados-section">
                    <h2 class="section-title">
                        <i class="fas fa-thumbs-up"></i>
                        Produtos Recomendados
                    </h2>
                    <div class="produtos-recomendados-grid">
                        ${produtosRecomendados.map(prod => `
                            <div class="produto-card" onclick="ProdutoDetalhes.carregarProduto('${prod.name}')">
                                <div class="produto-imagem">
                                    ${this.getImagemProduto(prod.name, true)}
                                </div>
                                <div class="produto-info-card">
                                    <h3>${prod.name}</h3>
                                    <p class="produto-categoria">${prod.category}</p>
                                    <div class="produto-preco">${this.formatarPreco(prod.price)} / kg</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Comentários -->
            <div class="comentarios-section">
                <h2 class="section-title">
                    <i class="fas fa-star"></i>
                    Avaliações e Comentários
                </h2>
                <div class="comentarios-lista">
                    ${avaliacao.comentarios.map(comentario => `
                        <div class="comentario-item">
                            <div class="comentario-header">
                                <div class="comentario-avatar">${comentario.nome.charAt(0)}</div>
                                <div class="comentario-info">
                                    <h4 class="comentario-nome">${comentario.nome}</h4>
                                    <p class="comentario-data">${comentario.data}</p>
                                    <div class="comentario-estrelas">
                                        ${this.renderizarEstrelas(comentario.estrelas, true)}
                                    </div>
                                </div>
                            </div>
                            <p class="comentario-texto">${comentario.texto}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    // Renderiza estrelas
    renderizarEstrelas(media, tamanhoPequeno = false) {
        const estrelas = Math.round(media);
        const tamanho = tamanhoPequeno ? '0.9rem' : '1.5rem';
        let html = '';
        
        for (let i = 1; i <= 5; i++) {
            html += `<span class="estrela ${i <= estrelas ? 'ativa' : ''}" style="font-size: ${tamanho};">★</span>`;
        }
        
        return html;
    },
    
    // Altera quantidade
    alterarQuantidade(delta) {
        const novaQuantidade = this.quantidade + delta;
        const quantidadeDisponivel = this.getQuantidadeDisponivel();
        
        if (novaQuantidade < 1) return;
        if (novaQuantidade > quantidadeDisponivel) {
            if (window.BeiraMarNotificacoes) {
                window.BeiraMarNotificacoes.addNotification(
                    'Limite Atingido',
                    `Você só pode adicionar mais ${quantidadeDisponivel}kg deste produto.`,
                    'warning'
                );
            }
            return;
        }
        
        this.quantidade = novaQuantidade;
        document.getElementById('quantidadeValue').textContent = this.quantidade;
        
        // Atualiza preço total
        this.atualizarPrecoTotal();
        
        // Atualiza botões
        const btnMenos = document.querySelector('.btn-quantidade:first-of-type');
        const btnMais = document.querySelector('.btn-quantidade:last-of-type');
        
        if (btnMenos) btnMenos.disabled = this.quantidade <= 1;
        if (btnMais) btnMais.disabled = this.quantidade >= quantidadeDisponivel;
    },
    
    // Obtém quantidade disponível
    getQuantidadeDisponivel() {
        if (!this.produtoAtual) return 0;
        
        let quantidadeUsada = 0;
        
        // Verifica compras pendentes
        if (window.ClienteCompras) {
            const compras = window.ClienteCompras.getComprasPorStatus('a-pagar');
            compras.forEach(compra => {
                compra.produtos.forEach(prod => {
                    if (prod.nome === this.produtoAtual.name) {
                        quantidadeUsada += prod.quantidade;
                    }
                });
            });
        }
        
        // Verifica carrinho
        if (window.ClienteCarrinho && window.ClienteCarrinho.itens) {
            const itemCarrinho = window.ClienteCarrinho.itens.find(item => item.name === this.produtoAtual.name);
            if (itemCarrinho) {
                quantidadeUsada += itemCarrinho.quantidade;
            }
        }
        
        return Math.max(0, this.quantidadeMaxima - quantidadeUsada);
    },
    
    // Adiciona ao carrinho
    adicionarAoCarrinho() {
        if (!this.produtoAtual) return;
        
        const quantidadeDisponivel = this.getQuantidadeDisponivel();
        if (this.quantidade > quantidadeDisponivel) {
            if (window.BeiraMarNotificacoes) {
                window.BeiraMarNotificacoes.addNotification(
                    'Quantidade Indisponível',
                    `Você só pode adicionar mais ${quantidadeDisponivel}kg deste produto.`,
                    'warning'
                );
            }
            return;
        }
        
        if (window.ClienteCarrinho) {
            // Verifica se o produto já existe no carrinho
            const itemExistente = window.ClienteCarrinho.itens.find(item => item.name === this.produtoAtual.name);
            
            if (itemExistente) {
                // Se já existe, aumenta a quantidade
                itemExistente.quantidade = (parseInt(itemExistente.quantidade) || 1) + this.quantidade;
            } else {
                // Se não existe, adiciona novo item com a quantidade especificada
                window.ClienteCarrinho.itens.push({
                    name: this.produtoAtual.name,
                    category: this.produtoAtual.category,
                    price: this.produtoAtual.price,
                    descricao: this.produtoAtual.descricao || '',
                    quantidade: this.quantidade,
                    disponivel: this.produtoAtual.disponivel !== false
                });
            }
            
            // Salva e atualiza o carrinho
            window.ClienteCarrinho.salvar();
            window.ClienteCarrinho.atualizarBadge();
            
            // Atualiza a tela do carrinho se estiver aberta
            const carrinhoPage = document.getElementById('carrinho');
            if (carrinhoPage && carrinhoPage.classList.contains('active')) {
                window.ClienteCarrinho.renderCarrinho();
            }
            
            if (window.BeiraMarNotificacoes) {
                window.BeiraMarNotificacoes.addNotification(
                    'Adicionado ao Carrinho',
                    `${this.quantidade}kg de ${this.produtoAtual.name} adicionado ao carrinho!`,
                    'success'
                );
            }
        }
    },
    
    // Compra agora
    comprarAgora() {
        if (!this.produtoAtual) return;
        
        const quantidadeDisponivel = this.getQuantidadeDisponivel();
        if (this.quantidade > quantidadeDisponivel) {
            if (window.BeiraMarNotificacoes) {
                window.BeiraMarNotificacoes.addNotification(
                    'Quantidade Indisponível',
                    `Você só pode comprar mais ${quantidadeDisponivel}kg deste produto.`,
                    'warning'
                );
            }
            return;
        }
        
        // Verifica se atingiu o limite máximo
        const quantidadeTotal = (this.getQuantidadeDisponivel() - this.quantidade) + this.quantidade;
        
        if (quantidadeTotal >= this.quantidadeMaxima) {
            // Marca produto como indisponível
            this.produtoAtual.disponivel = false;
            
            if (window.BeiraMarNotificacoes) {
                window.BeiraMarNotificacoes.addNotification(
                    'Limite Máximo Atingido',
                    `Você atingiu o limite máximo de ${this.quantidadeMaxima}kg para ${this.produtoAtual.name}. O produto está temporariamente indisponível.`,
                    'warning'
                );
            }
        }
        
        // Cria compra direta
        if (window.ClienteCompras) {
            const novaCompra = {
                id: Date.now(),
                data: new Date().toLocaleDateString('pt-BR'),
                produtos: [{
                    nome: this.produtoAtual.name,
                    quantidade: this.quantidade,
                    preco: this.produtoAtual.price,
                    total: this.produtoAtual.price * this.quantidade
                }],
                valorTotal: this.produtoAtual.price * this.quantidade,
                status: 'a-pagar',
                metodoPagamento: 'Pendente'
            };
            
            window.ClienteCompras.comprasCliente.push(novaCompra);
            
            // Salva compras após adicionar nova compra
            if (window.ClienteCompras.salvarCompras) {
                window.ClienteCompras.salvarCompras();
            }
            
            if (window.BeiraMarNotificacoes) {
                window.BeiraMarNotificacoes.addNotification(
                    'Compra Realizada',
                    `Compra de ${this.quantidade}kg de ${this.produtoAtual.name} adicionada em "A Pagar"!`,
                    'success'
                );
            }
            
            // Volta para dashboard
            setTimeout(() => {
                if (window.BeiraMarNavigation) {
                    window.BeiraMarNavigation.navigateToPage('dashboard');
                }
            }, 1500);
        }
    },
    
    // Obtém produtos recomendados
    getProdutosRecomendados() {
        if (!this.produtoAtual) return [];
        
        if (!window.ClienteDashboard) return [];
        
        return window.ClienteDashboard.catalogoProdutos
            .filter(p => 
                p.name !== this.produtoAtual.name && 
                p.disponivel === true &&
                (p.category === this.produtoAtual.category || Math.random() > 0.5)
            )
            .slice(0, 4);
    },
    
    // Obtém imagem do produto (usa a mesma função do dashboard)
    getImagemProduto(nome, pequena = false) {
        if (!window.ClienteDashboard) {
            return pequena 
                ? `<div class="imagem-placeholder"><span class="emoji-produto">🐟</span></div>`
                : `<div class="imagem-placeholder"><span class="emoji-produto">🐟</span></div>`;
        }
        
        const imagemPath = window.ClienteDashboard.getImagemProduto(nome);
        const icone = window.ClienteDashboard.getIconePorCategoria(this.produtoAtual?.category || 'Peixe Fresco');
        
        if (pequena) {
            // Para produtos recomendados (tamanho de card)
            if (imagemPath) {
                return `<img src="${imagemPath}" alt="${nome}" class="produto-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="imagem-placeholder" style="display: none;">
                        <i class="fas ${icone} fa-3x"></i>
                    </div>`;
            }
            return `<div class="imagem-placeholder">
                <i class="fas ${icone} fa-3x"></i>
            </div>`;
        }
        
        // Para imagem grande do produto detalhado
        if (imagemPath) {
            return `<img src="${imagemPath}" alt="${nome}" class="produto-img-grande-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="imagem-placeholder" style="display: none;">
                    <i class="fas ${icone}" style="font-size: 8rem;"></i>
                </div>`;
        }
        return `<div class="imagem-placeholder">
            <i class="fas ${icone}" style="font-size: 8rem;"></i>
        </div>`;
    },
    
    // Atualiza preço total baseado na quantidade
    atualizarPrecoTotal() {
        if (!this.produtoAtual) return;
        
        const precoTotal = this.produtoAtual.price * this.quantidade;
        const precoTotalElement = document.getElementById('precoTotalDetalhes');
        
        if (precoTotalElement) {
            precoTotalElement.textContent = `Total: ${this.formatarPreco(precoTotal)}`;
        }
    },
    
    // Formata preço
    formatarPreco(preco) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco);
    },
    
    // Volta para dashboard
    voltar() {
        if (window.BeiraMarNavigation) {
            window.BeiraMarNavigation.navigateToPage('dashboard');
        }
    }
};

window.ProdutoDetalhes = ProdutoDetalhes;


// =========================================
// DASHBOARD DO CLIENTE - CARDS DE PRODUTOS
// =========================================

const ClienteDashboard = {
    // Categoria selecionada para filtro
    categoriaSelecionada: 'Todas',
    // Termo de pesquisa
    termoPesquisa: '',
    
    // Catálogo próprio para clientes (separado do estoque interno)
    catalogoProdutos: [
        { name: 'Salmão Fresco', category: 'Peixe Fresco', price: 45.00, descricao: 'Salmão fresco premium, ideal para sashimi', disponivel: true },
        { name: 'Tilápia Inteira', category: 'Peixe Inteiro', price: 12.00, descricao: 'Tilápia fresca, pesca local', disponivel: true },
        { name: 'Camarão Médio', category: 'Crustáceo', price: 65.00, descricao: 'Camarão médio, limpo e selecionado', disponivel: true },
        { name: 'Filé de Tilápia', category: 'Peixe Fresco', price: 38.00, descricao: 'Filé de tilápia sem espinha', disponivel: true },
        { name: 'Atum Fresco', category: 'Peixe Fresco', price: 52.00, descricao: 'Atum fresco, qualidade sashimi', disponivel: true },
        { name: 'Camarão Rosa', category: 'Crustáceo', price: 75.00, descricao: 'Camarão rosa tamanho grande', disponivel: true },
        { name: 'Camarão Cinza', category: 'Crustáceo', price: 40.00, descricao: 'Camarão cinza fresco', disponivel: true },
        { name: 'Lula Anéis', category: 'Molusco', price: 42.00, descricao: 'Lula em anéis, pronta para fritar', disponivel: true },
        { name: 'Polvo Inteiro', category: 'Molusco', price: 85.00, descricao: 'Polvo fresco inteiro', disponivel: true },
        { name: 'Sardinha', category: 'Peixe Inteiro', price: 9.50, descricao: 'Sardinha fresca, caixa com 30 unidades', disponivel: true },
        { name: 'Pescada', category: 'Peixe Inteiro', price: 15.00, descricao: 'Pescada fresca, pesca do dia', disponivel: true },
        { name: 'Robalo', category: 'Peixe Fresco', price: 48.00, descricao: 'Robalo fresco premium', disponivel: true },
        { name: 'Dourado', category: 'Peixe Fresco', price: 55.00, descricao: 'Dourado fresco, qualidade premium', disponivel: true },
        { name: 'Cavala', category: 'Peixe Inteiro', price: 14.00, descricao: 'Cavala fresca', disponivel: true },
        { name: 'Ostras', category: 'Molusco', price: 28.00, descricao: 'Ostras frescas, vendidas por dúzia', disponivel: true },
        { name: 'Mexilhão', category: 'Molusco', price: 18.00, descricao: 'Mexilhão limpo e selecionado', disponivel: true },
        { name: 'Lagosta', category: 'Crustáceo', price: 120.00, descricao: 'Lagosta viva, premium', disponivel: true },
        { name: 'Siri', category: 'Crustáceo', price: 35.00, descricao: 'Siri fresco', disponivel: true },
        { name: 'Caranguejo', category: 'Crustáceo', price: 32.00, descricao: 'Caranguejo inteiro fresco', disponivel: true },
        { name: 'Corvina', category: 'Peixe Fresco', price: 42.00, descricao: 'Corvina em filé', disponivel: true }
    ],
    
    // Obtém todos os produtos disponíveis para venda (filtrados por categoria)
    getProdutosDisponiveis() {
        let produtos = this.catalogoProdutos.filter(p => p.disponivel === true);
        
        // Aplica filtro de categoria se houver
        if (this.categoriaSelecionada && this.categoriaSelecionada !== 'Todas') {
            produtos = produtos.filter(p => p.category === this.categoriaSelecionada);
        }
        
        return produtos;
    },
    
    // Obtém categorias únicas para o filtro
    getCategorias() {
        const categorias = ['Todas', ...new Set(this.catalogoProdutos.map(p => p.category))];
        return categorias;
    },
    
    // Obtém ícone baseado na categoria
    getIconePorCategoria(categoria) {
        const icones = {
            'Peixe Fresco': 'fa-fish',
            'Peixe Inteiro': 'fa-fish',
            'Crustáceo': 'fa-shrimp',
            'Molusco': 'fa-crab'
        };
        return icones[categoria] || 'fa-fish';
    },
    
    // Obtém caminho da imagem baseado no nome do produto
    getImagemProduto(nome) {
        // Mapeamento de nomes para arquivos de imagem
        // Os arquivos estão em assets/peixes/ (com P maiúsculo)
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
        if (!arquivo) {
            console.warn(`⚠️ Imagem não encontrada para: ${nome}`);
            return null;
        }
        return `assets/Peixes/${arquivo}`;
    },
    
    // Formata o preço
    formatarPreco(preco) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco || 0);
    },
    
    // Renderiza estrelas para produto no card
    renderizarEstrelasProduto(nomeProduto) {
        const avaliacoes = {
            'Salmão Fresco': { media: 4.8, total: 127 },
            'Tilápia Inteira': { media: 4.5, total: 89 },
            'Camarão Médio': { media: 4.7, total: 156 },
            'Filé de Tilápia': { media: 4.6, total: 98 },
            'Atum Fresco': { media: 4.9, total: 203 },
            'Camarão Rosa': { media: 4.8, total: 145 },
            'Camarão Cinza': { media: 4.4, total: 67 },
            'Lula Anéis': { media: 4.5, total: 112 },
            'Polvo Inteiro': { media: 4.7, total: 89 },
            'Sardinha': { media: 4.3, total: 234 },
            'Pescada': { media: 4.4, total: 156 },
            'Robalo': { media: 4.8, total: 178 },
            'Dourado': { media: 4.9, total: 201 },
            'Cavala': { media: 4.2, total: 98 },
            'Ostras': { media: 4.6, total: 134 },
            'Mexilhão': { media: 4.5, total: 112 },
            'Lagosta': { media: 4.9, total: 67 },
            'Siri': { media: 4.4, total: 89 },
            'Caranguejo': { media: 4.5, total: 123 },
            'Corvina': { media: 4.6, total: 145 }
        };
        
        const avaliacao = avaliacoes[nomeProduto] || { media: 4.5, total: 0 };
        const media = avaliacao.media;
        
        // Lógica simplificada: 4.5 ou mais = 5 estrelas, abaixo disso = 4 estrelas
        const estrelasCompletas = media >= 4.5 ? 5 : 4;
        const estrelasVazias = 5 - estrelasCompletas;
        
        let html = '<div class="produto-estrelas-card">';
        
        // Estrelas completas
        for (let i = 0; i < estrelasCompletas; i++) {
            html += `<span class="estrela-card ativa">★</span>`;
        }
        
        // Estrelas vazias
        for (let i = 0; i < estrelasVazias; i++) {
            html += `<span class="estrela-card">★</span>`;
        }
        
        html += `<span class="avaliacao-numero-card">${avaliacao.media.toFixed(1)}</span>`;
        html += '</div>';
        
        return html;
    },
    
    // Renderiza o filtro de categorias
    renderFiltroCategorias() {
        const filtroContainer = document.getElementById('categoriaFiltro');
        if (!filtroContainer) return;
        
        const categorias = this.getCategorias();
        filtroContainer.innerHTML = categorias.map(cat => {
            const isActive = cat === this.categoriaSelecionada ? 'active' : '';
            return `
                <button class="filter-btn ${isActive}" onclick="ClienteDashboard.filtrarPorCategoria('${cat}')">
                    ${cat}
                </button>
            `;
        }).join('');
    },
    
    // Filtra produtos por categoria
    filtrarPorCategoria(categoria) {
        this.categoriaSelecionada = categoria;
        this.renderFiltroCategorias();
        this.renderProdutos();
    },
    
    // Configura a barra de pesquisa
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        
        if (!searchInput) return;
        
        // Evento de digitação
        searchInput.addEventListener('input', (e) => {
            this.termoPesquisa = e.target.value.toLowerCase().trim();
            
            // Mostra/esconde botão de limpar
            if (searchClear) {
                searchClear.style.display = this.termoPesquisa ? 'flex' : 'none';
            }
            
            // Filtra produtos
            this.renderProdutos();
        });
        
        // Botão de limpar pesquisa
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                searchInput.value = '';
                this.termoPesquisa = '';
                searchClear.style.display = 'none';
                this.renderProdutos();
            });
        }
    },
    
    // Renderiza os cards de produtos
    renderProdutos() {
        let produtos = this.getProdutosDisponiveis();
        
        // Aplica filtro de pesquisa se houver termo
        if (this.termoPesquisa) {
            produtos = produtos.filter(produto => 
                produto.name.toLowerCase().includes(this.termoPesquisa)
            );
        }
        
        const grid = document.getElementById('produtosGrid');
        
        if (!grid) {
            console.error('❌ Grid de produtos não encontrado');
            return;
        }
        
        if (produtos.length === 0) {
            grid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open"></i>
                    <p>Nenhum produto disponível nesta categoria</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = produtos.map(produto => {
            const icone = this.getIconePorCategoria(produto.category);
            const imagemPath = this.getImagemProduto(produto.name);
            const preco = produto.price || 0;
            const descricao = produto.descricao || '';
            
            const imagemHTML = imagemPath ? 
                `<img src="${imagemPath}" alt="${produto.name}" class="produto-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="imagem-placeholder" style="display: none;">
                    <i class="fas ${icone} fa-3x"></i>
                </div>` :
                `<div class="imagem-placeholder">
                    <i class="fas ${icone} fa-3x"></i>
                </div>`;
            
            return `
                <div class="produto-card" onclick="ClienteDashboard.verDetalhes('${produto.name}')" style="cursor: pointer;">
                    <div class="produto-imagem">
                        ${imagemHTML}
                        <div class="status-badge status-normal">Disponível</div>
                    </div>
                    <div class="produto-info">
                        <h3 class="produto-nome">${produto.name}</h3>
                        <p class="produto-categoria">
                            <i class="fas ${icone}"></i> ${produto.category}
                        </p>
                        ${descricao ? `<p class="produto-descricao">${descricao}</p>` : ''}
                        ${this.renderizarEstrelasProduto(produto.name)}
                        <div class="produto-preco">
                            <span class="preco-label">Preço por kg:</span>
                            <span class="preco-valor">${this.formatarPreco(preco)}</span>
                        </div>
                        <button class="btn-comprar" onclick="event.stopPropagation(); event.preventDefault(); ClienteDashboard.comprarProduto('${produto.name}')">
                            <i class="fas fa-shopping-cart"></i> Adicionar ao carrinho
                        </button>
                        <button class="btn-ver-detalhes" onclick="event.stopPropagation(); event.preventDefault(); ClienteDashboard.verDetalhes('${produto.name}')">
                            <i class="fas fa-info-circle"></i> Ver Detalhes
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Função para ver detalhes do produto
    verDetalhes(nomeProduto) {
        if (window.ProdutoDetalhes && window.BeiraMarNavigation) {
            window.BeiraMarNavigation.navigateToPage('produto-detalhes');
            setTimeout(() => {
                window.ProdutoDetalhes.carregarProduto(nomeProduto);
            }, 300);
        }
    },
    
    // Função para comprar produto - adiciona ao carrinho
    comprarProduto(nome) {
        // Previne múltiplas chamadas simultâneas
        if (this._comprandoProduto) {
            console.log('⚠️ Já está processando uma compra, aguardando...');
            return;
        }
        
        this._comprandoProduto = true;
        console.log(`🛒 [1x] Adicionando ${nome} ao carrinho`);
        
        // Busca o produto no catálogo
        const produto = this.catalogoProdutos.find(p => p.name === nome);
        
        if (produto && window.ClienteCarrinho) {
            window.ClienteCarrinho.adicionarItem(produto);
        } else {
            console.error('Produto não encontrado ou carrinho não disponível');
            if (window.BeiraMarUtils && window.BeiraMarUtils.showToast) {
                window.BeiraMarUtils.showToast('Erro ao adicionar ao carrinho', 'error');
            }
        }
        
        // Libera o bloqueio após um pequeno delay
        setTimeout(() => {
            this._comprandoProduto = false;
        }, 300);
    },
    
    // Carrega o conteúdo do dashboard
    loadDashboard() {
        console.log('📦 Carregando dashboard do cliente...');
        this.renderFiltroCategorias();
        this.setupSearch();
        this.renderProdutos();
    }
};

// Exporta globalmente
window.ClienteDashboard = ClienteDashboard;


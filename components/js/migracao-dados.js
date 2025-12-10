// =========================================
// SISTEMA DE MIGRAÇÃO DE DADOS ANTIGOS
// =========================================

const MigracaoDados = {
    // Email da Fernanda (usuário padrão que tinha dados)
    FERNANDA_EMAIL: 'Fernanda12@gmail.com',
    
    // Verifica e migra dados antigos para o novo sistema
    migrarDadosAntigos() {
        const email = sessionStorage.getItem('userEmail') || '';
        
        // Só migra se for a Fernanda
        if (email.toLowerCase() !== this.FERNANDA_EMAIL.toLowerCase()) {
            return;
        }
        
        console.log('🔄 Verificando migração de dados para:', email);
        
        // Migra notificações
        this.migrarNotificacoes(email);
        
        // Migra compras
        this.migrarCompras(email);
        
        // Migra carrinho
        this.migrarCarrinho(email);
    },
    
    // Migra notificações antigas
    migrarNotificacoes(email) {
        const chaveAntiga = 'notificacoes';
        const chaveNova = `notificacoes_${email}`;
        
        // Verifica se já tem dados novos
        const dadosNovos = localStorage.getItem(chaveNova);
        if (dadosNovos) {
            console.log('✅ Notificações já migradas');
            return;
        }
        
        // Verifica se tem dados antigos
        const dadosAntigos = localStorage.getItem(chaveAntiga);
        if (dadosAntigos) {
            try {
                const notificacoes = JSON.parse(dadosAntigos);
                localStorage.setItem(chaveNova, JSON.stringify(notificacoes));
                console.log(`✅ Notificações migradas: ${notificacoes.length} itens`);
            } catch (e) {
                console.error('Erro ao migrar notificações:', e);
            }
        }
    },
    
    // Migra compras antigas - APENAS PARA A FERNANDA
    migrarCompras(email) {
        // Só migra dados antigos se for a Fernanda
        if (email.toLowerCase() !== this.FERNANDA_EMAIL.toLowerCase()) {
            return; // Outros usuários não devem herdar dados antigos
        }
        
        const chaveAntiga = 'compras';
        const chaveNova = `compras_${email}`;
        
        // Verifica se já tem dados novos
        const dadosNovos = localStorage.getItem(chaveNova);
        if (dadosNovos) {
            console.log('✅ Compras já migradas');
            return;
        }
        
        // Verifica se tem dados antigos (pode estar em 'clienteCompras' também)
        let dadosAntigos = localStorage.getItem(chaveAntiga);
        if (!dadosAntigos) {
            dadosAntigos = localStorage.getItem('clienteCompras');
        }
        
        if (dadosAntigos) {
            try {
                const compras = JSON.parse(dadosAntigos);
                localStorage.setItem(chaveNova, JSON.stringify(compras));
                console.log(`✅ Compras migradas: ${compras.length} pedidos`);
            } catch (e) {
                console.error('Erro ao migrar compras:', e);
            }
        } else {
            // Se não tiver dados antigos, usa os dados padrão do código
            const comprasPadrao = this.getComprasPadraoFernanda();
            if (comprasPadrao && comprasPadrao.length > 0) {
                localStorage.setItem(chaveNova, JSON.stringify(comprasPadrao));
                console.log(`✅ Compras padrão da Fernanda restauradas: ${comprasPadrao.length} pedidos`);
            }
        }
    },
    
    // Migra carrinho antigo
    migrarCarrinho(email) {
        const chaveAntiga = 'clienteCarrinho';
        const chaveNova = `clienteCarrinho_${email}`;
        
        // Verifica se já tem dados novos
        const dadosNovos = localStorage.getItem(chaveNova);
        if (dadosNovos) {
            console.log('✅ Carrinho já migrado');
            return;
        }
        
        // Verifica se tem dados antigos
        const dadosAntigos = localStorage.getItem(chaveAntiga);
        if (dadosAntigos) {
            try {
                const carrinho = JSON.parse(dadosAntigos);
                localStorage.setItem(chaveNova, JSON.stringify(carrinho));
                console.log(`✅ Carrinho migrado: ${carrinho.length} itens`);
            } catch (e) {
                console.error('Erro ao migrar carrinho:', e);
            }
        }
    },
    
    // Retorna as compras padrão da Fernanda (do código original)
    getComprasPadraoFernanda() {
        return [
            {
                id: 'PED-001',
                data: '15/01/2025',
                produtos: [
                    { nome: 'Salmão Fresco', quantidade: 2, precoUnit: 45.00, total: 90.00 }
                ],
                valorTotal: 90.00,
                status: 'a-pagar',
                metodoPagamento: 'Pix',
                dataCriacao: new Date(Date.now() - 20 * 60 * 60 * 1000).getTime()
            },
            {
                id: 'PED-002',
                data: '14/01/2025',
                produtos: [
                    { nome: 'Camarão Médio', quantidade: 3, precoUnit: 65.00, total: 195.00 },
                    { nome: 'Filé de Tilápia', quantidade: 1.5, precoUnit: 38.00, total: 57.00 }
                ],
                valorTotal: 252.00,
                status: 'a-pagar',
                metodoPagamento: 'Cartão de Crédito',
                dataCriacao: new Date(Date.now() - 18 * 60 * 60 * 1000).getTime()
            },
            {
                id: 'PED-003',
                data: '18/01/2025',
                produtos: [
                    { nome: 'Atum Fresco', quantidade: 1.5, precoUnit: 52.00, total: 78.00 },
                    { nome: 'Lula Anéis', quantidade: 2, precoUnit: 42.00, total: 84.00 }
                ],
                valorTotal: 162.00,
                status: 'preparando',
                metodoPagamento: 'Pix',
                localizacao: 'Câmara de Preparação A',
                etapaAtual: 'Lavagem e Limpeza',
                tempoEstimado: '30 minutos',
                responsavel: 'João Silva'
            },
            {
                id: 'PED-004',
                data: '17/01/2025',
                produtos: [
                    { nome: 'Salmão Fresco', quantidade: 3, precoUnit: 45.00, total: 135.00 },
                    { nome: 'Camarão Rosa', quantidade: 2, precoUnit: 75.00, total: 150.00 }
                ],
                valorTotal: 285.00,
                status: 'a-caminho',
                metodoPagamento: 'Cartão de Crédito',
                etapasEntrega: [
                    {
                        titulo: 'Pedido Confirmado',
                        status: 'completed',
                        data: '17/01/2025, 08:30',
                        descricao: 'Pedido confirmado e preparação iniciada'
                    },
                    {
                        titulo: 'Em Preparação',
                        status: 'completed',
                        data: '17/01/2025, 09:15',
                        descricao: 'Produtos sendo preparados e embalados'
                    },
                    {
                        titulo: 'Saiu para Entrega',
                        status: 'active',
                        data: '17/01/2025, 14:20',
                        descricao: 'Pedido a caminho do endereço de entrega'
                    },
                    {
                        titulo: 'Entrega',
                        status: 'pending',
                        data: 'Previsão: 17/01/2025, 16:00',
                        descricao: 'Entrega prevista para hoje'
                    }
                ],
                transportadora: 'BeiraMar Express',
                codigoRastreamento: 'BM-2025-001234',
                enderecoEntrega: 'Rua das Flores, 123 - Centro, Fortaleza/CE'
            },
            {
                id: 'PED-005',
                data: '13/01/2025',
                produtos: [
                    { nome: 'Tilápia Inteira', quantidade: 5, precoUnit: 12.00, total: 60.00 },
                    { nome: 'Filé de Tilápia', quantidade: 2, precoUnit: 38.00, total: 76.00 }
                ],
                valorTotal: 136.00,
                status: 'a-avaliar',
                metodoPagamento: 'Pix',
                dataEntrega: '15/01/2025, 16:30',
                etapasEntregaCompleta: [
                    {
                        titulo: 'Pedido Confirmado',
                        status: 'completed',
                        data: '13/01/2025, 10:00',
                        descricao: 'Pedido confirmado e preparação iniciada'
                    },
                    {
                        titulo: 'Em Preparação',
                        status: 'completed',
                        data: '13/01/2025, 11:30',
                        descricao: 'Produtos sendo preparados e embalados'
                    },
                    {
                        titulo: 'Saiu para Entrega',
                        status: 'completed',
                        data: '14/01/2025, 08:00',
                        descricao: 'Pedido a caminho do endereço de entrega'
                    },
                    {
                        titulo: 'Entrega',
                        status: 'completed',
                        data: '15/01/2025, 16:30',
                        descricao: 'Pedido entregue com sucesso'
                    }
                ],
                transportadora: 'BeiraMar Express',
                codigoRastreamento: 'BM-2025-000987',
                enderecoEntrega: 'Rua das Flores, 123 - Centro, Fortaleza/CE'
            }
        ];
    }
};

// Exporta globalmente
window.MigracaoDados = MigracaoDados;

// Executa migração automaticamente quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguarda um pouco para garantir que sessionStorage esteja disponível
    setTimeout(() => {
        if (window.MigracaoDados) {
            window.MigracaoDados.migrarDadosAntigos();
        }
    }, 100);
});


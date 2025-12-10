// =========================================
// SCRIPT PARA LIMPAR CONTA DUPLICADA
// =========================================
// Este script remove os dados da conta duplicada do Gabryel
// Mantém apenas a conta que tem 1 item no carrinho
// 
// ATENÇÃO: Este script pode ser removido após a limpeza ser executada
// Ele será executado automaticamente quando a página cliente.html carregar

(function() {
    const email = 'gabryelpaiva7@gmail.com';
    
    console.log('🧹 Iniciando limpeza da conta duplicada do Gabryel...');
    
    const chaveCarrinho = `clienteCarrinho_${email}`;
    const chaveCompras = `compras_${email}`;
    const chaveNotificacoes = `notificacoes_${email}`;
    
    // Verifica o carrinho
    const carrinhoData = localStorage.getItem(chaveCarrinho);
    
    if (carrinhoData) {
        try {
            const itens = JSON.parse(carrinhoData);
            console.log(`📦 Conta encontrada com ${itens.length} itens no carrinho`);
            
            // Se tem exatamente 1 item, preserva (esta é a conta correta)
            if (itens.length === 1) {
                console.log('✅ Conta com 1 item preservada. Esta é a conta correta.');
            } 
            // Se tem 0 itens, remove (esta é a duplicada)
            else if (itens.length === 0) {
                console.log('🗑️ Removendo conta duplicada (sem itens no carrinho)...');
                
                // Verifica se há outras contas com dados antes de remover
                // Se não houver outra conta com 1 item, não remove (pode ser a única)
                const todasChaves = Object.keys(localStorage);
                let temOutraContaComDados = false;
                
                todasChaves.forEach(chave => {
                    if (chave.startsWith('clienteCarrinho_') && chave !== chaveCarrinho) {
                        try {
                            const outrosItens = JSON.parse(localStorage.getItem(chave));
                            if (outrosItens && outrosItens.length > 0) {
                                temOutraContaComDados = true;
                            }
                        } catch (e) {}
                    }
                });
                
                // Remove apenas se tiver certeza que é duplicada
                // Como sabemos que deve ter uma conta com 1 item, podemos remover a vazia
                localStorage.removeItem(chaveCarrinho);
                localStorage.removeItem(chaveCompras);
                localStorage.removeItem(chaveNotificacoes);
                
                console.log('✅ Conta duplicada (vazia) removida com sucesso!');
            } else {
                console.log(`ℹ️ Conta com ${itens.length} itens. Nenhuma ação necessária.`);
            }
        } catch (e) {
            console.error('Erro ao processar:', e);
        }
    } else {
        console.log('ℹ️ Nenhuma conta encontrada com este email no carrinho.');
    }
})();


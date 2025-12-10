// =========================================
// SISTEMA DE CONTROLE DE PERMISSÕES
// =========================================

const BeiraMarPermissoes = {
    // Força o recarregamento dos funcionários do localStorage
    recarregarFuncionarios() {
        try {
            const funcionariosSalvos = localStorage.getItem('funcionariosListaCompleta');
            if (funcionariosSalvos) {
                const funcionariosCarregados = JSON.parse(funcionariosSalvos);
                if (Array.isArray(funcionariosCarregados) && funcionariosCarregados.length > 0) {
                    window.funcionariosLista = funcionariosCarregados;
                    console.log('🔄 [Permissões] Funcionários recarregados do localStorage:', funcionariosCarregados.length);
                    return true;
                }
            }
            return false;
        } catch (e) {
            console.error('❌ [Permissões] Erro ao recarregar funcionários:', e);
            return false;
        }
    },
    
    // Obtém o funcionário logado completo
    obterFuncionarioLogado() {
        try {
            const email = sessionStorage.getItem('userEmail');
            if (!email) {
                console.log('❌ [Permissões] Email não encontrado no sessionStorage');
                return null;
            }
            
            // SEMPRE tenta carregar do localStorage primeiro (garante dados atualizados)
            this.recarregarFuncionarios();
            
            // Se ainda não tiver, verifica se existe na variável global
            if (!window.funcionariosLista || window.funcionariosLista.length === 0) {
                console.warn('⚠️ [Permissões] Nenhum funcionário encontrado no localStorage nem na variável global');
                return null;
            }
            
            const funcionario = window.funcionariosLista.find(f => 
                f.email && f.email.toLowerCase() === email.toLowerCase()
            );
            
            if (funcionario) {
                console.log(`✅ [Permissões] Funcionário encontrado: ${funcionario.nome}`);
                console.log('📋 [Permissões] Permissões do funcionário:', JSON.stringify(funcionario.permissoes, null, 2));
                return funcionario;
            } else {
                console.warn(`⚠️ [Permissões] Funcionário não encontrado para email: ${email}`);
                console.log('📋 [Permissões] Emails disponíveis:', window.funcionariosLista.map(f => f.email));
            }
            
            return null;
        } catch (e) {
            console.error('❌ [Permissões] Erro ao obter funcionário logado:', e);
            return null;
        }
    },
    
    // Verifica se o funcionário tem uma permissão específica em uma página
    temPermissao(pagina, acao) {
        const funcionario = this.obterFuncionarioLogado();
        if (!funcionario) return false;
        
        // Se for admin (userType === 'adm'), tem acesso total
        const userType = sessionStorage.getItem('userType');
        if (userType === 'adm' || userType === 'admin') {
            return true;
        }
        
        // Verifica as permissões do funcionário
        const permissoes = funcionario.permissoes || {};
        const permissoesPagina = permissoes[pagina] || [];
        
        return permissoesPagina.includes(acao);
    },
    
    // Verifica se o funcionário tem pelo menos permissão de visualizar uma página
    podeVisualizar(pagina) {
        return this.temPermissao(pagina, 'visualizar');
    },
    
    // Verifica se o funcionário pode adicionar em uma página
    podeAdicionar(pagina) {
        return this.temPermissao(pagina, 'adicionar');
    },
    
    // Verifica se o funcionário pode editar em uma página
    podeEditar(pagina) {
        return this.temPermissao(pagina, 'editar');
    },
    
    // Verifica se o funcionário pode excluir em uma página
    podeExcluir(pagina) {
        return this.temPermissao(pagina, 'excluir');
    },
    
    // Verifica se o funcionário tem qualquer permissão na página
    temAcesso(pagina) {
        const funcionario = this.obterFuncionarioLogado();
        if (!funcionario) {
            console.log(`❌ [Permissões] Funcionário não encontrado para verificar acesso a ${pagina}`);
            return false;
        }
        
        // Se for admin, tem acesso total
        const userType = sessionStorage.getItem('userType');
        if (userType === 'adm' || userType === 'admin') {
            console.log(`✅ [Permissões] Admin tem acesso total a ${pagina}`);
            return true;
        }
        
        const permissoes = funcionario.permissoes || {};
        const permissoesPagina = permissoes[pagina] || [];
        
        console.log(`🔍 [Permissões] Verificando acesso a ${pagina} para ${funcionario.nome}:`, permissoesPagina);
        const temAcesso = permissoesPagina.length > 0;
        console.log(`${temAcesso ? '✅' : '❌'} [Permissões] Acesso a ${pagina}: ${temAcesso}`);
        
        return temAcesso;
    },
    
    // Obtém todas as permissões de uma página
    obterPermissoesPagina(pagina) {
        const funcionario = this.obterFuncionarioLogado();
        if (!funcionario) return [];
        
        // Se for admin, tem todas as permissões
        const userType = sessionStorage.getItem('userType');
        if (userType === 'adm' || userType === 'admin') {
            return ['adicionar', 'editar', 'visualizar', 'excluir'];
        }
        
        const permissoes = funcionario.permissoes || {};
        return permissoes[pagina] || [];
    }
};

// Expõe globalmente
window.BeiraMarPermissoes = BeiraMarPermissoes;


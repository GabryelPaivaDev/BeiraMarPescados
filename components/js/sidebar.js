// =========================================
// SIDEBAR - CONTROLE VISUAL E FUNCIONAL
// =========================================

function initializeSidebar() {
    console.log("🚀 Sidebar Inicializado");
    
    // 1. Remove sinos ANTES de qualquer coisa
    removeBellFromMenuItems();
    
    // 2. ATUALIZA O NOME DO USUÁRIO IMEDIATAMENTE
    updateUserName();

    // 2. LISTENER DE CLIQUES (Menu e Toggle)
    document.addEventListener('click', function(e) {
        
        // Botão de Recolher (Toggle)
        const toggleBtn = e.target.closest('#sidebarToggle');
        if (toggleBtn) {
            e.preventDefault();
            document.body.classList.toggle('compact-mode');
            return;
        }

        // Links de Navegação
        const navLink = e.target.closest('.nav-link');
        if (navLink) {
            e.preventDefault();
            const pageName = navLink.getAttribute('data-page');
            
            if (pageName) {
                // Remove sinos antes de navegar
                removeBellFromMenuItems();
                
                // Efeito visual
                updateVisualActiveState(pageName);
                
                // Navegação real
                if (window.BeiraMarNavigation && window.BeiraMarNavigation.navigateToPage) {
                    window.BeiraMarNavigation.navigateToPage(pageName);
                }
                
                // Fecha menu no mobile
                if (window.innerWidth <= 768) {
                    document.body.classList.remove('mobile-menu-open');
                }
                
                // Remove sinos depois de navegar também
                setTimeout(removeBellFromMenuItems, 100);
            }
        }
    });
}

// === FUNÇÃO MÁGICA: PREENCHE O NOME ===
function updateUserName() {
    const userSpan = document.getElementById('sidebarUserName');
    
    // Tenta pegar o email salvo na sessão
    const userEmail = sessionStorage.getItem('userEmail');
    
    if (userSpan) {
        if (userEmail) {
            // Pega o que vem antes do @ (ex: joao@gmail.com -> joao)
            let nick = userEmail.split('@')[0];
            // Deixa a primeira letra maiúscula (Joao)
            nick = nick.charAt(0).toUpperCase() + nick.slice(1);
            
            userSpan.textContent = nick;
        } else {
            // Se não tiver login (caso raro), mostra Visitante
            userSpan.textContent = "Visitante";
        }
    }
}

function updateVisualActiveState(pageName) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const activeLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    if (activeLink) {
        const parentLi = activeLink.closest('.nav-item');
        if (parentLi) {
            parentLi.classList.add('active');
        }
    }
}

// Funções de responsividade
function checkScreenSize() {
    // Remove mobile-menu-open quando não está em mobile e limpa todas as classes relacionadas
    if (window.innerWidth > 768) {
        const sidebar = document.querySelector('.sidebar');
        const sidebarContainer = document.getElementById('sidebar-container');
        const appContainer = document.querySelector('.app-container');
        
        document.body.classList.remove('mobile-menu-open');
        sidebar?.classList.remove('open');
        sidebarContainer?.classList.remove('open');
        appContainer?.classList.remove('sidebar-open');
        
        // Limpa estilos inline
        sidebar?.style.setProperty('width', '');
        sidebar?.style.setProperty('transform', '');
        document.body.style.overflow = '';
    }
    
    if (window.innerWidth <= 1024 && window.innerWidth > 768) {
        document.body.classList.add('compact-mode');
    } else if (window.innerWidth > 1024) {
        document.body.classList.remove('compact-mode');
    }
}

window.addEventListener('resize', checkScreenSize);

// Exportação Global
window.BeiraMarSidebar = {
    initializeSidebar,
    setActivePage: updateVisualActiveState,
    updateUserName, // Exportamos para poder chamar de fora se precisar
    toggleMobileMenu: () => document.body.classList.toggle('mobile-menu-open')
};

// Remove qualquer ícone de sino dos itens do menu
function removeBellFromMenuItems() {
    console.log('🔍 Verificando sinos nos itens do menu...');
    
    // Remove sino de Sede Local
    const sedeLocalLink = document.querySelector('.nav-link[data-page="sedelocal"]');
    if (sedeLocalLink) {
        console.log('📍 Sede Local encontrado. Ícones antes:', sedeLocalLink.querySelectorAll('i').length);
        // Remove TODOS os ícones primeiro
        const allIcons = sedeLocalLink.querySelectorAll('i');
        allIcons.forEach(icon => {
            const iconClass = icon.className || '';
            // Se for sino, remove
            if (iconClass.includes('bell') || iconClass.includes('fa-bell')) {
                console.log('🔔 Removendo sino de Sede Local:', icon, iconClass);
                icon.remove();
            }
        });
        
        // Garante que apenas o ícone de mapa está presente
        const mapIcon = sedeLocalLink.querySelector('i.fa-map-marker-alt, i.fas.fa-map-marker-alt');
        if (!mapIcon) {
            const newMapIcon = document.createElement('i');
            newMapIcon.className = 'fas fa-map-marker-alt';
            const span = sedeLocalLink.querySelector('span');
            if (span) {
                sedeLocalLink.insertBefore(newMapIcon, span);
            } else {
                sedeLocalLink.appendChild(newMapIcon);
            }
        }
        
        // Remove qualquer ícone extra (deve ter apenas 1 ícone)
        const remainingIcons = sedeLocalLink.querySelectorAll('i');
        if (remainingIcons.length > 1) {
            const mapIconToKeep = sedeLocalLink.querySelector('i.fa-map-marker-alt, i.fas.fa-map-marker-alt');
            remainingIcons.forEach(icon => {
                if (icon !== mapIconToKeep) {
                    console.log('🗑️ Removendo ícone extra de Sede Local:', icon);
                    icon.remove();
                }
            });
        }
    }
    
    // Remove sino de Contato
    const contatoLink = document.querySelector('.nav-link[data-page="contato"]');
    if (contatoLink) {
        console.log('📞 Contato encontrado. Ícones antes:', contatoLink.querySelectorAll('i').length);
        // Remove TODOS os ícones primeiro
        const allIcons = contatoLink.querySelectorAll('i');
        allIcons.forEach(icon => {
            const iconClass = icon.className || '';
            // Se for sino, remove
            if (iconClass.includes('bell') || iconClass.includes('fa-bell')) {
                console.log('🔔 Removendo sino de Contato:', icon, iconClass);
                icon.remove();
            }
        });
        
        // Garante que apenas o ícone de telefone está presente
        const phoneIcon = contatoLink.querySelector('i.fa-phone-alt, i.fas.fa-phone-alt');
        if (!phoneIcon) {
            const newPhoneIcon = document.createElement('i');
            newPhoneIcon.className = 'fas fa-phone-alt';
            const span = contatoLink.querySelector('span');
            if (span) {
                contatoLink.insertBefore(newPhoneIcon, span);
            } else {
                contatoLink.appendChild(newPhoneIcon);
            }
        }
        
        // Remove qualquer ícone extra (deve ter apenas 1 ícone)
        const remainingIcons = contatoLink.querySelectorAll('i');
        if (remainingIcons.length > 1) {
            const phoneIconToKeep = contatoLink.querySelector('i.fa-phone-alt, i.fas.fa-phone-alt');
            remainingIcons.forEach(icon => {
                if (icon !== phoneIconToKeep) {
                    console.log('🗑️ Removendo ícone extra de Contato:', icon);
                    icon.remove();
                }
            });
        }
    }
}

// Inicialização Automática
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeSidebar();
        setTimeout(removeBellFromMenuItems, 100);
        setTimeout(removeBellFromMenuItems, 500);
        setTimeout(removeBellFromMenuItems, 1000);
        setTimeout(removeBellFromMenuItems, 2000);
    });
} else {
    initializeSidebar();
    setTimeout(removeBellFromMenuItems, 100);
    setTimeout(removeBellFromMenuItems, 500);
    setTimeout(removeBellFromMenuItems, 1000);
    setTimeout(removeBellFromMenuItems, 2000);
}

// Observa mudanças no DOM para remover sino se aparecer
const observer = new MutationObserver(() => {
    removeBellFromMenuItems();
});

// Inicia observação após um pequeno delay
setTimeout(() => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        observer.observe(sidebar, { childList: true, subtree: true });
    }
}, 500);
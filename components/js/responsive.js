/**
 * Responsividade - ajusta a interface conforme o tamanho da janela
 */
function initializeResponsive() {
    // Protege contra múltiplas inicializações
    if (window.beiramresponsiveinitialized) return;
    window.beiramresponsiveinitialized = true;

    function adjustSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarContainer = document.getElementById('sidebar-container');
        const appContainer = document.querySelector('.app-container');

        if (!sidebar) return;

        if (window.innerWidth <= 768) {
            // Mobile: sidebar off-canvas (usa classe "open" para mostrar)
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('open');
            sidebarContainer?.classList.remove('collapsed');
            sidebarContainer?.classList.remove('open');
            appContainer?.classList.remove('sidebar-collapsed');
            // Também remover estado de sidebar aberta no mobile
            appContainer?.classList.remove('sidebar-open');
            // Restaurar overflow do body caso tenha sido ocultado
            document.body.style.overflow = '';
            // Atualiza variável CSS: em mobile o sidebar não ocupa espaço
            appContainer?.style.setProperty('--sidebar-current', '0px');

        } else if (window.innerWidth <= 1024) {
            // Tablet: sidebar colapsada por padrão
            // IMPORTANTE: Remove TODAS as classes relacionadas ao mobile-menu quando não está em mobile
            document.body.classList.remove('mobile-menu-open');
            sidebar.classList.remove('open');
            sidebar.classList.add('collapsed');
            sidebarContainer?.classList.remove('open');
            sidebarContainer?.classList.add('collapsed');
            appContainer?.classList.remove('sidebar-open');
            appContainer?.classList.add('sidebar-collapsed');
            document.body.style.overflow = '';
            // Limpa qualquer estilo inline que possa estar interferindo
            sidebar.style.width = '';
            sidebar.style.transform = '';
            // Atualiza variável CSS
            appContainer?.style.setProperty('--sidebar-current', '80px');

        } else {
            // Desktop: sidebar expandida por padrão
            // IMPORTANTE: Remove TODAS as classes relacionadas ao mobile-menu quando não está em mobile
            document.body.classList.remove('mobile-menu-open');
            sidebar.classList.remove('open');
            sidebar.classList.remove('collapsed');
            sidebarContainer?.classList.remove('open');
            sidebarContainer?.classList.remove('collapsed');
            appContainer?.classList.remove('sidebar-open');
            appContainer?.classList.remove('sidebar-collapsed');
            document.body.style.overflow = '';
            // Limpa qualquer estilo inline que possa estar interferindo
            sidebar.style.width = '';
            sidebar.style.transform = '';
            // Atualiza variável CSS
            appContainer?.style.setProperty('--sidebar-current', '280px');
        }
    }

    function adjustTables() {
        const tables = document.querySelectorAll('.table-container');
        tables.forEach(table => {
            if (window.innerWidth <= 768) {
                table.style.overflowX = 'auto';
            }
        });
    }

    // Estilização dinâmica para header-actions
    function adjustHeaderActions() {
        const style = document.getElementById('dynamic-header-style') || document.createElement('style');
        style.id = 'dynamic-header-style';
        
        if (window.innerWidth <= 768) {
            style.textContent = `
                .header-actions {
                    gap: 0.25rem;
                }
                .header-actions .btn {
                    padding: 0.5rem 0.7rem !important;
                    font-size: 1rem !important;
                }
                .header-actions .notification-btn i,
                .header-actions .user-menu i {
                    font-size: 1.15rem !important;
                }
                .header-actions .notification-count {
                    transform: translate(25%, -25%) !important;
                    font-size: 0.65rem !important;
                    min-width: 1.2rem !important;
                    min-height: 1.2rem !important;
                }
            `;
        } else if (window.innerWidth <= 1024) {
            style.textContent = `
                .header-actions {
                    gap: 0.35rem;
                }
                .header-actions .btn {
                    padding: 0.55rem 0.8rem !important;
                    font-size: 1.025rem !important;
                }
                .header-actions .notification-btn i,
                .header-actions .user-menu i {
                    font-size: 1.2rem !important;
                }
                .header-actions .notification-count {
                    transform: translate(28%, -28%) !important;
                    font-size: 0.7rem !important;
                    min-width: 1.3rem !important;
                    min-height: 1.3rem !important;
                }
            `;
        } else {
            style.textContent = `
                .header-actions {
                    gap: 0.5rem;
                }
                .header-actions .btn {
                    padding: 0.6rem 0.9rem !important;
                    border-radius: 999px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    font-size: 1.05rem !important;
                    transition: all 0.2s ease !important;
                }
                .header-actions .btn:hover {
                    background-color: rgba(0, 0, 0, 0.05) !important;
                    transform: scale(1.05) !important;
                }
                .header-actions .notification-btn i,
                .header-actions .user-menu i {
                    font-size: 1.25rem !important;
                }
                .header-actions .notification-count {
                    transform: translate(30%, -30%) !important;
                    font-size: 0.75rem !important;
                    min-width: 1.4rem !important;
                    min-height: 1.4rem !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
            `;
        }
        
        if (!document.getElementById('dynamic-header-style')) {
            document.head.appendChild(style);
        }
    }

    // Executa no carregamento
    adjustSidebar();
    adjustTables();
    adjustHeaderActions();

    // Executa quando redimensiona a janela
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // IMPORTANTE: Se mudou de mobile para tablet/desktop, remove TODAS as classes mobile
            if (window.innerWidth > 768) {
                const sidebar = document.querySelector('.sidebar');
                const sidebarContainer = document.getElementById('sidebar-container');
                const appContainer = document.querySelector('.app-container');
                
                // Remove todas as classes relacionadas ao mobile-menu
                document.body.classList.remove('mobile-menu-open');
                sidebar?.classList.remove('open');
                sidebarContainer?.classList.remove('open');
                appContainer?.classList.remove('sidebar-open');
                
                // Limpa estilos inline que podem estar presos
                sidebar?.style.setProperty('width', '');
                sidebar?.style.setProperty('transform', '');
                document.body.style.overflow = '';
            }
            adjustSidebar();
            adjustTables();
            adjustHeaderActions();
        }, 100); // Reduzido para resposta mais rápida
    });
}

// Exporta para uso global
window.BeiraMarResponsive = {
    initializeResponsive
};

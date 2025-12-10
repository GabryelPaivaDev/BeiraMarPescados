// Função para mostrar overlay de acesso negado no fluxo
function mostrarOverlayAcessoNegadoFluxo() {
    const fluxoPage = document.getElementById('fluxo');
    if (!fluxoPage) return;
    
    // Se já existe overlay, não recria (evita piscar)
    const overlayAnterior = fluxoPage.querySelector('.overlay-acesso-negado-fluxo');
    if (overlayAnterior) {
        return; // Já existe, não precisa recriar
    }
    
    // Cria o overlay que cobre apenas a área de conteúdo
    const overlay = document.createElement('div');
    overlay.className = 'overlay-acesso-negado-fluxo';
    overlay.style.cssText = `
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        min-height: calc(100vh - 80px);
        background: var(--bg-secondary, #f8fafc);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem 2rem;
        animation: fadeIn 0.3s ease;
        overflow: auto;
        box-sizing: border-box;
    `;
    
    overlay.innerHTML = `
        <div style="background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); max-width: 550px; width: 100%; padding: 3rem; text-align: center; border: 1px solid var(--border-color, #e2e8f0);">
            <div style="width: 100px; height: 100px; margin: 0 auto 2rem; border-radius: 50%; background: linear-gradient(135deg, #fee2e2, #fecaca); display: flex; align-items: center; justify-content: center; position: relative;">
                <div style="position: absolute; inset: -4px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #dc2626); opacity: 0.2; animation: pulse 2s infinite;"></div>
                <i class="fas fa-lock" style="font-size: 2.5rem; color: #ef4444; position: relative; z-index: 1;"></i>
            </div>
            
            <h2 style="margin: 0 0 1rem 0; color: var(--text-primary, #1e293b); font-size: 2rem; font-weight: 700;">
                Acesso Negado
            </h2>
            
            <p style="margin: 0 0 2.5rem 0; color: var(--text-secondary, #64748b); font-size: 1.1rem; line-height: 1.7;">
                Você não tem acesso a essa parte do sistema, seu nível é baixo
            </p>
            
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; display: flex; align-items: start; gap: 1rem; text-align: left;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: #fee2e2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i class="fas fa-info-circle" style="color: #ef4444; font-size: 1.2rem;"></i>
                </div>
                <p style="margin: 0; color: #991b1b; font-size: 0.95rem; line-height: 1.6;">
                    Esta área é restrita para funcionários com nível de acesso superior ao seu.
                </p>
            </div>
            
            <button onclick="const overlay=document.querySelector('.overlay-acesso-negado-fluxo');if(overlay)overlay.remove();if(window.BeiraMarNavigation&&window.BeiraMarNavigation.navigateToPage){window.BeiraMarNavigation.navigateToPage('dashboard');}" style="
                width: 100%;
                padding: 1rem 2rem;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)'">
                <i class="fas fa-arrow-left"></i>
                <span>Voltar ao Dashboard</span>
            </button>
        </div>
    `;
    
    // Garante que a página tenha position relative e altura mínima
    if (getComputedStyle(fluxoPage).position === 'static') {
        fluxoPage.style.position = 'relative';
    }
    if (!fluxoPage.style.minHeight) {
        fluxoPage.style.minHeight = 'calc(100vh - 80px)';
    }
    
    fluxoPage.appendChild(overlay);
    
    // Adiciona animações CSS se não existirem
    if (!document.getElementById('overlay-fluxo-animations')) {
        const style = document.createElement('style');
        style.id = 'overlay-fluxo-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.2; }
                50% { transform: scale(1.1); opacity: 0.3; }
            }
            .overlay-acesso-negado-fluxo > div {
                animation: fadeIn 0.4s ease;
            }
            [data-theme="dark"] .overlay-acesso-negado-fluxo {
                background: var(--bg-secondary, #1e293b) !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-fluxo > div {
                background: #334155 !important;
                border-color: rgba(255, 255, 255, 0.1) !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-fluxo h2 {
                color: #f1f5f9 !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-fluxo p {
                color: #cbd5e1 !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-fluxo div[style*="background: #fef2f2"] {
                background: rgba(239, 68, 68, 0.15) !important;
                border-color: rgba(239, 68, 68, 0.3) !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-fluxo div[style*="color: #991b1b"] {
                color: #fca5a5 !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-fluxo div[style*="background: #fee2e2"] {
                background: rgba(239, 68, 68, 0.2) !important;
            }
            [data-theme="dark"] .overlay-acesso-negado-fluxo i[style*="color: #ef4444"] {
                color: #fca5a5 !important;
            }
        `;
        document.head.appendChild(style);
    }
}


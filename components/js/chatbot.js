// Sistema de Chat Bot com Perguntas Pré-selecionadas
const ChatBot = {
    initialized: false,
    processingQuestion: null,
    // Categorias de perguntas organizadas por tema
    categories: {
        'preco': {
            icon: 'fa-dollar-sign',
            questions: [
                {
                    key: 'preco-1kg',
                    question: 'Esse preço inicial é de 1kg do produto?',
                    answer: 'Sim! Todos os preços exibidos são referentes a 1kg (um quilo) do produto. Por exemplo, se você ver "R$ 45,00" no Salmão Fresco, isso significa R$ 45,00 por quilo. Você pode comprar a quantidade que desejar, e o valor total será calculado automaticamente.'
                },
                {
                    key: 'preco-minimo',
                    question: 'Qual o valor mínimo para compra?',
                    answer: 'Não temos valor mínimo de compra! Você pode comprar qualquer quantidade que desejar, desde 1kg até quantidades maiores. Para compras em grande quantidade, oferecemos descontos progressivos.'
                },
                {
                    key: 'preco-atacado',
                    question: 'Os preços são diferentes para atacado?',
                    answer: 'Sim! Para compras em maior quantidade (atacado), oferecemos preços diferenciados e descontos progressivos. A partir de 10kg você já ganha 5% de desconto, e os descontos aumentam conforme a quantidade.'
                }
            ]
        },
        'produtos': {
            icon: 'fa-fish',
            questions: [
                {
                    key: 'produtos-disponiveis',
                    question: 'Quais produtos vocês têm disponíveis?',
                    answer: 'Temos uma grande variedade de pescados frescos! 🐟\n\n• Salmão Fresco\n• Tilápia Inteira\n• Filé de Tilápia\n• Camarão Médio\n• Camarão Rosa\n• Atum Fresco\n• Lula Anéis\n\nTodos os nossos produtos são selecionados e frescos, garantindo a melhor qualidade para você!'
                },
                {
                    key: 'produtos-frescos',
                    question: 'Os produtos são frescos?',
                    answer: 'Sim! Todos os nossos produtos são 100% frescos! ❄️\n\n• Seleção diária de pescados\n• Conservação em câmaras frigoríficas\n• Embalagem especial para manter a qualidade\n\nGarantimos a frescura desde a seleção até a entrega!'
                },
                {
                    key: 'produtos-congelados',
                    question: 'Vocês vendem produtos congelados?',
                    answer: 'Trabalhamos principalmente com produtos frescos, mas também temos opções congeladas disponíveis. Entre em contato conosco para saber mais sobre nossos produtos congelados e disponibilidade.'
                }
            ]
        },
        'pagamento': {
            icon: 'fa-credit-card',
            questions: [
                {
                    key: 'formas-pagamento',
                    question: 'Quais formas de pagamento vocês aceitam?',
                    answer: 'Aceitamos diversas formas de pagamento para sua comodidade: 💳\n\n• PIX (mais rápido e seguro)\n• Cartão de Crédito\n• Cartão de Débito\n• Boleto Bancário\n\nO pagamento é processado de forma segura e você recebe a confirmação imediatamente!'
                },
                {
                    key: 'parcelamento',
                    question: 'Posso parcelar a compra?',
                    answer: 'Sim! Aceitamos parcelamento no cartão de crédito em até 12x sem juros (para compras acima de R$ 300,00). Para valores menores, o parcelamento pode ter juros conforme a operadora do cartão.'
                },
                {
                    key: 'desconto-pix',
                    question: 'Tem desconto para pagamento no PIX?',
                    answer: 'Sim! Oferecemos desconto de 3% para pagamentos via PIX, pois é uma forma de pagamento mais rápida e com menor custo operacional. O desconto é aplicado automaticamente no checkout.'
                }
            ]
        },
        'entrega': {
            icon: 'fa-truck',
            questions: [
                {
                    key: 'entrega',
                    question: 'Vocês fazem entrega? Qual o prazo?',
                    answer: 'Sim! Fazemos entrega em toda a região. 🚚\n\n• Prazo de entrega: 2 a 5 dias úteis\n• Frete calculado conforme localização\n• Produtos embalados com cuidado especial\n• Entrega com rastreamento\n\nPara saber o valor do frete e prazo exato para seu endereço, adicione os produtos ao carrinho e informe seu CEP!'
                },
                {
                    key: 'frete-gratis',
                    question: 'Tem frete grátis?',
                    answer: 'Sim! Oferecemos frete grátis para compras acima de R$ 200,00 na região metropolitana de Aracaju. Para outras localidades, o frete é calculado conforme a distância e peso dos produtos.'
                },
                {
                    key: 'retirada-local',
                    question: 'Posso retirar no local?',
                    answer: 'Sim! Você pode retirar seus produtos diretamente em nossa sede em Aracaju. A retirada é gratuita e você pode agendar o horário que preferir. Entre em contato conosco para combinar!'
                }
            ]
        },
        'desconto': {
            icon: 'fa-percent',
            questions: [
                {
                    key: 'desconto-quantidade',
                    question: 'Tem desconto para compras em grande quantidade?',
                    answer: 'Sim! Oferecemos descontos progressivos para compras em maior quantidade! 💰\n\n• A partir de 10kg: 5% de desconto\n• A partir de 20kg: 10% de desconto\n• A partir de 50kg: 15% de desconto\n\nPara pedidos ainda maiores, entre em contato conosco para negociarmos condições especiais!'
                },
                {
                    key: 'desconto-fidelidade',
                    question: 'Tem programa de fidelidade?',
                    answer: 'Sim! Temos um programa de fidelidade onde você acumula pontos a cada compra. A cada R$ 10,00 gastos, você ganha 1 ponto. Ao acumular 100 pontos, você ganha R$ 10,00 de desconto na próxima compra!'
                }
            ]
        },
        'qualidade': {
            icon: 'fa-snowflake',
            questions: [
                {
                    key: 'produto-fresco',
                    question: 'Os produtos são frescos? Como é a conservação?',
                    answer: 'Sim! Todos os nossos produtos são 100% frescos! ❄️\n\n• Seleção diária de pescados\n• Conservação em câmaras frigoríficas\n• Embalagem especial para manter a qualidade\n• Entrega em embalagens térmicas\n\nGarantimos a frescura e qualidade dos produtos desde a seleção até a entrega na sua casa!'
                },
                {
                    key: 'validade',
                    question: 'Qual a validade dos produtos?',
                    answer: 'Nossos produtos frescos têm validade de 2 a 3 dias quando mantidos na temperatura adequada (0°C a 4°C). Recomendamos consumir o mais rápido possível para garantir o melhor sabor e qualidade. As instruções de conservação vêm junto com o produto.'
                },
                {
                    key: 'origem',
                    question: 'De onde vêm os produtos?',
                    answer: 'Trabalhamos com fornecedores locais e regionais, priorizando sempre a qualidade e frescor. Todos os nossos produtos passam por rigoroso controle de qualidade antes de serem disponibilizados para venda.'
                }
            ]
        },
        'horario': {
            icon: 'fa-clock',
            questions: [
                {
                    key: 'horario-funcionamento',
                    question: 'Qual o horário de funcionamento?',
                    answer: 'Nosso horário de funcionamento: 🕐\n\n• Segunda a Sexta: 6h às 18h\n• Sábado: 6h às 14h\n• Domingo: Fechado\n\nAtendimento via WhatsApp 24 horas para tirar dúvidas e fazer pedidos! 📱'
                },
                {
                    key: 'atendimento-24h',
                    question: 'Vocês atendem 24 horas?',
                    answer: 'Nosso atendimento presencial funciona de segunda a sábado nos horários mencionados. Porém, nosso WhatsApp fica disponível 24 horas para tirar dúvidas, fazer pedidos e receber mensagens. Respondemos o mais rápido possível!'
                }
            ]
        },
        'contato': {
            icon: 'fa-phone',
            questions: [
                {
                    key: 'contato',
                    question: 'Como posso entrar em contato?',
                    answer: 'Entre em contato conosco pelos seguintes canais: 📞\n\n📱 WhatsApp: (79) 99116-6601\n📧 Email: contato@beiramar.com.br\n🌐 Instagram: @beira_pescados\n📍 Endereço: Aracaju, Sergipe\n\nEstamos prontos para ajudar você! 😊'
                },
                {
                    key: 'whatsapp',
                    question: 'Qual o número do WhatsApp?',
                    answer: 'Nosso WhatsApp é: (79) 99116-6601 📱\n\nVocê pode nos chamar a qualquer hora do dia ou da noite! Estamos sempre prontos para ajudar com dúvidas, fazer pedidos ou negociar condições especiais.'
                },
                {
                    key: 'endereco',
                    question: 'Onde vocês estão localizados?',
                    answer: 'Estamos localizados em Aracaju, Sergipe. Para mais informações sobre nosso endereço completo e como chegar, acesse a página "Sede Local" no menu ou entre em contato conosco pelo WhatsApp!'
                }
            ]
        }
    },
    
    // Função auxiliar para obter todas as respostas
    getResponse(questionKey) {
        for (const category in this.categories) {
            const question = this.categories[category].questions.find(q => q.key === questionKey);
            if (question) return question;
        }
        return null;
    },
    
    init() {
        // Evita múltiplas inicializações
        if (this.initialized) {
            console.log('ChatBot: Já inicializado, ignorando...');
            return;
        }
        
        // Aguarda um pouco para garantir que o DOM está pronto
        const self = this;
        setTimeout(() => {
            const questionButtons = document.querySelectorAll('.question-icon-btn');
            console.log('ChatBot: Encontrados', questionButtons.length, 'botões de pergunta');
            
            if (questionButtons.length === 0) {
                console.warn('ChatBot: Nenhum botão de pergunta encontrado!');
                // Tenta novamente após mais tempo
                setTimeout(() => {
                    self.init();
                }, 500);
                return;
            }
            
            this.attachResizeListener();
            
            questionButtons.forEach((btn, index) => {
                const category = btn.getAttribute('data-category');
                console.log(`ChatBot: Configurando botão ${index + 1} - categoria: ${category}`);
                
                // Remove listeners antigos se existirem
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                // Adiciona listener para abrir/fechar dropdown
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('ChatBot: Botão clicado - categoria:', category);
                    self.showQuestionList(category);
                });
            });
            
            // Fecha dropdowns ao clicar fora
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.question-icon-btn') && !e.target.closest('.question-dropdown') && !e.target.closest('.question-item')) {
                    self.closeAllDropdowns();
                }
            });
            
            // Adiciona listeners para as perguntas dentro dos dropdowns
            const questionItems = document.querySelectorAll('.question-item');
            console.log('ChatBot: Encontrados', questionItems.length, 'itens de pergunta');
            
            questionItems.forEach((item, index) => {
                const questionKey = item.getAttribute('data-question');
                console.log(`ChatBot: Configurando item ${index + 1} - pergunta: ${questionKey}`);
                
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('ChatBot: Item clicado - pergunta:', questionKey);
                    if (questionKey) {
                        // Fecha dropdown e remove estado ativo do botão
                        self.closeAllDropdowns();
                        // Adiciona pergunta ao chat
                        self.handleQuestion(questionKey);
                    }
                });
            });
            
            console.log('ChatBot: Inicializado com sucesso!');
            self.initialized = true;
        }, 300);
    },
    
    attachResizeListener() {
        // Reajusta posicionamento dos dropdowns quando a janela é redimensionada
        let resizeTimeout;
        const self = this;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                document.querySelectorAll('.question-dropdown.active').forEach(dropdown => {
                    const wrapper = dropdown.closest('.question-icon-wrapper');
                    if (wrapper) {
                        self.ajustarPosicionamentoDropdown(dropdown, wrapper);
                    }
                });
            }, 250);
        });
    },
    
    handleQuestion(questionKey) {
        console.log('ChatBot: handleQuestion chamado com:', questionKey);
        
        // Evita processamento duplicado
        if (this.processingQuestion === questionKey) {
            console.log('ChatBot: Pergunta já está sendo processada, ignorando...');
            return;
        }
        
        this.processingQuestion = questionKey;
        
        const response = this.getResponse(questionKey);
        if (!response) {
            console.warn('ChatBot: Resposta não encontrada para:', questionKey);
            this.processingQuestion = null;
            return;
        }
        
        console.log('ChatBot: Adicionando mensagem do usuário:', response.question);
        // Adiciona mensagem do usuário
        this.addUserMessage(response.question);
        
        // Adiciona resposta do bot após um pequeno delay
        setTimeout(() => {
            console.log('ChatBot: Adicionando resposta do bot:', response.answer);
            this.addBotMessage(response.answer);
            this.processingQuestion = null;
        }, 500);
    },
    
    showQuestionList(category) {
        console.log('ChatBot: showQuestionList chamado para categoria:', category);
        
        // Remove estado ativo de todos os botões e wrappers primeiro
        document.querySelectorAll('.question-icon-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.question-icon-wrapper').forEach(wrapper => {
            wrapper.classList.remove('active');
        });
        
        // Fecha TODAS as listas abertas primeiro
        document.querySelectorAll('.question-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
        const dropdown = document.querySelector(`.question-dropdown[data-category="${category}"]`);
        const wrapper = dropdown ? dropdown.closest('.question-icon-wrapper') : null;
        const button = document.querySelector(`.question-icon-btn[data-category="${category}"]`);
        console.log('ChatBot: Dropdown encontrado:', !!dropdown);
        
        if (dropdown && wrapper) {
            const isActive = dropdown.classList.contains('active');
            
            // Se não estava ativo, abre agora
            if (!isActive) {
                dropdown.classList.add('active');
                if (button) {
                    button.classList.add('active');
                    wrapper.classList.add('active');
                }
                
                // No mobile, move dropdown para dentro de chatbotMessages
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    const messagesContainer = document.getElementById('chatbotMessages');
                    if (messagesContainer && !messagesContainer.contains(dropdown)) {
                        // Salva referência ao wrapper original
                        dropdown.dataset.originalWrapper = category;
                        messagesContainer.appendChild(dropdown);
                    }
                }
                
                // Ajusta posicionamento
                setTimeout(() => {
                    this.ajustarPosicionamentoDropdown(dropdown, wrapper);
                }, 10);
                
                console.log('ChatBot: Dropdown aberto');
            } else {
                // Se já estava ativo, fecha
                dropdown.classList.remove('active');
                if (button) {
                    button.classList.remove('active');
                    wrapper.classList.remove('active');
                }
                
                // No mobile, move dropdown de volta para o lugar original
                const isMobile = window.innerWidth <= 768;
                if (isMobile && dropdown.dataset.originalWrapper) {
                    const messagesContainer = document.getElementById('chatbotMessages');
                    if (messagesContainer && messagesContainer.contains(dropdown)) {
                        // Encontra o wrapper original pela categoria
                        const originalCategory = dropdown.dataset.originalWrapper;
                        const button = document.querySelector(`.question-icon-btn[data-category="${originalCategory}"]`);
                        const originalWrapper = button ? button.closest('.question-icon-wrapper') : null;
                        if (originalWrapper) {
                            originalWrapper.appendChild(dropdown);
                            delete dropdown.dataset.originalWrapper;
                        }
                    }
                }
                
                console.log('ChatBot: Dropdown fechado');
            }
        } else {
            console.warn('ChatBot: Dropdown não encontrado para categoria:', category);
        }
    },
    
    ajustarPosicionamentoDropdown(dropdown, wrapper) {
        if (!dropdown || !wrapper) return;
        
        const viewportWidth = window.innerWidth;
        const isMobile = viewportWidth <= 768;
        
        if (isMobile) {
            // No mobile: move dropdown para dentro de chatbotMessages
            const messagesContainer = document.getElementById('chatbotMessages');
            if (!messagesContainer) return;
            
            if (!messagesContainer.contains(dropdown)) {
                // Move o dropdown para dentro do container de mensagens
                messagesContainer.appendChild(dropdown);
            }
            
            // Remove todas as classes e estilos de posicionamento
            dropdown.classList.remove('dropdown-left', 'dropdown-right', 'dropdown-top');
            
            // Dropdown como elemento normal do fluxo, centralizado
            dropdown.style.position = 'static';
            dropdown.style.top = 'auto';
            dropdown.style.bottom = 'auto';
            dropdown.style.left = 'auto';
            dropdown.style.right = 'auto';
            dropdown.style.transform = 'none';
            dropdown.style.zIndex = 'auto';
            dropdown.style.margin = '1rem auto';
            dropdown.style.maxWidth = `${Math.min(300, viewportWidth - 40)}px`;
            dropdown.style.width = 'auto';
            dropdown.style.display = 'flex';
            dropdown.style.flexDirection = 'column';
            dropdown.style.alignItems = 'center';
            dropdown.style.textAlign = 'center';
        } else {
            // Desktop/Tablet: mantém posicionamento relativo ao wrapper
            // Remove classes de posicionamento anteriores
            dropdown.classList.remove('dropdown-left', 'dropdown-right', 'dropdown-top');
            
            // Dropdown relativo ao wrapper, não fixo
            dropdown.style.position = 'absolute';
            dropdown.style.bottom = 'calc(100% + 10px)';
            dropdown.style.left = '50%';
            dropdown.style.right = 'auto';
            dropdown.style.transform = 'translateX(-50%)';
            dropdown.style.top = 'auto';
            dropdown.style.zIndex = '1000';
            dropdown.style.margin = '0';
        }
    },
    
    closeAllDropdowns() {
        const isMobile = window.innerWidth <= 768;
        
        document.querySelectorAll('.question-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
            
            // No mobile, move dropdown de volta para o lugar original
            if (isMobile && dropdown.dataset.originalWrapper) {
                const messagesContainer = document.getElementById('chatbotMessages');
                if (messagesContainer && messagesContainer.contains(dropdown)) {
                    // Encontra o wrapper original pela categoria salva
                    const originalCategory = dropdown.dataset.originalWrapper;
                    const button = document.querySelector(`.question-icon-btn[data-category="${originalCategory}"]`);
                    const originalWrapper = button ? button.closest('.question-icon-wrapper') : null;
                    if (originalWrapper) {
                        originalWrapper.appendChild(dropdown);
                        delete dropdown.dataset.originalWrapper;
                    }
                }
            }
        });
        
        // Remove estado ativo de todos os botões e wrappers
        document.querySelectorAll('.question-icon-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.question-icon-wrapper').forEach(wrapper => {
            wrapper.classList.remove('active');
        });
    },
    
    addUserMessage(text) {
        this.addMessage(text, 'user');
    },
    
    addBotMessage(text) {
        // Converte quebras de linha em <br>
        const formattedText = text.replace(/\n/g, '<br>');
        this.addMessage(formattedText, 'bot');
    },
    
    addMessage(text, type) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) {
            console.error('ChatBot: Container de mensagens não encontrado!');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        // Para mensagens do bot, centraliza
        if (type === 'bot') {
            messageDiv.style.display = 'flex';
            messageDiv.style.flexDirection = 'column';
            messageDiv.style.alignItems = 'center';
            messageDiv.style.justifyContent = 'center';
            messageDiv.style.width = '100%';
        }
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${text}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll para baixo
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
};

// Inicializa quando a página for exibida
function initChatBot() {
    console.log('initChatBot: Iniciando...');
    // Reseta a flag de inicialização para permitir reinicialização
    if (window.ChatBot) {
        window.ChatBot.initialized = false;
    }
    
    // Aguarda um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        const messagesContainer = document.getElementById('chatbotMessages');
        const questionButtons = document.querySelectorAll('.question-icon-btn');
        console.log('initChatBot: Verificando elementos...', {
            messagesContainer: !!messagesContainer,
            chatBot: !!window.ChatBot,
            questionButtons: questionButtons.length
        });
        
        if (messagesContainer && window.ChatBot) {
            console.log('initChatBot: Container encontrado, inicializando ChatBot...');
            window.ChatBot.init();
        } else {
            console.warn('initChatBot: Container ou ChatBot não encontrado! Tentando novamente...');
            // Tenta novamente após mais tempo
            setTimeout(() => {
                if (window.ChatBot) {
                    window.ChatBot.initialized = false;
                    window.ChatBot.init();
                }
            }, 500);
        }
    }, 500);
}

window.ChatBot = ChatBot;
window.initChatBot = initChatBot;


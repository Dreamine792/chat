// DOM Elements
const chatMessages = document.querySelector('.chat-messages');

// const chatInput = document.querySelector('.chat-input');
// const inputField = document.querySelector('.input-field input');
const contactStatus = document.querySelector('.contact-status');

// Variables to track message display
let currentMessageIndex = 0;
let typingIndicator = null;
let displayedMessages = [];
let userMessages = [];
// const STORAGE_KEY = 'whatsapp_chat_data';

// Payment configuration - Easy to modify
const PAYMENT_PRICE_MESSAGE = "The fee is only <strong>$19.90</strong>";
const PAYMENT_LINK = 'https://evolution2two.mycartpanda.com/checkout ';

// Function to show typing indicator
function showTypingIndicator() {
  if (typingIndicator) {
    return; // Already showing
  }
  
  // "typing..."
  contactStatus.textContent = 'typing...';
  
  typingIndicator = createTypingIndicator();
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to hide typing indicator
function hideTypingIndicator() {
  if (typingIndicator) {
    chatMessages.removeChild(typingIndicator);
    typingIndicator = null;
    
    // Retorna o status do contato para "online"
    contactStatus.textContent = 'online';
  }
}

// Função para criar os botões de resposta
function showResponseButtons(options) {
  // Se já existe uma área de botões, remova-a primeiro
  const existingButtons = document.querySelector('.response-buttons');
  if (existingButtons) {
    chatMessages.removeChild(existingButtons);
  }
  
  // Verificar se já temos mensagens do usuário que indicam que passou dessa etapa
  if (userMessages.length > 0 && options.includes("¡Sí, quiero descubrir a mi alma gemela!")) {
    // Se já temos mensagens do usuário e estamos tentando mostrar o botão inicial,
    // significa que já passamos dessa etapa e não devemos mostrar o botão novamente
    console.log("Usuário já passou da etapa inicial, não mostrando botão de novo");
    return;
  }
  
  // Criar a área de botões
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'response-buttons';
  
  // Adicionar cada botão de resposta
  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'response-button';
    button.textContent = option;
    
    // Evento de clique para o botão
    button.addEventListener('click', function() {
      // Criar mensagem enviada com o texto do botão
      const messageText = option;
      const currentTime = getCurrentTime();
      
      // Create sent message
      const messageEl = document.createElement('div');
      messageEl.className = 'message sent';
      
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      
      const messageTextEl = document.createElement('div');
      messageTextEl.className = 'message-text';
      messageTextEl.textContent = messageText;
      
      const messageTimeContainer = document.createElement('div');
      messageTimeContainer.className = 'message-time-container';
      
      const messageTime = document.createElement('span');
      messageTime.className = 'message-time';
      messageTime.textContent = currentTime;
      
      // Criar o ícone de duplo check como um span vazio
      const doubleCheck = document.createElement('span');
      doubleCheck.className = 'double-check';
      
      messageTimeContainer.appendChild(messageTime);
      messageTimeContainer.appendChild(doubleCheck);
      
      messageContent.appendChild(messageTextEl);
      messageContent.appendChild(messageTimeContainer);
      messageEl.appendChild(messageContent);
      
      // Add message to chat
      chatMessages.appendChild(messageEl);
      
      // Remover área de botões após clicar
      chatMessages.removeChild(buttonsContainer);
      
      // Armazenar a mensagem do usuário
      userMessages.push({
        content: messageText,
        time: currentTime
      });
      
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Aqui adicionamos a próxima mensagem do fluxo
      setTimeout(() => {
        // Mostrar o indicador de digitação
        showTypingIndicator();
        
        // Após um delay, mostrar a próxima mensagem
        setTimeout(() => {
          // Esconder o indicador de digitação
          hideTypingIndicator();
          
          // Criar e mostrar a próxima mensagem
          const nextMessageContent = "Perfect, I'll start with the first question that will reveal who your soulmate is. <strong>Can you tell me your name?</strong>";
          const nextTime = getCurrentTime();
          const messageEl = createTextMessage(nextMessageContent, nextTime, true);
          chatMessages.appendChild(messageEl);
          
          // Adicionar ao array displayedMessages 
          displayedMessages.push({
            type: 'text',
            content: nextMessageContent,
            time: nextTime,
            isHTML: true
          });
          // Removendo chamada ao saveChatData()
          
          // Rolar para baixo
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Mostrar o campo de entrada de texto para o nome após um pequeno delay
          setTimeout(() => {
            showNameInput();
          }, 500);
        }, 2000); // 2 segundos para simular a digitação
      }, 1000); // 1 segundo após a mensagem do usuário
    });
    
    buttonsContainer.appendChild(button);
  });
  
  // Adicionar os botões ao chat
  chatMessages.appendChild(buttonsContainer);
  
  // Rolar para baixo para mostrar os botões
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to display a message
function displayMessage(messageInfo) {
  // Check if we've already shown all messages
  if (currentMessageIndex >= messageData.length) {
    // Se todas as mensagens foram exibidas e não temos mensagens do usuário,
    // mostrar o botão de resposta inicial apenas se não houver mensagens do usuário
    if (userMessages.length === 0) {
      setTimeout(() => {
        showResponseButtons(["Yes, I want to discover my soulmate!"]);
      }, 1000);
    }
    return;
  }

  // Check if this message is already displayed (when reloading page)
  if (currentMessageIndex < displayedMessages.length) {
    // Skip showing this message as it should be already displayed
    currentMessageIndex++;
    
    // Continue to next message or show buttons if all messages displayed
    if (currentMessageIndex < messageData.length) {
      setTimeout(() => {
        displayMessage(messageData[currentMessageIndex]);
      }, 500); // Shorter delay for already displayed messages
    } else if (userMessages.length === 0) {
      // All messages displayed and no user messages yet, show response buttons
      setTimeout(() => {
        showResponseButtons(["Yes, I want to discover my soulmate!"]);
      }, 1000);
    }
    return;
  }
  
  // Verificar se devemos pular o indicador de digitação para esta mensagem
  if (messageInfo.skipTyping) {
    // Criar e mostrar a mensagem diretamente, sem mostrar o indicador de digitação
    let messageEl;
    const currentTime = getCurrentTime();
    
    switch (messageInfo.type) {
      case 'text':
        messageEl = createTextMessage(messageInfo.content, currentTime, messageInfo.isHTML);
        // Store displayed message
        displayedMessages.push({
          type: 'text',
          content: messageInfo.content,
          time: currentTime,
          isHTML: messageInfo.isHTML
        });
        break;
      // Outros casos podem ser adicionados aqui se necessário
    }
    
    // Add message to chat
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Removendo chamada ao saveChatData()
    
    // Display next message or show input if done
    currentMessageIndex++;
    if (currentMessageIndex < messageData.length) {
      setTimeout(() => {
        displayMessage(messageData[currentMessageIndex]);
      }, messageInfo.delay || 2000);
    } else if (userMessages.length === 0) {
      // All messages displayed and no user messages yet, show response buttons
      setTimeout(() => {
        showResponseButtons(["Yes, I want to discover my soulmate!"]);
      }, 1000);
    }
    return;
  }
  
  // Show typing indicator para mensagens normais
  showTypingIndicator();
  
  // Display message after typing delay (1-3 seconds)
  setTimeout(() => {
    // Hide typing indicator
    hideTypingIndicator();
    
    // Create message based on type
    let messageEl;
    const currentTime = getCurrentTime();
    
    switch (messageInfo.type) {
      case 'text':
        messageEl = createTextMessage(messageInfo.content, currentTime, messageInfo.isHTML);
        // Store displayed message
        displayedMessages.push({
          type: 'text',
          content: messageInfo.content,
          time: currentTime,
          isHTML: messageInfo.isHTML
        });
        break;
      case 'image':
        messageEl = createImageMessage(messageInfo.content, messageInfo.caption, currentTime);
        // Store displayed message
        displayedMessages.push({
          type: 'image',
          content: messageInfo.content,
          caption: messageInfo.caption,
          time: currentTime
        });
        break;
      case 'audio':
        messageEl = createAudioMessage(messageInfo.duration, currentTime, messageInfo.audioSrc);
        // Store displayed message
        displayedMessages.push({
          type: 'audio',
          duration: messageInfo.duration,
          audioSrc: messageInfo.audioSrc,
          time: currentTime
        });
        break;
      case 'link':
        messageEl = createLinkMessage(messageInfo.content, messageInfo.url, messageInfo.preview, currentTime);
        // Store displayed message
        displayedMessages.push({
          type: 'link',
          content: messageInfo.content,
          url: messageInfo.url,
          preview: messageInfo.preview,
          time: currentTime
        });
        break;
      default:
        messageEl = createTextMessage(messageInfo.content, currentTime);
        // Store displayed message
        displayedMessages.push({
          type: 'text',
          content: messageInfo.content,
          time: currentTime
        });
    }
    
    // Add message to chat
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Removendo chamada ao saveChatData()
    
    // Display next message or show response buttons if done
    currentMessageIndex++;
    if (currentMessageIndex < messageData.length) {
      setTimeout(() => {
        displayMessage(messageData[currentMessageIndex]);
      }, messageData[currentMessageIndex].delay);
    } else if (userMessages.length === 0) {
      // All messages displayed and no user messages yet, show response buttons
      setTimeout(() => {
        showResponseButtons(["Yes, I want to discover my soulmate!"]);
      }, 1000);
    }
  }, Math.random() * 1000 + 1000); // Random delay between 1-2 seconds to simulate typing
}

// Initialize the chat - start with the first message
document.addEventListener('DOMContentLoaded', () => {
  // Depuração para verificar se o evento está sendo acionado
  console.log('DOMContentLoaded event triggered');
  console.log('Current message index:', currentMessageIndex);
  console.log('Message data length:', messageData.length);
  
  // Adicionando listener para os botões de áudio
  // NOTA: Este handler só deve ser usado para áudios simulados (sem audioSrc)
  // Áudios reais são gerenciados pelo handler em messages.js
  document.addEventListener('click', function(e) {
    if (e.target.closest('.play-button')) {
      const playButton = e.target.closest('.play-button');
      
      // Se o botão tem um audioSrc, significa que é um áudio real
      // e já tem seu próprio handler em messages.js - não interferir
      if (playButton.dataset.audioSrc) {
        return; // Deixar o handler em messages.js cuidar disso
      }
      
      const progressBar = playButton.parentElement.querySelector('.audio-progress-filled');
      handleAudioPlayback(playButton, progressBar);
    }
  });
  
  // Removendo a chamada a loadChatData()
  
  // Iniciar exibindo a primeira mensagem
  console.log('No previous messages, starting new conversation');
  setTimeout(() => {
    displayMessage(messageData[currentMessageIndex]);
  }, 1000);
});

// Clear chat history - utility function for testing
window.clearChatHistory = function() {
  // Em caso de erro, limpar os dados corrompidos
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
};

// Handle audio player functionality
// NOTA: Este handler só deve ser usado para áudios simulados (sem audioSrc)
// Áudios reais são gerenciados pelo handler em messages.js
document.addEventListener('click', function(e) {
  // Delegated event handling for audio player controls
  if (e.target.closest('.play-button')) {
    const playButton = e.target.closest('.play-button');
    
    // Se o botão tem um audioSrc, significa que é um áudio real
    // e já tem seu próprio handler em messages.js - não interferir
    if (playButton.dataset.audioSrc) {
      return; // Deixar o handler em messages.js cuidar disso
    }
    
    const audioPlayer = playButton.closest('.audio-player');
    const progressBar = audioPlayer.querySelector('.audio-progress-filled');
    
    handleAudioPlayback(playButton, progressBar);
  }
});

// Handle simulated audio playback
// NOTA: Esta função só é usada para áudios simulados (sem audioSrc)
// Áudios reais são gerenciados pelo handler em messages.js
function handleAudioPlayback(playButton, progressBar) {
  const isPlaying = playButton.classList.contains('playing');
  
  // Toggle play/pause
  if (isPlaying) {
    // Pausar áudio - parar a animação mas NÃO resetar a barra
    playButton.classList.remove('playing');
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    
    // Cancelar qualquer animação ativa
    if (playButton.dataset.animationId) {
      cancelAnimationFrame(playButton.dataset.animationId);
      delete playButton.dataset.animationId;
    }
    
    // Limpar intervalos se existirem
    if (playButton.dataset.intervalId) {
      clearInterval(playButton.dataset.intervalId);
      delete playButton.dataset.intervalId;
    }
  } else {
    // Reproduzir áudio - resetar barra para o início antes de começar
    playButton.classList.add('playing');
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Resetar a barra de progresso para o início
    progressBar.style.width = '0%';
    
    // Buscar a duração do áudio em segundos
    const audioMessage = playButton.closest('.audio-player');
    const durationText = audioMessage ? audioMessage.querySelector('.audio-duration').textContent : '0:00';
    
    // Converter a duração (por exemplo, "0:23") para segundos
    let totalSeconds = 0;
    if (durationText) {
      const parts = durationText.split(':');
      if (parts.length === 2) {
        totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
    }
    
    // Se não conseguir obter a duração, usar um valor padrão
    if (totalSeconds <= 0) {
      totalSeconds = 30; // Padrão de 30 segundos
    }
    
    // Definir a duração total em milissegundos
    const totalDuration = totalSeconds * 1000;
    
    // Usar requestAnimationFrame para uma animação mais suave
    let animationId;
    const startTime = Date.now();
    
    const updateProgress = () => {
      // Verificar se ainda está tocando antes de atualizar
      if (!playButton.classList.contains('playing')) {
        cancelAnimationFrame(animationId);
        delete playButton.dataset.animationId;
        return;
      }
      
      // Calcular o tempo decorrido desde o início
      const elapsed = Date.now() - startTime;
      
      // Calcular o progresso com base no tempo decorrido
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Atualizar a largura da barra de progresso
      progressBar.style.width = `${progress * 100}%`;
      
      // Verificar se a reprodução terminou
      if (progress >= 1) {
        cancelAnimationFrame(animationId);
        delete playButton.dataset.animationId;
        playButton.classList.remove('playing');
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.style.width = '0%';
      } else {
        // Continuar a animação
        animationId = requestAnimationFrame(updateProgress);
        playButton.dataset.animationId = animationId;
      }
    };
    
    // Iniciar a animação
    animationId = requestAnimationFrame(updateProgress);
    playButton.dataset.animationId = animationId;
  }
}

// Comentando os event listeners relacionados aos elementos removidos do HTML
/*
// Handle sending messages
inputField.addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && inputField.value.trim() !== '') {
    const messageText = inputField.value.trim();
    const currentTime = getCurrentTime();
    
    // Create sent message
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTextEl = document.createElement('div');
    messageTextEl.className = 'message-text';
    messageTextEl.textContent = messageText;
    
    const messageTimeContainer = document.createElement('div');
    messageTimeContainer.className = 'message-time-container';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;
    
    // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
    const doubleCheck = document.createElement('span');
    doubleCheck.className = 'double-check';
    
    messageTimeContainer.appendChild(messageTime);
    messageTimeContainer.appendChild(doubleCheck);
    
    messageContent.appendChild(messageTextEl);
    messageContent.appendChild(messageTimeContainer);
    messageEl.appendChild(messageContent);
    
    // Add message to chat
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Store user message
    userMessages.push({
      content: messageText,
      time: currentTime
    });
    
    // Save to local storage
    saveChatData();
    
    // Clear input
    inputField.value = '';
  }
});

// Handle attachment button
const attachmentButton = document.querySelector('.attachment-button');
attachmentButton.addEventListener('click', function() {
  alert('Attachment feature would open here!');
});

// Handle emoji button
const emojiButton = document.querySelector('.emoji-button');
emojiButton.addEventListener('click', function() {
  alert('Emoji picker would open here!');
});

// Handle voice button
const voiceButton = document.querySelector('.voice-button');
voiceButton.addEventListener('click', function() {
  alert('Voice recording would start here!');
});
*/

// Função para criar um campo de entrada de texto para o nome
function showNameInput() {
  // Se já existe um campo, remova-o primeiro
  const existingInput = document.querySelector('.name-input-container');
  if (existingInput) {
    chatMessages.removeChild(existingInput);
  }
  
  // Criar o container do input
  const inputContainer = document.createElement('div');
  inputContainer.className = 'name-input-container';
  
  // Criar o campo de entrada
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter your name...';
  input.className = 'name-input';
  
  // Criar o botão de envio
  const sendButton = document.createElement('button');
  sendButton.className = 'name-send-button';
  sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
  
  // Adicionar evento de clique no botão de envio
  sendButton.addEventListener('click', function() {
    sendNameResponse(input.value);
  });
  
  // Adicionar evento de tecla no campo de entrada
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendNameResponse(input.value);
    }
  });
  
  // Adicionar os elementos ao container
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  
  // Adicionar o container ao chat
  chatMessages.appendChild(inputContainer);
  
  // Focar no campo de entrada e rolar para garantir visibilidade
  setTimeout(() => {
    input.focus();
    
    // Usar a função de rolagem automática
    if (window.scrollToInputOnFocus) {
      window.scrollToInputOnFocus(input);
    } else {
      // Fallback para o comportamento antigo
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 100);
}

// Função para enviar a resposta do nome
function sendNameResponse(name) {
  // Verificar se o nome foi digitado
  if (!name || name.trim() === '') {
    return;
  }
  
  // Obter o valor limpo
  const nameText = name.trim();
  const currentTime = getCurrentTime();
  
  // Remover o campo de entrada
  const inputContainer = document.querySelector('.name-input-container');
  if (inputContainer) {
    chatMessages.removeChild(inputContainer);
  }
  
  // Criar mensagem enviada com o nome
  const messageEl = document.createElement('div');
  messageEl.className = 'message sent';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageTextEl = document.createElement('div');
  messageTextEl.className = 'message-text';
  messageTextEl.textContent = nameText;
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = currentTime;
  
  // Criar o ícone de duplo check
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTextEl);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Adicionar mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Armazenar a mensagem do usuário
  userMessages.push({
    content: nameText,
    time: currentTime
  });
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Armazenar o nome para uso futuro
  const userName = nameText;
  
  // Exibir a próxima mensagem com o nome do usuário
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Criar e mostrar a próxima mensagem, substituindo {{NOME}} pelo nome do usuário
      const nextMessageContent = `Amazing, <strong>${userName}</strong>. Right after you told me your name, I could already see a blurry image of a man...`;
      const currentTime = getCurrentTime();
      const messageEl = createTextMessage(nextMessageContent, currentTime, true);
      chatMessages.appendChild(messageEl);
      
      // Adicionar ao array displayedMessages 
      displayedMessages.push({
        type: 'text',
        content: nextMessageContent,
        time: currentTime,
        isHTML: true
      });
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar a próxima mensagem do fluxo após um delay
      setTimeout(() => {
        // Mostrar o indicador de digitação
        showTypingIndicator();
        
        // Após um delay, mostrar a próxima mensagem
        setTimeout(() => {
          // Esconder o indicador de digitação
          hideTypingIndicator();
          
          // Criar e mostrar a próxima mensagem
          const message1Content = "This means that your soulmate is someone <strong>very close to you, or someone you are about to interact with in the coming days</strong>🙏🔮<br><br>Let's continue...";
          const currentTime1 = getCurrentTime();
          const message1El = createTextMessage(message1Content, currentTime1, true);
          chatMessages.appendChild(message1El);
          
          // Adicionar ao array displayedMessages 
          displayedMessages.push({
            type: 'text',
            content: message1Content,
            time: currentTime1,
            isHTML: true
          });
          // Removendo chamada ao saveChatData()
          
          // Rolar para baixo
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Mostrar a próxima mensagem do fluxo após outro delay
          setTimeout(() => {
            // Mostrar o indicador de digitação
            showTypingIndicator();
            
            // Após um delay, mostrar a próxima mensagem
            setTimeout(() => {
              // Esconder o indicador de digitação
              hideTypingIndicator();
              
              // Criar e mostrar a próxima mensagem
              const message2Content = "But before we proceed, let me explain how the procedure works so that we can begin your drawing.";
              const currentTime2 = getCurrentTime();
              const message2El = createTextMessage(message2Content, currentTime2, false);
              chatMessages.appendChild(message2El);
              
              // Adicionar ao array displayedMessages 
              displayedMessages.push({
                type: 'text',
                content: message2Content,
                time: currentTime2,
                isHTML: false
              });
              // Removendo chamada ao saveChatData()
              
              // Rolar para baixo
              chatMessages.scrollTop = chatMessages.scrollHeight;
              
              // Mostrar a mensagem de áudio após outro delay
              setTimeout(() => {
                // Mostrar o indicador de digitação
                showTypingIndicator();
                
                // Após um delay, mostrar a mensagem de áudio
                setTimeout(() => {
                  // Esconder o indicador de digitação
                  hideTypingIndicator();
                  
                  // Criar e mostrar a mensagem de áudio
                  const currentTime3 = getCurrentTime();
                  const audioEl = createAudioMessage("0:18", currentTime3, "assets/1.mp3");
                  chatMessages.appendChild(audioEl);
                  
                  // Adicionar ao array displayedMessages 
                  displayedMessages.push({
                    type: 'audio',
                    duration: "0:17",
                    audioSrc: "assets/1.mp3",
                    time: currentTime3
                  });
                  // Removendo chamada ao saveChatData()
                  
                  // Rolar para baixo
                  chatMessages.scrollTop = chatMessages.scrollHeight;
                  
                  // Reproduzir o áudio automaticamente após um pequeno delay
                  setTimeout(() => {
                    // Encontrar o botão de play do áudio e simular o clique
                    const playButton = audioEl.querySelector('.play-button');
                    if (playButton) {
                      playButton.click();
                    }
                    
                    // Mostrar a próxima mensagem após 17 segundos (duração completa do áudio)
                    setTimeout(() => {
                      // Mostrar o indicador de digitação
                      showTypingIndicator();
                      
                      // Após um delay, mostrar a próxima mensagem
                      setTimeout(() => {
                        // Esconder o indicador de digitação
                        hideTypingIndicator();
                        
                        // Criar e mostrar a próxima mensagem
                        const nextMessageContent = "<strong>Can I start with the questions?</strong> Remember not to cross your legs or arms…";
                        const currentTime4 = getCurrentTime();
                        const messageEl = createTextMessage(nextMessageContent, currentTime4, true);
                        chatMessages.appendChild(messageEl);
                        
                        // Adicionar ao array displayedMessages 
                        displayedMessages.push({
                          type: 'text',
                          content: nextMessageContent,
                          time: currentTime4,
                          isHTML: true
                        });
                        // Removendo chamada ao saveChatData()
                        
                        // Rolar para baixo
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                        
                        // Mostrar botão de resposta após a mensagem
                        setTimeout(() => {
                          showResponseButtons(["Yes, I am ready"]);
                          
                          // Ajustar o comportamento do botão de resposta específico para o áudio
                          const responseButton = document.querySelector('.response-button');
                          if (responseButton) {
                            // Substituir o event listener existente
                            const newButton = responseButton.cloneNode(true);
                            responseButton.parentNode.replaceChild(newButton, responseButton);
                            
                            // Adicionar novo event listener
                            newButton.addEventListener('click', function() {
                              // Remover os botões
                              const buttonsContainer = document.querySelector('.response-buttons');
                              if (buttonsContainer) {
                                chatMessages.removeChild(buttonsContainer);
                              }
                              
                              // Processar a resposta
                              processAudioResponse("Yes, I am ready");
                            });
                          }
                        }, 1000);
                      }, 2000); // 2 segundos para simular a digitação
                    }, 17000); // 17 segundos após o início do áudio
                  }, 1000); // 1 segundo após a exibição do áudio
                }, 2000); // 2 segundos para simular a digitação
              }, 2000); // 2 segundos após a mensagem anterior
            }, 2000); // 2 segundos para simular a digitação
          }, 2000); // 2 segundos após a mensagem anterior
        }, 2000); // 2 segundos para simular a digitação
      }, 2000); // 2 segundos após a mensagem personalizada com o nome
    }, 2000); // 2 segundos para simular a digitação
  }, 1000); // 1 segundo após a mensagem do usuário
}

// Função para processar a resposta após ouvir o áudio
function processAudioResponse(responseText) {
  // Obter a hora atual
  const currentTime = getCurrentTime();
  
  // Criar mensagem enviada com o texto da resposta
  const messageEl = document.createElement('div');
  messageEl.className = 'message sent';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageTextEl = document.createElement('div');
  messageTextEl.className = 'message-text';
  messageTextEl.textContent = responseText;
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = currentTime;
  
  // Criar o ícone de duplo check
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTextEl);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Adicionar mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Armazenar a mensagem do usuário
  userMessages.push({
    content: responseText,
    time: currentTime
  });
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Próxima mensagem após o botão "Sí, estoy listo" (usando delay normal)
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Mostrar a mensagem sobre o signo
      const nextMessageContent = "What is your sign?";
      const currentTime = getCurrentTime();
      const messageEl = createTextMessage(nextMessageContent, currentTime, false);
      chatMessages.appendChild(messageEl);
      
      // Adicionar ao array displayedMessages 
      displayedMessages.push({
        type: 'text',
        content: nextMessageContent,
        time: currentTime,
        isHTML: false
      });
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar o campo de entrada para o signo após um pequeno delay
      setTimeout(() => {
        showSignInput();
      }, 500);
    }, 2000); // 2 segundos para simular a digitação
  }, 1000); // 1 segundo após a resposta do usuário (delay normal)
}

// Cria uma função helper para facilitar a criação e salvamento de mensagens
function createAndSaveMessage(content, isHTML = false, type = 'text', extraParams = {}) {
  const currentTime = getCurrentTime();
  let messageEl;
  let messageData = {
    type: type,
    time: currentTime,
    ...extraParams
  };
  
  // Cria a mensagem de acordo com o tipo
  switch (type) {
    case 'text':
      messageEl = createTextMessage(content, currentTime, isHTML);
      messageData.content = content;
      messageData.isHTML = isHTML;
      break;
    case 'image':
      messageEl = createImageMessage(content, extraParams.caption, currentTime);
      messageData.content = content;
      messageData.caption = extraParams.caption;
      break;
    case 'audio':
      messageEl = createAudioMessage(extraParams.duration, currentTime, content);
      messageData.audioSrc = content;
      messageData.duration = extraParams.duration;
      break;
    case 'link':
      messageEl = createLinkMessage(content, extraParams.url, extraParams.preview, currentTime);
      messageData.content = content;
      messageData.url = extraParams.url;
      messageData.preview = extraParams.preview;
      break;
  }
  
  // Adiciona a mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Adiciona ao array displayedMessages e salva no localStorage
  displayedMessages.push(messageData);
  saveChatData();
  
  // Rola para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  return messageEl;
}

// Função para criar um campo de entrada para o signo
function showSignInput() {
  // Se já existe um campo, remova-o primeiro
  const existingInput = document.querySelector('.sign-input-container');
  if (existingInput) {
    chatMessages.removeChild(existingInput);
  }
  
  // Criar o container do input
  const inputContainer = document.createElement('div');
  inputContainer.className = 'sign-input-container name-input-container'; // Reutilizando os estilos do name-input
  
  // Criar o campo de entrada
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Write your zodiac sign...';
  input.className = 'sign-input name-input'; // Reutilizando os estilos do name-input
  
  // Criar o botão de envio
  const sendButton = document.createElement('button');
  sendButton.className = 'sign-send-button name-send-button'; // Reutilizando os estilos do name-send-button
  sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
  
  // Adicionar evento de clique no botão de envio
  sendButton.addEventListener('click', function() {
    sendSignResponse(input.value);
  });
  
  // Adicionar evento de tecla no campo de entrada
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendSignResponse(input.value);
    }
  });
  
  // Adicionar os elementos ao container
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  
  // Adicionar o container ao chat
  chatMessages.appendChild(inputContainer);
  
  // Focar no campo de entrada e rolar para garantir visibilidade
  setTimeout(() => {
    input.focus();
    
    // Usar a função de rolagem automática
    if (window.scrollToInputOnFocus) {
      window.scrollToInputOnFocus(input);
    } else {
      // Fallback para o comportamento antigo
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 100);
}

// Função para enviar a resposta do signo
function sendSignResponse(sign) {
  // Verificar se o signo foi digitado
  if (!sign || sign.trim() === '') {
    return;
  }
  
  // Obter o valor limpo
  const signText = sign.trim();
  const currentTime = getCurrentTime();
  
  // Remover o campo de entrada
  const inputContainer = document.querySelector('.sign-input-container');
  if (inputContainer) {
    chatMessages.removeChild(inputContainer);
  }
  
  // Criar mensagem enviada com o signo
  const messageEl = document.createElement('div');
  messageEl.className = 'message sent';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageTextEl = document.createElement('div');
  messageTextEl.className = 'message-text';
  messageTextEl.textContent = signText;
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = currentTime;
  
  // Criar o ícone de duplo check
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTextEl);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Adicionar mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Armazenar a mensagem do usuário
  userMessages.push({
    content: signText,
    time: currentTime
  });
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Encontrar o nome do usuário (corrigindo a lógica para obter o nome correto)
  let userName = ""; // Valor padrão caso não encontre
  
  // Procurar nas mensagens do usuário por um nome
  // O nome do usuário geralmente é a segunda mensagem do usuário
  // A primeira mensagem é a resposta do botão inicial "¡Sí, quiero descubrir a mi alma gemela!"
  if (userMessages.length > 1) {
    userName = userMessages[1].content;
  }
  
  // Armazenar o índice onde o signo foi salvo para uso futuro
  const signIndex = userMessages.length - 1;
  // Armazenar o signo diretamente em uma variável global para facilitar acesso
  window.userSignData = {
    content: signText,
    index: signIndex
  };
  
  // Exibir a próxima mensagem mencionando o nome e o signo
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Criar e mostrar a mensagem personalizada com nome e signo
      const nextMessageContent = `What a coincidence, <strong>${userName}</strong>, I am also <strong>${signText}</strong>.`;
      const currentTime = getCurrentTime();
      const messageEl = createTextMessage(nextMessageContent, currentTime, true);
      chatMessages.appendChild(messageEl);
      
      // Adicionar ao array displayedMessages 
      displayedMessages.push({
        type: 'text',
        content: nextMessageContent,
        time: currentTime,
        isHTML: true
      });
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar a próxima mensagem - Data de Nascimento
      setTimeout(() => {
        // Mostrar o indicador de digitação
        showTypingIndicator();
        
        // Após um delay, mostrar a próxima mensagem
        setTimeout(() => {
          // Esconder o indicador de digitação
          hideTypingIndicator();
          
          // Criar e mostrar a próxima mensagem
          const birthdateMessageContent = "What is your date of birth?";
          const currentTime2 = getCurrentTime();
          const birthdateMessageEl = createTextMessage(birthdateMessageContent, currentTime2, false);
          chatMessages.appendChild(birthdateMessageEl);
          
          // Adicionar ao array displayedMessages 
          displayedMessages.push({
            type: 'text',
            content: birthdateMessageContent,
            time: currentTime2,
            isHTML: false
          });
          // Removendo chamada ao saveChatData()
          
          // Rolar para baixo
          chatMessages.scrollTop = chatMessages.scrollHeight;
          
          // Mostrar o campo de entrada para a data de nascimento
          setTimeout(() => {
            showBirthdateInput();
          }, 500);
        }, 2000); // 2 segundos para simular a digitação
      }, 2000); // 2 segundos após a mensagem personalizada
    }, 2000); // 2 segundos para simular a digitação
  }, 1000); // 1 segundo após a resposta do usuário
}

// Função para criar um campo de entrada para a data de nascimento
function showBirthdateInput() {
  // Se já existe um campo, remova-o primeiro
  const existingInput = document.querySelector('.birthdate-input-container');
  if (existingInput) {
    chatMessages.removeChild(existingInput);
  }
  
  // Criar o container do input
  const inputContainer = document.createElement('div');
  inputContainer.className = 'birthdate-input-container name-input-container'; // Reutilizando os estilos
  
  // Criar o campo de entrada
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Example: 03/15/1990';
  input.className = 'birthdate-input name-input'; // Reutilizando os estilos
  
  // Criar o botão de envio
  const sendButton = document.createElement('button');
  sendButton.className = 'birthdate-send-button name-send-button'; // Reutilizando os estilos
  sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
  
  // Adicionar evento de clique no botão de envio
  sendButton.addEventListener('click', function() {
    sendBirthdateResponse(input.value);
  });
  
  // Adicionar evento de tecla no campo de entrada
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendBirthdateResponse(input.value);
    }
  });
  
  // Adicionar os elementos ao container
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  
  // Adicionar o container ao chat
  chatMessages.appendChild(inputContainer);
  
  // Focar no campo de entrada e rolar para garantir visibilidade
  setTimeout(() => {
    input.focus();
    
    // Usar a função de rolagem automática
    if (window.scrollToInputOnFocus) {
      window.scrollToInputOnFocus(input);
    } else {
      // Fallback para o comportamento antigo
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 100);
}

// Função para enviar a resposta da data de nascimento
function sendBirthdateResponse(birthdate) {
  // Verificar se a data foi digitada
  if (!birthdate || birthdate.trim() === '') {
    return;
  }
  
  // Obter o valor limpo
  const birthdateText = birthdate.trim();
  const currentTime = getCurrentTime();
  
  // Remover o campo de entrada
  const inputContainer = document.querySelector('.birthdate-input-container');
  if (inputContainer) {
    chatMessages.removeChild(inputContainer);
  }
  
  // Criar mensagem enviada com a data
  const messageEl = document.createElement('div');
  messageEl.className = 'message sent';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageTextEl = document.createElement('div');
  messageTextEl.className = 'message-text';
  messageTextEl.textContent = birthdateText;
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = currentTime;
  
  // Criar o ícone de duplo check
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTextEl);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Adicionar mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Armazenar a mensagem do usuário
  userMessages.push({
    content: birthdateText,
    time: currentTime
  });
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Mostrar a próxima mensagem - Hora de Nascimento
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Criar e mostrar a próxima mensagem
      const birthtimeMessageContent = "What time were you born? If you don't know the exact time, that's okay...";
      const currentTime = getCurrentTime();
      const birthtimeMessageEl = createTextMessage(birthtimeMessageContent, currentTime, false);
      chatMessages.appendChild(birthtimeMessageEl);
      
      // Adicionar ao array displayedMessages 
      displayedMessages.push({
        type: 'text',
        content: birthtimeMessageContent,
        time: currentTime,
        isHTML: false
      });
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar o campo de entrada para a hora de nascimento
      setTimeout(() => {
        showBirthtimeInput();
      }, 500);
    }, 2000); // 2 segundos para simular a digitação
  }, 1000); // 1 segundo após a resposta do usuário
}

// Função para criar um campo de entrada para a hora de nascimento
function showBirthtimeInput() {
  // Se já existe um campo, remova-o primeiro
  const existingInput = document.querySelector('.birthtime-input-container');
  if (existingInput) {
    chatMessages.removeChild(existingInput);
  }
  
  // Criar o container do input
  const inputContainer = document.createElement('div');
  inputContainer.className = 'birthtime-input-container name-input-container'; // Reutilizando os estilos
  
  // Criar o campo de entrada
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Example: 15:30';
  input.className = 'birthtime-input name-input'; // Reutilizando os estilos
  
  // Criar o botão de envio
  const sendButton = document.createElement('button');
  sendButton.className = 'birthtime-send-button name-send-button'; // Reutilizando os estilos
  sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
  
  // Adicionar evento de clique no botão de envio
  sendButton.addEventListener('click', function() {
    sendBirthtimeResponse(input.value);
  });
  
  // Adicionar evento de tecla no campo de entrada
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendBirthtimeResponse(input.value);
    }
  });
  
  // Adicionar os elementos ao container
  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);
  
  // Adicionar o container ao chat
  chatMessages.appendChild(inputContainer);
  
  // Focar no campo de entrada e rolar para garantir visibilidade
  setTimeout(() => {
    input.focus();
    
    // Usar a função de rolagem automática
    if (window.scrollToInputOnFocus) {
      window.scrollToInputOnFocus(input);
    } else {
      // Fallback para o comportamento antigo
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 100);
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para enviar a resposta da hora de nascimento
function sendBirthtimeResponse(birthtime) {
  // Verificar se a hora foi digitada
  if (!birthtime || birthtime.trim() === '') {
    return;
  }
  
  // Obter o valor limpo
  const birthtimeText = birthtime.trim();
  const currentTime = getCurrentTime();
  
  // Remover o campo de entrada
  const inputContainer = document.querySelector('.birthtime-input-container');
  if (inputContainer) {
    chatMessages.removeChild(inputContainer);
  }
  
  // Criar mensagem enviada com a hora
  const messageEl = document.createElement('div');
  messageEl.className = 'message sent';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageTextEl = document.createElement('div');
  messageTextEl.className = 'message-text';
  messageTextEl.textContent = birthtimeText;
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = currentTime;
  
  // Criar o ícone de duplo check
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTextEl);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Adicionar mensagem ao chat
  chatMessages.appendChild(messageEl);
  
  // Armazenar a mensagem do usuário
  userMessages.push({
    content: birthtimeText,
    time: currentTime
  });
  
  // Rolar para baixo
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Mostrar a mensagem final sobre vida amorosa
  setTimeout(() => {
    // Mostrar o indicador de digitação
    showTypingIndicator();
    
    // Após um delay, mostrar a próxima mensagem
    setTimeout(() => {
      // Esconder o indicador de digitação
      hideTypingIndicator();
      
      // Criar e mostrar a mensagem final
      const loveLifeMessageContent = "And lastly, how is your love life going?";
      const currentTime = getCurrentTime();
      const loveLifeMessageEl = createTextMessage(loveLifeMessageContent, currentTime, false);
      chatMessages.appendChild(loveLifeMessageEl);
      
      // Adicionar ao array displayedMessages 
      displayedMessages.push({
        type: 'text',
        content: loveLifeMessageContent,
        time: currentTime,
        isHTML: false
      });
      // Removendo chamada ao saveChatData()
      
      // Rolar para baixo
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Mostrar os botões com as opções de vida amorosa após um pequeno delay
      setTimeout(() => {
        const loveLifeOptions = [
          "I am in a serious relationship.",
          "I'm getting to know or talking to someone.",
          "I am single at the moment!"
        ];
        showLoveLifeOptions(loveLifeOptions);
      }, 1000);
    }, 2000); // 2 segundos para simular a digitação
  }, 1000);
}

// Função para mostrar as opções de vida amorosa
function showLoveLifeOptions(options) {
  // Se já existe uma área de botões, remova-a primeiro
  const existingButtons = document.querySelector('.response-buttons');
  if (existingButtons) {
    chatMessages.removeChild(existingButtons);
  }
  
  // Criar a área de botões
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'response-buttons';
  
  // Adicionar cada botão de resposta
  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'response-button';
    button.textContent = option;
    
    // Evento de clique para o botão
    button.addEventListener('click', function() {
      // Remover os botões
      chatMessages.removeChild(buttonsContainer);
      
      // Processar a resposta escolhida
      processLoveLifeResponse(option);
    });
    
    buttonsContainer.appendChild(button);
  });
  
  // Adicionar os botões ao chat
  chatMessages.appendChild(buttonsContainer);
  
  // Rolar para baixo para mostrar os botões
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para processar a resposta sobre vida amorosa
function processLoveLifeResponse(response) {
    // Esconder os botões
    const responseOptions = document.getElementById('response-options');
    if (responseOptions) {
        responseOptions.innerHTML = '';
        responseOptions.style.display = 'none';
    }
    
    // Obter a hora atual
    const currentTime = getCurrentTime();
    
    // Criar mensagem enviada com o texto da resposta
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTextEl = document.createElement('div');
    messageTextEl.className = 'message-text';
    messageTextEl.textContent = response;
    
    const messageTimeContainer = document.createElement('div');
    messageTimeContainer.className = 'message-time-container';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;
    
    // Criar o ícone de duplo check
    const doubleCheck = document.createElement('span');
    doubleCheck.className = 'double-check';
    
    messageTimeContainer.appendChild(messageTime);
    messageTimeContainer.appendChild(doubleCheck);
    
    messageContent.appendChild(messageTextEl);
    messageContent.appendChild(messageTimeContainer);
    messageEl.appendChild(messageContent);
    
    // Adicionar mensagem ao chat
    chatMessages.appendChild(messageEl);
    
    // Armazenar a mensagem do usuário
    userMessages.push({
        content: response,
        time: currentTime
    });
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Obter dados do usuário para personalização das mensagens
    const userName = userMessages.length > 1 ? userMessages[1].content : '';
    const userSign = window.userSignData ? window.userSignData.content : 'your zodiac sign';
    
    // Determinar mensagens baseadas na resposta do usuário
    const isSingle = response === "I am single at the moment!";
    const isInRelationship = response === "I am in a serious relationship." || response === "I'm getting to know or talking to someone.";
    
    // Definir mensagens condicionais
    let botResponse, botResponse2;
    
    if (isSingle) {
        // Respostas para usuário solteiro
        botResponse = `Then you're single, <strong>${userName}</strong>!`;
        botResponse2 = `It's very rare to find a <strong>${userSign}</strong> single. I feel like you have such a good heart...`;
    } else if (isInRelationship) {
        // Respostas para usuário em relacionamento ou conhecendo alguém
        botResponse = "I'm glad to hear that things are going well in your life.";
        botResponse2 = `Generally, <strong>${userSign}</strong> individuals tend to be lucky in relationships, and you seem to be one of them.`;
    } else {
        // Fallback caso não corresponda a nenhuma opção
        botResponse = "I'm glad to hear that things are going well in your life.";
        botResponse2 = `Generally, <strong>${userSign}</strong> individuals tend to be lucky in relationships, and you seem to be one of them.`;
    }
    
    // Delay para resposta do bot
    setTimeout(() => {
        showTypingIndicator();
        
        // Enviar mensagem após um certo tempo
        setTimeout(() => {
            hideTypingIndicator();
            const currentTime = getCurrentTime();
            // Primeira mensagem usa HTML apenas se for solteiro (tem <strong>), senão é texto simples
            const messageEl = createTextMessage(botResponse, currentTime, isSingle);
            chatMessages.appendChild(messageEl);
            
            // Adicionar ao array displayedMessages 
            displayedMessages.push({
              type: 'text',
              content: botResponse,
              time: currentTime,
              isHTML: isSingle
            });
            // Removendo chamada ao saveChatData()
            
            // Segunda mensagem
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    const currentTime2 = getCurrentTime();
                    const messageEl2 = createTextMessage(botResponse2, currentTime2, true);
                    chatMessages.appendChild(messageEl2);
                    
                    // Adicionar ao array displayedMessages 
                    displayedMessages.push({
                      type: 'text',
                      content: botResponse2,
                      time: currentTime2,
                      isHTML: true
                    });
                    // Removendo chamada ao saveChatData()
                    
                    // Áudio mensagem
                    setTimeout(() => {
                        showTypingIndicator();
                        
                        setTimeout(() => {
                            hideTypingIndicator();
                            const currentTime3 = getCurrentTime();
                            const audioEl = createAudioMessage("0:21", currentTime3, "assets/2.mp3");
                            chatMessages.appendChild(audioEl);
                            
                            // Adicionar ao array displayedMessages 
                            displayedMessages.push({
                              type: 'audio',
                              duration: "0:21",
                              audioSrc: "assets/2.mp3",
                              time: currentTime3
                            });
                            // Removendo chamada ao saveChatData()
                            
                            // Reproduzir o áudio automaticamente após um pequeno delay
                            setTimeout(() => {
                                // Encontrar o botão de play do áudio e simular o clique
                                const playButton = audioEl.querySelector('.play-button');
                                if (playButton) {
                                    playButton.click();
                                }
                                
                                // Última mensagem
                                setTimeout(() => {
                                    showTypingIndicator();
                                    
                                    setTimeout(() => {
                                        hideTypingIndicator();
                                        const botResponse3 = `One day, these women were also where you are, talking to me...<br><br>And after some time, they sent me these photos 👇`;
                                        const currentTime4 = getCurrentTime();
                                        const messageEl3 = createTextMessage(botResponse3, currentTime4, true);
                                        chatMessages.appendChild(messageEl3);
                                        
                                        // Adicionar ao array displayedMessages 
                                        displayedMessages.push({
                                          type: 'text',
                                          content: botResponse3,
                                          time: currentTime4,
                                          isHTML: true
                                        });
                                        // Removendo chamada ao saveChatData()
                                        
                                        // Primeira imagem com texto explicativo
                                        setTimeout(() => {
                                            showTypingIndicator();
                                            
                                            setTimeout(() => {
                                                hideTypingIndicator();
                                                const currentTime5 = getCurrentTime();
                                                const imageEl1 = createImageMessage("assets/img-1.webp", null, currentTime5);
                                                chatMessages.appendChild(imageEl1);
                                                
                                                // Adicionar ao array displayedMessages 
                                                displayedMessages.push({
                                                  type: 'image',
                                                  content: "assets/img-1.webp",
                                                  caption: null,
                                                  time: currentTime5
                                                });
                                                // Removendo chamada ao saveChatData()
                                                
                                                setTimeout(() => {
                                                    showTypingIndicator();
                                                    
                                                    setTimeout(() => {
                                                        hideTypingIndicator();
                                                        const imageText1 = "This is Mayara. She also asked me to reveal the name and traits of the person in the drawing!";
                                                        const currentTime6 = getCurrentTime();
                                                        const textMessageEl1 = createTextMessage(imageText1, currentTime6, false);
                                                        chatMessages.appendChild(textMessageEl1);
                                                        
                                                        // Adicionar ao array displayedMessages 
                                                        displayedMessages.push({
                                                          type: 'text',
                                                          content: imageText1,
                                                          time: currentTime6,
                                                          isHTML: false
                                                        });
                                                        // Removendo chamada ao saveChatData()
                                                        
                                                        // Segunda imagem com texto explicativo
                                                        setTimeout(() => {
                                                            showTypingIndicator();
                                                            
                                                            setTimeout(() => {
                                                                hideTypingIndicator();
                                                                const currentTime7 = getCurrentTime();
                                                                const imageEl2 = createImageMessage("assets/img-2.webp", null, currentTime7);
                                                                chatMessages.appendChild(imageEl2);
                                                                
                                                                // Adicionar ao array displayedMessages 
                                                                displayedMessages.push({
                                                                  type: 'image',
                                                                  content: "assets/img-2.webp",
                                                                  caption: null,
                                                                  time: currentTime7
                                                                });
                                                                // Removendo chamada ao saveChatData()
                                                                
                                                                setTimeout(() => {
                                                                    showTypingIndicator();
                                                                    
                                                                    setTimeout(() => {
                                                                        hideTypingIndicator();
                                                                        const imageText2 = "This is Olivia, in less than 1 month, she had already found the person in the drawing!";
                                                                        const currentTime8 = getCurrentTime();
                                                                        const textMessageEl2 = createTextMessage(imageText2, currentTime8, false);
                                                                        chatMessages.appendChild(textMessageEl2);
                                                                        
                                                                        // Adicionar ao array displayedMessages 
                                                                        displayedMessages.push({
                                                                          type: 'text',
                                                                          content: imageText2,
                                                                          time: currentTime8,
                                                                          isHTML: false
                                                                        });
                                                                        // Removendo chamada ao saveChatData()
                                                                        
                                                                        // Pergunta final com o nome do usuário
                                                                        setTimeout(() => {
                                                                            showTypingIndicator();
                                                                            
                                                                            setTimeout(() => {
                                                                                hideTypingIndicator();
                                                                                // Obter o nome do userMessages[1] (segunda mensagem)
                                                                                const userName = userMessages.length > 1 ? userMessages[1].content : '';
                                                                                const finalQuestion = `Isn't it amazing, <strong>${userName}</strong>? Would you like to see the characteristics of your soulmate too?`;
                                                                                const currentTime9 = getCurrentTime();
                                                                                const finalMessageEl = createTextMessage(finalQuestion, currentTime9, true);
                                                                                chatMessages.appendChild(finalMessageEl);
                                                                                
                                                                                // Adicionar ao array displayedMessages 
                                                                                displayedMessages.push({
                                                                                  type: 'text',
                                                                                  content: finalQuestion,
                                                                                  time: currentTime9,
                                                                                  isHTML: true
                                                                                });
                                                                                // Removendo chamada ao saveChatData()
                                                                                
                                                                                // Botões de resposta
                                                                                setTimeout(() => {
                                                                                    const drawingOptions = [
                                                                                        "Yes, I want to see the characteristics of my soulmate!",
                                                                                        "I prefer to see just the drawing, please!"
                                                                                    ];
                                                                                    showDrawingOptions(drawingOptions);
                                                                                }, 1000);
                                                                            }, 2000);
                                                                        }, 5000); // Aumentado para 5 segundos
                                                                    }, 2000);
                                                                }, 5000); // Aumentado para 5 segundos
                                                            }, 2000);
                                                        }, 5000); // Aumentado para 5 segundos
                                                    }, 2000);
                                                }, 5000); // Aumentado para 5 segundos
                                            }, 2000);
                                        }, 5000); // Aumentado para 5 segundos
                                    }, 2000);
                                }, 15000); // Tempo para ouvir o áudio
                            }, 1000);
                        }, 2000);
                    }, 1000);
                }, 2000);
            }, 1000);
        }, 2000);
    }, 1000);
}

// Função para mostrar as opções de visualização do desenho
function showDrawingOptions(options) {
    // Se já existe uma área de botões, remova-a primeiro
    const existingButtons = document.querySelector('.response-buttons');
    if (existingButtons) {
        chatMessages.removeChild(existingButtons);
    }
    
    // Criar a área de botões
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'response-buttons';
    
    // Adicionar cada botão de resposta
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'response-button';
        button.textContent = option;
        
        // Evento de clique para o botão
        button.addEventListener('click', function() {
            // Remover os botões
            chatMessages.removeChild(buttonsContainer);
            
            // Processar a resposta escolhida
            processDrawingResponse(option);
        });
        
        buttonsContainer.appendChild(button);
    });
    
    // Adicionar os botões ao chat
    chatMessages.appendChild(buttonsContainer);
    
    // Rolar para baixo para mostrar os botões
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para processar a resposta sobre o desenho
function processDrawingResponse(response) {
    // Obter a hora atual
    const currentTime = getCurrentTime();
    
    // Criar mensagem enviada com o texto da resposta
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTextEl = document.createElement('div');
    messageTextEl.className = 'message-text';
    messageTextEl.textContent = response;
    
    const messageTimeContainer = document.createElement('div');
    messageTimeContainer.className = 'message-time-container';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;
    
    // Criar o ícone de duplo check
    const doubleCheck = document.createElement('span');
    doubleCheck.className = 'double-check';
    
    messageTimeContainer.appendChild(messageTime);
    messageTimeContainer.appendChild(doubleCheck);
    
    messageContent.appendChild(messageTextEl);
    messageContent.appendChild(messageTimeContainer);
    messageEl.appendChild(messageContent);
    
    // Adicionar mensagem ao chat
    chatMessages.appendChild(messageEl);
    
    // Armazenar a mensagem do usuário
    userMessages.push({
        content: response,
        time: currentTime
    });
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Primeira mensagem de confirmação
    setTimeout(() => {
        // Removendo o primeiro balão "Perfecto! Procesaré tu solicitud ahora mismo..."
        // e indo direto para a segunda mensagem
        
        // Segunda mensagem perguntando se pode começar o desenho
        setTimeout(() => {
            showTypingIndicator();
            
            setTimeout(() => {
                hideTypingIndicator();
                // Obter o nome do usuário (segunda mensagem)
                const userName = userMessages.length > 1 ? userMessages[1].content : '';
                const drawMessage = `Perfect, <strong>${userName}</strong>. Can I start creating your drawing?`;
                const currentTime2 = getCurrentTime();
                const drawMessageEl = createTextMessage(drawMessage, currentTime2, true);
                chatMessages.appendChild(drawMessageEl);
                
                // Adicionar ao array displayedMessages 
                displayedMessages.push({
                    type: 'text',
                    content: drawMessage,
                    time: currentTime2,
                    isHTML: true
                });
                // Removendo chamada ao saveChatData()
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Mostrar campo de entrada que não armazena informação
                setTimeout(() => {
                    showConfirmDrawingInput();
                }, 1000);
            }, 2000);
        }, 1000);
    }, 1000);
}

// Função para mostrar campo de entrada que não armazena informação
function showConfirmDrawingInput() {
    // Se já existe um campo, remova-o primeiro
    const existingInput = document.querySelector('.confirm-drawing-input-container');
    if (existingInput) {
        chatMessages.removeChild(existingInput);
    }
    
    // Criar o container do input
    const inputContainer = document.createElement('div');
    inputContainer.className = 'confirm-drawing-input-container name-input-container';
    
    // Criar o campo de entrada
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Your answer...';
    input.className = 'confirm-drawing-input name-input';
    
    // Criar o botão de envio
    const sendButton = document.createElement('button');
    sendButton.className = 'confirm-drawing-send-button name-send-button';
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
    
    // Adicionar evento de clique no botão de envio
    sendButton.addEventListener('click', function() {
        processConfirmDrawingResponse(input.value);
    });
    
    // Adicionar evento de tecla no campo de entrada
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processConfirmDrawingResponse(input.value);
        }
    });
    
    // Adicionar os elementos ao container
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    
    // Adicionar o container ao chat
    chatMessages.appendChild(inputContainer);
    
    // Focar no campo de entrada e rolar para garantir visibilidade
    setTimeout(() => {
        input.focus();
        
        // Usar a função de rolagem automática
        if (window.scrollToInputOnFocus) {
            window.scrollToInputOnFocus(input);
        } else {
            // Fallback para o comportamento antigo
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 100);
}

// Função para processar a resposta de confirmação (sem armazenar)
function processConfirmDrawingResponse(response) {
    // Verificar se a resposta foi digitada
    if (!response || response.trim() === '') {
        return;
    }
    
    // Obter o valor limpo
    const responseText = response.trim();
    const currentTime = getCurrentTime();
    
    // Remover o campo de entrada
    const inputContainer = document.querySelector('.confirm-drawing-input-container');
    if (inputContainer) {
        chatMessages.removeChild(inputContainer);
    }
    
    // Criar mensagem enviada com a resposta
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTextEl = document.createElement('div');
    messageTextEl.className = 'message-text';
    messageTextEl.textContent = responseText;
    
    const messageTimeContainer = document.createElement('div');
    messageTimeContainer.className = 'message-time-container';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;
    
    // Criar o ícone de duplo check
    const doubleCheck = document.createElement('span');
    doubleCheck.className = 'double-check';
    
    messageTimeContainer.appendChild(messageTime);
    messageTimeContainer.appendChild(doubleCheck);
    
    messageContent.appendChild(messageTextEl);
    messageContent.appendChild(messageTimeContainer);
    messageEl.appendChild(messageContent);
    
    // Adicionar mensagem ao chat
    chatMessages.appendChild(messageEl);
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Continuar com o fluxo - mostrar o nome do usuário
    setTimeout(() => {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            // Obter o nome do usuário (segunda mensagem)
            const userName = userMessages.length > 1 ? userMessages[1].content : '';
            const nameMessage = `<strong>${userName}</strong>`;
            const currentTime = getCurrentTime();
            const nameMessageEl = createTextMessage(nameMessage, currentTime, true);
            chatMessages.appendChild(nameMessageEl);
            
            // Adicionar ao array displayedMessages 
            displayedMessages.push({
                type: 'text',
                content: nameMessage,
                time: currentTime,
                isHTML: true
            });
            // Removendo chamada ao saveChatData()
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Mostrar o signo do usuário (corrigido para pegar a terceira mensagem)
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    // Obter o signo correto do usuário usando a variável armazenada anteriormente
                    const userSign = window.userSignData ? window.userSignData.content : 'Desconhecido';
                    const signMessage = `<strong>${userSign}</strong>`;
                    const currentTime2 = getCurrentTime();
                    const signMessageEl = createTextMessage(signMessage, currentTime2, true);
                    chatMessages.appendChild(signMessageEl);
                    
                    // Adicionar ao array displayedMessages 
                    displayedMessages.push({
                        type: 'text',
                        content: signMessage,
                        time: currentTime2,
                        isHTML: true
                    });
                    // Removendo chamada ao saveChatData()
                    
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Mostrar a hora do usuário
                    setTimeout(() => {
                        showTypingIndicator();
                        
                        setTimeout(() => {
                            hideTypingIndicator();
                            // Obter a hora do usuário (quinta mensagem)
                            const userTime = userMessages.length > 4 ? userMessages[4].content : '';
                            const timeMessage = `<strong>${userTime}</strong>`;
                            const currentTime3 = getCurrentTime();
                            const timeMessageEl = createTextMessage(timeMessage, currentTime3, true);
                            chatMessages.appendChild(timeMessageEl);
                            
                            // Adicionar ao array displayedMessages 
                            displayedMessages.push({
                                type: 'text',
                                content: timeMessage,
                                time: currentTime3,
                                isHTML: true
                            });
                            // Removendo chamada ao saveChatData()
                            
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                            
                            // Mensagem sobre consulta da carta astral
                            setTimeout(() => {
                                showTypingIndicator();
                                
                                setTimeout(() => {
                                    hideTypingIndicator();
                                    const astralMessage = "I am consulting your astrological chart now. Please do not cross your arms or legs. I am visualizing very important information about your soulmate!";
                                    const currentTime4 = getCurrentTime();
                                    const astralMessageEl = createTextMessage(astralMessage, currentTime4, false);
                                    chatMessages.appendChild(astralMessageEl);
                                    
                                    // Adicionar ao array displayedMessages 
                                    displayedMessages.push({
                                        type: 'text',
                                        content: astralMessage,
                                        time: currentTime4,
                                        isHTML: false
                                    });
                                    // Removendo chamada ao saveChatData()
                                    
                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                    
                                    // Mensagem final sobre análise da carta (com delay maior)
                                    setTimeout(() => {
                                        showTypingIndicator();
                                        
                                        setTimeout(() => {
                                            hideTypingIndicator();
                                            const finalAnalysisMessage = "I will analyze your Chart deeply, and with my Gift, I will concentrate to draw the face I am visualizing.";
                                            const currentTime5 = getCurrentTime();
                                            const finalAnalysisMessageEl = createTextMessage(finalAnalysisMessage, currentTime5, false);
                                            chatMessages.appendChild(finalAnalysisMessageEl);
                                            
                                            // Adicionar ao array displayedMessages 
                                            displayedMessages.push({
                                                type: 'text',
                                                content: finalAnalysisMessage,
                                                time: currentTime5,
                                                isHTML: false
                                            });
                                            // Removendo chamada ao saveChatData()
                                            
                                            chatMessages.scrollTop = chatMessages.scrollHeight;
                                            
                                            // Primeira mensagem de áudio (3.mp3)
                                            setTimeout(() => {
                                                showTypingIndicator();
                                                
                                                setTimeout(() => {
                                                    hideTypingIndicator();
                                                    const currentTime6 = getCurrentTime();
                                                    const audioEl1 = createAudioMessage("0:16", currentTime6, "assets/3.mp3");
                                                    chatMessages.appendChild(audioEl1);
                                                    
                                                    // Adicionar ao array displayedMessages 
                                                    displayedMessages.push({
                                                        type: 'audio',
                                                        duration: "0:16",
                                                        audioSrc: "assets/3.mp3",
                                                        time: currentTime6
                                                    });
                                                    // Removendo chamada ao saveChatData()
                                                    
                                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                                    
                                                    // Reproduzir o áudio automaticamente após um pequeno delay
                                                    setTimeout(() => {
                                                        // Encontrar o botão de play do áudio e simular o clique
                                                        const playButton = audioEl1.querySelector('.play-button');
                                                        if (playButton) {
                                                            playButton.click();
                                                        }
                                                        
                                                        // Segunda mensagem de áudio (4.mp3) após 16 segundos
                                                        setTimeout(() => {
                                                            showTypingIndicator();
                                                            
                                                            setTimeout(() => {
                                                                hideTypingIndicator();
                                                                const currentTime7 = getCurrentTime();
                                                                const audioEl2 = createAudioMessage("0:11", currentTime7, "assets/4.mp3");
                                                                chatMessages.appendChild(audioEl2);
                                                                
                                                                // Adicionar ao array displayedMessages 
                                                                displayedMessages.push({
                                                                    type: 'audio',
                                                                    duration: "0:11",
                                                                    audioSrc: "assets/4.mp3",
                                                                    time: currentTime7
                                                                });
                                                                // Removendo chamada ao saveChatData()
                                                                
                                                                chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                
                                                                // Reproduzir o segundo áudio automaticamente após um pequeno delay
                                                                setTimeout(() => {
                                                                    // Encontrar o botão de play do áudio e simular o clique
                                                                    const playButton = audioEl2.querySelector('.play-button');
                                                                    if (playButton) {
                                                                        playButton.click();
                                                                    }
                                                                    
                                                                    // Mensagem de confirmação após 11 segundos
                                                                    setTimeout(() => {
                                                                        showTypingIndicator();
                                                                        
                                                                        setTimeout(() => {
                                                                            hideTypingIndicator();
                                                                            const confirmMessage = "To send you the drawing as soon as I finish, I just need your confirmation. Please click the button below to confirm!";
                                                                            const currentTime8 = getCurrentTime();
                                                                            const confirmMessageEl = createTextMessage(confirmMessage, currentTime8, false);
                                                                            chatMessages.appendChild(confirmMessageEl);
                                                                            
                                                                            // Adicionar ao array displayedMessages 
                                                                            displayedMessages.push({
                                                                                type: 'text',
                                                                                content: confirmMessage,
                                                                                time: currentTime8,
                                                                                isHTML: false
                                                                            });
                                                                            // Removendo chamada ao saveChatData()
                                                                            
                                                                            chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                            
                                                                            // Mostrar botão de confirmação
                                                                            setTimeout(() => {
                                                                                const confirmOptions = [
                                                                                    "YES, DRAW MY SOULMATE!"
                                                                                ];
                                                                                showFinalConfirmation(confirmOptions);
                                                                            }, 1000);
                                                                        }, 2000);
                                                                    }, 11000); // 11 segundos para ouvir o segundo áudio
                                                                }, 1000);
                                                            }, 2000);
                                                        }, 16000); // 16 segundos para ouvir o primeiro áudio
                                                    }, 1000);
                                                }, 2000);
                                            }, 3000);
                                        }, 5000); // 5 segundos de delay conforme solicitado
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 2000);
    }, 1000);
}

// Função para mostrar o botão de confirmação final
function showFinalConfirmation(options) {
    // Se já existe uma área de botões, remova-a primeiro
    const existingButtons = document.querySelector('.response-buttons');
    if (existingButtons) {
        chatMessages.removeChild(existingButtons);
    }
    
    // Criar a área de botões
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'response-buttons';
    
    // Adicionar cada botão de resposta
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'response-button';
        button.textContent = option;
        
        // Evento de clique para o botão
        button.addEventListener('click', function() {
            // Remover os botões
            chatMessages.removeChild(buttonsContainer);
            
            // Processar a resposta final
            processFinalConfirmation(option);
        });
        
        buttonsContainer.appendChild(button);
    });
    
    // Adicionar os botões ao chat
    chatMessages.appendChild(buttonsContainer);
    
    // Rolar para baixo para mostrar os botões
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Função para processar a confirmação final
function processFinalConfirmation(response) {
    // Obter a hora atual
    const currentTime = getCurrentTime();
    
    // Criar mensagem enviada com o texto da resposta
    const messageEl = document.createElement('div');
    messageEl.className = 'message sent';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTextEl = document.createElement('div');
    messageTextEl.className = 'message-text';
    messageTextEl.textContent = response;
    
    const messageTimeContainer = document.createElement('div');
    messageTimeContainer.className = 'message-time-container';
    
    const messageTime = document.createElement('span');
    messageTime.className = 'message-time';
    messageTime.textContent = currentTime;
    
    // Criar o ícone de duplo check
    const doubleCheck = document.createElement('span');
    doubleCheck.className = 'double-check';
    
    messageTimeContainer.appendChild(messageTime);
    messageTimeContainer.appendChild(doubleCheck);
    
    messageContent.appendChild(messageTextEl);
    messageContent.appendChild(messageTimeContainer);
    messageEl.appendChild(messageContent);
    
    // Adicionar mensagem ao chat
    chatMessages.appendChild(messageEl);
    
    // Armazenar a mensagem do usuário
    userMessages.push({
        content: response,
        time: currentTime
    });
    
    // Rolar para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Removendo a mensagem "¡Perfecto! Ya estoy trabajando en tu dibujo. Te avisaré cuando esté listo."
    // e indo direto para a primeira mensagem sobre momento especial
    setTimeout(() => {
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const specialMomentMessage = "You are very close to experiencing a special moment! But now, <strong>pay close attention, dear...</strong>";
            const currentTime2 = getCurrentTime();
            const specialMomentEl = createTextMessage(specialMomentMessage, currentTime2, true);
            chatMessages.appendChild(specialMomentEl);
            
            // Adicionar ao array displayedMessages 
            displayedMessages.push({
                type: 'text',
                content: specialMomentMessage,
                time: currentTime2,
                isHTML: true
            });
            // Removendo chamada ao saveChatData()
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Segunda mensagem sobre não cobrar pela consulta
            setTimeout(() => {
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    const freeConsultMessage = "I am not charging anything for the consultation.";
                    const currentTime3 = getCurrentTime();
                    const freeConsultEl = createTextMessage(freeConsultMessage, currentTime3, false);
                    chatMessages.appendChild(freeConsultEl);
                    
                    // Adicionar ao array displayedMessages 
                    displayedMessages.push({
                        type: 'text',
                        content: freeConsultMessage,
                        time: currentTime3,
                        isHTML: false
                    });
                    // Removendo chamada ao saveChatData()
                    
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    // Primeiro áudio (5.mp3 em vez de 6.mp3)
                    setTimeout(() => {
                        showTypingIndicator();
                        
                        setTimeout(() => {
                            hideTypingIndicator();
                            const currentTime4 = getCurrentTime();
                            const audioEl1 = createAudioMessage("0:19", currentTime4, "assets/5.mp3");
                            chatMessages.appendChild(audioEl1);
                            
                            // Adicionar ao array displayedMessages 
                            displayedMessages.push({
                                type: 'audio',
                                duration: "0:19",
                                audioSrc: "assets/5.mp3",
                                time: currentTime4
                            });
                            // Removendo chamada ao saveChatData()
                            
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                            
                            // Reproduzir o áudio automaticamente após um pequeno delay
                            setTimeout(() => {
                                // Encontrar o botão de play do áudio e simular o clique
                                const playButton = audioEl1.querySelector('.play-button');
                                if (playButton) {
                                    playButton.click();
                                }
                                
                                // Mensagem sobre o valor da tarifa após 19 segundos (em vez de 23)
                                setTimeout(() => {
                                    showTypingIndicator();
                                    
                                    setTimeout(() => {
                                        hideTypingIndicator();
                                        const priceMessage = PAYMENT_PRICE_MESSAGE;
                                        const currentTime5 = getCurrentTime();
                                        const priceMessageEl = createTextMessage(priceMessage, currentTime5, true);
                                        chatMessages.appendChild(priceMessageEl);
                                        
                                        // Adicionar ao array displayedMessages 
                                        displayedMessages.push({
                                            type: 'text',
                                            content: priceMessage,
                                            time: currentTime5,
                                            isHTML: true
                                        });
                                        // Removendo chamada ao saveChatData()
                                        
                                        chatMessages.scrollTop = chatMessages.scrollHeight;
                                        
                                        // Segundo áudio (6.mp3 em vez de 7.mp3)
                                        setTimeout(() => {
                                            showTypingIndicator();
                                            
                                            setTimeout(() => {
                                                hideTypingIndicator();
                                                const currentTime6 = getCurrentTime();
                                                const audioEl2 = createAudioMessage("0:17", currentTime6, "assets/6.mp3");
                                                chatMessages.appendChild(audioEl2);
                                                
                                                // Adicionar ao array displayedMessages 
                                                displayedMessages.push({
                                                    type: 'audio',
                                                    duration: "0:17",
                                                    audioSrc: "assets/6.mp3",
                                                    time: currentTime6
                                                });
                                                // Removendo chamada ao saveChatData()
                                                
                                                chatMessages.scrollTop = chatMessages.scrollHeight;
                                                
                                                // Reproduzir o segundo áudio automaticamente após um pequeno delay
                                                setTimeout(() => {
                                                    // Encontrar o botão de play do áudio e simular o clique
                                                    const playButton = audioEl2.querySelector('.play-button');
                                                    if (playButton) {
                                                        playButton.click();
                                                    }
                                                    
                                                    // Mensagem final sobre o pagamento após 23 segundos (em vez de 24)
                                                    setTimeout(() => {
                                                        showTypingIndicator();
                                                        
                                                        setTimeout(() => {
                                                            hideTypingIndicator();
                                                            const paymentMessage = "I will leave a <strong>button below</strong> for you to make the payment of the fee. After that, I will send the portrait of your soulmate by email and provide personal guidance to you over the next few months, so that the universe can quickly manifest the person destined to have a special connection with you.";
                                                            const currentTime7 = getCurrentTime();
                                                            const paymentMessageEl = createTextMessage(paymentMessage, currentTime7, true);
                                                            chatMessages.appendChild(paymentMessageEl);
                                                            
                                                            // Adicionar ao array displayedMessages 
                                                            displayedMessages.push({
                                                                type: 'text',
                                                                content: paymentMessage,
                                                                time: currentTime7,
                                                                isHTML: true
                                                            });
                                                            // Removendo chamada ao saveChatData()
                                                            
                                                            chatMessages.scrollTop = chatMessages.scrollHeight;
                                                            
                                                            // Adicionar imagem clicável como link para pagamento
                                                            setTimeout(() => {
                                                                showTypingIndicator();
                                                                
                                                                setTimeout(() => {
                                                                    hideTypingIndicator();
                                                                    
                                                                    // Criar elemento de mensagem para a imagem clicável
                                                                    const imageMessageEl = document.createElement('div');
                                                                    imageMessageEl.className = 'message received';
                                                                    
                                                                    const imageMessageContent = document.createElement('div');
                                                                    imageMessageContent.className = 'message-content';
                                                                    
                                                                    // Criar link clicável
                                                                    const imageLink = document.createElement('a');
                                                                    imageLink.href = PAYMENT_LINK;
                                                                    imageLink.target = '_blank'; // Abrir em nova aba
                                                                    
                                                                    // Adicionar imagem dentro do link
                                                                    const imageElement = document.createElement('img');
                                                                    imageElement.src = 'assets/btn.webp';
                                                                    imageElement.className = 'chat-image';
                                                                    imageElement.alt = 'Make payment';
                                                                    
                                                                    // Montar a estrutura
                                                                    imageLink.appendChild(imageElement);
                                                                    
                                                                    const imageMessageText = document.createElement('div');
                                                                    imageMessageText.className = 'message-text image-container';
                                                                    imageMessageText.appendChild(imageLink);
                                                                    
                                                                    const imageTimeContainer = document.createElement('div');
                                                                    imageTimeContainer.className = 'message-time-container';
                                                                    
                                                                    const imageTime = document.createElement('span');
                                                                    imageTime.className = 'message-time';
                                                                    imageTime.textContent = getCurrentTime();
                                                                    
                                                                    imageTimeContainer.appendChild(imageTime);
                                                                    
                                                                    imageMessageContent.appendChild(imageMessageText);
                                                                    imageMessageContent.appendChild(imageTimeContainer);
                                                                    imageMessageEl.appendChild(imageMessageContent);
                                                                    
                                                                    // Adicionar a mensagem ao chat
                                                                    chatMessages.appendChild(imageMessageEl);
                                                                    
                                                                    // Adicionar ao array displayedMessages 
                                                                    const imageTime8 = getCurrentTime();
                                                                    displayedMessages.push({
                                                                        type: 'image',
                                                                        content: 'assets/btn.webp',
                                                                        caption: null,
                                                                        time: imageTime8
                                                                    });
                                                                    // Removendo chamada ao saveChatData()
                                                                    
                                                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                    
                                                                    // Adicionar mensagem de áudio após imagem (7.mp3 em vez de 8.mp3)
                                                                    setTimeout(() => {
                                                                        showTypingIndicator();
                                                                        
                                                                        setTimeout(() => {
                                                                            hideTypingIndicator();
                                                                            const currentTime9 = getCurrentTime();
                                                                            const audioEl3 = createAudioMessage("0:24", currentTime9, "assets/7.mp3");
                                                                            chatMessages.appendChild(audioEl3);
                                                                            
                                                                            // Adicionar ao array displayedMessages 
                                                                            displayedMessages.push({
                                                                                type: 'audio',
                                                                                duration: "0:24",
                                                                                audioSrc: "assets/7.mp3",
                                                                                time: currentTime9
                                                                            });
                                                                            // Removendo chamada ao saveChatData()
                                                                            
                                                                            chatMessages.scrollTop = chatMessages.scrollHeight;
                                                                            
                                                                            // Reproduzir o áudio automaticamente após um pequeno delay
                                                                            setTimeout(() => {
                                                                                // Encontrar o botão de play do áudio e simular o clique
                                                                                const playButton = audioEl3.querySelector('.play-button');
                                                                                if (playButton) {
                                                                                    playButton.click();
                                                                                }
                                                                            }, 1000);
                                                                        }, 2000);
                                                                    }, 2000);
                                                                }, 2000);
                                                            }, 2000);
                                                        }, 2000);
                                                    }, 23000); // 23 segundos para ouvir o segundo áudio (em vez de 24)
                                                }, 1000);
                                            }, 2000);
                                        }, 2000);
                                    }, 2000);
                                }, 19000); // 19 segundos para ouvir o primeiro áudio (em vez de 23)
                            }, 1000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 2000);
    }, 1000);
}
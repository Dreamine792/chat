// Message data configuration
const messageData = [
  {
    type: 'text',
    content: "Hello, welcome! I'm glad you didn't ignore the signs🙏🔮<br><br><strong>Something important is about to be revealed to you.</strong>",
    delay: 0,
    skipTyping: true, // Esta mensagem deve aparecer sem o efeito de digitando
    isHTML: true // Permite que as tags HTML sejam interpretadas como formatação
  },
  {
    type: 'text',
    content: "From the moment you entered, I felt a man's energy strongly connected to you...<br><br>Whether he's already in your life or about to arrive, the universe wants you to <strong>see his true face</strong> before it's too late ❤️‍🔥",
    delay: 2000,
    isHTML: true
  },
  {
    type: 'text',
    content: 'My name is <strong>Theresa Caputo</strong>, and through the gift I inherited from my grandmother, I help women see the truth about the man tied to their fate.<br><br><strong>In just 2 minutes, I will visualize and draw his face — so you can finally recognize who he really is.</strong>',
    delay: 4000,
    isHTML: true
  },
  {
    type: 'text',
    content: "<strong>Are you ready to see his face?</strong> What I'm about to show may surprise you, move you, or even open your eyes to something you've been missing💕✨",
    delay: 5000,
    isHTML: true
  }
];

// Current time formatter
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  return hours + ':' + minutes + ' ' + ampm;
}

// Function to create a text message element
function createTextMessage(content, customTime, isHTML) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message received';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const messageText = document.createElement('div');
  messageText.className = 'message-text';
  
  // Se a mensagem contém HTML, use innerHTML em vez de textContent
  if (isHTML) {
    messageText.innerHTML = content;
  } else {
    messageText.textContent = content;
  }
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = customTime || getCurrentTime();
  
  // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageText);
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  return messageEl;
}

// Function to create an image message element
function createImageMessage(imageUrl, caption, customTime) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message received';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const imageContainer = document.createElement('div');
  imageContainer.className = 'message-image-container';
  
  const image = document.createElement('img');
  image.className = 'message-image';
  image.src = imageUrl;
  image.alt = 'Shared image';
  image.loading = 'lazy';
  
  imageContainer.appendChild(image);
  messageContent.appendChild(imageContainer);
  
  if (caption) {
    const captionText = document.createElement('div');
    captionText.className = 'message-text';
    captionText.textContent = caption;
    messageContent.appendChild(captionText);
  }
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = customTime || getCurrentTime();
  
  // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  return messageEl;
}

// Function to create an audio message element
function createAudioMessage(duration, customTime, audioSrc = null) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message received';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  const audioPlayer = document.createElement('div');
  audioPlayer.className = 'audio-player';
  
  const playButton = document.createElement('div');
  playButton.className = 'play-button';
  playButton.innerHTML = '<i class="fas fa-play"></i>';
  
  // Se foi fornecido um caminho de áudio, adicionar ao player
  if (audioSrc) {
    playButton.dataset.audioSrc = audioSrc;
  }
  
  const audioTrack = document.createElement('div');
  audioTrack.className = 'audio-track';
  
  const audioProgress = document.createElement('div');
  audioProgress.className = 'audio-progress';
  
  const audioProgressFilled = document.createElement('div');
  audioProgressFilled.className = 'audio-progress-filled';
  
  const audioDuration = document.createElement('div');
  audioDuration.className = 'audio-duration';
  audioDuration.textContent = duration;
  
  audioProgress.appendChild(audioProgressFilled);
  audioTrack.appendChild(audioProgress);
  audioTrack.appendChild(audioDuration);
  
  audioPlayer.appendChild(playButton);
  audioPlayer.appendChild(audioTrack);
  
  messageContent.appendChild(audioPlayer);
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = customTime || getCurrentTime();
  
  // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  // Add click event to play button
  playButton.addEventListener('click', function() {
    const isPlaying = playButton.classList.contains('playing');
    
    if (isPlaying) {
      // Pausar o áudio
      playButton.classList.remove('playing');
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      
      // Se tiver um elemento de áudio real, pausá-lo
      if (playButton.dataset.audioElement) {
        const audioElement = document.getElementById(playButton.dataset.audioElement);
        if (audioElement) {
          audioElement.pause();
          // Não resetar a barra aqui - deixar ela parada onde está
        }
      }
      
      // Se tiver um intervalo de simulação ativo, limpar
      if (playButton.dataset.simulationInterval) {
        clearInterval(playButton.dataset.simulationInterval);
        delete playButton.dataset.simulationInterval;
      }
    } else {
      // Reproduzir o áudio
      playButton.classList.add('playing');
      playButton.innerHTML = '<i class="fas fa-pause"></i>';
      
      // Resetar a barra de progresso para o início antes de começar
      audioProgressFilled.style.width = '0%';
      
      // Se tiver um arquivo de áudio especificado, reproduzi-lo
      if (audioSrc) {
        // Verificar se já existe um elemento de áudio para este botão
        let audioElement;
        if (playButton.dataset.audioElement) {
          audioElement = document.getElementById(playButton.dataset.audioElement);
        } else {
          // Criar um elemento de áudio oculto
          audioElement = document.createElement('audio');
          const audioId = 'audio-' + Date.now();
          audioElement.id = audioId;
          audioElement.src = audioSrc;
          audioElement.style.display = 'none';
          document.body.appendChild(audioElement);
          
          // Salvar a referência ao elemento de áudio
          playButton.dataset.audioElement = audioId;
          
          // Configurar evento de atualização do progresso
          // Verificar se o áudio está tocando antes de atualizar
          audioElement.addEventListener('timeupdate', function() {
            // Só atualizar se o áudio estiver realmente tocando
            if (!audioElement.paused && !audioElement.ended) {
              const percent = (audioElement.currentTime / audioElement.duration) * 100;
              audioProgressFilled.style.width = `${percent}%`;
            }
          });
          
          // Configurar evento de fim da reprodução
          audioElement.addEventListener('ended', function() {
            playButton.classList.remove('playing');
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            audioProgressFilled.style.width = '0%';
          });
        }
        
        // Resetar o áudio e reproduzir
        audioElement.currentTime = 0;
        audioElement.play();
      } else {
        // Comportamento para simulação quando não há arquivo real
        let progress = 0;
        const interval = setInterval(() => {
          // Verificar se ainda está tocando antes de atualizar
          if (!playButton.classList.contains('playing')) {
            clearInterval(interval);
            delete playButton.dataset.simulationInterval;
            return;
          }
          
          progress += 1;
          audioProgressFilled.style.width = `${progress}%`;
          
          if (progress >= 100) {
            clearInterval(interval);
            delete playButton.dataset.simulationInterval;
            playButton.classList.remove('playing');
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            audioProgressFilled.style.width = '0%';
          }
        }, 300);
        
        // Armazenar o ID do intervalo para poder limpar quando pausar
        playButton.dataset.simulationInterval = interval;
      }
    }
  });
  
  return messageEl;
}

// Function to create a link button message
function createLinkMessage(content, url, preview, customTime) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message received';
  
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  
  if (preview) {
    const linkPreview = document.createElement('div');
    linkPreview.className = 'link-preview';
    linkPreview.textContent = preview;
    messageContent.appendChild(linkPreview);
  }
  
  const linkText = document.createElement('div');
  linkText.className = 'message-text';
  linkText.textContent = content;
  messageContent.appendChild(linkText);
  
  const linkButton = document.createElement('a');
  linkButton.className = 'link-button';
  linkButton.href = url;
  linkButton.target = '_blank';
  linkButton.textContent = 'Open Link';
  messageContent.appendChild(linkButton);
  
  const messageTimeContainer = document.createElement('div');
  messageTimeContainer.className = 'message-time-container';
  
  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = customTime || getCurrentTime();
  
  // Criar o ícone de duplo check como um span vazio (sem o Font Awesome)
  const doubleCheck = document.createElement('span');
  doubleCheck.className = 'double-check';
  
  messageTimeContainer.appendChild(messageTime);
  messageTimeContainer.appendChild(doubleCheck);
  
  messageContent.appendChild(messageTimeContainer);
  messageEl.appendChild(messageContent);
  
  return messageEl;
}

// Function to create a typing indicator
function createTypingIndicator() {
  const typingEl = document.createElement('div');
  typingEl.className = 'typing-indicator';
  
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    typingEl.appendChild(dot);
  }
  
  return typingEl;
}

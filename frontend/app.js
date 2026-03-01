// ConstitutionBD ChatGPT-style Frontend with Advanced Features
// Simple and clean chat interface with Dark Mode, Language Support, etc.

const API_BASE = 'http://localhost:8000';

// Language strings
const strings = {
    en: {
        headerSubtitle: 'Legal Knowledge Made Easy',
        inputPlaceholder: 'Ask questions about laws or constitution...',
        sendBtnTitle: 'Ask something',
        welcomeMsg: 'Welcome to OpenLaw Chat! I can help answer your questions about constitution and legal matters. Ask anything!',
        connectionError: 'Server not connected. Make sure the backend is running.',
        answerError: 'No answer found',
        apiError: 'API Error',
        sources: '📚 Sources:',
        moreSource: '+ More',
        settingsTitle: '⚙️ Settings',
        langLabel: 'Language',
        langInfo: 'Change the language of chat and UI',
        themeLabel: 'Dark Mode',
        themeOn: 'On',
        themeOff: 'Off',
        themeInfo: 'Use eye-friendly dark theme',
    }
};

// Settings state
const settings = {
    language: 'en',
    darkMode: false
};

// DOM Elements
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const inputForm = document.getElementById('input-form');
const settingsPanel = document.getElementById('settings-panel');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// State
let isLoading = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
    checkHealth();
    addWelcomeMessage();
    applySettings();
});

function loadSettings() {
    const saved = localStorage.getItem('constitutionBDSettings');
    if (saved) {
        Object.assign(settings, JSON.parse(saved));
    }
}

function saveSettings() {
    localStorage.setItem('constitutionBDSettings', JSON.stringify(settings));
}

function setupEventListeners() {
    inputForm.addEventListener('submit', handleSendMessage);
    
    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 100) + 'px';
    });

    // Allow Shift+Enter for new line, Enter to send
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(new Event('submit'));
        }
    });

    // Close settings on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsPanel.classList.contains('open')) {
            toggleSettings();
        }
    });
}

async function checkHealth() {
    try {
        await fetch(`${API_BASE}/health`);
    } catch (error) {
        addErrorMessage(strings[settings.language].connectionError);
    }
}

function addWelcomeMessage() {
    addMessage('assistant', strings[settings.language].welcomeMsg, null);
}

// Settings functions
function toggleSettings() {
    settingsPanel.classList.toggle('open');
}

// Language change function removed - English only

function toggleDarkMode() {
    settings.darkMode = darkModeToggle.checked;
    saveSettings();
    applyDarkMode();
    updateThemeStatus();
}


function applySettings() {
    // Apply dark mode
    darkModeToggle.checked = settings.darkMode;
    applyDarkMode();

    // Update theme status
    updateThemeStatus();
}

function updateUIText() {
    const str = strings[settings.language];
    document.getElementById('settings-title').textContent = str.settingsTitle;
    document.getElementById('theme-label').textContent = str.themeLabel;
    document.getElementById('theme-info').textContent = str.themeInfo;
}

function updateMessageInputPlaceholder() {
    messageInput.placeholder = strings[settings.language].inputPlaceholder;
}

function updateSendBtnTitle() {
    const sendBtn = document.getElementById('send-btn');
    sendBtn.title = strings[settings.language].sendBtnTitle;
}

function applyDarkMode() {
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function updateThemeStatus() {
    document.getElementById('theme-status').textContent = settings.darkMode 
        ? strings[settings.language].themeOn 
        : strings[settings.language].themeOff;
}



async function handleSendMessage(e) {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    if (!message || isLoading) return;

    // Add user message to chat
    addMessage('user', message, null);
    
    // Clear input and reset height
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Disable send button
    isLoading = true;
    updateSendButton();
    
    // Show loading indicator
    const loadingId = Date.now();
    addMessage('assistant', '<div class="loading-spinner"></div>', null);
    
    try {
        const response = await fetch(`${API_BASE}/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: message,
                include_sources: true
            })
        });

        if (!response.ok) {
            throw new Error(strings[settings.language].apiError + ': ' + response.status);
        }
        
        const data = await response.json();
        
        // Remove loading message
        removeLastMessage();
        
        // Add response with sources
        if (data.answer) {
            addMessage('assistant', data.answer, data.sources);
        } else {
            addErrorMessage(strings[settings.language].answerError);
        }
        
    } catch (error) {
        removeLastMessage();
        addErrorMessage('Error: ' + error.message);
    } finally {
        isLoading = false;
        updateSendButton();
        messageInput.focus();
    }
}

function addMessage(role, content, sources) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;
    
    messageDiv.appendChild(contentDiv);
    
    // Add sources if present
    if (sources && sources.length > 0) {
        const sourcesDiv = document.createElement('div');
        sourcesDiv.className = 'sources';
        
        let sourcesHTML = '<strong>' + strings[settings.language].sources + '</strong><br>';
        sources.slice(0, 2).forEach(source => {
            sourcesHTML += `<div>• ${source.article || 'Article'}</div>`;
        });
        if (sources.length > 2) {
            sourcesHTML += `<div style="color: #0084ff; cursor: pointer;">${strings[settings.language].moreSource} ${sources.length - 2}</div>`;
        }
        
        sourcesDiv.innerHTML = sourcesHTML;
        messageDiv.appendChild(sourcesDiv);
    }
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addErrorMessage(text) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i>${text}`;
    messagesContainer.appendChild(errorDiv);
    scrollToBottom();
}

function removeLastMessage() {
    if (messagesContainer.lastChild) {
        messagesContainer.removeChild(messagesContainer.lastChild);
    }
}

function updateSendButton() {
    sendBtn.disabled = isLoading;
    sendBtn.innerHTML = isLoading 
        ? '<div class="loading-spinner" style="border-width: 2px; width: 16px; height: 16px;"></div>'
        : '↑';
}

function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 0);
}

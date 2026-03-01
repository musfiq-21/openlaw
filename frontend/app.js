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

// DOM Elements (will be set in DOMContentLoaded)
let messagesContainer;
let messageInput;
let sendBtn;
let inputForm;
let darkModeBtn;

// State
let isLoading = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set DOM elements
    messagesContainer = document.getElementById('messages');
    messageInput = document.getElementById('message-input');
    sendBtn = document.getElementById('send-btn');
    inputForm = document.getElementById('input-form');
    darkModeBtn = document.getElementById('dark-mode-btn');
    
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
        if (e.key === 'Escape') {
            // Settings panel removed
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
    settings.darkMode = !settings.darkMode;
    saveSettings();
    applyDarkMode();
    updateDarkModeIcon();
}


function applySettings() {
    // Apply dark mode
    applyDarkMode();
    updateDarkModeIcon();
}

function applyDarkMode() {
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function updateDarkModeIcon() {
    const icon = darkModeBtn.querySelector('i');
    if (settings.darkMode) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
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
    
    const messageWrapperDiv = document.createElement('div');
    messageWrapperDiv.className = 'message-wrapper';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content;
    
    messageWrapperDiv.appendChild(contentDiv);
    
    // Add action buttons for user and assistant messages
    if (role === 'user' || role === 'assistant') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-btn';
        copyBtn.title = 'Copy message';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.onclick = () => copyMessage(contentDiv.innerText);
        
        if (role === 'user') {
            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn';
            editBtn.title = 'Edit message';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.onclick = () => editMessage(messageWrapperDiv, contentDiv, content);
            actionsDiv.appendChild(editBtn);
        }
        
        actionsDiv.appendChild(copyBtn);
        messageWrapperDiv.appendChild(actionsDiv);
    }
    
    messageDiv.appendChild(messageWrapperDiv);
    
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

function copyMessage(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Message copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy message');
    });
}

function editMessage(wrapper, contentDiv, originalContent) {
    // Check if already in edit mode
    if (wrapper.classList.contains('editing')) return;
    
    wrapper.classList.add('editing');
    const originalText = contentDiv.innerText;
    
    // Create editing container
    const editContainer = document.createElement('div');
    editContainer.className = 'edit-container';
    
    // Create textarea
    const textarea = document.createElement('textarea');
    textarea.className = 'edit-textarea';
    textarea.value = originalText;
    textarea.focus();
    
    // Prevent Shift+Enter from sending when editing
    textarea.addEventListener('keydown', (e) => {
        e.stopPropagation();
    });
    
    // Create buttons container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'edit-buttons';
    
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'edit-btn save-btn';
    saveBtn.textContent = 'Send';
    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newText = textarea.value.trim();
        if (newText && newText !== originalText) {
            contentDiv.innerHTML = newText;
            
            // Add edited indicator if not already present
            if (!contentDiv.querySelector('.edited-indicator')) {
                const editedSpan = document.createElement('span');
                editedSpan.className = 'edited-indicator';
                editedSpan.textContent = ' (edited)';
                contentDiv.appendChild(editedSpan);
            }
        }
        editContainer.remove();
        contentDiv.style.display = 'block';
        wrapper.classList.remove('editing');
        return false;
    });
    
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'edit-btn cancel-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        editContainer.remove();
        contentDiv.style.display = 'block';
        wrapper.classList.remove('editing');
        return false;
    });
    
    buttonsDiv.appendChild(saveBtn);
    buttonsDiv.appendChild(cancelBtn);
    editContainer.appendChild(textarea);
    editContainer.appendChild(buttonsDiv);
    
    contentDiv.parentNode.insertBefore(editContainer, contentDiv.nextSibling);
    contentDiv.style.display = 'none';
}

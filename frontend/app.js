// ConstitutionBD ChatGPT-style Frontend with Advanced Features
// Simple and clean chat interface with Dark Mode, Language Support, etc.

const API_BASE = 'http://localhost:8000';

// Language strings
const strings = {
    bn: {
        headerSubtitle: 'বাংলাদেশ সংবিধান সম্পর্কে প্রশ্ন করুন',
        inputPlaceholder: 'সংবিধান সম্পর্কে আপনার প্রশ্ন লিখুন...',
        welcomeMsg: '👋 স্বাগতম ConstitutionBD চ্যাটে! আমি বাংলাদেশ সংবিধান সম্পর্কে আপনার প্রশ্নের উত্তর দিতে পারি। যেকোনো প্রশ্ন করুন!',
        connectionError: 'সার্ভার সংযুক্ত নয়। নিশ্চিত করুন ব্যাকএন্ড চলছে। (http://localhost:8000)',
        answerError: 'উত্তর পাওয়া যায়নি',
        apiError: 'API ত্রুটি',
        sources: '📚 উৎস:',
        moreSource: '+ আরও',
        settingsTitle: '⚙️ সেটিংস',
        langLabel: 'ভাষা / Language',
        langInfo: 'চ্যাট এবং ইউআই এর ভাষা পরিবর্তন করুন',
        themeLabel: 'ডার্ক মোড / Dark Mode',
        themeOn: 'চালু',
        themeOff: 'অফ',
        themeInfo: 'চোখে আরামদায়ক ডার্ক থিম ব্যবহার করুন',
        fontLabel: 'টেক্সট সাইজ / Font Size',
        fontInfo: 'চ্যাটের টেক্সট আকার পরিবর্তন করুন',
        scrollLabel: 'স্বয়ংক্রিয় স্ক্রল / Auto Scroll',
        scrollStatus: 'চালু',
        scrollInfo: 'নতুন বার্তায় স্বয়ংক্রিয়ভাবে নীচে স্ক্রল করুন',
        sourcesLabel: 'উৎস দেখান / Show Sources',
        sourcesStatus: 'চালু',
        sourcesInfo: 'প্রতিটি উত্তরের সাথে সংবিধানের উৎস দেখান',
        aboutLabel: 'বিষয়ে / About',
    },
    en: {
        headerSubtitle: 'Ask questions about Bangladesh Constitution',
        inputPlaceholder: 'Ask your question about the constitution...',
        welcomeMsg: '👋 Welcome to ConstitutionBD Chat! I can help answer your questions about the Bangladesh Constitution. Ask anything!',
        connectionError: 'Server not connected. Make sure the backend is running. (http://localhost:8000)',
        answerError: 'No answer found',
        apiError: 'API Error',
        sources: '📚 Sources:',
        moreSource: '+ More',
        settingsTitle: '⚙️ Settings',
        langLabel: 'Language / ভাষা',
        langInfo: 'Change the language of chat and UI',
        themeLabel: 'Dark Mode / ডার্ক মোড',
        themeOn: 'On',
        themeOff: 'Off',
        themeInfo: 'Use eye-friendly dark theme',
        fontLabel: 'Font Size / টেক্সট সাইজ',
        fontInfo: 'Change the text size in chat',
        scrollLabel: 'Auto Scroll / স্বয়ংক্রিয় স্ক্রল',
        scrollStatus: 'On',
        scrollInfo: 'Automatically scroll down on new messages',
        sourcesLabel: 'Show Sources / উৎস দেখান',
        sourcesStatus: 'On',
        sourcesInfo: 'Show constitution sources with each answer',
        aboutLabel: 'About / বিষয়ে',
    }
};

// Settings state
const settings = {
    language: 'bn',
    darkMode: false,
    fontSize: 'medium',
    autoScroll: true,
    showSources: true
};

// DOM Elements
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const inputForm = document.getElementById('input-form');
const settingsPanel = document.getElementById('settings-panel');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const languageSelect = document.getElementById('language-select');
const fontSizeSelect = document.getElementById('font-size-select');
const autoScrollToggle = document.getElementById('auto-scroll-toggle');
const showSourcesToggle = document.getElementById('show-sources-toggle');

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

function changeLanguage(lang) {
    settings.language = lang;
    saveSettings();
    updateUIText();
    updateMessageInputPlaceholder();
}

function toggleDarkMode() {
    settings.darkMode = darkModeToggle.checked;
    saveSettings();
    applyDarkMode();
    updateThemeStatus();
}

function changeFontSize(size) {
    settings.fontSize = size;
    saveSettings();
    applyFontSize();
}

function toggleAutoScroll() {
    settings.autoScroll = autoScrollToggle.checked;
    saveSettings();
    updateAutoScrollStatus();
}

function toggleShowSources() {
    settings.showSources = showSourcesToggle.checked;
    saveSettings();
    updateSourcesStatus();
}

function applySettings() {
    // Apply dark mode
    darkModeToggle.checked = settings.darkMode;
    applyDarkMode();

    // Apply font size
    fontSizeSelect.value = settings.fontSize;
    applyFontSize();

    // Apply language
    languageSelect.value = settings.language;
    updateUIText();
    updateMessageInputPlaceholder();

    // Apply auto scroll and sources toggles
    autoScrollToggle.checked = settings.autoScroll;
    showSourcesToggle.checked = settings.showSources;
    updateAutoScrollStatus();
    updateSourcesStatus();
    updateThemeStatus();
}

function updateUIText() {
    const str = strings[settings.language];
    document.getElementById('header-subtitle').textContent = str.headerSubtitle;
    document.getElementById('settings-title').textContent = str.settingsTitle;
    document.getElementById('lang-label').textContent = str.langLabel;
    document.getElementById('lang-info').textContent = str.langInfo;
    document.getElementById('theme-label').textContent = str.themeLabel;
    document.getElementById('theme-info').textContent = str.themeInfo;
    document.getElementById('font-label').textContent = str.fontLabel;
    document.getElementById('font-info').textContent = str.fontInfo;
    document.getElementById('scroll-label').textContent = str.scrollLabel;
    document.getElementById('scroll-info').textContent = str.scrollInfo;
    document.getElementById('sources-label').textContent = str.sourcesLabel;
    document.getElementById('sources-info').textContent = str.sourcesInfo;
    document.getElementById('about-label').textContent = str.aboutLabel;
}

function updateMessageInputPlaceholder() {
    messageInput.placeholder = strings[settings.language].inputPlaceholder;
}

function applyDarkMode() {
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function applyFontSize() {
    const sizes = {
        small: '13px',
        medium: '15px',
        large: '17px'
    };
    messagesContainer.style.fontSize = sizes[settings.fontSize];
}

function updateThemeStatus() {
    document.getElementById('theme-status').textContent = settings.darkMode 
        ? strings[settings.language].themeOn 
        : strings[settings.language].themeOff;
}

function updateAutoScrollStatus() {
    document.getElementById('scroll-status').textContent = settings.autoScroll 
        ? strings[settings.language].scrollStatus 
        : 'বন্ধ';
}

function updateSourcesStatus() {
    document.getElementById('sources-status').textContent = settings.showSources 
        ? strings[settings.language].sourcesStatus 
        : 'বন্ধ';
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
            addMessage('assistant', data.answer, settings.showSources ? data.sources : null);
        } else {
            addErrorMessage(strings[settings.language].answerError);
        }
        
    } catch (error) {
        removeLastMessage();
        addErrorMessage('ত্রুটি: ' + error.message);
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
    
    // Add sources if present and enabled
    if (sources && sources.length > 0 && settings.showSources) {
        const sourcesDiv = document.createElement('div');
        sourcesDiv.className = 'sources';
        
        let sourcesHTML = '<strong>' + strings[settings.language].sources + '</strong><br>';
        sources.slice(0, 2).forEach(source => {
            sourcesHTML += `<div>• ${source.article || 'অনুচ্ছেদ'}</div>`;
        });
        if (sources.length > 2) {
            sourcesHTML += `<div style="color: #0084ff; cursor: pointer;">${strings[settings.language].moreSource} ${sources.length - 2}</div>`;
        }
        
        sourcesDiv.innerHTML = sourcesHTML;
        messageDiv.appendChild(sourcesDiv);
    }
    
    messagesContainer.appendChild(messageDiv);
    
    if (settings.autoScroll) {
        scrollToBottom();
    }
}

function addErrorMessage(text) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i>${text}`;
    messagesContainer.appendChild(errorDiv);
    
    if (settings.autoScroll) {
        scrollToBottom();
    }
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
        : '<i class="fas fa-paper-plane"></i>';
}

function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 0);
}

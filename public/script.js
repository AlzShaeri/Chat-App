const socket = io();

const nameInput = document.getElementById('name-input');
const colorButton = document.getElementById('color-button');
const colorPopup = document.getElementById('color-popup');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent newline
        sendMessage();
    }
});

messageInput.addEventListener('input', adjustHeight);

let userName = 'You';
let userColor = '#000000';

nameInput.addEventListener('input', function () {
    userName = nameInput.value || 'You';
});

colorButton.addEventListener('click', function () {
    colorPopup.classList.toggle('hidden');
});

colorPopup.addEventListener('click', function (e) {
    if (e.target.classList.contains('color-option')) {
        userColor = e.target.getAttribute('data-color');
        colorButton.style.backgroundColor = userColor;
        colorPopup.classList.add('hidden');
    }
});

function sendMessage() {
    const message = messageInput.value;
    if (message.trim()) {
        socket.emit('send-chat-message', { name: userName, color: userColor, message: message });
        messageInput.value = '';
        adjustHeight(); // Reset height after sending
        appendMessage(`${userName}: ${message}`, userColor);
    }
}

socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`, data.color);
});

function appendMessage(message, color) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<span style="color: ${color}; font-weight: bold;">${message.split(': ')[0]}</span>: ${message.split(': ')[1]}`;
    messageElement.classList.add('message');
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function adjustHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = (messageInput.scrollHeight) + 'px';
    messageInput.style.overflowY = 'hidden'; // Ensure no vertical scrollbar
}

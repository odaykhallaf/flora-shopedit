const socketUrl = 'ws://localhost:8081';
let socket = new WebSocket(socketUrl);

document.getElementById('submit-btn').addEventListener('click', sendMessage);
document.getElementById('rest-btn').addEventListener('click', resetChat);
document.getElementById('word-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    let inputField = document.getElementById('word-input');
    let message = inputField.value.trim();

    if (!message) {
        alert('Please enter text before submitting.');
        return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        alert('The message could not be sent, the connection to the server is not open.');
        return;
    }

    socket.send(message);
    console.log("Message sent to server: ", message);

    // Create a container for the message and the reply
    const replyContent = document.getElementById('reply-content');
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';

    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.textContent = `User: ${message}`;
    messageContainer.appendChild(messageDiv);
    
    replyContent.appendChild(messageContainer);
    inputField.value = '';  // Clear the input field after sending
}

function resetChat() {
    const replyContent = document.getElementById('reply-content');
    replyContent.innerHTML = '';  // Clear all messages
    const restMessage = 'rest';

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(restMessage);
        console.log("Sent rest command to server.");
    } else {
        alert('Cannot send reset command, server connection is not open.');
    }
}

socket.onmessage = function(event) {
    console.log("Message from server: ", event.data);
    const replyContent = document.getElementById('reply-content');

    // Create a new div for the bot reply
    const lastMessageContainer = replyContent.lastElementChild;
    const replyDiv = document.createElement('div');
    replyDiv.className = 'bot-reply';
    replyDiv.textContent = `Chat: ${event.data}`;
    lastMessageContainer.appendChild(replyDiv);
};

socket.onerror = function(event) {
    if (event && event.message) {
        console.log("WebSocket Error: ", event.message);
        alert('Error connecting to the server: ' + event.message);
    } else {
        console.log("WebSocket Error: An undefined error occurred");
        alert('Error connecting to the server: An undefined error occurred');
    }
};

socket.onclose = function(event) {
    if (!event.wasClean) {
        console.log('Connection died unexpectedly');
        setTimeout(function() {
            socket = new WebSocket(socketUrl);
            console.log('Attempting to reconnect...');
        }, 1000);
    }
};

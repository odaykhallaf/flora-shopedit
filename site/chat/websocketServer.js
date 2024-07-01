const WebSocket = require('ws');
const fetch = require('node-fetch');

const API_URL = 'https://api-inference.huggingface.co/models/gpt2';
const HUGGINGFACE_TOKEN = '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';

const server = new WebSocket.Server({ port: 8081 });

async function fetchModelResponse(text) {
    const payload = JSON.stringify({
        inputs: text,
        parameters: {
            max_length: 30,
            temperature: 0.5
        }
    });

    const headers = {
        'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: payload,
            headers: headers
        });

        const data = await response.json();

        if (data.error) {
            console.error('Error response from API:', data);
            return `Error: ${data.error}`;
        }

        if (data && Array.isArray(data) && data.length > 0 && data[0].generated_text) {
            return data[0].generated_text.trim();
        } else {
            console.error('Unexpected response format:', data);
            return 'Error: Unexpected response format';
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return 'Error processing your request';
    }
}

server.on('connection', function(socket) {
    console.log('Client connected');

    socket.on('message', async function(message) {
        try {
            const textMessage = message.toString('utf8').trim();
            if (textMessage) {
                const botReply = await fetchModelResponse(textMessage);

                server.clients.forEach(wsClient => {
                    if (wsClient.readyState === WebSocket.OPEN) {
                        wsClient.send(`Chat: ${botReply}`);
                    }
                });
            } else {
                console.error('Cannot send an empty message');
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
            socket.send('An error occurred while processing your request.');
        }
    });

    socket.on('close', function() {
        console.log('Client disconnected');
    });

    socket.on('error', function(error) {
        console.error('WebSocket error:', error);
    });
});
console.log('خادم WebSocket يعمل على ws://localhost:8081');

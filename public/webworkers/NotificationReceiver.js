const API_BASE_URL = "https://apis.vydeo.xyz/java"
const FLASK_API_BASE_URL = "https://apis.vydeo.xyz/py"
const DOWNLOAD_BASE_URL = "https://localhost:5000"
const WebSocket_URL = "wss://apis.vydeo.xyz/ws"

import DatabaseManipulator from "./DatabaseManipulator.js";

let socket;
let token;
let userId;
let reconnectAttempts = 0;
let maxReconnectAttempts = 5;
let reconnectDelay = 1000; // Start with 1 second
let heartbeatInterval;
let connectionTimeout;
let isConnecting = false;

const connectWebSocket = (url) => {
    if (isConnecting) {
        console.log('Connection already in progress, skipping...');
        return;
    }

    if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
        console.log('WebSocket already connected or connecting');
        return;
    }

    isConnecting = true;
    console.log('Attempting to connect to WebSocket...');

    // Clear any existing connection timeout
    if (connectionTimeout) {
        clearTimeout(connectionTimeout);
    }

    // Set connection timeout
    connectionTimeout = setTimeout(() => {
        if (socket && socket.readyState === WebSocket.CONNECTING) {
            console.log('Connection timeout, closing socket...');
            socket.close();
        }
    }, 10000); // 10 second timeout

    try {
        socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket connection established successfully');
            isConnecting = false;
            reconnectAttempts = 0;
            reconnectDelay = 1000;
            
            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
            }

            // Start heartbeat
            startHeartbeat();
        };

        socket.onmessage = (event) => {
            console.log('Message received:', event.data);
            
            try {
                if (event.data === "success") {
                    console.log("Connection successful!");
                } else if (event.data === "pong") {
                    console.log("Heartbeat pong received");
                } else {
                    // Handle notification messages
                    const data = JSON.parse(event.data);
                    if (Array.isArray(data)) {
                        // Handle array of messages
                        data.forEach(message => {
                            if (message && typeof message === 'object') {
                                DatabaseManipulator.addContactHistory(message).then(() => {
                                    postMessage({action: "updateNotification"});
                                });
                            }
                        });
                    } else if (data && typeof data === 'object') {
                        // Handle single message
                        DatabaseManipulator.addContactHistory(data).then(() => {
                            postMessage({action: "updateNotification"});
                        });
                    }
                }
            } catch (error) {
                console.error('Error processing message:', error);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            isConnecting = false;
            stopHeartbeat();
        };

        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
            isConnecting = false;
            stopHeartbeat();
            
            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
            }

            // Attempt to reconnect if not manually closed
            if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
                scheduleReconnect(url);
            } else if (reconnectAttempts >= maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
                postMessage({action: "connectionFailed", message: "Failed to establish WebSocket connection"});
            }
        };

    } catch (error) {
        console.error('Error creating WebSocket:', error);
        isConnecting = false;
        scheduleReconnect(url);
    }
};

const scheduleReconnect = (url) => {
    if (reconnectAttempts >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        return;
    }

    reconnectAttempts++;
    const delay = Math.min(reconnectDelay * Math.pow(2, reconnectAttempts - 1), 30000); // Max 30 seconds
    
    console.log(`Scheduling reconnection attempt ${reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
        if (!socket || socket.readyState === WebSocket.CLOSED) {
            connectWebSocket(url);
        }
    }, delay);
};

const startHeartbeat = () => {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
    }

    heartbeatInterval = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            try {
                socket.send('ping');
            } catch (error) {
                console.error('Error sending heartbeat:', error);
                stopHeartbeat();
            }
        } else {
            stopHeartbeat();
        }
    }, 30000); // Send heartbeat every 30 seconds
};

const stopHeartbeat = () => {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
};

const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        try {
            socket.send(JSON.stringify(message));
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            return false;
        }
    } else {
        console.warn('WebSocket is not connected. Message not sent:', message);
        return false;
    }
};

function getNewestMessages() {
    // return DatabaseManipulator.getTimestamp().then((timestamp) => {
    //     if (!timestamp) {
    //         timestamp = -1;
    //     }

    //     return fetch(API_BASE_URL + "/chat/getNewestMessages", {
    //         method: 'POST',
    //         headers: {
    //             'token': token,
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             timestamp: timestamp
    //         })
    //     })
    //     .catch(err => {
    //         console.error('Error fetching newest messages:', err);
    //         throw err;
    //     })
    //     .then(async response => {
    //         if (!response || !response.ok) {
    //             throw new Error(`HTTP error! status: ${response?.status}`);
    //         }

    //         const data = await response.json();

    //         if (!data || !data.message) {
    //             console.log('No new messages available');
    //             return;
    //         }

    //         return DatabaseManipulator.batchAddContactHistory(JSON.parse(data.message));
    //     });
    // });
}

// Graceful cleanup
const cleanup = () => {
    stopHeartbeat();
    if (connectionTimeout) {
        clearTimeout(connectionTimeout);
    }
    if (socket) {
        socket.close(1000, 'Worker shutting down');
    }
};

onmessage = (event) => {
    const {action, key, value} = event.data;
    console.log('Worker received message:', event.data);
    
    try {
        switch (action) {
            case "setToken":
                token = value;
                userId = key;
                connectWebSocket(WebSocket_URL + "/notification/" + token);
                // getNewestMessages()
                //     .then(() => {
                //         connectWebSocket(WebSocket_URL + "/notification/" + token);
                //     })
                //     .catch(error => {
                //         console.error('Error during initialization:', error);
                //         postMessage({action: "initializationError", message: error.message});
                //     });
                break;
                
            case "sendMessage":
                const success = sendMessage(value);
                postMessage({action: "messageSent", success: success});
                break;
                
            case "requestMessages":
                // Send a request for pending messages
                const requestSuccess = sendMessage({userID: userId, action: "getMessages"});
                postMessage({action: "messagesRequested", success: requestSuccess});
                break;
                
            case "disconnect":
                cleanup();
                postMessage({action: "disconnected"});
                break;
                
            default:
                console.warn('Unknown action received:', action);
        }
    } catch (error) {
        console.error('Error handling message:', error);
        postMessage({action: "error", message: error.message});
    }
};

// Handle worker termination
self.addEventListener('beforeunload', cleanup);
self.addEventListener('unload', cleanup);

// Initial setup message
postMessage({action: "workerReady"});
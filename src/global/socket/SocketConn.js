import io from 'socket.io-client';
import { baseUrl } from '../../config/HTTP';



let socket = null;

const createSocket = () => {
    socket = io(baseUrl.SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        randomizationFactor: 0.5
    });

    socket.on('connect', () => {
        console.warn('Socket connected');
    });

    socket.on('disconnect', () => {
        console.warn('Socket disconnected');
    });

    socket.on('reconnect', (attemptNumber) => {
        console.warn(`Socket reconnected after ${attemptNumber} attempts`);
    });

    socket.on('reconnect_attempt', () => {
        console.warn('Attempting to reconnect...');
    });

    socket.on('reconnect_error', (error) => {
        console.error('Reconnection attempt failed:', error);
    });

    return socket;
};

let listenersAttached = false;

const tryReconnect = () => {
    if (socket && !socket.connected) {
        socket.connect();
    }
};

export const initSocket = () => {
    if (!socket) {
        createSocket();
    }

    if (!listenersAttached) {
        listenersAttached = true;

        // Reconnect when page becomes visible (mobile unlock, tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                tryReconnect();
            }
        });

        // Reconnect when device comes back online
        window.addEventListener('online', () => {
            tryReconnect();
        });

        // Reconnect when window gets focus
        window.addEventListener('focus', () => {
            tryReconnect();
        });
    }

    return socket;
};

export const getSocket = () => {
    return socket;
};

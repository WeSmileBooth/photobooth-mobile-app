import { ref } from 'vue'
import { emitter } from './eventBus';

const ws = ref<WebSocket | null>(null)
const isConnected = ref(false)

export function useWebsocket() {
    const setupWebsocket = async () => {
        return new Promise((resolve, reject) => {
          if (ws.value?.readyState === WebSocket.OPEN) {
            resolve(true);
            return;
          }

          // Get the ngrok URL from the URL parameters
        const params = new URLSearchParams(window.location.search);
        const ngrokUrl = params.get('ngrok');

        if (!ngrokUrl) {
            console.error('No ngrok URL provided');
            reject(new Error('No ngrok URL provided'));
            return;
        }

        ws.value = new WebSocket(ngrokUrl);
      
          // ws.value = new WebSocket('ws://localhost:5080');
          //ws.value = new WebSocket('wss://3aa8-62-194-9-220.ngrok-free.app');

      
          ws.value.onopen = () => {
            console.log('Connected to server');
            isConnected.value = true;
            resolve(true);
          };

          ws.value.onmessage = (event) => {
            console.log('Message received:', event.data);
            const parsedData = JSON.parse(event.data);
            emitter.emit('ws-message', parsedData);
          }
      
          ws.value.onerror = (error) => {
            console.error('WebSocket error:', error);
            isConnected.value = false;
            reject(error);
          };
        });
      };

    const sendMessage = async (type: string, payload: any) => {
        if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
          await setupWebsocket()  
        }
        
        console.log('Sending message:', type);        
        if (ws.value && isConnected.value) {
          try {
            ws.value.send(JSON.stringify({ type, payload }));
            return true;
          } catch (error) {
            console.log(error);
            return false;
          }
        }
        
        return false;  // Added return false if not connected
      };

    return {
        isConnected,
        setupWebsocket,
        sendMessage
    }
}
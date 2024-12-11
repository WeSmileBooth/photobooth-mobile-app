function connectWebSocket() {
  // Determine if we're in development or production
  const wsHost = import.meta.env.DEV ? 
      'ws://localhost:5080' : 
      `ws://${window.location.hostname}:5080`;
  
  const ws = new WebSocket(wsHost);

  ws.onopen = () => {
      console.log('Connected to robot WebSocket server');
  };

  ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      // Handle incoming messages here
  };

  ws.onerror = (error) => {
      console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Optional: Implement reconnection logic here
  };

  return ws;
}
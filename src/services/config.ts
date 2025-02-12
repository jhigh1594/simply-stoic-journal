// Add or update the WebSocket configuration
export const WS_URL = process.env.NODE_ENV === 'production'
  ? 'wss://api.simplystoicism.com/graphql'  // Replace with your production WebSocket URL
  : 'ws://localhost:3001/graphql';  // Replace with your local WebSocket URL
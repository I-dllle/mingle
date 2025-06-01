export function createSocket(url: string): WebSocket {
  const socket = new WebSocket(url);
  return socket;
}

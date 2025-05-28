import type { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';

let socket: WebSocket | null = null;
const messageHandlers: Array<(msg: ChatMessagePayload) => void> = [];

export function connectWebSocket(token: string) {
  if (socket) socket.close();

  const wsUrl = `ws://your-domain/ws/chat`; // EC2 주소 or localhost로 교체
  socket = new WebSocket(`${wsUrl}?token=${token}`);

  socket.onopen = () => {
    console.log('[WebSocket 연결 성공]');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    messageHandlers.forEach((handler) => handler(data));
  };

  socket.onerror = (err) => {
    console.error('[WebSocket 에러]', err);
  };

  socket.onclose = () => {
    console.log('[WebSocket 연결 종료]');
  };
}

export function sendMessage(payload: ChatMessagePayload) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  } else {
    console.warn('WebSocket이 아직 열리지 않았습니다.');
  }
}

export function onMessage(handler: (msg: ChatMessagePayload) => void) {
  messageHandlers.push(handler);
}

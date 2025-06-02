'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';

export function useSocket(
  token: string,
  onMessage: (msg: ChatMessagePayload) => void
) {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/chat?token=${token}`; // EC2 주소 또는 localhost
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('[WebSocket 연결 성공]');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onerror = (err) => {
      console.error('[WebSocket 에러]', err);
    };

    socket.onclose = () => {
      console.log('[WebSocket 연결 종료]');
      setIsConnected(false);
    };

    return () => socket.close();
  }, [token, onMessage]);

  const send = (payload: ChatMessagePayload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.warn('WebSocket이 아직 열리지 않았습니다.');
    }
  };

  return { send, isConnected };
}

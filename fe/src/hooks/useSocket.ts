'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';

export function useSocket(
  roomId: number,
  token: string | null,
  onMessage: (msg: ChatMessagePayload) => void
) {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // token이 null 또는 "null" 문자열일 경우 연결 생략 (불필요한 WebSocket 연결 방지)
    if (!token || token === 'null') {
      console.warn('[useSocket] 유효하지 않은 토큰, 연결 생략');
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/chat/${roomId}?token=${token}`; // EC2 주소 또는 localhost
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
    console.log('[send() 호출됨] payload:', payload);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket 전송됨] JSON:', JSON.stringify(payload));
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.warn('WebSocket이 아직 열리지 않았습니다.');
    }
  };

  return { send, isConnected };
}

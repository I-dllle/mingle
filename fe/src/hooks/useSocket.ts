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

    // 이미 연결되어 있으면 중복 연결 생략
    if (socketRef.current) {
      console.warn('[useSocket] 기존 WebSocket 연결이 존재함, 재연결 생략');
      return;
    }

    // [WebSocket 연결 URL 구성]
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/chat/${roomId}?token=${token}`; // EC2 주소 또는 localhost
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    // ping 주기 설정: 서버에 지속 연결 신호 보내기
    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send('ping');
      }
    }, 10000); // 10초마다 ping

    socket.onopen = () => {
      console.log('[WebSocket 연결 성공]');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      console.log('[WebSocket 수신]', event.data);
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onerror = (err) => {
      console.error('[WebSocket 에러]', err);
    };

    socket.onclose = () => {
      console.log('[WebSocket 연결 종료]');
      setIsConnected(false);
      socketRef.current = null; // 연결 종료 시 socketRef 초기화

      // ping 중단
      clearInterval(pingInterval);
    };

    // 컴포넌트 언마운트 시 소켓 닫고 초기화
    return () => {
      socket.close();
      socketRef.current = null; // 컴포넌트 언마운트 시 socketRef 초기화

      // 컴포넌트 언마운트 시 ping 중단
      clearInterval(pingInterval);
    };
  }, [roomId, token]);

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

'use client';

import { useEffect, useState } from 'react';
import { connectWebSocket, sendMessage, onMessage } from '@/lib/socket';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import { ChatRoomType } from '@/features/chat/common/types/ChatRoomType';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';

export function useDmChat(roomId: number, receiverId: number | null) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);

  useEffect(() => {
    // websocket 연결
    const token = localStorage.getItem('token');
    if (token) {
      connectWebSocket(token);
    }

    // 메시지 수신 핸들러 등록
    const unsubscribe = onMessage((msg: ChatMessagePayload) => {
      if (msg.chatType === ChatRoomType.DIRECT && msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // 메시지 핸들러 정리 (메모리 누수 방지)
    return () => {
      unsubscribe?.(); // 수신 핸들러 해제
    };
  }, [roomId]);

  // receiverId가 있을 때만 메시지 전송
  const sendDmMessage = (content: string) => {
    if (receiverId === null) return;

    const payload: ChatMessagePayload = {
      roomId,
      receiverId,
      senderId: 1, // 후속 단계에서 auth에서 가져올 예정
      content,
      format: MessageFormat.TEXT,
      chatType: ChatRoomType.DIRECT,
      createdAt: new Date().toISOString(),
    };
    sendMessage(payload);
  };

  return {
    messages,
    sendDmMessage,
  };
}

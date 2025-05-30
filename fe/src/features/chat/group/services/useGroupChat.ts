'use client';

import { useEffect, useState } from 'react';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import { ChatRoomType } from '@/features/chat/common/types/ChatRoomType';
import { connectWebSocket, sendMessage, onMessage } from '@/lib/socket';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';

export function useGroupChat(roomId: number) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      connectWebSocket(token);
    }

    onMessage((msg: ChatMessagePayload) => {
      if (msg.chatType === ChatRoomType.GROUP && msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    });
  }, [roomId]);

  const sendGroupMessage = (content: string) => {
    const userId = Number(localStorage.getItem('userId')); // 프론트에 저장된 userId를 사용
    if (!userId) return;

    const payload: ChatMessagePayload = {
      roomId,
      senderId: userId,
      chatType: ChatRoomType.GROUP, // DM일 때는 ChatRoomType.DM
      content,
      format: MessageFormat.TEXT,
      createdAt: new Date().toISOString(),
    };
    sendMessage(payload);
  };

  return {
    messages,
    sendGroupMessage,
  };
}

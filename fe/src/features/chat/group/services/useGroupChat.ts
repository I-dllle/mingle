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
    const payload: ChatMessagePayload = {
      roomId,
      chatType: ChatRoomType.GROUP,
      content,
      format: MessageFormat.TEXT,
    };
    sendMessage(payload);
  };

  return {
    messages,
    sendGroupMessage,
  };
}

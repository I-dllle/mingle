'use client';

import { useEffect, useState } from 'react';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import { ChatRoomType } from '@/features/chat/common/types/ChatRoomType';
import { useSocket } from '@/hooks/useSocket';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';
import { fetchGroupChatMessages } from './fetchGroupChatMessages'; // 초기 메시지 불러오기 위한 API

export function useGroupChat(roomId: number) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);

  const token = localStorage.getItem('token')!;
  const { send } = useSocket(token, (msg) => {
    if (msg.chatType === ChatRoomType.GROUP && msg.roomId === roomId) {
      setMessages((prev) => [...prev, msg]);
    }
  });

  // 초기 메시지 로딩
  useEffect(() => {
    if (!roomId || isNaN(roomId)) return;

    const loadInitialMessages = async () => {
      try {
        const data = await fetchGroupChatMessages(roomId); // 🔧 [추가]
        setMessages(data); // 🔧 [추가] 초기 메시지 저장
      } catch (error) {
        console.error('초기 그룹 채팅 메시지 로딩 실패:', error);
      }
    };

    loadInitialMessages();
  }, [roomId]);

  const sendGroupMessage = (content: string) => {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) return;

    const payload: ChatMessagePayload = {
      roomId,
      senderId: userId,
      chatType: ChatRoomType.GROUP,
      content,
      format: MessageFormat.TEXT,
      createdAt: new Date().toISOString(),
    };
    send(payload); // 🔄 수정
  };

  return {
    messages,
    sendGroupMessage,
  };
}

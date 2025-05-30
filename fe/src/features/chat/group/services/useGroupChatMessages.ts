'use client';

import { useEffect, useState } from 'react';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import { connectWebSocket, onMessage } from '@/lib/socket';
import { ChatRoomType } from '@/features/chat/common/types/ChatRoomType';
import { fetchGroupChatMessages } from './fetchGroupChatMessages';

/**
 * 그룹 채팅방 내 메시지를 받아오는 훅
 * - 초기 메시지 목록은 API를 통해 가져옴
 * - 이후 WebSocket을 통해 실시간 메시지를 수신
 */
export function useGroupChatMessages(roomId: number) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);

  // 1. 초기 메시지 목록 불러오기
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const initialMessages = await fetchGroupChatMessages(roomId);
        setMessages(initialMessages);
      } catch (error) {
        console.error('채팅 메시지 로딩 실패:', error);
      }
    };

    loadMessages();
  }, [roomId]);

  // 2. WebSocket 수신 메시지 핸들링
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

  return {
    messages,
  };
}

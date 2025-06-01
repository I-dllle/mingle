'use client';

import { useEffect, useState } from 'react';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import { ChatRoomType } from '@/features/chat/common/types/ChatRoomType';
import { connectWebSocket, sendMessage, onMessage } from '@/lib/socket';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';
import { fetchGroupChatMessages } from './fetchGroupChatMessages'; // 초기 메시지 불러오기 위한 API

export function useGroupChat(roomId: number) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);

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

  // WebSocket 연결 및 실시간 메시지 수신
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      connectWebSocket(token);
    }

    const handleMessage = (msg: ChatMessagePayload) => {
      if (msg.chatType === ChatRoomType.GROUP && msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]); // 실시간 메시지 추가
      }
    };

    onMessage(handleMessage);

    // 클린업 함수
    return () => {
      // onMessage 해제 로직이 있다면 호출
      // 예: removeListener(handleMessage)
    };
  }, [roomId]);

  // 메시지 전송 함수
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

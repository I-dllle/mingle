'use client';

import { useEffect, useState } from 'react';
import { connectWebSocket, sendMessage, onMessage } from '@/lib/socket';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import { ChatRoomType } from '@/features/chat/common/types/ChatRoomType';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';
import { fetchDmChatMessages } from './fetchDmChatMessages'; // 과거 메시지 fetch 함수

export function useDmChat(roomId: number, receiverId: number | null) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]); // 과거 + 실시간 메시지 포함

  // senderId를 localStorage에서 가져오도록 변경 예정
  const userId = Number(localStorage.getItem('userId')); // 인증 연동 시 이 부분은 추상화된 유저 훅으로 대체 가능

  // 초기에 과거 메시지 불러오기
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const pastMessages = await fetchDmChatMessages(roomId);
        setMessages(pastMessages); // 과거 메시지 저장
      } catch (error) {
        console.error('과거 메시지 불러오기 실패:', error);
      }
    };

    loadMessages();
  }, [roomId]);

  // 실시간 메시지 수신 처리
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
      senderId: userId, // localStorage에서 가져온 값 사용
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

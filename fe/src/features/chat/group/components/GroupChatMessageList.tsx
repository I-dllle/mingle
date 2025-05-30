'use client';

import { useEffect, useState } from 'react';
import { useGroupChat } from '@/features/chat/group/services/useGroupChat';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import { fetchGroupChatMessages } from '@/features/chat/group/services/fetchGroupChatMessages';

interface GroupChatMessageListProps {
  roomId: number;
}

// 시간 포맷팅 함수 분리
const formatTimestamp = (timestamp: string | undefined): string => {
  if (!timestamp) return '시간 없음';
  return new Date(timestamp).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function GroupChatMessageList({
  roomId,
}: GroupChatMessageListProps) {
  const [initialMessages, setInitialMessages] = useState<ChatMessagePayload[]>(
    []
  );
  const { messages: liveMessages } = useGroupChat(roomId);

  // 최초 진입 시 메시지 불러오기
  useEffect(() => {
    if (!roomId || isNaN(roomId)) return;

    const loadMessages = async () => {
      try {
        const data = await fetchGroupChatMessages(roomId);
        setInitialMessages(data);
      } catch (err) {
        console.error('채팅 메시지 불러오기 실패:', err);
      }
    };
    loadMessages();
  }, [roomId]);

  // 초기 메시지 + 실시간 메시지 합치기
  const allMessages = [...initialMessages, ...liveMessages];

  return (
    <div
      style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {allMessages.map((msg: ChatMessagePayload, idx: number) => (
        <div
          key={`${msg.createdAt}-${msg.senderId}-${idx}`} // 고유 key 생성
          style={{
            background: '#f0f0f0',
            padding: '8px',
            borderRadius: '6px',
          }}
        >
          <div style={{ fontSize: '14px', color: '#888' }}>
            From: {msg.senderId ?? '알 수 없음'}
          </div>
          <div>{msg.content}</div>
          <div style={{ fontSize: '12px', color: '#aaa' }}>
            {msg.format} · {formatTimestamp(msg.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
}

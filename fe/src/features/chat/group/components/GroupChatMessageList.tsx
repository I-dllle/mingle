'use client';

import { useGroupChat } from '@/features/chat/group/services/useGroupChat';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';

interface GroupChatMessageListProps {
  roomId: number;
}

export default function GroupChatMessageList({
  roomId,
}: GroupChatMessageListProps) {
  const { messages } = useGroupChat(roomId);

  return (
    <div
      style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {messages.map((msg: ChatMessagePayload, idx: number) => (
        <div
          key={idx}
          style={{ background: '#f0f0f0', padding: '8px', borderRadius: '6px' }}
        >
          <div style={{ fontSize: '14px', color: '#888' }}>
            From: {msg.senderId ?? '알 수 없음'}
          </div>
          <div>{msg.content}</div>
          <div style={{ fontSize: '12px', color: '#aaa' }}>
            {msg.format}
            {' · '}
            {msg.createdAt
              ? new Date(msg.createdAt).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '시간 없음'}
          </div>
        </div>
      ))}
    </div>
  );
}

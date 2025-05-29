'use client';

import { useDmChat } from '@/features/chat/dm/services/useDmChat';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';

interface DmChatMessageListProps {
  roomId: number;
  receiverId: number;
}

export default function DmChatMessageList({
  roomId,
  receiverId,
}: DmChatMessageListProps) {
  const { messages } = useDmChat(roomId, receiverId);

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
          style={{
            background: '#fff1f0',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ffccc7',
          }}
        >
          <div style={{ fontSize: '14px', color: '#888' }}>
            From: {msg.senderId ?? '알 수 없음'}
          </div>
          <div>{msg.content}</div>
          <div style={{ fontSize: '12px', color: '#aaa' }}>{msg.format}</div>
        </div>
      ))}
    </div>
  );
}

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

  // 현재 로그인한 사용자 ID (임시: 로컬에서 가져옴)
  const currentUserId = Number(localStorage.getItem('userId'));

  return (
    <div
      style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {messages.map((msg: ChatMessagePayload, idx: number) => {
        // 보낸 사람이 나인지 확인
        const isMe = msg.senderId === currentUserId;

        return (
          <div
            key={idx}
            style={{
              // 보낸 사람에 따라 메시지 위치와 스타일 다르게 적용
              alignSelf: isMe ? 'flex-end' : 'flex-start', // 좌우 정렬
              background: isMe ? '#d9f7be' : '#fff1f0', // 배경 색상 구분
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              maxWidth: '70%',
              textAlign: isMe ? 'right' : 'left', // 텍스트 정렬
            }}
          >
            <div style={{ fontSize: '14px', color: '#888' }}>
              {/* 발신자 라벨링 */}
              {isMe ? '나' : `상대(${msg.senderId})`}
            </div>
            <div>{msg.content}</div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>{msg.format}</div>
          </div>
        );
      })}
    </div>
  );
}

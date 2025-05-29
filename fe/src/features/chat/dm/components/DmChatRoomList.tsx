'use client';

import { useDmChatRoomList } from '@/features/chat/dm/services/useDmChatRoomList';
import { ChatRoomSummary } from '@/features/chat/dm/types/ChatRoomSummary';
import { useRouter } from 'next/navigation';

export default function DmChatRoomList() {
  const { rooms } = useDmChatRoomList();
  const router = useRouter();

  return (
    <div style={{ padding: '16px' }}>
      <h2>DM 채팅방 목록</h2>
      {rooms.length === 0 ? (
        <div>채팅방이 없습니다.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {rooms.map((room: ChatRoomSummary, idx: number) => (
            <li
              key={idx}
              onClick={() => router.push(`/chat-detail/dm/${room.roomId}`)} // router.push 사용으로 이동
              style={{
                padding: '12px',
                marginBottom: '12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
                background: room.unreadCount > 0 ? '#fff7e6' : '#f9f9f9', // 안 읽은 메시지 색상 강조
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{room.opponentNickname}</div>
              <div>
                {/* 메시지 형식 구분 */}
                {room.format === 'ARCHIVE' ? '[자료]' : room.previewMessage}
                {' | '}
                {room.sentAt?.slice(0, 16).replace('T', ' ')}
              </div>
              {/* 안 읽은 메시지 수 강조 */}
              {room.unreadCount > 0 && (
                <div style={{ color: 'red' }}>
                  안 읽은 메시지 {room.unreadCount}개
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

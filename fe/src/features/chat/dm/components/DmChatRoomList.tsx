'use client';

import { useDmChatRoomList } from '@/features/chat/dm/services/useDmChatRoomList';
import { useRouter } from 'next/navigation';

// 시간 포맷 함수 분리
function formatTime(isoString: string) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DmChatRoomList() {
  const { rooms } = useDmChatRoomList();
  const router = useRouter();

  return (
    <ul style={{ marginTop: 20 }}>
      {rooms.length === 0 ? (
        <div className="text-gray-400 px-4 py-8">채팅방이 없습니다.</div>
      ) : (
        rooms.map((room) => (
          <li
            key={room.roomId}
            onClick={() => router.push(`/dm/${room.roomId}`)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition mb-2"
          >
            <img
              src={'/default-avatar.png'}
              alt={room.opponentNickname}
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
              style={{ minWidth: 40, minHeight: 40 }}
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-medium text-[16px] text-gray-900 truncate">
                {room.opponentNickname}
              </span>
              <span className="text-sm text-gray-500 truncate max-w-[200px]">
                {room.format === 'ARCHIVE' ? '[자료]' : room.previewMessage}
              </span>
            </div>
            <span className="text-xs text-gray-400 ml-2">
              {formatTime(room.sentAt)}
            </span>
            {room.unreadCount > 0 && (
              <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                {room.unreadCount}
              </span>
            )}
          </li>
        ))
      )}
    </ul>
  );
}

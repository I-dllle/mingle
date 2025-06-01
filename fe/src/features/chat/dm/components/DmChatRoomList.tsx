'use client';

import { useDmChatRoomList } from '@/features/chat/dm/services/useDmChatRoomList';
import { useRouter } from 'next/navigation';
import styles from './DmChatRoomList.module.css';

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
    <div className={styles.container}>
      {' '}
      {/* 인라인 → className */}
      <h2 className={styles.title}>DM 채팅방 목록</h2>
      {rooms.length === 0 ? (
        <div className={styles.empty}>채팅방이 없습니다.</div>
      ) : (
        <ul className={styles.list}>
          {rooms.map((room) => (
            <li
              key={room.roomId} // idx 대신 고유 ID 사용
              onClick={() => router.push(`/chat-detail/dm/${room.roomId}`)}
              className={`${styles.item} ${
                room.unreadCount > 0 ? styles.unread : styles.read
              }`} // 읽음 여부에 따라 동적 클래스 적용
            >
              <div className={styles.nickname}>{room.opponentNickname}</div>
              <div className={styles.message}>
                {room.format === 'ARCHIVE' ? '[자료]' : room.previewMessage} |{' '}
                {formatTime(room.sentAt)}
              </div>
              {room.unreadCount > 0 && (
                <div className={styles.unreadCount}>
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

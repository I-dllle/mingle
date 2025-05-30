'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchGroupChatRoomInfo } from '@/features/chat/group/services/fetchGroupChatRoomInfo';
import { GroupChatRoom } from '@/features/chat/group/types/GroupChatRoom';

// roomId 기반 fetch 구조
export default function GroupChatRoomHeader() {
  //  Next.js 동적 라우팅에서 roomId 추출
  const { roomId } = useParams();
  const parsedRoomId = Number(roomId);

  // 상태 정의
  const [room, setRoom] = useState<GroupChatRoom | null>(null);

  // fetch 요청으로 방 정보 가져오기
  useEffect(() => {
    if (!parsedRoomId) return;
    fetchGroupChatRoomInfo(parsedRoomId)
      .then(setRoom)
      .catch((err) => {
        console.error('채팅방 정보 조회 실패:', err);
      });
  }, [parsedRoomId]);

  // 로딩 처리
  if (!room) return <div>채팅방 정보를 불러오는 중...</div>;

  return (
    <div style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
      {/* room.name 표시 */}
      <h2>{room.name}</h2>

      {/* 유형 및 소속 텍스트 출력 */}
      <div style={{ fontSize: '14px', color: '#666' }}>
        유형: {room.roomType === 'ARCHIVE' ? '자료방' : '일반방'} / 소속:{' '}
        {room.scope === 'PROJECT' ? '프로젝트' : '부서'}
      </div>
    </div>
  );
}

'use client';

import { GroupChatRoom } from '@/features/chat/group/types/GroupChatRoom';

interface Props {
  room: GroupChatRoom;
}

// roomId 기반 fetch 구조
export default function GroupChatRoomHeader({ room }: Props) {
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

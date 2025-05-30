'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchGroupChatRoomInfo } from '@/features/chat/group/services/fetchGroupChatRoomInfo';
import { GroupChatRoom } from '@/features/chat/group/types/GroupChatRoom';
import GroupChatRoomHeader from '@/features/chat/group/components/GroupChatRoomHeader';
import GroupChatMessageList from '@/features/chat/group/components/GroupChatMessageList';
import GroupChatInput from '@/features/chat/group/components/GroupChatInput';

export default function GroupChatDetailPage() {
  // [1] URL에서 roomId 파라미터 추출
  const params = useParams();
  const roomId = Number(params.roomId);

  // [2] 채팅방 정보 상태 정의
  const [roomInfo, setRoomInfo] = useState<GroupChatRoom | null>(null);

  // [3] 컴포넌트 마운트 시 roomId로 채팅방 정보 요청
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await fetchGroupChatRoomInfo(roomId);
        setRoomInfo(data);
      } catch (error) {
        console.error('채팅방 정보 불러오기 실패:', error);
      }
    };

    fetchRoom();
  }, [roomId]);

  // [4] 로딩 처리 (데이터 없으면 렌더링 지연)
  if (!roomInfo) {
    return <div style={{ padding: '24px' }}>채팅방 정보를 불러오는 중...</div>;
  }

  // [5] 채팅방 상세 UI 렌더링
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 채팅방 상단 정보 (이름, 유형 등) */}
      <GroupChatRoomHeader room={roomInfo} />

      {/* 채팅 메시지 리스트 (스크롤 가능) */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <GroupChatMessageList roomId={roomId} />
      </div>

      {/* 메시지 입력창 */}
      <GroupChatInput roomId={roomId} />
    </div>
  );
}

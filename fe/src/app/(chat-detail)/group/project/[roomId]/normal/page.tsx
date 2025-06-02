'use client';

import { useParams } from 'next/navigation';
import GroupChatRoomHeader from '@/features/chat/group/components/GroupChatRoomHeader';
import GroupChatMessageList from '@/features/chat/group/components/GroupChatMessageList';
import GroupChatInput from '@/features/chat/group/components/GroupChatInput';
import { fetchGroupChatRoomInfo } from '@/features/chat/group/services/fetchGroupChatRoomInfo';
import { useEffect, useState } from 'react';
import type { GroupChatRoom } from '@/features/chat/group/types/GroupChatRoom';

export default function ProjectChatRoomPage() {
  const { roomId } = useParams();
  const [roomInfo, setRoomInfo] = useState<GroupChatRoom | null>(null);

  useEffect(() => {
    (async () => {
      const info = await fetchGroupChatRoomInfo(Number(roomId));
      setRoomInfo(info);
    })();
  }, [roomId]);

  if (!roomInfo) return <div>채팅방 정보를 불러오는 중...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <GroupChatRoomHeader room={roomInfo} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <GroupChatMessageList roomId={Number(roomId)} />
      </div>
      <GroupChatInput roomId={Number(roomId)} />
    </div>
  );
}

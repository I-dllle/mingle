'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchGroupChatRoomInfo } from '@/features/chat/group/services/fetchGroupChatRoomInfo';
import type { GroupChatRoom } from '@/features/chat/group/types/GroupChatRoom';
import GroupChatRoomHeader from '@/features/chat/group/components/GroupChatRoomHeader';
import GroupChatMessageList from '@/features/chat/group/components/GroupChatMessageList';
import GroupChatInput from '@/features/chat/group/components/GroupChatInput';
import ChatPanelChatLayout from '@/features/chat/panel/ChatPanelChatLayout';
import ChatTopTitle from '@/features/chat/panel/ChatTopTitle';

export default function TeamChatRoomPage() {
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
    <ChatPanelChatLayout
      title={<ChatTopTitle />}
      onBack={() => {}}
      tabs={<GroupChatRoomHeader room={roomInfo} />}
      input={<GroupChatInput roomId={Number(roomId)} />}
    >
      <GroupChatMessageList roomId={Number(roomId)} />
    </ChatPanelChatLayout>
  );
}

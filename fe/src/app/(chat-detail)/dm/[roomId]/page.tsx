'use client';

import ChatTopTitle from '@/features/chat/common/components/ChatTopTitle';
import { useParams } from 'next/navigation';
import DmChatMessageList from '@/features/chat/dm/components/DmChatMessageList';
import DmChatInput from '@/features/chat/dm/components/DmChatInput';

export default function DmChatRoomPage() {
  const { roomId } = useParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChatTopTitle />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <DmChatMessageList roomId={Number(roomId)} />
      </div>
      <DmChatInput roomId={Number(roomId)} />
    </div>
  );
}

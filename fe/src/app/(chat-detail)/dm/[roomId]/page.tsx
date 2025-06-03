'use client';

import ChatPanelChatLayout from '@/features/chat/panel/ChatPanelChatLayout';
import ChatPanelHeader from '@/features/chat/panel/ChatPanelHeader';
import ChatPanelWelcome from '@/features/chat/panel/ChatPanelWelcome';
import DmChatMessageList from '@/features/chat/dm/components/DmChatMessageList';
import ChatPanelInput from '@/features/chat/panel/ChatPanelInput';
import { useParams } from 'next/navigation';
import { useDmChatRoomList } from '@/features/chat/dm/services/useDmChatRoomList';
import { useDmChat } from '@/features/chat/dm/services/useDmChat';

export default function DmChatRoomPage() {
  const { roomId } = useParams();
  const { rooms } = useDmChatRoomList();
  const room = rooms.find((r) => r.roomId === Number(roomId));

  // 메시지에서 receiverId 추출
  const userId =
    typeof window !== 'undefined' ? Number(localStorage.getItem('userId')) : 0;
  const { messages, sendDmMessage } = useDmChat(Number(roomId), null);
  let receiverId = 0;
  if (messages && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.senderId === userId && lastMsg.receiverId) {
      receiverId = lastMsg.receiverId;
    } else if (lastMsg.senderId !== userId) {
      receiverId = lastMsg.senderId;
    }
  }

  return (
    <ChatPanelChatLayout
      title={
        <ChatPanelHeader
          title={room?.opponentNickname || 'DM'}
          type="team"
          onSearch={() => {}}
          onBack={() => {}}
        />
      }
      welcome={
        <ChatPanelWelcome
          title={room?.opponentNickname || '상대방'}
          description={
            room
              ? `${room.opponentNickname}님과의 1:1 대화입니다.`
              : '상대방과의 1:1 대화입니다.'
          }
          type="team"
        />
      }
      input={<ChatPanelInput onSend={(msg) => sendDmMessage(msg)} />}
    >
      <DmChatMessageList roomId={Number(roomId)} receiverId={receiverId} />
    </ChatPanelChatLayout>
  );
}

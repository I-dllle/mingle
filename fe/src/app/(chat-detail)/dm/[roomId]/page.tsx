'use client';

import ChatPanelChatLayout from '@/features/chat/panel/ChatPanelChatLayout';
import DmChatMessageList from '@/features/chat/dm/components/DmChatMessageList';
import ChatPanelInput from '@/features/chat/panel/ChatPanelInput';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useDmChatRoomList } from '@/features/chat/dm/services/useDmChatRoomList';
import { useDmChat } from '@/features/chat/dm/services/useDmChat';
import DMPanelTabs from '@/features/chat/panel/DMPanelTabs';
import ChatTopTitle from '@/features/chat/panel/ChatTopTitle';
import DmPanelWelcome from '@/features/chat/panel/DmPanelWelcome';

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

  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname === '/dm' ? 'start' : 'list';
  const handleTabChange = (key: string) => {
    if (key === 'start') router.push('/dm');
    // 'list'는 현재 방이므로 이동하지 않음
  };

  return (
    <ChatPanelChatLayout
      title={
        <div>
          {/* 1. 상단 타이틀/아이콘 */}
          <div className="flex items-center justify-between px-8 pt-8">
            <ChatTopTitle />
            <div className="flex items-center gap-4">
              {/* 기존 우측 아이콘 (검색, 화살표 등) 유지: ChatPanelHeader에서 관리하거나 별도 컴포넌트로 분리 가능 */}
            </div>
          </div>
          {/* 2. 탭 */}
          <div className="mt-2">
            <DMPanelTabs
              tabs={[
                { key: 'start', label: '친구' },
                { key: 'list', label: 'DM' },
              ]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      }
      welcome={
        <DmPanelWelcome
          profileImageUrl={
            room?.opponentProfileImageUrl || '/default-avatar.png'
          }
          nickname={room?.opponentNickname ?? ''}
        />
      }
      input={<ChatPanelInput onSend={(msg) => sendDmMessage(msg)} />}
    >
      <DmChatMessageList roomId={Number(roomId)} receiverId={receiverId} />
    </ChatPanelChatLayout>
  );
}

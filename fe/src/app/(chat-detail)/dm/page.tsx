'use client';

import { useState } from 'react';
import DmChatRoomList from '@/features/chat/dm/components/DmChatRoomList';
import ChatTopTitle from '@/features/chat/panel/ChatTopTitle';
import ChatPanelListLayout from '@/features/chat/panel/ChatPanelListLayout';
import DMPanelTabs from '@/features/chat/panel/DMPanelTabs';

// dynamic import로 DmStartUserList 불러오기 (클라이언트 전용)
import dynamic from 'next/dynamic';
const DmStartUserList = dynamic(
  () => import('@/features/chat/dm/components/DmStartUserList'),
  { ssr: false }
);

export default function DmChatListPage() {
  const [tab, setTab] = useState<'start' | 'list'>('start');

  return (
    <ChatPanelListLayout
      title={<ChatTopTitle />}
      onBack={() => {}}
      tabs={
        <DMPanelTabs
          tabs={[
            { key: 'start', label: '친구' },
            { key: 'list', label: 'DM' },
          ]}
          activeTab={tab}
          onTabChange={(key) => setTab(key as 'start' | 'list')}
        />
      }
    >
      {tab === 'start' ? <DmStartUserList /> : <DmChatRoomList />}
    </ChatPanelListLayout>
  );
}

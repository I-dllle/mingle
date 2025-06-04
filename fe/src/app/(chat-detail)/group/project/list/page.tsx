'use client';

import ChatTopTitle from '@/features/chat/panel/ChatTopTitle';
import GroupChatRoomList from '@/features/chat/group/components/GroupChatRoomList';
import { useState } from 'react';
import ChatPanelListLayout from '@/features/chat/panel/ChatPanelListLayout';
import ProjectPanelTabs from '@/features/chat/panel/ProjectPanelTabs';

export default function ProjectListPage() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  return (
    <ChatPanelListLayout
      title={<ChatTopTitle />}
      onBack={() => {}}
      tabs={
        <ProjectPanelTabs
          tabs={[
            { key: 'active', label: '진행중' },
            { key: 'completed', label: '진행 완료' },
          ]}
          activeTab={tab}
          onTabChange={(key) => setTab(key as 'active' | 'completed')}
        />
      }
    >
      <GroupChatRoomList projectStatus={tab} />
    </ChatPanelListLayout>
  );
}

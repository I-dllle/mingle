'use client';

import ChatTopTitle from '@/features/chat/panel/ChatTopTitle';
import GroupChatRoomList from '@/features/chat/group/components/GroupChatRoomList';
import { useState } from 'react';
import ChatPanelListLayout from '@/features/chat/panel/ChatPanelListLayout';

export default function ProjectListPage() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  return (
    <ChatPanelListLayout
      title={<ChatTopTitle />}
      onBack={() => {}}
      tabs={
        <>
          <button
            style={{
              fontWeight: tab === 'active' ? 'bold' : 'normal',
              border: 'none',
              background: 'none',
              fontSize: 18,
              color: tab === 'active' ? '#222' : '#aaa',
              padding: '12px 24px',
              borderBottom: tab === 'active' ? '2px solid #7B61FF' : 'none',
              cursor: 'pointer',
            }}
            onClick={() => setTab('active')}
          >
            진행중
          </button>
          <button
            style={{
              fontWeight: tab === 'completed' ? 'bold' : 'normal',
              border: 'none',
              background: 'none',
              fontSize: 18,
              color: tab === 'completed' ? '#222' : '#aaa',
              padding: '12px 24px',
              borderBottom: tab === 'completed' ? '2px solid #7B61FF' : 'none',
              cursor: 'pointer',
            }}
            onClick={() => setTab('completed')}
          >
            진행 완료
          </button>
        </>
      }
    >
      <GroupChatRoomList projectStatus={tab} />
    </ChatPanelListLayout>
  );
}

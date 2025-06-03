'use client';

import { useState } from 'react';
import DmChatRoomList from '@/features/chat/dm/components/DmChatRoomList';
import ChatTopTitle from '@/features/chat/panel/ChatTopTitle';
import ChatPanelListLayout from '@/features/chat/panel/ChatPanelListLayout';

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
        <>
          <button
            style={{
              fontWeight: tab === 'start' ? 'bold' : 'normal',
              border: 'none',
              background: 'none',
              fontSize: 18,
              color: tab === 'start' ? '#222' : '#aaa',
              padding: '12px 24px',
              borderBottom: tab === 'start' ? '2px solid #7B61FF' : 'none',
              cursor: 'pointer',
            }}
            onClick={() => setTab('start')}
          >
            친구
          </button>
          <button
            style={{
              fontWeight: tab === 'list' ? 'bold' : 'normal',
              border: 'none',
              background: 'none',
              fontSize: 18,
              color: tab === 'list' ? '#222' : '#aaa',
              padding: '12px 24px',
              borderBottom: tab === 'list' ? '2px solid #7B61FF' : 'none',
              cursor: 'pointer',
            }}
            onClick={() => setTab('list')}
          >
            DM
          </button>
        </>
      }
    >
      {tab === 'start' ? <DmStartUserList /> : <DmChatRoomList />}
    </ChatPanelListLayout>
  );
}

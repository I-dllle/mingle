'use client';

import ChatTopTitle from '@/features/chat/common/components/ChatTopTitle';
import GroupChatRoomList from '@/features/chat/group/components/GroupChatRoomList';
import { useState } from 'react';

export default function ProjectListPage() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  return (
    <div>
      <ChatTopTitle />
      <div
        style={{
          display: 'flex',
          gap: 16,
          borderBottom: '1px solid #eee',
          marginBottom: 24,
        }}
      >
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
      </div>
      <GroupChatRoomList projectStatus={tab} />
    </div>
  );
}

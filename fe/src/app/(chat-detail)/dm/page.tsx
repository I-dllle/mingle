'use client';

import DmChatRoomList from '@/features/chat/dm/components/DmChatRoomList';

export default function DmChatListPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1>내 DM 채팅방</h1>
      <DmChatRoomList />
    </main>
  );
}

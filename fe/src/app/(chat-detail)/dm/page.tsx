'use client';

import DmChatRoomList from '@/features/chat/dm/components/DmChatRoomList';

// dynamic import로 DmStartUserList 불러오기 (클라이언트 전용)
import dynamic from 'next/dynamic';
const DmStartUserList = dynamic(
  () => import('@/features/chat/dm/components/DmStartUserList'),
  { ssr: false }
);

export default function DmChatListPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: 16 }}>내 DM 채팅방</h1>

      {/* 기존 채팅방 목록 */}
      <DmChatRoomList />

      <hr style={{ margin: '32px 0' }} />

      {/* 새 DM 시작할 수 있는 유저 리스트 */}
      <DmStartUserList />
    </main>
  );
}

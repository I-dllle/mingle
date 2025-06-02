'use client';

import ChatTopTitle from '@/features/chat/common/components/ChatTopTitle';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function TeamRoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { teamId: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { teamId } = params;

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
            fontWeight: pathname.endsWith('/normal') ? 'bold' : 'normal',
          }}
          onClick={() =>
            router.push(`/chat-detail/group/team/${teamId}/normal`)
          }
        >
          채팅방
        </button>
        <button
          style={{
            fontWeight: pathname.endsWith('/archive') ? 'bold' : 'normal',
          }}
          onClick={() =>
            router.push(`/chat-detail/group/team/${teamId}/archive`)
          }
        >
          자료방
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
}

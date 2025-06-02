'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function ProjectRoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { roomId: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { roomId } = params;

  return (
    <div>
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
            router.push(`/chat-detail/group/project/${roomId}/normal`)
          }
        >
          채팅방
        </button>
        <button
          style={{
            fontWeight: pathname.endsWith('/archive') ? 'bold' : 'normal',
          }}
          onClick={() =>
            router.push(`/chat-detail/group/project/${roomId}/archive`)
          }
        >
          자료방
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
}

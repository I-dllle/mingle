'use client';

import ChatPanelListLayout from '@/features/chat/panel/ChatPanelListLayout';
import ChatPanelTabs from '@/features/chat/panel/ChatPanelTabs';
import ChatTopTitle from '@/features/chat/panel/ChatTopTitle';
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

  // Determine active tab from pathname
  const activeTab = pathname.endsWith('/archive') ? 'archive' : 'chat';

  return (
    <ChatPanelListLayout
      title={<ChatTopTitle />}
      tabs={
        <ChatPanelTabs
          activeTab={activeTab as 'chat' | 'archive'}
          onTabChange={(tab) => {
            router.push(
              `/chat-detail/group/team/${teamId}/${
                tab === 'chat' ? 'normal' : 'archive'
              }`
            );
          }}
        />
      }
    >
      {children}
    </ChatPanelListLayout>
  );
}

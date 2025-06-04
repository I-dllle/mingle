'use client';

import { useSidebar } from '@/hooks/useSidebar';

export default function ToggleSidebarButton() {
  const { toggleRightSidebar } = useSidebar();

  return <button onClick={toggleRightSidebar}>👉 채팅 사이드바 토글</button>;
}

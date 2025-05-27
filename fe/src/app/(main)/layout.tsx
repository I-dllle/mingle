// 로그인 후 업무용 레이아웃
// 공통 사이드바, 부서별 사이드바, 우측 채팅 고정 포함

import React from 'react';
import { SidebarProvider } from '@/hooks/useSidebar'; // 사이드바 열림/닫힘 상태 관리
import ClientFetcher from '@/components/layout/ClientFetcher';

// Server Component로 동작하는 레이아웃
// 실제 유저 정보 fetch는 ClientFetcher 안에서 처리됨
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* 유저 정보를 브라우저에서 fetch하고, 조건부 렌더링 처리 */}
      <ClientFetcher>{children}</ClientFetcher>
    </SidebarProvider>
  );
}

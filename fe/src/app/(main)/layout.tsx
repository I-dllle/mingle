'use client';

import React from 'react';
import LeftSidebar from '@/components/ui/LeftSidebar';
import DepartmentSidebar from '@/components/ui/DepartmentSidebar';
import RightMessenger from '@/components/ui/RightMessenger';
import { SidebarProvider } from '@/hooks/useSidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          background: '#f5f6fa',
        }}
      >
        <LeftSidebar />
        <DepartmentSidebar />
        <main
          style={{
            flex: 1,
            marginLeft: 80,
            marginRight: 320,
            minHeight: '100vh',
            padding: 32,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {children}
        </main>
        <RightMessenger />
      </div>
    </SidebarProvider>
  );
}

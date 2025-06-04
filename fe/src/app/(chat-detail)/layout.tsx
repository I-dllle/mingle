'use client';

import React from 'react';
import { SidebarProvider } from '@/hooks/useSidebar';
import AuthGuard from '@/features/user/auth/components/AuthGuard';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AuthGuard>{children}</AuthGuard>
    </SidebarProvider>
  );
}

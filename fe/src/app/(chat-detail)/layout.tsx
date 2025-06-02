'use client';

import AuthGuard from '@/features/user/auth/components/AuthGuard';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>; // 또는 메신저 레이아웃 포함
}

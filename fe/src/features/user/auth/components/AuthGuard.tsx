'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchCurrentUser } from '@/features/user/auth/services/authService';
import type { CurrentUser } from '@/features/user/auth/types/user';
import ClientDepartmentProvider from '@/components/layout/ClientDepartmentProvider';
import LeftSidebar from '@/components/ui/LeftSidebar';
import DepartmentSidebar from '@/components/ui/DepartmentSidebar';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isDmDetail = /^\/dm\/[0-9]+$/.test(pathname);

  useEffect(() => {
    (async () => {
      const me = await fetchCurrentUser();
      if (!me) {
        router.replace('/login');
      } else {
        setUser(me);
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading || !user) return null;

  return (
    <ClientDepartmentProvider name={user.departmentName ?? 'default'}>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          background: isDmDetail ? '#f5f3ff' : '#f5f6fa',
        }}
      >
        <LeftSidebar />
        <DepartmentSidebar />
        <main
          style={{
            flex: 1,
            // marginLeft: 80,
            marginRight: 0, // 우측 채팅 사이드바 없음
            padding: isDmDetail ? 0 : 32,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {children}
        </main>
        {/* RightMessenger는 렌더링하지 않음 */}
      </div>
    </ClientDepartmentProvider>
  );
}

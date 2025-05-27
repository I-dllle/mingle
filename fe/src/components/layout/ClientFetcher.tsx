'use client';

import { useEffect, useState } from 'react';
import { fetchCurrentUser, type CurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import ClientDepartmentProvider from './ClientDepartmentProvider';
import LeftSidebar from '@/components/ui/LeftSidebar';
import DepartmentSidebar from '@/components/ui/DepartmentSidebar';
import RightMessenger from '@/components/ui/RightMessenger';

export default function ClientFetcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  // [1] fetchCurrentUser 호출
  useEffect(() => {
    (async () => {
      const user = await fetchCurrentUser();

      // [2] 로그인 안 된 경우 redirect
      if (!user) {
        router.replace('/login');
      } else {
        setUser(user);
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading || !user) return null; // 로딩 중

  // [3] 레이아웃 구성 유지
  return (
    <ClientDepartmentProvider name={user.department}>
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
            padding: 32,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {children}
        </main>
        <RightMessenger />
      </div>
    </ClientDepartmentProvider>
  );
}

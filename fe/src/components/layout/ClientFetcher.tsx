'use client';

import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '@/features/user/auth/services/authService';
import type { CurrentUser } from '@/features/user/auth/types/user';
import { useRouter } from 'next/navigation';
import ClientDepartmentProvider from './ClientDepartmentProvider';
import LeftSidebar from '@/components/ui/LeftSidebar';
import DepartmentSidebar from '@/components/ui/DepartmentSidebar';
import RightMessenger from '@/components/ui/RightMessenger';
import { useSidebar } from '@/hooks/useSidebar';

export default function ClientFetcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  // 사이드바 열림 상태 가져오기
  const { isRightOpen } = useSidebar();

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
    <ClientDepartmentProvider name={user.departmentName ?? 'default'}>
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
            marginRight: isRightOpen ? 320 : 0, // 채팅 사이드바 있을 때만 margin
            padding: 32,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {children}
        </main>
        {/* 채팅 사이드바 조건부 렌더링 */}
        {isRightOpen && <RightMessenger />}
      </div>
    </ClientDepartmentProvider>
  );
}

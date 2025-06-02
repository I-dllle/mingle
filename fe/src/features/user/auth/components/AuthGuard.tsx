'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/features/user/auth/services/authService';
import type { CurrentUser } from '@/features/user/auth/types/user';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

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

  return <>{children}</>;
}

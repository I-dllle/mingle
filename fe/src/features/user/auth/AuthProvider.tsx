'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser } from '@/features/user/auth/services/authService';
import type { CurrentUser } from '@/features/user/auth/types/user';

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const isAuthPage = ['/login', '/signup', '/logout'].includes(path);

    if (isAuthPage) {
      setLoading(false); // 인증 페이지는 user 확인 건너뜀
      return;
    }

    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

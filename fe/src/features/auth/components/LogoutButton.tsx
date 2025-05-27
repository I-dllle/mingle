'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. 서버에 로그아웃 API 호출 (선택)
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });

    // 2. 클라이언트에서 쿠키 삭제 (accessToken, refreshToken)
    document.cookie = 'accessToken=; Max-Age=0; path=/;';
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';

    // 3. 로그인 페이지로 이동
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:underline"
    >
      로그아웃
    </button>
  );
}

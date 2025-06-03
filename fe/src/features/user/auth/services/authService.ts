// 인증 관련 API 함수 정의

import { apiClient } from '@/lib/api/apiClient';
import type { CurrentUser } from '@/features/user/auth/types/user';

// 현재 로그인한 유저 정보 조회
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await apiClient<CurrentUser>('/users/me');
  } catch (e) {
    console.error('fetchCurrentUser 실패:', e);
    return null;
  }
}

// 로그인 요청
export async function login(
  email: string,
  password: string
): Promise<CurrentUser> {
  const user = await apiClient<CurrentUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // 토큰과 userId를 localStorage에 저장
  if (typeof window !== 'undefined') {
    localStorage.setItem('userId', String(user.id));
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userNickname', user.nickname);
    localStorage.setItem('token', 'dummy'); // 실제 토큰이 필요하면 응답에서 받아서 처리
  }

  return user;
}

// 로그아웃 요청
export async function logout(): Promise<void> {
  await apiClient('/auth/logout', { method: 'POST' });

  // 브라우저에서 accessToken 제거
  if (typeof window !== 'undefined') {
    localStorage.clear();
    document.cookie = 'accessToken=; Max-Age=0; path=/';
    window.location.href = '/login';
  }
}

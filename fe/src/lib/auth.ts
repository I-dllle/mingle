// [공통 API 클라이언트]
// apiClient가 아래에서 사용되므로 파일 상단에 선언
export async function apiClient<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // 브라우저 쿠키 자동 포함
    cache: 'no-store', // 항상 fresh한 요청 (SSR과 충돌 없음)
  });

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  return res.json();
}

export interface CurrentUser {
  id: number;
  name: string;
  nickname: string;
  department: string;
  role: string;
  email: string;
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await apiClient<CurrentUser>('/users/me'); // apiClient 사용으로 전환
  } catch (e) {
    console.error('fetchCurrentUser 실패:', e); // 예외 핸들링 추가
    return null;
  }
}

// 로그인 요청
export async function login(
  email: string,
  password: string
): Promise<CurrentUser> {
  const res = await apiClient<CurrentUser>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res;
}

// 로그아웃 요청
export async function logout(): Promise<void> {
  await apiClient('/auth/logout', { method: 'POST' });

  // 로그아웃 후 클라이언트에서 쿠키 지우고 /login으로 이동
  if (typeof window !== 'undefined') {
    document.cookie = 'accessToken=; Max-Age=0; path=/';
    window.location.href = '/login';
  }
}

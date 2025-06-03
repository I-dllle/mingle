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
    credentials: 'include', // 쿠키 자동 포함
    cache: 'no-store', // 항상 fresh
  });

  if (!res.ok) {
    if (res.status === 401) {
      // 토큰 만료로 추정, 강제 로그아웃 또는 /refresh 시도
      console.warn('토큰이 만료되었습니다. 로그인 페이지로 이동합니다.');
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    const errorText = await res.text(); // 응답 본문까지 읽어서 상세 로그 확인
    throw new Error(
      `API 요청 실패: ${res.status} ${res.statusText} - ${errorText}`
    );
  }

  return res.json();
}

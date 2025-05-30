// lib/apiClient.ts
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
    credentials: 'include', // 중요! 쿠키 자동 포함
    cache: 'no-store', // 매번 fresh 하게
  });

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  return res.json();
}

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
    const errorText = await res.text(); // 응답 본문까지 읽어서 상세 로그 확인
    throw new Error(
      `API 요청 실패: ${res.status} ${res.statusText} - ${errorText}`
    );
  }

  return res.json();
}

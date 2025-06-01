// 업로드 전용 client 함수
export async function uploadClient<T>(
  url: string,
  formData: FormData
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    cache: 'no-store',
    // headers 생략 → fetch가 자동으로 multipart/form-data + boundary 생성
  });

  if (!res.ok) {
    throw new Error(`업로드 실패: ${res.statusText}`);
  }

  return res.json();
}

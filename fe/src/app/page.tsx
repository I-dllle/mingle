import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // 로그인 안 된 경우 → 로그인 페이지로
  if (!accessToken) {
    redirect('/login');
  }

  // 로그인 된 경우 → 메인 화면 (/schedule)으로
  redirect('/schedule');
}

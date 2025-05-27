import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/signup');

  // 인증 안 된 사용자가 보호된 라우트에 접근할 때만 /login으로 리다이렉트
  if (!accessToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 인증된 사용자가 /login, /signup에 접근하면 /schedule로 리다이렉트
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL('/schedule', request.url));
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};

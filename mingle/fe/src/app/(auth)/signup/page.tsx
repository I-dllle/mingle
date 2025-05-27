import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('accessToken');
  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup');

  // 인증되지 않은 사용자가 보호된 라우트에 접근하려고 할 때
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 이미 인증된 사용자가 로그인/회원가입 페이지에 접근하려고 할 때
  if (isAuthenticated && isAuthPage) {
    // 🔥 "/"가 아니라 "/schedule"로 리다이렉트!
    return NextResponse.redirect(new URL('/schedule', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

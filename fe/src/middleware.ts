// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// JWT 페이로드만 간단히 뽑아오는 헬퍼 (atob은 브라우저/Edge 런타임에서 지원합니다)
function parseJwt(token?: string) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // 1) 비로그인 사용자가 보호된 페이지(로그인·회원가입 제외)에 접근 시 → /login
  if (!accessToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // 2) 로그인 사용자가 /login, /signup 접근 시 → /schedule
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/schedule", request.url));
  }

  // 3) 관리자 전용 페이지 접근 시 role 검사
  //    실제 URL은 (admin) 폴더명과 무관하게 /room, /reservation-admin 등
  if (
    pathname.startsWith("/room") ||
    pathname.startsWith("/reservation-admin")
  ) {
    const payload = parseJwt(accessToken);
    // 토큰 없거나, 파싱 실패했거나, role이 ADMIN이 아니면 403 페이지로
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/403", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // _next/static, _next/image, favicon.ico, /api/* 등 제외한 모든 경로에 적용
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

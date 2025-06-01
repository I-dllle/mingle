"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // 현재 경로에 따라 탭의 활성 상태 결정
  const isActive = (path: string) => {
    if (path === "/attendance" && pathname === "/attendance") {
      return true;
    }
    if (path !== "/attendance" && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 탭 네비게이션 */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex overflow-x-auto">
            <Link
              href="/attendance"
              className={`flex-none py-4 px-6 border-b-2 ${
                isActive("/attendance")
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              } font-medium text-sm whitespace-nowrap`}
            >
              출퇴근 관리
            </Link>
            <Link
              href="/attendance/requests"
              className={`flex-none py-4 px-6 border-b-2 ${
                isActive("/attendance/requests")
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              } font-medium text-sm whitespace-nowrap`}
            >
              휴가/부재 신청
            </Link>
            <Link
              href="/attendance/overtime"
              className={`flex-none py-4 px-6 border-b-2 ${
                isActive("/attendance/overtime")
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              } font-medium text-sm whitespace-nowrap`}
            >
              야근 관리
            </Link>
          </div>
        </div>
      </div>

      {/* 페이지 내용 */}
      <div>{children}</div>
    </div>
  );
}

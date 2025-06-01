import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 내비게이션 영역 - 사이드바는 별도 구현했다고 하셔서 제외했습니다 */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-purple-600">
              관리자 대시보드
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-white font-medium">관</span>
                </div>
                <span className="hidden md:block text-sm font-medium">
                  관리자
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 내비게이션 */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto space-x-8">
            {[
              { name: "근태 관리", href: "/panel/attendance", current: true },
              {
                name: "휴가/부재 관리",
                href: "/panel/request",
                current: false,
              },
              { name: "사용자 관리", href: "/panel/users", current: false },
              { name: "부서 관리", href: "/panel/departments", current: false },
              { name: "설정", href: "/panel/settings", current: false },
            ].map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  tab.current
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="py-6 bg-gray-100">{children}</main>
    </div>
  );
}

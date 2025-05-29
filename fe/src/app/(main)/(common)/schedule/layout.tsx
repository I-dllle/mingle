import "@/features/schedule/styles/schedule-global.css";

import { Suspense } from "react";

interface ScheduleLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function ScheduleLayout({
  children,
  modal,
}: ScheduleLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="px-5 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-2xl font-bold">일정 목록</h1>
      </header>

      {/* ★ 이 부분에 inline style 로 margin/padding 을 0 으로 덮어쓰기 ★ */}
      <main
        className="flex-1 overflow-hidden"
        style={{ margin: 0, padding: 0 }}
      >
        <Suspense fallback={<div>Loading calendar...</div>}>
          {children}
        </Suspense>
      </main>

      <div className="[&>dialog]:max-w-3xl [&>dialog]:w-full [&>dialog]:min-h-[60vh]">
        {modal}
      </div>
    </div>
  );
}

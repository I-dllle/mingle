import "@/features/schedule/styles/schedule-global.css";

import { Suspense } from "react";
import FullCalendarView from "@/features/schedule/components/calendar/FullCalendarView";

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
        <h1 className="text-2xl font-bold">일정 관리</h1>
      </header>

      {/* FullCalendarView 컴포넌트 적용 */}
      <main
        className="flex-1 overflow-hidden"
        style={{ margin: 0, padding: 0 }}
      >
        <Suspense fallback={<div>Loading calendar...</div>}>
          <FullCalendarView />
        </Suspense>
      </main>

      <div className="[&>dialog]:max-w-3xl [&>dialog]:w-full [&>dialog]:min-h-[60vh]">
        {modal}
      </div>
    </div>
  );
}

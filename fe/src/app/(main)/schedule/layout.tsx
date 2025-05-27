"use client";

import { Suspense } from "react";

interface ScheduleLayoutProps {
  children: React.ReactNode; // 메인 컨텐츠 (캘린더)
  modal: React.ReactNode; // 인터셉팅 라우트에서 렌더링될 모달
}

export default function ScheduleLayout({
  children,
  modal,
}: ScheduleLayoutProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">일정 관리</h1>

      {/* 메인 컨텐츠 - 캘린더 */}
      <Suspense fallback={<div>Loading calendar...</div>}>{children}</Suspense>

      {/* 모달 슬롯 - 인터셉팅 라우트로 렌더링될 부분 */}
      <div className="[&>dialog]:max-w-3xl [&>dialog]:w-full [&>dialog]:min-h-[60vh]">
        {modal}
      </div>
    </div>
  );
}

// app/(main)/(common)/reservation/layout.tsx
"use client";

import React from "react";

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-26 py-4 bg-gray-50">
      {/* (Optional) 공통 헤더 */}{" "}
      <header className="px-8 py-4 border-b border-gray-100 bg-white shadow-sm">
        <h1 className="text-lg font-bold text-gray-800">룸 예약</h1>
      </header>{" "}
      {/* 메인 컨텐츠 스크롤 영역 */}
      <div className="flex-1 py-6 space-y-5 max-w-[1420px] mx-auto w-full">
        {children}
      </div>
    </div>
  );
}

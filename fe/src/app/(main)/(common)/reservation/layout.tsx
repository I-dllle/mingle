// app/(main)/(common)/reservation/layout.tsx
"use client";

import React from "react";
import { createPortal } from "react-dom";

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* (Optional) 공통 헤더 */}
      <header className="px-6 py-4 border-b border-gray-100 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">예약</h1>
      </header>

      {/* 메인 컨텐츠 스크롤 영역 */}
      <div className="flex-1 overflow-auto p-6 space-y-6 max-w-[1420px] mx-auto w-full">
        {children}
      </div>
    </div>
  );
}

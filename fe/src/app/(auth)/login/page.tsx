"use client";

import React from "react";
import LoginForm from "@/features/user/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6edfa]">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white/0 rounded-xl shadow-lg overflow-hidden">
        {/* 왼쪽: 브랜드/설명 */}
        <div className="flex-1 flex flex-col justify-center items-center p-10">
          <div className="mb-8">
            <span className="text-4xl font-bold text-[#a084e8]">mingle</span>
            <div className="text-xs text-[#a084e8] mt-1">
              Entertainment Group Solution
            </div>
          </div>
          <div className="text-2xl font-bold mb-4 text-[#4b2563]">
            엔터테인먼트
            <br />
            그룹통합 솔루션
          </div>
          <div className="text-gray-500 mb-6 text-center">
            테스트와 스태프를 위한 올인원 플랫폼으로
            <br />
            스케줄 관리, 콘텐츠 제작, 팬 커뮤니케이션을 한 곳에서 관리하세요.
          </div>
          <div className="flex gap-4 text-[#a084e8] text-sm">
            <span>일정 관리</span>
            <span>팀 협업</span>
            <span>데이터 분석</span>
          </div>
        </div>
        {/* 오른쪽: 로그인 폼 */}
        <div className="flex-1 flex flex-col justify-center items-center bg-white p-10 rounded-xl shadow-md">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

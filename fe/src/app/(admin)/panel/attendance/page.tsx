// 파일 경로: app/(admin)/panel/attendance/page.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import AdminAttendanceList from "@/features/attendance/components/attendance/AdminAttendanceList";
import type { AttendanceAdminRecord } from "@/features/attendance/types/attendance";
import AttendanceStatsChart from "@/features/attendance/components/attendance/AttendanceStatsChart";
import type { AttendanceStatus } from "@/features/attendance/types/attendanceCommonTypes";

export default function AdminAttendancePage() {
  const [selectedStatus, setSelectedStatus] = useState<
    AttendanceStatus | "ALL"
  >("ALL");
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [filteredRecords, setFilteredRecords] = useState<
    AttendanceAdminRecord[]
  >([]);

  // AdminAttendanceList에서 필터링된 데이터를 받는 핸들러
  const handleDataFiltered = (data: AttendanceAdminRecord[]) => {
    setFilteredRecords(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            근태 관리 대시보드
          </h1>
          <p className="text-gray-600">
            직원들의 근태 현황을 효율적으로 관리하고 분석하세요
          </p>
        </header>

        {/* 기본 툴바 영역 */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            근태 현황 관리
          </h2>

          {/* 필터 컨트롤 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 상태 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태 필터
              </label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as AttendanceStatus | "ALL")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="ALL">전체</option>
                <option value="PRESENT">정상 출근</option>
                <option value="LATE">지각</option>
                <option value="ABSENT">결근</option>
                <option value="EARLY_LEAVE">조퇴</option>
                <option value="OVERTIME">야근</option>
                <option value="ON_ANNUAL_LEAVE">연차</option>
                <option value="ON_SICK_LEAVE">병가</option>
              </select>
            </div>

            {/* 월 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                조회 월
              </label>
              <input
                type="month"
                value={selectedYearMonth}
                onChange={(e) => setSelectedYearMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* 검색 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                통합 검색
              </label>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="닉네임, 이름, 부서명으로 검색..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
              <span className="mr-1">📊</span>
              엑셀 내보내기
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
              <span className="mr-1">📈</span>
              요약 보고서
            </button>
          </div>
        </div>

        {/* 근태 목록 영역 - 실제 컴포넌트 사용 */}
        <AdminAttendanceList
          yearMonth={selectedYearMonth}
          keyword={searchKeyword}
          status={selectedStatus === "ALL" ? undefined : selectedStatus}
          onDataFiltered={handleDataFiltered}
        />

        {/* 통계 차트 영역 - 실제 컴포넌트 사용 */}
        <AttendanceStatsChart
          records={filteredRecords}
          title="근태 현황 통계"
        />
      </div>
    </div>
  );
}

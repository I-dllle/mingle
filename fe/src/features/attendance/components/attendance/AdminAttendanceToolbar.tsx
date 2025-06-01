// 파일 경로: features/attendance/components/AdminAttendanceToolbar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type {
  AttendanceStatus,
  ApprovalStatus,
} from "@/features/attendance/types/attendanceCommonTypes";
import {
  attendanceStatusLabels,
  approvalStatusLabels,
} from "@/features/attendance/utils/attendanceLabels";

export type StatusType = AttendanceStatus | ApprovalStatus | "ALL";

interface AdminAttendanceToolbarProps {
  /**
   * 툴바가 어느 용도로 쓰이는지 구분.
   * "attendance" → 근태 관리 페이지(엑셀 버튼 보임, attendance 상태 목록)
   * "approval"   → 휴가 요청 페이지(엑셀 버튼 숨김, approval 상태 목록)
   */
  statusType: "attendance" | "approval";

  /**
   * 현재 선택된 상태 필터
   * "ALL" 이면 필터 해제
   * Attendance 페이지라면 AttendanceStatus | "ALL"
   * Approval 페이지라면 ApprovalStatus | "ALL"
   */
  selectedStatus: StatusType;

  /** 상태가 바뀔 때 호출 (필터링) */
  onStatusFilter: (newStatus: StatusType) => void;

  /** 날짜 범위가 바뀔 때 호출: YYYY-MM-DD, YYYY-MM-DD */
  onDateRangeChange?: (startDate: string, endDate: string) => void;

  /** 검색어 입력 후 엔터 또는 돋보기 버튼 클릭 시 호출: query 문자열 */
  onSearch?: (query: string) => void;

  /** 엑셀 내보내기 버튼 클릭 시 호출 (attendance 전용) */
  onExport?: () => void;

  /** 요약 보고서 페이지 이동 시 호출 */
  onViewReport?: () => void;
}

export default function AdminAttendanceToolbar({
  statusType,
  selectedStatus,
  onStatusFilter,
  onDateRangeChange,
  onSearch,
  onExport,
  onViewReport,
}: AdminAttendanceToolbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // 1) 검색 폼 제출
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery.trim());
  };

  // 2) 날짜 범위 적용
  const handleApplyDateRange = () => {
    if (onDateRangeChange && startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  };

  // 3) 엑셀 내보내기 (attendance 전용)
  const handleExportClick = () => {
    if (statusType === "attendance" && onExport) {
      onExport();
    }
  };

  // 4) 요약 보고서 이동 (default 경로: "/attendance/admin/reports")
  const handleViewReport = () => {
    if (onViewReport) {
      onViewReport();
    } else {
      router.push("/attendance/admin/reports");
    }
  };

  // 상태 필터용 목록: statusType에 따라 AttendanceStatus 또는 ApprovalStatus + "ALL"
  const statusOptions: StatusType[] =
    statusType === "attendance"
      ? [
          "ALL",
          "PRESENT",
          "LATE",
          "ABSENT",
          "EARLY_LEAVE",
          "OVERTIME",
          "ON_ANNUAL_LEAVE",
          "ON_SICK_LEAVE",
          "ON_HALF_DAY_AM",
          "ON_HALF_DAY_PM",
          "ON_OFFICIAL_LEAVE",
          "ON_BUSINESS_TRIP",
          "ON_SPECIAL_LEAVE",
        ]
      : ["ALL", "PENDING", "APPROVED", "REJECTED"];

  // 상태 옵션에 대응하는 레이블을 반환하는 헬퍼
  const getLabel = (st: StatusType) => {
    if (st === "ALL") return "전체";
    if (statusType === "attendance") {
      return attendanceStatusLabels[st as AttendanceStatus];
    } else {
      return approvalStatusLabels[st as ApprovalStatus];
    }
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      {/* ─── 상단 제목 + 엑셀 / 리포트 버튼 ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          {statusType === "attendance" ? "근태 현황 관리" : "휴가 요청 관리"}
        </h2>

        <div className="flex flex-wrap gap-2">
          {/* 엑셀 버튼: statusType === "attendance"일 때만 렌더링 */}
          {statusType === "attendance" && (
            <button
              onClick={handleExportClick}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              엑셀 내보내기
            </button>
          )}

          {/* 요약 보고서 버튼: attendance/approval 모두 노출 */}
          <button
            onClick={handleViewReport}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
              />
            </svg>
            요약 보고서
          </button>
        </div>
      </div>

      {/* ─── 상태 필터 / 날짜 범위 / 검색 ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* 1) 상태 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상태 필터
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((st) => {
              const isSelected = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => onStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isSelected
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {getLabel(st)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2) 날짜 범위 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            기간 선택
          </label>
          <div className="flex items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <span className="mx-2">~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={handleApplyDateRange}
              disabled={!startDate || !endDate}
              className="ml-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              적용
            </button>
          </div>
        </div>

        {/* 3) 검색창 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            검색
          </label>
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                statusType === "attendance"
                  ? "이름, 부서, 키워드..."
                  : "신청자 이름, 부서, 키워드..."
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* ─── 빠른 필터 버튼 ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {/* 오늘 */}
        <button
          onClick={() => {
            const today = new Date().toISOString().split("T")[0];
            setStartDate(today);
            setEndDate(today);
            if (onDateRangeChange) onDateRangeChange(today, today);
          }}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          오늘
        </button>

        {/* 이번 주 */}
        <button
          onClick={() => {
            const today = new Date();
            const weekStart = new Date();
            weekStart.setDate(today.getDate() - today.getDay());
            const s = weekStart.toISOString().split("T")[0];
            const e = today.toISOString().split("T")[0];
            setStartDate(s);
            setEndDate(e);
            if (onDateRangeChange) onDateRangeChange(s, e);
          }}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          이번 주
        </button>

        {/* 이번 달 */}
        <button
          onClick={() => {
            const today = new Date();
            const monthStart = new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );
            const s = monthStart.toISOString().split("T")[0];
            const e = today.toISOString().split("T")[0];
            setStartDate(s);
            setEndDate(e);
            if (onDateRangeChange) onDateRangeChange(s, e);
          }}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          이번 달
        </button>

        {/* 지난 달 */}
        <button
          onClick={() => {
            const today = new Date();
            const lastMonthStart = new Date(
              today.getFullYear(),
              today.getMonth() - 1,
              1
            );
            const lastMonthEnd = new Date(
              today.getFullYear(),
              today.getMonth(),
              0
            );
            const s = lastMonthStart.toISOString().split("T")[0];
            const e = lastMonthEnd.toISOString().split("T")[0];
            setStartDate(s);
            setEndDate(e);
            if (onDateRangeChange) onDateRangeChange(s, e);
          }}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          지난 달
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApprovalStatus } from "@/features/attendance/types/attendanceCommonTypes";

interface AdminAttendanceToolbarProps {
  onStatusFilter?: (status: ApprovalStatus | "ALL") => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
  onSearch?: (query: string) => void;
  onExport?: () => void;
  selectedStatus?: ApprovalStatus | "ALL";
}

export default function AdminAttendanceToolbar({
  onStatusFilter,
  onDateRangeChange,
  onSearch,
  onExport,
  selectedStatus = "ALL",
}: AdminAttendanceToolbarProps) {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // 날짜 범위 변경 핸들러
  const handleDateRangeApply = () => {
    if (onDateRangeChange && startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  };

  // 상태 필터 핸들러
  const handleStatusFilter = (status: ApprovalStatus | "ALL") => {
    if (onStatusFilter) {
      onStatusFilter(status);
    }
  };

  // 엑셀 내보내기 핸들러
  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  // 요약 보고서 페이지 이동
  const handleViewReport = () => {
    router.push("/attendance/admin/reports");
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          근태 관리
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExport}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* 상태 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            상태 필터
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilter("ALL")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedStatus === "ALL"
                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => handleStatusFilter("PENDING")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedStatus === "PENDING"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              대기중
            </button>
            <button
              onClick={() => handleStatusFilter("APPROVED")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedStatus === "APPROVED"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              승인됨
            </button>
            <button
              onClick={() => handleStatusFilter("REJECTED")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedStatus === "REJECTED"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              거부됨
            </button>
          </div>
        </div>

        {/* 날짜 범위 선택 */}
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
              onClick={handleDateRangeApply}
              disabled={!startDate || !endDate}
              className="ml-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              적용
            </button>
          </div>
        </div>

        {/* 검색 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            검색
          </label>
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 부서, 요청 유형 등"
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

      {/* 빠른 필터 버튼 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            const today = new Date().toISOString().split("T")[0];
            setStartDate(today);
            setEndDate(today);
            if (onDateRangeChange) {
              onDateRangeChange(today, today);
            }
          }}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          오늘
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const weekStart = new Date();
            weekStart.setDate(today.getDate() - today.getDay()); // 일요일부터 시작

            setStartDate(weekStart.toISOString().split("T")[0]);
            setEndDate(today.toISOString().split("T")[0]);
            if (onDateRangeChange) {
              onDateRangeChange(
                weekStart.toISOString().split("T")[0],
                today.toISOString().split("T")[0]
              );
            }
          }}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          이번 주
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const monthStart = new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );

            setStartDate(monthStart.toISOString().split("T")[0]);
            setEndDate(today.toISOString().split("T")[0]);
            if (onDateRangeChange) {
              onDateRangeChange(
                monthStart.toISOString().split("T")[0],
                today.toISOString().split("T")[0]
              );
            }
          }}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          이번 달
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(today.getMonth() - 1);
            const lastMonthStart = new Date(
              lastMonth.getFullYear(),
              lastMonth.getMonth(),
              1
            );
            const lastMonthEnd = new Date(
              today.getFullYear(),
              today.getMonth(),
              0
            );

            setStartDate(lastMonthStart.toISOString().split("T")[0]);
            setEndDate(lastMonthEnd.toISOString().split("T")[0]);
            if (onDateRangeChange) {
              onDateRangeChange(
                lastMonthStart.toISOString().split("T")[0],
                lastMonthEnd.toISOString().split("T")[0]
              );
            }
          }}
          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          지난 달
        </button>
      </div>
    </div>
  );
}

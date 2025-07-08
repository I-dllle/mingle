"use client";

import React, { useState } from "react";

// 이미지에 표시된 필터를 기반으로 한 단순화된 목록
const leaveTypeFilters = [
  { key: "ALL", label: "전체" },
  { key: "PENDING", label: "대기중" },
  { key: "APPROVED", label: "승인" },
  { key: "REJECTED", label: "반려" },
];

interface AdminRequestToolbarProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedMonth: string; // "YYYY-MM"
  onMonthChange: (month: string) => void;
  searchTerm: string;
  onSearchChange: (keyword: string) => void;
}

export default function AdminRequestToolbar({
  selectedStatus,
  onStatusChange,
  selectedMonth,
  onMonthChange,
  searchTerm,
  onSearchChange,
}: AdminRequestToolbarProps) {
  const [currentSearch, setCurrentSearch] = useState(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("검색 실행:", currentSearch);
    onSearchChange(currentSearch);
  };

  const handleMonthChange = (increment: number) => {
    const currentDate = new Date(`${selectedMonth}-01`);
    currentDate.setMonth(currentDate.getMonth() + increment);
    const newYearMonth = currentDate.toISOString().slice(0, 7);
    onMonthChange(newYearMonth);
  };

  const formattedYearMonth = () => {
    if (!selectedMonth) return "";
    const [year, month] = selectedMonth.split("-");
    return `${year}년 ${parseInt(month, 10)}월`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* 휴가 유형 필터 */}
        <div className="flex items-center gap-2 flex-wrap">
          {leaveTypeFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onStatusChange(filter.key)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                selectedStatus === filter.key
                  ? "bg-purple-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* 월 선택 (중앙) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleMonthChange(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <span className="text-lg font-semibold text-gray-800 w-32 text-center">
            {formattedYearMonth()}
          </span>
          <button
            onClick={() => handleMonthChange(1)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        {/* 검색창 */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 font-medium">
            검색 가능: 이름, 부서명
          </span>
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
                placeholder="이름 또는 부서로 검색"
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              검색
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

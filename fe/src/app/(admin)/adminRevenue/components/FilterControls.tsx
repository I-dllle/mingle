"use client";

import React from "react";

interface FilterControlsProps {
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  selectedPeriod: string;
  onSelectedPeriodChange: (period: string) => void;
}

export default function FilterControls({
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  selectedPeriod,
  onSelectedPeriodChange,
}: FilterControlsProps) {
  const handleReset = () => {
    onStartDateChange("");
    onEndDateChange("");
    onSelectedPeriodChange("month");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700">기간:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-violet-500 focus:border-violet-500"
          />
          <span className="text-slate-500">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700">
            분석 기간:
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => onSelectedPeriodChange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="week">주간</option>
            <option value="month">월간</option>
            <option value="quarter">분기</option>
            <option value="year">연간</option>
          </select>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          초기화
        </button>
      </div>
    </div>
  );
}

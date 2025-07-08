// AttendanceStatsChart.tsx
"use client";

import React, { useEffect, useState } from "react";
import type { AttendanceAdminRecord } from "@/features/attendance/types/attendance";
import { AttendanceStatus } from "@/features/attendance/types/attendanceCommonTypes";
import { attendanceStatusLabels } from "@/features/attendance/utils/attendanceLabels";

interface AttendanceStatsChartProps {
  records: AttendanceAdminRecord[];
  title: string;
}

interface StatusCounts {
  [key: string]: number;
}

export default function AttendanceStatsChart({
  records,
  title,
}: AttendanceStatsChartProps) {
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({});

  useEffect(() => {
    const counts: StatusCounts = {};

    // 모든 상태 초기화
    const statusValues: AttendanceStatus[] = [
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
    ];

    statusValues.forEach((status) => {
      counts[status] = 0;
    });

    // 레코드 집계
    records.forEach((record) => {
      if (record.status) {
        counts[record.status] = (counts[record.status] || 0) + 1;
      }
    });

    setStatusCounts(counts);
  }, [records]);

  const totalRecords = records.length;

  const getStatusColor = (status: AttendanceStatus) => {
    const colorMap: Record<AttendanceStatus, string> = {
      PRESENT: "bg-green-100 text-green-800",
      LATE: "bg-orange-100 text-orange-800",
      ABSENT: "bg-red-100 text-red-800",
      EARLY_LEAVE: "bg-purple-100 text-purple-800",
      OVERTIME: "bg-blue-100 text-blue-800",
      ON_ANNUAL_LEAVE: "bg-teal-100 text-teal-800",
      ON_SICK_LEAVE: "bg-yellow-100 text-yellow-800",
      ON_HALF_DAY_AM: "bg-indigo-100 text-indigo-800",
      ON_HALF_DAY_PM: "bg-pink-100 text-pink-800",
      ON_OFFICIAL_LEAVE: "bg-gray-100 text-gray-800",
      ON_BUSINESS_TRIP: "bg-cyan-100 text-cyan-800",
      ON_SPECIAL_LEAVE: "bg-amber-100 text-amber-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">총 {totalRecords}건</span>
      </div>

      {/* 상태별 통계 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => {
          const percentage =
            totalRecords > 0 ? ((count / totalRecords) * 100).toFixed(1) : "0";
          return (
            <div key={status} className="text-center">
              <div
                className={`p-4 rounded-lg ${getStatusColor(
                  status as AttendanceStatus
                )}`}
              >
                <div className="text-2xl font-bold mb-1">{count}</div>
                <div className="text-sm font-medium mb-1">
                  {attendanceStatusLabels[status as AttendanceStatus] || status}
                </div>
                <div className="text-xs opacity-75">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 요약 정보 */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {statusCounts["PRESENT"] || 0}
          </div>
          <div className="text-sm text-gray-600">정상출근</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-orange-600">
            {statusCounts["LATE"] || 0}
          </div>
          <div className="text-sm text-gray-600">지각</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600">
            {statusCounts["ABSENT"] || 0}
          </div>
          <div className="text-sm text-gray-600">결근</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {(statusCounts["ON_ANNUAL_LEAVE"] || 0) +
              (statusCounts["ON_SICK_LEAVE"] || 0) +
              (statusCounts["ON_HALF_DAY_AM"] || 0) +
              (statusCounts["ON_HALF_DAY_PM"] || 0) +
              (statusCounts["ON_OFFICIAL_LEAVE"] || 0) +
              (statusCounts["ON_BUSINESS_TRIP"] || 0) +
              (statusCounts["ON_SPECIAL_LEAVE"] || 0)}
          </div>
          <div className="text-sm text-gray-600">휴가</div>
        </div>
      </div>
    </div>
  );
}

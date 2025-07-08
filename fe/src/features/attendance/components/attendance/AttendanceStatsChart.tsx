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
  const [showLeaveDetails, setShowLeaveDetails] = useState(false);

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
      if (record.attendanceStatus) {
        counts[record.attendanceStatus] =
          (counts[record.attendanceStatus] || 0) + 1;
      }
    });

    setStatusCounts(counts);
  }, [records]);

  const totalRecords = records.length;

  // 휴가 타입별 집계 계산
  const leaveTypes = {
    ON_ANNUAL_LEAVE: statusCounts["ON_ANNUAL_LEAVE"] || 0,
    ON_SICK_LEAVE: statusCounts["ON_SICK_LEAVE"] || 0,
    ON_HALF_DAY_AM: statusCounts["ON_HALF_DAY_AM"] || 0,
    ON_HALF_DAY_PM: statusCounts["ON_HALF_DAY_PM"] || 0,
    ON_OFFICIAL_LEAVE: statusCounts["ON_OFFICIAL_LEAVE"] || 0,
    ON_BUSINESS_TRIP: statusCounts["ON_BUSINESS_TRIP"] || 0,
    ON_SPECIAL_LEAVE: statusCounts["ON_SPECIAL_LEAVE"] || 0,
  };

  const totalLeaveCount = Object.values(leaveTypes).reduce(
    (sum, count) => sum + count,
    0
  );

  const toggleLeaveDetails = () => {
    setShowLeaveDetails(!showLeaveDetails);
  };

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

      {/* 메인 통계 그리드 - 기본 4개 상태만 표시 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 정상출근 */}
        <div className="text-center">
          <div className="p-4 rounded-lg bg-green-100 text-green-800">
            <div className="text-2xl font-bold mb-1">
              {statusCounts["PRESENT"] || 0}
            </div>
            <div className="text-sm font-medium mb-1">정상출근</div>
            <div className="text-xs opacity-75">
              {totalRecords > 0
                ? (
                    ((statusCounts["PRESENT"] || 0) / totalRecords) *
                    100
                  ).toFixed(1)
                : "0"}
              %
            </div>
          </div>
        </div>

        {/* 지각 */}
        <div className="text-center">
          <div className="p-4 rounded-lg bg-orange-100 text-orange-800">
            <div className="text-2xl font-bold mb-1">
              {statusCounts["LATE"] || 0}
            </div>
            <div className="text-sm font-medium mb-1">지각</div>
            <div className="text-xs opacity-75">
              {totalRecords > 0
                ? (((statusCounts["LATE"] || 0) / totalRecords) * 100).toFixed(
                    1
                  )
                : "0"}
              %
            </div>
          </div>
        </div>

        {/* 결근 */}
        <div className="text-center">
          <div className="p-4 rounded-lg bg-red-100 text-red-800">
            <div className="text-2xl font-bold mb-1">
              {statusCounts["ABSENT"] || 0}
            </div>
            <div className="text-sm font-medium mb-1">결근</div>
            <div className="text-xs opacity-75">
              {totalRecords > 0
                ? (
                    ((statusCounts["ABSENT"] || 0) / totalRecords) *
                    100
                  ).toFixed(1)
                : "0"}
              %
            </div>
          </div>
        </div>

        {/* 휴가 (통합) */}
        <div className="text-center">
          <div
            className="p-4 rounded-lg bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
            onClick={toggleLeaveDetails}
          >
            <div className="text-2xl font-bold mb-1">{totalLeaveCount}</div>
            <div className="text-sm font-medium mb-1 flex items-center justify-center gap-1">
              휴가
              <svg
                className={`w-4 h-4 transition-transform ${
                  showLeaveDetails ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div className="text-xs opacity-75">
              {totalRecords > 0
                ? ((totalLeaveCount / totalRecords) * 100).toFixed(1)
                : "0"}
              %
            </div>
          </div>
        </div>
      </div>

      {/* 휴가 상세 통계 (토글) */}
      {showLeaveDetails && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-md font-semibold text-blue-900 mb-3">
            휴가 상세 통계
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(leaveTypes).map(([status, count]) => {
              const percentage =
                totalLeaveCount > 0
                  ? ((count / totalLeaveCount) * 100).toFixed(1)
                  : "0";
              return (
                <div key={status} className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {count}
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      {attendanceStatusLabels[status as AttendanceStatus] ||
                        status}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {percentage}% (전체 휴가 대비)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-sm text-gray-600 text-center">
            총 휴가 건수: {totalLeaveCount}건
          </div>
        </div>
      )}
    </div>
  );
}

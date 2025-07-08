// AdminAttendanceList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AttendanceStatusBadge } from "./StatusBadge";
import { getAllAttendanceRecordsForAdmin } from "@/features/attendance/services/attendanceService";
import type { AttendanceAdminRecord } from "@/features/attendance/types/attendance";
import type { AttendanceStatus } from "@/features/attendance/types/attendanceCommonTypes";

interface AdminAttendanceListProps {
  yearMonth: string;
  departmentId?: number;
  userId?: number;
  keyword?: string;
  status?: AttendanceStatus | "ALL";
  onDataFiltered?: (data: AttendanceAdminRecord[]) => void;
}

export default function AdminAttendanceList({
  yearMonth,
  departmentId,
  userId,
  keyword,
  status,
  onDataFiltered,
}: AdminAttendanceListProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceAdminRecord[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  const fetchAttendanceRecords = async (page: number = 1) => {
    if (!yearMonth) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAllAttendanceRecordsForAdmin(
        yearMonth,
        departmentId,
        userId,
        keyword,
        status === "ALL" ? undefined : status,
        page,
        pageSize
      );

      setAttendanceRecords(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(page);

      // 상위 컴포넌트에 필터링된 데이터 전달
      if (onDataFiltered) {
        onDataFiltered(response.content);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "데이터 조회 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAttendanceRecords(1);
    }, 100); // 100ms 디바운스

    return () => clearTimeout(timeoutId);
  }, [yearMonth, departmentId, userId, keyword, status]);

  const handlePageChange = (page: number) => {
    fetchAttendanceRecords(page);
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5); // HH:MM 형식으로 변환
  };

  const formatWorkingHours = (hours: number | null) => {
    if (hours === null || hours === undefined) return "-";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}시간 ${m}분`;
  };

  const calculateWorkingHours = (
    checkIn: string | null,
    checkOut: string | null
  ) => {
    if (!checkIn || !checkOut) return "-";

    try {
      // HH:MM 형식의 시간을 분으로 변환
      const [inHour, inMin] = checkIn.split(":").map(Number);
      const [outHour, outMin] = checkOut.split(":").map(Number);

      const checkInMinutes = inHour * 60 + inMin;
      const checkOutMinutes = outHour * 60 + outMin;

      const totalMinutes = checkOutMinutes - checkInMinutes;

      if (totalMinutes <= 0) return "-";

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return `${hours}시간 ${minutes}분`;
    } catch (error) {
      return "-";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchAttendanceRecords(currentPage)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          근태 현황 목록 ({attendanceRecords.length}건)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                선택
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                부서
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                날짜
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                출근시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                퇴근시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                근무시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendanceRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  조회된 근태 기록이 없습니다.
                </td>
              </tr>
            ) : (
              attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {record.nickName?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <Link 
                          href={`/panel/attendance/${record.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-purple-600 hover:underline cursor-pointer"
                        >
                          {record.nickName || "이름 없음"}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.departmentName || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(record.checkInTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(record.checkOutTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateWorkingHours(record.checkInTime, record.checkOutTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AttendanceStatusBadge status={record.attendanceStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      href={`/panel/attendance/${record.id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200 hover:text-purple-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span>
              {currentPage} / {totalPages} 페이지
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === page
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AttendanceRecord } from "@/features/attendance/types/attendance";
import attendanceService from "@/features/attendance/services/attendanceService";
import { AttendanceStatusBadge } from "./StatusBadge";

interface RecentRecordsTableProps {
  initialPage?: number;
  recordsPerPage?: number;
}

export default function RecentRecordsTable({
  initialPage = 1,
  recordsPerPage = 5,
}: RecentRecordsTableProps) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const router = useRouter();

  // 포맷 함수
  const formatTime = (timeString: string | null): string => {
    if (!timeString) return "-";
    // HH:MM 포맷으로 변환 (시간만 필요)
    const date = new Date(timeString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // 근태 기록 불러오기
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.getRecentRecords(
        currentPage,
        recordsPerPage
      );
      setRecords(response.content);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || "근태 기록을 불러오는데 실패했습니다.");
      console.error("Error fetching records:", err);
    } finally {
      setLoading(false);
    }
  };

  // 페이지가 변경될 때마다 데이터 가져오기
  useEffect(() => {
    fetchRecords();
  }, [currentPage, recordsPerPage]);

  // 근무 시간 포맷 (소수점 1자리까지)
  const formatHours = (hours: number): string => {
    return hours.toFixed(1) + "시간";
  };

  // 날짜 포맷 (MM/DD 형식)
  const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  if (loading && !records.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          최근 근태 기록
        </h2>
        <div className="animate-pulse">
          {[...Array(recordsPerPage)].map((_, idx) => (
            <div key={idx} className="h-12 bg-gray-100 mb-2 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          최근 근태 기록
        </h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        최근 근태 기록
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                날짜
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                출근시간
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                퇴근시간
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                근무시간
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  근태 기록이 없습니다.
                </td>
              </tr>
            ) : (
              records.map((record, idx) => (
                <tr
                  key={`${record.date}-${idx}`}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    router.push(`/attendance/detail/${record.date}`)
                  }
                >
                  <td className="px-4 py-3 text-gray-900">
                    {formatDateShort(record.date)}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {formatTime(record.checkInTime)}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {formatTime(record.checkOutTime)}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {formatHours(record.workingHours)}
                  </td>
                  <td className="px-4 py-3">
                    <AttendanceStatusBadge status={record.attendanceStatus} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              &lt;
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              // 항상 현재 페이지 주변의 5개 페이지를 표시
              let pageNum = currentPage - 2 + i;

              // 앞쪽 범위를 벗어나면 조정
              if (pageNum < 1) pageNum = i + 1;

              // 뒤쪽 범위를 벗어나면 조정
              if (pageNum > totalPages) pageNum = totalPages - (4 - i);

              // 유효한 페이지 번호인 경우에만 버튼 렌더링
              if (pageNum >= 1 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 ${
                      currentPage === pageNum
                        ? "bg-purple-600 text-white"
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-r-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              &gt;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

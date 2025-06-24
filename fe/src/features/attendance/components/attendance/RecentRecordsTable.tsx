// 파일 경로 예시:
// features/attendance/components/attendance/RecentRecordsTable.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AttendanceStatusBadge } from "./StatusBadge";
import attendanceService from "../../services/attendanceService";
import {
  AttendanceRecord,
  AttendanceAdminRecord,
  AttendancePageResponse,
} from "../../types/attendance";

/**
 * props 인터페이스:
 * - isAdmin?: boolean                   // (기본값 false) 관리자용 전체 조회 모드인지 여부
 * - yearMonth?: string                  // (선택) YYYY-MM 형태. 관리자가 월별로 필터링할 때 사용
 * - keyword?: string                    // (선택) 검색 키워드
 * - statusFilter?: string               // (선택) 상태 필터 (예: "PRESENT", "LATE" 등)
 * - departmentId?: number | null        // (선택) 관리자 전용: 부서 ID
 * - userIdFilter?: number | null        // (선택) 관리자 전용: 특정 사용자 ID
 *
 * - initialPage?: number                // (선택) 초기 페이지; 없으면 1
 * - recordsPerPage?: number             // (선택) 페이지당 개수; 없으면 5
 * - onPageChange?: (newPage: number) => void  // (선택) 페이지가 바뀔 때 호출할 콜백
 */
interface RecentRecordsTableProps {
  isAdmin?: boolean;
  yearMonth?: string;
  keyword?: string;
  statusFilter?: string;
  departmentId?: number | null;
  userIdFilter?: number | null;

  initialPage?: number;
  recordsPerPage?: number;
  onPageChange?: (newPage: number) => void;
}

export default function RecentRecordsTable({
  isAdmin = false,
  yearMonth,
  keyword,
  statusFilter,
  departmentId,
  userIdFilter,

  initialPage = 1,
  recordsPerPage = 5,
  onPageChange,
}: RecentRecordsTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [perPage] = useState<number>(recordsPerPage);
  const [records, setRecords] = useState<
    (AttendanceRecord | AttendanceAdminRecord)[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: AttendancePageResponse;
      if (isAdmin) {
        data = await attendanceService.getAllAttendanceRecordsForAdmin(
          yearMonth ?? "",
          departmentId || undefined,
          userIdFilter || undefined,
          keyword || undefined,
          statusFilter as any,
          currentPage,
          perPage
        );
      } else {
        data = await attendanceService.getRecentRecords(currentPage, perPage);
      }

      if (data && data.content) {
        setRecords(data.content);
        setTotalPages(data.totalPages);
      } else {
        setRecords([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("AttendanceTable fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [
    isAdmin,
    yearMonth,
    keyword,
    statusFilter,
    departmentId,
    userIdFilter,
    currentPage,
    perPage,
  ]);

  const handleRowClick = (attendanceId: number) => {
    if (attendanceId) {
      router.push(`/attendance/${attendanceId}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  };

  const formatDateShort = (dateString: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-red-500">
        <p>오류: {error}</p>
        <button
          onClick={fetchRecords}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          재시도
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isAdmin ? "전체 근태 기록" : "최근 근태 기록"}
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {isAdmin && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  사원
                </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                날짜
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                출근
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                퇴근
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                근무시간
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.length > 0 ? (
              records.map((record: any) => {
                const adminRecord = record as AttendanceAdminRecord;
                return (
                  <tr
                    key={record.id}
                    onClick={() => handleRowClick(record.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{adminRecord.memberName}</div>
                        <div className="text-xs text-gray-500">
                          {adminRecord.departmentName}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateShort(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record.checkInTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record.checkOutTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(record.workingHours || 0).toFixed(1)}시간
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <AttendanceStatusBadge
                        status={record.attendanceStatus as any}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === page
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

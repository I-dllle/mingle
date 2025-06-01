// 파일 경로 예시:
// features/attendance/components/attendance/RecentRecordsTable.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  AttendanceRecord,
  AttendanceAdminRecord,
} from "@/features/attendance/types/attendance";
import attendanceService from "@/features/attendance/services/attendanceService";
import { AttendanceStatusBadge } from "./StatusBadge"; // 상태 배지 컴포넌트 경로 확인

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

  /** 현재 페이지 상태: initialPage prop이 있으면 그 값을, 없으면 1 */
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  /** 페이지당 표시할 레코드 수: recordsPerPage prop이 있으면 그 값을, 없으면 5 */
  const [perPage] = useState<number>(recordsPerPage);

  /** 실제로 테이블에 뿌릴 레코드 배열:
   *  - 일반 사용자는 `AttendanceRecord[]`
   *  - 관리자는 `AttendanceAdminRecord[]`
   *  둘 중 하나가 될 수 있다. */
  const [records, setRecords] = useState<
    AttendanceRecord[] | AttendanceAdminRecord[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /** 총 페이지 수 (페이징 UI 그리기 위함) */
  const [totalPages, setTotalPages] = useState<number>(1);

  /** 서버에서 데이터 가져오는 함수 */
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isAdmin) {
        // ---------- 관리자 모드: 전체 사용자 근태 기록 조회 ----------
        // 서버에서 AttendanceAdminRecord[] 만 반환한다고 가정
        const data: AttendanceAdminRecord[] =
          await attendanceService.getAllAttendanceRecordsForAdmin(
            yearMonth ?? "",
            departmentId || undefined,
            userIdFilter || undefined,
            keyword || undefined,
            statusFilter as any, // 예: "PRESENT" 등
            currentPage,
            perPage
          );

        // 정확한 타입으로 setRecords
        setRecords(data);
        // (만약 백엔드가 pagination 정보를 별도 제공한다면, 아래 처럼 써야 합니다)
        // setRecords(data.content);
        // setTotalPages(data.totalPages);
      } else {
        // ---------- 일반 사용자 모드: 본인의 최근 근태 조회 ----------
        // 서버에서 AttendancePageResponse 형태 반환: { content: AttendanceRecord[], totalPages: number, ... }
        const response = await attendanceService.getRecentRecords(
          currentPage,
          perPage
        );

        setRecords(response.content);
        setTotalPages(response.totalPages);
      }
    } catch (err: any) {
      setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("AttendanceTable fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /** currentPage 또는 perPage 등이 바뀔 때마다 재호출 */
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

  /** 날짜를 “MM/DD” 형태 문자열로 포맷팅 */
  const formatDateShort = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  /** ISO 문자열을 “HH:mm” 형태로 포맷팅 (없으면 “-” 반환) */
  const formatTime = (isoString: string | null) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isAdmin ? "전체 근태 기록" : "최근 근태 기록"}
        </h2>
        <div className="animate-pulse space-y-2">
          {Array.from({ length: perPage }).map((_, idx) => (
            <div key={idx} className="h-10 bg-gray-100 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isAdmin ? "전체 근태 기록" : "최근 근태 기록"}
        </h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isAdmin ? "전체 근태 기록" : "최근 근태 기록"}
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                날짜
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                출근
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                퇴근
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                근무시간
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">
                상태
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-left font-medium text-gray-500">
                  관리
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="px-4 py-4 text-center text-gray-500"
                >
                  {isAdmin
                    ? "조회된 기록이 없습니다."
                    : "근태 기록이 없습니다."}
                </td>
              </tr>
            ) : (
              records.map((rec: any, idx) => {
                // rec는 AttendanceRecord 또는 AttendanceAdminRecord
                const date = rec.date as string;
                const checkIn = rec.checkInTime as string | null;
                const checkOut = rec.checkOutTime as string | null;

                // AttendanceRecord 에는 workingHours 필드가 있고,
                // AttendanceAdminRecord 에는 내부 도메인마다 추가 필드가 있을 수 있지만
                // 양쪽 다 `attendanceStatus` 와 `id` (혹은 `userId`)가 있다고 가정
                const workingHours =
                  (rec as AttendanceRecord).workingHours ?? 0;
                const status = rec.attendanceStatus as string;

                return (
                  <tr
                    key={`${date}-${idx}`}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      if (isAdmin) {
                        router.push(`/admin/panel/attendance/${rec.id}`);
                      } else {
                        router.push(`/attendance/detail/${date}`);
                      }
                    }}
                  >
                    <td className="px-4 py-3 text-gray-900">
                      {formatDateShort(date)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {formatTime(checkIn)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {formatTime(checkOut)}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {`${workingHours.toFixed(1)}시간`}
                    </td>
                    <td className="px-4 py-3">
                      <AttendanceStatusBadge status={status as any} />
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-purple-600 hover:underline">
                        수정
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 (관리자와 일반 사용자가 동일 UI 사용) */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="inline-flex rounded-md">
            {/* 이전 버튼 */}
            <button
              onClick={() => {
                const prev = Math.max(currentPage - 1, 1);
                setCurrentPage(prev);
                if (onPageChange) onPageChange(prev);
              }}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              &lt;
            </button>

            {/* 페이지 번호들: 최대 5개 */}
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNum = currentPage - 2 + i;
              if (pageNum < 1) pageNum = i + 1;
              if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    if (onPageChange) onPageChange(pageNum);
                  }}
                  className={`px-3 py-1 ${
                    currentPage === pageNum
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* 다음 버튼 */}
            <button
              onClick={() => {
                const next = Math.min(currentPage + 1, totalPages);
                setCurrentPage(next);
                if (onPageChange) onPageChange(next);
              }}
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

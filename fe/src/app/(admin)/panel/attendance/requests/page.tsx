// 파일 경로: app/(admin)/panel/attendance/request/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AdminAttendanceToolbar, {
  StatusType,
} from "@/features/attendance/components/attendance/AdminAttendanceToolbar";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";
import type { AttendanceRequestDetail } from "@/features/attendance/types/attendanceRequest";
import type {
  ApprovalStatus,
  LeaveType,
} from "@/features/attendance/types/attendanceCommonTypes";
import {
  leaveTypeLabels,
  approvalStatusLabels,
  approvalColorMap,
} from "@/features/attendance/utils/attendanceLabels";

export default function AdminAttendanceRequestsPage() {
  const router = useRouter();

  // ─── 상태 관리: 로딩, 에러, 요청 목록, 필터, 페이징 ─────────────────────────────────
  const [requests, setRequests] = useState<AttendanceRequestDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // “ALL” 또는 ApprovalStatus 중 하나
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | "ALL">(
    "PENDING"
  );
  const [yearMonthFilter, setYearMonthFilter] = useState<string>(
    new Date().toISOString().slice(0, 7) // 기본: 현재 연·월 ("YYYY-MM")
  );
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // 검색어

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // ─── 1) 백엔드에서 데이터 Fetch 함수 ───────────────────────────────────────────
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      // “ALL”이면 status 파라미터를 제외
      const apiStatus =
        statusFilter === "ALL" ? undefined : (statusFilter as ApprovalStatus);
      const apiKeyword = searchKeyword || undefined;

      const res = await attendanceRequestService.getAllRequests(
        apiStatus as ApprovalStatus,
        yearMonthFilter,
        currentPage,
        10 // 한 페이지당 10개
      );

      setRequests(res.content);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      console.error("Error fetching admin request list:", err);
      setError(err.message || "요청 목록을 불러오는 중 오류가 발생했습니다.");
      setRequests([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // ─── 2) 필터/페이지 변경 시마다 재호출 ─────────────────────────────────────
  useEffect(() => {
    fetchRequests();
  }, [statusFilter, yearMonthFilter, searchKeyword, currentPage]);

  // ─── 3) 툴바 핸들러들 ─────────────────────────────────────────────────────
  // (1) 상태 필터: StatusType(ApprovalStatus|"ALL")을 받아옴
  const handleStatusFilter = (newStatus: StatusType) => {
    if (
      newStatus === "ALL" ||
      ["PENDING", "APPROVED", "REJECTED"].includes(newStatus)
    ) {
      setStatusFilter(newStatus as ApprovalStatus | "ALL");
      setCurrentPage(1);
    }
  };

  // (2) 연·월 필터 변경: YYYY-MM-DD 두 개를 받지만, Approval 모드에선 시작일만 YYYY-MM으로 사용
  const handleDateRangeChange = (start: string, end: string) => {
    const ym = start.slice(0, 7);
    setYearMonthFilter(ym);
    setCurrentPage(1);
  };

  // (3) 검색어 입력
  const handleSearch = (q: string) => {
    setSearchKeyword(q);
    setCurrentPage(1);
  };

  // (4) 엑셀 다운로드: 요청 페이지에선 제공하지 않음
  const handleExport = () => {
    alert("휴가 요청 페이지에서는 엑셀 기능을 제공하지 않습니다.");
  };

  // (5) 요약 보고서 페이지 이동
  const handleViewReport = () => {
    router.push("/attendance/admin/reports");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ─── ① 상단 툴바 ───────────────────────────────────────────────── */}
      <AdminAttendanceToolbar
        statusType="approval"
        selectedStatus={statusFilter as StatusType}
        onStatusFilter={handleStatusFilter}
        onDateRangeChange={handleDateRangeChange}
        onSearch={handleSearch}
        onExport={handleExport}
        onViewReport={handleViewReport}
      />

      {/* ─── ② 요청 목록 테이블 ────────────────────────────────────────── */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">로딩 중…</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            조회된 데이터가 없습니다.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신청자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  기간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신청일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    void router.push(`/panel/attendance/requests/${req.id}`)
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {req.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {req.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leaveTypeLabels[req.type as LeaveType] || req.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {req.startDate}
                    {req.endDate && req.endDate !== req.startDate
                      ? ` ~ ${req.endDate}`
                      : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold
                        ${approvalColorMap[req.approvalStatus]} text-white
                      `}
                    >
                      {approvalStatusLabels[req.approvalStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(req.appliedAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 hover:text-purple-800">
                    <Link href={`/admin/attendance/request/${req.id}`}>
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── ③ 페이지네이션 ────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav>
            <ul className="inline-flex -space-x-px">
              <li>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded-l-md text-sm ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  이전
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <li key={pageNum}>
                    <button
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border text-sm ${
                        currentPage === pageNum
                          ? "bg-purple-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded-r-md text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  다음
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

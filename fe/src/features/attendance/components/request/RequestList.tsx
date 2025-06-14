"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AttendanceRequestDetail } from "@/features/attendance/types/attendanceRequest";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";
import {
  ApprovalStatus,
  LeaveType,
} from "@/features/attendance/types/attendanceCommonTypes";
import { ApprovalStatusBadge } from "../attendance/StatusBadge";
import {
  leaveTypeLabels,
  statusBackgroundColorMap,
} from "@/features/attendance/utils/attendanceLabels";

// LeaveType에 따른 배경색 매핑
const leaveTypeColorMap: Record<LeaveType, string> = {
  ANNUAL: "bg-indigo-100 text-indigo-800",
  SICK: "bg-purple-100 text-purple-800",
  HALF_DAY_AM: "bg-pink-100 text-pink-800",
  HALF_DAY_PM: "bg-pink-100 text-pink-800",
  OFFICIAL: "bg-sky-100 text-sky-800",
  BUSINESS_TRIP: "bg-teal-100 text-teal-800",
  MARRIAGE: "bg-green-100 text-green-800",
  BEREAVEMENT: "bg-gray-100 text-gray-800",
  PARENTAL: "bg-blue-100 text-blue-800",
  EARLY_LEAVE: "bg-orange-100 text-orange-800",
  OTHER: "bg-gray-100 text-gray-800",
};

// 날짜 포맷팅 함수
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";

  try {
    // yyyy-MM-dd 포맷 (백엔드 LocalDate 객체에서 오는 형식)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-").map(Number);

      // 날짜 객체 생성 (월은 0부터 시작)
      return new Date(year, month - 1, day).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // ISO 포맷 또는 다른 형식의 날짜 스트링
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateString}`);
      return dateString;
    }

    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.error("날짜 변환 에러:", e);
    return dateString;
  }
};

interface RequestListProps {
  isAdmin?: boolean;
  initialYearMonth?: string; // 'YYYY-MM' 형식
  initialStatus?: ApprovalStatus;
}

export default function RequestList({
  isAdmin = false,
  initialYearMonth = new Date().toISOString().slice(0, 7), // 현재 연월
  initialStatus = "PENDING",
}: RequestListProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<AttendanceRequestDetail[]>([]);
  const [status, setStatus] = useState<ApprovalStatus>(initialStatus);
  const [yearMonth, setYearMonth] = useState<string>(initialYearMonth);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchFunction = isAdmin
        ? attendanceRequestService.getAllRequests
        : attendanceRequestService.getUserRequests;

      const response = await fetchFunction(status, yearMonth, currentPage, 10);

      if (response && response.content) {
        console.log("첫번째 요청 항목:", response.content[0]);
        setRequests(response.content);
        setTotalPages(response.totalPages);
      } else {
        setRequests([]);
        setTotalPages(0);
        console.error("응답 데이터 구조가 예상과 다름:", response);
      }
    } catch (err: any) {
      setError(err.message || "요청 목록을 불러오는데 실패했습니다.");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [status, yearMonth, currentPage, isAdmin]);

  const handleStatusChange = (newStatus: ApprovalStatus) => {
    setStatus(newStatus);
    setCurrentPage(1); // 상태 변경 시 첫 페이지로 이동
  };

  const handleYearMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYearMonth(e.target.value);
    setCurrentPage(1); // 날짜 변경 시 첫 페이지로 이동
  };

  if (loading && !requests.length) {
    return <div className="text-center p-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {isAdmin ? "전체 요청 목록" : "내 요청 목록"}
        </h2>

        <div className="flex space-x-2 mt-2 sm:mt-0">
          {!isAdmin && (
            <Link
              href="/attendance/request/new"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              새 요청
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center">
          <label htmlFor="yearMonth" className="mr-2 text-gray-700">
            날짜:
          </label>
          <input
            id="yearMonth"
            type="month"
            value={yearMonth}
            onChange={handleYearMonthChange}
            className="px-3 py-2 border rounded-md"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusChange("PENDING")}
            className={`px-4 py-2 rounded-md ${
              status === "PENDING"
                ? "bg-yellow-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            대기
          </button>
          <button
            onClick={() => handleStatusChange("APPROVED")}
            className={`px-4 py-2 rounded-md ${
              status === "APPROVED"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            승인
          </button>
          <button
            onClick={() => handleStatusChange("REJECTED")}
            className={`px-4 py-2 rounded-md ${
              status === "REJECTED"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            반려
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          요청 내역이 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">번호</th>
                {isAdmin && <th className="px-4 py-2">이름</th>}
                <th className="px-4 py-2">유형</th>
                <th className="px-4 py-2">기간</th>
                <th className="px-4 py-2">상태</th>
                <th className="px-4 py-2">신청일</th>
                <th className="px-4 py-2">세부정보</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr
                  key={request.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 text-center">{request.id}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">{request.userName}</td>
                  )}{" "}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        leaveTypeColorMap[request.leaveType as LeaveType]
                      }`}
                    >
                      {leaveTypeLabels[request.leaveType as LeaveType] ||
                        request.leaveType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(request.startDate)}
                    {request.endDate !== request.startDate &&
                      ` ~ ${formatDate(request.endDate)}`}
                  </td>
                  <td className="px-4 py-3">
                    <ApprovalStatusBadge status={request.approvalStatus} />
                  </td>
                  <td className="px-4 py-3">{formatDate(request.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={
                        isAdmin
                          ? `/panel/attendance/requests/${request.id}`
                          : `/attendance/requests/${request.id}`
                      }
                      className="text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      상세보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav>
            <ul className="flex space-x-1">
              <li>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  이전
                </button>
              </li>

              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum =
                  currentPage > 3 ? currentPage - 3 + i + 1 : i + 1;

                if (pageNum <= totalPages) {
                  return (
                    <li key={pageNum}>
                      <button
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded ${
                          currentPage === pageNum
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                }
                return null;
              })}

              <li>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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

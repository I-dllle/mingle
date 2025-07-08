"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AttendanceRequestDetail } from "@/features/attendance/types/attendanceRequest";
import { ApprovalStatusBadge, LeaveTypeBadge } from "../attendance/StatusBadge";
import { useEffect, useState } from "react";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";

interface AdminRequestListProps {
  status: string;
  month: string;
  searchTerm: string;
  onDataFiltered?: (filteredData: AttendanceRequestDetail[]) => void; // 필터링된 데이터를 부모로 전달
}

export default function AdminRequestList({
  status,
  month,
  searchTerm,
  onDataFiltered,
}: AdminRequestListProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<AttendanceRequestDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        console.log("API 요청 파라미터:", {
          status,
          month,
          currentPage,
          searchTerm,
        });

        if (status === "ALL") {
          // "전체" 선택 시 모든 상태의 데이터를 가져와서 합치기
          const [pendingResponse, approvedResponse, rejectedResponse] =
            await Promise.all([
              attendanceRequestService.getAllRequests(
                "PENDING",
                month,
                currentPage,
                10,
                searchTerm
              ),
              attendanceRequestService.getAllRequests(
                "APPROVED",
                month,
                currentPage,
                10,
                searchTerm
              ),
              attendanceRequestService.getAllRequests(
                "REJECTED",
                month,
                currentPage,
                10,
                searchTerm
              ),
            ]);

          console.log(
            "검색 결과 - PENDING:",
            pendingResponse.content.length,
            "건"
          );
          console.log(
            "검색 결과 - APPROVED:",
            approvedResponse.content.length,
            "건"
          );
          console.log(
            "검색 결과 - REJECTED:",
            rejectedResponse.content.length,
            "건"
          );

          // 모든 데이터 합치기
          let allRequests = [
            ...pendingResponse.content,
            ...approvedResponse.content,
            ...rejectedResponse.content,
          ];

          // 프론트엔드에서 검색 필터링 (백엔드에서 지원하지 않으므로)
          if (searchTerm && searchTerm.trim() !== "") {
            const searchLower = searchTerm.toLowerCase().trim();
            allRequests = allRequests.filter((request) => {
              const nickname = (request.nickname || "").toLowerCase();
              const departmentName = (
                request.departmentName || ""
              ).toLowerCase();
              return (
                nickname.includes(searchLower) ||
                departmentName.includes(searchLower)
              );
            });
            console.log(`"${searchTerm}" 검색 결과:`, allRequests.length, "건");
          }

          console.log("최종 표시할 데이터:", allRequests.length, "건");
          console.log("검색 결과 데이터 샘플:", allRequests.slice(0, 2));

          // 날짜별로 정렬 (최신순)
          allRequests.sort((a, b) => {
            const dateA = new Date(a.startDate || a.createdAt || "");
            const dateB = new Date(b.startDate || b.createdAt || "");
            return dateB.getTime() - dateA.getTime();
          });

          setRequests(allRequests);
          // 전체 페이지 수는 가장 큰 값으로 설정
          const maxTotalPages = Math.max(
            pendingResponse.totalPages,
            approvedResponse.totalPages,
            rejectedResponse.totalPages
          );
          setTotalPages(maxTotalPages);

          // 필터링된 데이터를 부모 컴포넌트로 전달
          if (onDataFiltered) {
            onDataFiltered(allRequests);
          }
        } else {
          // 특정 상태만 조회
          console.log("단일 상태 API 호출:", {
            status,
            month,
            currentPage,
            searchTerm,
          });
          const response = await attendanceRequestService.getAllRequests(
            status as any,
            month,
            currentPage,
            10,
            searchTerm
          );
          console.log("API 응답:", response);

          // 프론트엔드에서 검색 필터링 (백엔드에서 지원하지 않으므로)
          let filteredContent = response.content || [];
          if (searchTerm && searchTerm.trim() !== "") {
            const searchLower = searchTerm.toLowerCase().trim();
            filteredContent = filteredContent.filter((request) => {
              const nickname = (request.nickname || "").toLowerCase();
              const departmentName = (
                request.departmentName || ""
              ).toLowerCase();
              return (
                nickname.includes(searchLower) ||
                departmentName.includes(searchLower)
              );
            });
            console.log(
              `"${searchTerm}" 단일 상태 검색 결과:`,
              filteredContent.length,
              "건"
            );
          }

          setRequests(filteredContent);
          setTotalPages(response.totalPages || 1);

          // 필터링된 데이터를 부모 컴포넌트로 전달
          if (onDataFiltered) {
            onDataFiltered(filteredContent);
          }
        }
      } catch (err) {
        setError("데이터를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentPage, status, month, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime()) || date.getTime() === 0) {
        return "-";
      }
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return "-";
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">로딩 중…</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden p-8 text-center text-gray-600">
        조회된 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
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
          {requests.map((req, index) => (
            <tr key={req.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {(currentPage - 1) * 10 + index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {req.nickname || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <LeaveTypeBadge leaveType={req.leaveType} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(req.startDate)}
                {req.endDate && req.endDate !== req.startDate
                  ? ` ~ ${formatDate(req.endDate)}`
                  : ""}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <ApprovalStatusBadge status={req.approvalStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(req.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 hover:text-purple-800">
                <Link href={`/panel/requests/${req.id}/detail`}>상세보기</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-center p-4">
          <nav>
            <ul className="inline-flex -space-x-px">
              <li>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                      onClick={() => handlePageChange(pageNum)}
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
                    handlePageChange(Math.min(totalPages, currentPage + 1))
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

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ContractSearchCondition,
  ContractResponse,
  ContractStatus,
  ContractType,
  ContractCategory,
} from "@/features/department/finance-legal/contracts/types/Contract";
import { getFilteredContracts } from "@/features/department/finance-legal/contracts/services/contractService";

interface PagedResponse {
  content: ContractResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export default function ContractListPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 검색 조건 상태
  const [searchCondition, setSearchCondition] =
    useState<ContractSearchCondition>({});
  const [tempCondition, setTempCondition] = useState<ContractSearchCondition>(
    {}
  );

  // 정렬 상태
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // 계약서 목록 조회
  const fetchContracts = async (
    page: number = 0,
    condition: ContractSearchCondition = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response: PagedResponse = await getFilteredContracts(
        condition,
        page,
        pageSize,
        sortField,
        sortDirection
      );

      setContracts(response.content);
      setCurrentPage(response.number);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "계약서 목록 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchContracts();
  }, [sortField, sortDirection]);

  // 검색 실행
  const handleSearch = () => {
    setSearchCondition(tempCondition);
    setCurrentPage(0);
    fetchContracts(0, tempCondition);
  };

  // 검색 초기화
  const handleReset = () => {
    setTempCondition({});
    setSearchCondition({});
    setCurrentPage(0);
    fetchContracts(0, {});
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchContracts(page, searchCondition);
  };

  // 정렬 변경
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // 상태 번역
  const getStatusText = (status: ContractStatus) => {
    const statusMap = {
      [ContractStatus.DRAFT]: "초안",
      [ContractStatus.REVIEW]: "검토중",
      [ContractStatus.SIGNED_OFFLINE]: "오프라인서명",
      [ContractStatus.SIGNED]: "서명됨",
      [ContractStatus.CONFIRMED]: "확인됨",
      [ContractStatus.ACTIVE]: "활성화",
      [ContractStatus.EXPIRED]: "만료됨",
      [ContractStatus.PENDING]: "대기중",
      [ContractStatus.TERMINATED]: "종료됨",
    };
    return statusMap[status] || status;
  };

  // 상태별 스타일 클래스
  const getStatusClass = (status: ContractStatus) => {
    const classMap = {
      [ContractStatus.DRAFT]: "bg-gray-100 text-gray-800",
      [ContractStatus.REVIEW]: "bg-yellow-100 text-yellow-800",
      [ContractStatus.SIGNED_OFFLINE]: "bg-blue-100 text-blue-800",
      [ContractStatus.SIGNED]: "bg-green-100 text-green-800",
      [ContractStatus.CONFIRMED]: "bg-green-100 text-green-800",
      [ContractStatus.ACTIVE]: "bg-emerald-100 text-emerald-800",
      [ContractStatus.EXPIRED]: "bg-red-100 text-red-800",
      [ContractStatus.PENDING]: "bg-orange-100 text-orange-800",
      [ContractStatus.TERMINATED]: "bg-gray-100 text-gray-800",
    };
    return classMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">계약서 목록</h1>
        <button
          onClick={() => router.push("/contracts")}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          돌아가기
        </button>
      </div>

      {/* 검색 필터 */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">검색 조건</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 팀 ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              팀 ID
            </label>
            <input
              type="number"
              value={tempCondition.teamId || ""}
              onChange={(e) =>
                setTempCondition({
                  ...tempCondition,
                  teamId: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="팀 ID 입력"
            />
          </div>

          {/* 계약 상태 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계약 상태
            </label>
            <select
              value={tempCondition.status || ""}
              onChange={(e) =>
                setTempCondition({
                  ...tempCondition,
                  status: e.target.value
                    ? (e.target.value as ContractStatus)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체</option>
              {Object.values(ContractStatus).map((status) => (
                <option key={status} value={status}>
                  {getStatusText(status)}
                </option>
              ))}
            </select>
          </div>

          {/* 계약 타입 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계약 타입
            </label>
            <select
              value={tempCondition.contractType || ""}
              onChange={(e) =>
                setTempCondition({
                  ...tempCondition,
                  contractType: e.target.value
                    ? (e.target.value as ContractType)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체</option>
              <option value={ContractType.PAPER}>종이 계약</option>
              <option value={ContractType.ELECTRONIC}>전자 계약</option>
            </select>
          </div>

          {/* 계약 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계약 카테고리
            </label>
            <select
              value={tempCondition.contractCategory || ""}
              onChange={(e) =>
                setTempCondition({
                  ...tempCondition,
                  contractCategory: e.target.value
                    ? (e.target.value as ContractCategory)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체</option>
              <option value={ContractCategory.INTERNAL}>내부 계약</option>
              <option value={ContractCategory.EXTERNAL}>외부 계약</option>
            </select>
          </div>

          {/* 시작일 범위 - 시작 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작일 (부터)
            </label>
            <input
              type="date"
              value={tempCondition.startDateFrom || ""}
              onChange={(e) =>
                setTempCondition({
                  ...tempCondition,
                  startDateFrom: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 시작일 범위 - 끝 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작일 (까지)
            </label>
            <input
              type="date"
              value={tempCondition.startDateTo || ""}
              onChange={(e) =>
                setTempCondition({
                  ...tempCondition,
                  startDateTo: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 검색 버튼 */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "검색 중..." : "검색"}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 결과 정보 */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">
          총 {totalElements}개의 계약서 (페이지 {currentPage + 1} / {totalPages}
          )
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">정렬:</span>
          <select
            value={`${sortField}_${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split("_");
              setSortField(field);
              setSortDirection(direction as "asc" | "desc");
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="createdAt_desc">생성일 (최신순)</option>
            <option value="createdAt_asc">생성일 (오래된순)</option>
            <option value="startDate_desc">시작일 (최신순)</option>
            <option value="startDate_asc">시작일 (오래된순)</option>
            <option value="endDate_desc">종료일 (최신순)</option>
            <option value="endDate_asc">종료일 (오래된순)</option>
          </select>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 계약서 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("id")}
                >
                  ID
                  {sortField === "id" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("title")}
                >
                  제목
                  {sortField === "title" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  팀
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  회사
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("startDate")}
                >
                  시작일
                  {sortField === "startDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("endDate")}
                >
                  종료일
                  {sortField === "endDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  타입
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {contract.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="max-w-xs truncate" title={contract.title}>
                      {contract.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.teamName || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                        contract.status
                      )}`}
                    >
                      {getStatusText(contract.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.contractCategory === ContractCategory.INTERNAL
                      ? "내부"
                      : "외부"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contract.contractType === ContractType.PAPER
                      ? "종이"
                      : "전자"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 빈 결과 */}
        {!loading && contracts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">조건에 맞는 계약서가 없습니다.</p>
          </div>
        )}

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">로딩 중...</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            처음
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            이전
          </button>

          {/* 페이지 번호 */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const startPage = Math.max(
              0,
              Math.min(currentPage - 2, totalPages - 5)
            );
            const pageNum = startPage + i;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 text-sm border rounded-md ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            다음
          </button>
          <button
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            마지막
          </button>
        </div>
      )}
    </div>
  );
}

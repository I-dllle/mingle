"use client";

import { useState, useEffect } from "react";
import { contractService } from "@/features/department/finance-legal/contracts/services/contractService";
import {
  ContractCategory,
  ContractResponse,
  ContractDetailDto,
  ContractSearchCondition,
  ContractStatus,
  ContractType,
  ContractSimpleDto,
  PagedResponse,
  UserSearchDto,
} from "@/features/department/finance-legal/contracts/types/Contract";

export default function AdminContractsPage() {
  // 상태 관리
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [allContracts, setAllContracts] = useState<ContractSimpleDto[]>([]);
  const [selectedContract, setSelectedContract] =
    useState<ContractDetailDto | null>(null);
  const [expiringContracts, setExpiringContracts] = useState<
    ContractResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "expiring" | "detail">(
    "all"
  );

  // 페이징
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;
  // 필터링
  const [tempCondition, setTempCondition] = useState<ContractSearchCondition>(
    {}
  );
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [category, setCategory] = useState<ContractCategory>(
    ContractCategory.EXTERNAL
  );
  // 사용자 검색 관련 상태
  const [searchUserName, setSearchUserName] = useState<string>("");
  const [userSearchResults, setUserSearchResults] = useState<UserSearchDto[]>(
    []
  );
  const [selectedUser, setSelectedUser] = useState<UserSearchDto | null>(null);
  const [userContracts, setUserContracts] = useState<any[]>([]);
  // 모든 계약서 조회 (간단 정보)
  const fetchAllContracts = async (page: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response: PagedResponse<ContractSimpleDto> =
        await contractService.getAllContracts(category, page, pageSize);
      setAllContracts(response.content);
      setCurrentPage(response.number);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "계약서 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }; // 필터링된 계약서 조회
  const fetchFilteredContracts = async (
    page: number = 0,
    condition: ContractSearchCondition = {}
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractService.getFilteredContracts(
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
        err instanceof Error ? err.message : "필터링 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 검색 실행
  const handleSearch = () => {
    setCurrentPage(0);
    fetchFilteredContracts(0, tempCondition);
  };

  // 검색 초기화
  const handleReset = () => {
    setTempCondition({});
    setCurrentPage(0);
    fetchAllContracts(0);
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

  // 만료 예정 계약 조회
  const fetchExpiringContracts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractService.getExpiringContracts(category);
      setExpiringContracts(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "만료 예정 계약 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 계약 상세 조회
  const fetchContractDetail = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractService.getContractDetail(id, category);
      setSelectedContract(response);
      setActiveTab("detail");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "계약 상세 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };
  // 사용자 이름으로 검색
  const searchUsersByName = async () => {
    if (searchUserName.trim().length < 2) {
      alert("최소 2글자 이상 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await contractService.searchUsers(searchUserName.trim());
      setUserSearchResults(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "사용자 검색에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };
  // 사용자 선택 후 계약 조회
  const fetchUserContracts = async () => {
    if (!selectedUser) {
      alert("사용자를 선택해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await contractService.getContractsByUser(
        selectedUser.id,
        category,
        0,
        20
      );
      setUserContracts(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "사용자 계약 조회에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };
  // 초기 로드
  useEffect(() => {
    if (activeTab === "all") {
      fetchAllContracts();
    } else if (activeTab === "expiring") {
      fetchExpiringContracts();
    }
  }, [category, activeTab, sortField, sortDirection]);
  // 페이지 변경
  const handlePageChange = (page: number) => {
    if (contracts.length > 0) {
      // 필터링된 결과가 있으면 필터링된 페이지 조회
      fetchFilteredContracts(page, tempCondition);
    } else {
      // 전체 계약 페이지 조회
      fetchAllContracts(page);
    }
  };

  // 상태 번역
  const getStatusText = (status: ContractStatus) => {
    const statusMap = {
      [ContractStatus.DRAFT]: "초안",
      [ContractStatus.REVIEW]: "검토중",
      [ContractStatus.SIGNED_OFFLINE]: "오프라인서명",
      [ContractStatus.SIGNED]: "서명완료",
      [ContractStatus.CONFIRMED]: "확정",
      [ContractStatus.ACTIVE]: "활성",
      [ContractStatus.EXPIRED]: "만료",
      [ContractStatus.PENDING]: "대기",
      [ContractStatus.TERMINATED]: "종료",
    };
    return statusMap[status] || status;
  };
  // 상태별 색상 클래스
  const getStatusColor = (status: ContractStatus) => {
    const colorMap = {
      [ContractStatus.DRAFT]: "bg-gray-100 text-gray-800",
      [ContractStatus.REVIEW]: "bg-yellow-100 text-yellow-800",
      [ContractStatus.SIGNED_OFFLINE]: "bg-blue-100 text-blue-800",
      [ContractStatus.SIGNED]: "bg-blue-100 text-blue-800",
      [ContractStatus.CONFIRMED]: "bg-green-100 text-green-800",
      [ContractStatus.ACTIVE]: "bg-green-100 text-green-800",
      [ContractStatus.EXPIRED]: "bg-red-100 text-red-800",
      [ContractStatus.PENDING]: "bg-orange-100 text-orange-800",
      [ContractStatus.TERMINATED]: "bg-gray-100 text-gray-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 카테고리 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          계약 카테고리:
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ContractCategory)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={ContractCategory.EXTERNAL}>외부 계약</option>
          <option value={ContractCategory.INTERNAL}>내부 계약</option>
        </select>
      </div>{" "}
      {/* 탭 네비게이션 */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          전체 계약
        </button>
        <button
          onClick={() => setActiveTab("expiring")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "expiring"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          만료 예정
        </button>{" "}
      </div>
      {/* 사용자별 계약 조회 - 만료 예정 탭에서만 표시 */}
      {activeTab === "expiring" && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">사용자별 계약 조회</h3>

          {/* 사용자 검색 */}
          <div className="space-y-4">
            <div className="flex space-x-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사용자 이름:
                </label>
                <input
                  type="text"
                  value={searchUserName}
                  onChange={(e) => setSearchUserName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="사용자 이름 입력 (최소 2글자)"
                />
              </div>
              <button
                onClick={searchUsersByName}
                disabled={loading || searchUserName.trim().length < 2}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                검색
              </button>
            </div>

            {/* 검색 결과 */}
            {userSearchResults.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  검색 결과:
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                  {userSearchResults.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-3 cursor-pointer hover:bg-gray-100 border-b border-gray-200 last:border-b-0 ${
                        selectedUser?.id === user.id
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 선택된 사용자 */}
            {selectedUser && (
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                <div>
                  <span className="font-medium">선택된 사용자: </span>
                  <span className="text-green-700">
                    {selectedUser.name} ({selectedUser.email})
                  </span>
                </div>
                <button
                  onClick={fetchUserContracts}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
                >
                  계약 조회
                </button>
              </div>
            )}
          </div>

          {/* 사용자 계약 결과 표시 */}
          {userContracts.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium mb-3">
                사용자 계약 목록 ({userContracts.length}개)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {userContracts.map((contract, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded border border-gray-200 hover:border-gray-300 cursor-pointer"
                    onClick={() => fetchContractDetail(contract.id)}
                  >
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">ID:</span>
                        <span className="ml-2 font-medium">{contract.id}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">제목:</span>
                        <div className="font-medium text-gray-900 truncate">
                          {contract.title}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">상태:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            contract.status
                          )}`}
                        >
                          {getStatusText(contract.status)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">시작일:</span>
                        <span className="ml-2">{contract.startDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-4">
          <div className="text-gray-600">로딩 중...</div>
        </div>
      )}
      {/* 계약 상세 정보 */}
      {activeTab === "detail" && selectedContract && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">계약 상세 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>ID:</strong> {selectedContract.id}
            </div>
            <div>
              <strong>상태:</strong> {getStatusText(selectedContract.status)}
            </div>
            <div>
              <strong>시작일:</strong> {selectedContract.startDate}
            </div>
            <div>
              <strong>종료일:</strong> {selectedContract.endDate}
            </div>
            <div className="md:col-span-2">
              <strong>요약:</strong>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                {selectedContract.summary || "요약 정보가 없습니다."}
              </div>
            </div>
            {selectedContract.signerName && (
              <div>
                <strong>서명자:</strong> {selectedContract.signerName}
              </div>
            )}
            {selectedContract.signerMemo && (
              <div className="md:col-span-2">
                <strong>서명 메모:</strong>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  {selectedContract.signerMemo}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setActiveTab("all")}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            목록으로 돌아가기
          </button>
        </div>
      )}
      {/* 검색 필터 - All Contracts 탭에서만 표시 */}
      {activeTab === "all" && (
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
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      )}
      {/* 계약 목록 */}
      {activeTab === "all" && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                계약 목록
                <span className="text-sm text-gray-600 ml-2">
                  (총{" "}
                  {contracts.length > 0 ? totalElements : allContracts.length}
                  개, {currentPage + 1}/
                  {contracts.length > 0
                    ? totalPages
                    : Math.ceil(allContracts.length / pageSize)}{" "}
                  페이지)
                </span>
              </h3>
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
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
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
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* 필터링된 계약 또는 전체 계약 표시 */}
                {contracts.length > 0
                  ? // 필터링된 계약 표시 (ContractResponse 사용)
                    contracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.userName}
                          {contract.teamName && (
                            <div className="text-xs text-gray-500">
                              팀: {contract.teamName}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              contract.status
                            )}`}
                          >
                            {getStatusText(contract.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.startDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.endDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => fetchContractDetail(contract.id)}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                          >
                            상세보기
                          </button>
                        </td>
                      </tr>
                    ))
                  : // 전체 계약 표시 (ContractSimpleDto 사용)
                    allContracts.map((contract) => (
                      <tr key={contract.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {contract.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.startDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {contract.endDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => fetchContractDetail(contract.id)}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                          >
                            상세보기
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>{" "}
          {/* 페이지네이션 */}
          {((contracts.length > 0 && totalPages > 1) ||
            (contracts.length === 0 &&
              Math.ceil(allContracts.length / pageSize) > 1)) && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                {Array.from(
                  {
                    length: Math.min(
                      5,
                      contracts.length > 0
                        ? totalPages
                        : Math.ceil(allContracts.length / pageSize)
                    ),
                  },
                  (_, i) => {
                    const maxPages =
                      contracts.length > 0
                        ? totalPages
                        : Math.ceil(allContracts.length / pageSize);
                    const pageNumber =
                      currentPage < 3 ? i : currentPage - 2 + i;
                    if (pageNumber >= maxPages) return null;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-1 rounded border ${
                          currentPage === pageNumber
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber + 1}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage >=
                    (contracts.length > 0
                      ? totalPages
                      : Math.ceil(allContracts.length / pageSize)) -
                      1
                  }
                  className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* 만료 예정 계약 */}
      {activeTab === "expiring" && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b bg-red-50">
            <h3 className="text-lg font-semibold text-red-800">
              만료 예정 계약 ({expiringContracts.length}개)
            </h3>
          </div>
          {expiringContracts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              만료 예정인 계약이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      종료일
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
                  {expiringContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-red-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        {contract.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {getStatusText(contract.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => fetchContractDetail(contract.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

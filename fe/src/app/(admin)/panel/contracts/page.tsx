"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { contractService } from "@/features/department/finance-legal/contracts/services/contractService";
import {
  ContractCategory,
  ContractResponse,
  ContractSearchCondition,
  ContractStatus,
  ContractSimpleDto,
  UserSearchDto,
  PagedResponse,
} from "@/features/department/finance-legal/contracts/types/Contract";

// Import components
import ContractStatsCards from "@/features/admin/components/contracts/ContractStatsCards";
import ContractSearchFilters from "@/features/admin/components/contracts/ContractSearchFilters";
import ContractTable from "@/features/admin/components/contracts/ContractTable";
import ExpiringContractsTab from "@/features/admin/components/contracts/ExpiringContractsTab";
import Pagination from "@/features/admin/components/contracts/Pagination";
import ContractAlerts from "@/features/admin/components/contracts/ContractAlerts";

export default function AdminContractsPage() {
  const router = useRouter();

  // 상태 관리
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [allContracts, setAllContracts] = useState<ContractSimpleDto[]>([]);
  const [expiringContracts, setExpiringContracts] = useState<
    ContractResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "expiring">("all");
  // 검색 조건 표시 여부 상태 추가
  const [showFilters, setShowFilters] = useState(false);

  // 페이징
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 필터링
  const [searchCondition, setSearchCondition] =
    useState<ContractSearchCondition>({});
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [category, setCategory] = useState<ContractCategory>(
    ContractCategory.EXTERNAL
  );

  // 통계 데이터
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    review: 0,
  });

  // 모든 계약서 조회
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
  };

  // 필터링된 계약서 조회
  const fetchFilteredContracts = async (
    page: number = 0,
    condition: ContractSearchCondition = {}
  ) => {
    setLoading(true);
    setError(null);
    try {
      // 항상 현재 카테고리를 기준으로 필터링하기 위해 조건에 추가
      const updatedCondition = {
        ...condition,
        contractCategory: category,
      };

      const response = await contractService.getFilteredContracts(
        updatedCondition,
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

  // 만료 예정 계약 조회
  const fetchExpiringContracts = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
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
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // 계약 상세 페이지로 이동
  const handleViewDetail = (id: number) => {
    router.push(`/panel/contracts/${id}?category=${category}`);
  };
  // 참여자 검색
  const handleParticipantSearch = async (
    name: string
  ): Promise<UserSearchDto[]> => {
    try {
      return await contractService.searchUsers(name);
    } catch (err) {
      console.error("참여자 검색 실패:", err);
      return [];
    }
  };

  // 검색 실행
  const handleSearch = () => {
    if (Object.keys(searchCondition).length > 0) {
      fetchFilteredContracts(0, searchCondition);
    } else {
      fetchAllContracts(0);
    }
  };

  // 검색 조건 초기화
  const handleReset = () => {
    setSearchCondition({});
    setContracts([]);
    setCurrentPage(0);
    fetchAllContracts(0);
  };

  // 정렬 처리
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (contracts.length > 0) {
      fetchFilteredContracts(page, searchCondition);
    } else {
      fetchAllContracts(page);
    }
  };

  // 통계 업데이트
  const updateStats = () => {
    const total = contracts.length > 0 ? totalElements : allContracts.length;
    const active =
      contracts.filter((c) => c.status === ContractStatus.ACTIVE).length ||
      allContracts.filter((c) => c.status === ContractStatus.ACTIVE).length;
    const review =
      contracts.filter((c) => c.status === ContractStatus.REVIEW).length ||
      allContracts.filter((c) => c.status === ContractStatus.REVIEW).length;

    setStats({
      total,
      active,
      expiring: expiringContracts.length,
      review,
    });
  };

  // 카테고리 변경 감지
  useEffect(() => {
    // 카테고리가 변경되면 현재 선택된 탭에 맞게 데이터를 다시 로드
    if (activeTab === "all") {
      // 검색 조건이 있다면 필터링된 결과를, 없다면 모든 계약 조회
      if (Object.keys(searchCondition).length > 0) {
        fetchFilteredContracts(0, searchCondition);
      } else {
        fetchAllContracts(0);
      }
    } else if (activeTab === "expiring") {
      fetchExpiringContracts(true);
    }

    // 카테고리가 변경될 때 만료 예정 계약을 항상 업데이트 (만료 개수 표시를 위해)
    if (activeTab !== "expiring") {
      fetchExpiringContracts(false);
    }
  }, [category]);

  // 탭 변경 감지
  useEffect(() => {
    if (activeTab === "all") {
      if (Object.keys(searchCondition).length > 0) {
        fetchFilteredContracts(0, searchCondition);
      } else {
        fetchAllContracts(0);
      }
    } else if (activeTab === "expiring") {
      fetchExpiringContracts(true);
    }
  }, [activeTab]);
  // 정렬 변경 시 재조회
  useEffect(() => {
    if (contracts.length > 0) {
      fetchFilteredContracts(currentPage, searchCondition);
    } else if (allContracts.length > 0) {
      // allContracts의 경우 프론트엔드에서 정렬되므로 재조회 불필요
      // ContractTable 컴포넌트에서 정렬 처리
    }
  }, [sortField, sortDirection]);

  // 통계 업데이트
  useEffect(() => {
    updateStats();
  }, [contracts, allContracts, expiringContracts, totalElements, category]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            {" "}
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              📄 계약 관리
            </h1>
            <p className="text-gray-600 mt-2">
              전체 계약을 관리하고 만료 예정 계약을 모니터링하세요
            </p>
          </div>
          {/* 카테고리 선택 */}{" "}
          <div className="flex items-center gap-4">
            {" "}
            {/* 알림 시스템 */}
            <ContractAlerts
              contracts={contracts.length > 0 ? contracts : []}
              onContractClick={handleViewDetail}
            />
            <div className="flex items-center gap-2">
              ⚙️
              <label className="text-sm font-medium text-gray-700">
                계약 카테고리:
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ContractCategory)
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value={ContractCategory.EXTERNAL}>외부 계약</option>
                <option value={ContractCategory.INTERNAL}>내부 계약</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* 통계 카드 */}
      <ContractStatsCards stats={stats} loading={loading} />
      {/* 탭 네비게이션 */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "all"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          📄 전체 계약
        </button>
        <button
          onClick={() => setActiveTab("expiring")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "expiring"
              ? "bg-white text-red-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          ⏰ 만료 예정
          {expiringContracts.length > 0 && (
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
              {expiringContracts.length}
            </span>
          )}
        </button>
      </div>
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
          ⚠️
          {error}
        </div>
      )}
      {/* 탭 컨텐츠 */}
      {activeTab === "all" && (
        <>
          {/* 검색 토글 버튼 */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-all"
            >
              {showFilters ? "검색 필터 접기 ▲" : "검색 필터 열기 ▼"}
            </button>
          </div>

          {/* 검색 필터 (토글에 따라 표시) */}
          {showFilters && (
            <ContractSearchFilters
              condition={searchCondition}
              onConditionChange={setSearchCondition}
              onSearch={handleSearch}
              onReset={handleReset}
              loading={loading}
              onParticipantSearch={handleParticipantSearch}
            />
          )}

          {/* 계약 테이블 (굵은 선 제거) */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ContractTable
              contracts={contracts}
              allContracts={allContracts}
              category={category}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              loading={loading}
            />
          </div>

          {/* 페이지네이션 */}
          {((contracts.length > 0 && totalPages > 1) ||
            (contracts.length === 0 &&
              Math.ceil(allContracts.length / pageSize) > 1)) && (
            <Pagination
              currentPage={currentPage}
              totalPages={
                contracts.length > 0
                  ? totalPages
                  : Math.ceil(allContracts.length / pageSize)
              }
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </>
      )}
      {activeTab === "expiring" && (
        <ExpiringContractsTab
          contracts={expiringContracts}
          category={category}
          loading={loading}
        />
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ContractSearchCondition,
  ContractResponse,
  ContractSimpleDto,
  ContractStatus,
  ContractType,
  ContractCategory,
  UserSearchDto,
} from "@/features/department/finance-legal/contracts/types/Contract";
import {
  getFilteredContracts,
  getAllContracts,
  searchUsers,
} from "@/features/department/finance-legal/contracts/services/contractService";

interface PagedResponse {
  content: ContractSimpleDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export default function ContractsPage() {
  const [category, setCategory] = useState<ContractCategory>(
    ContractCategory.EXTERNAL
  );
  const [showFilters, setShowFilters] = useState(false);
  const [contracts, setContracts] = useState<ContractSimpleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  // 검색 조건 상태
  const [searchCondition, setSearchCondition] =
    useState<ContractSearchCondition>({});
  const [tempCondition, setTempCondition] = useState<ContractSearchCondition>({
    contractCategory: category,
  });

  // 참여자 검색 관련 상태
  const [participantName, setParticipantName] = useState<string>("");
  const [searchingParticipant, setSearchingParticipant] =
    useState<boolean>(false);
  const [participantResults, setParticipantResults] = useState<UserSearchDto[]>(
    []
  );
  const [selectedParticipant, setSelectedParticipant] =
    useState<UserSearchDto | null>(null);

  // 정렬 상태
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  // 카테고리 변경 핸들러
  const handleCategoryChange = (newCategory: ContractCategory) => {
    setCategory(newCategory);
    setTempCondition({
      ...tempCondition,
      contractCategory: newCategory,
    });
    fetchContracts(0, { ...searchCondition, contractCategory: newCategory });
  };
  // 참여자 이름으로 검색
  const handleParticipantSearch = async () => {
    if (participantName.trim().length < 2) {
      // 이제 경고 메시지 표시하지 않고 그냥 반환
      setParticipantResults([]);
      return;
    }

    setSearchingParticipant(true);
    try {
      const results = await searchUsers(participantName.trim());
      setParticipantResults(results);
      // 경고 메시지도 제거 (자동 검색이므로 사용자 경험 향상)
    } catch (error) {
      console.error("사용자 검색 실패:", error);
      // 경고 메시지도 제거 (자동 검색이므로 사용자 경험 향상)
    } finally {
      setSearchingParticipant(false);
    }
  };

  // 디바운스를 위한 타이머 변수
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  // 참여자 선택
  const handleSelectParticipant = (user: UserSearchDto) => {
    setSelectedParticipant(user);
    setTempCondition({
      ...tempCondition,
      participantUserId: user.id,
    });
    // 검색 결과 닫기
    setParticipantResults([]);
  };

  // 참여자 선택 해제
  const handleClearParticipant = () => {
    setSelectedParticipant(null);
    setParticipantName("");
    setTempCondition({
      ...tempCondition,
      participantUserId: undefined,
    });
  }; // 계약서 목록 조회
  const fetchContracts = async (
    page: number = 0,
    condition: ContractSearchCondition = { contractCategory: category },
    size: number = pageSize
  ) => {
    setLoading(true);
    setError(null);

    try {
      // 모든 경우에 getAllContracts 사용 (ContractSimpleDto 반환)
      const response = await getAllContracts(
        condition.contractCategory || category,
        page,
        size
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
    const resetCondition = { contractCategory: category };
    setTempCondition(resetCondition);
    setSearchCondition(resetCondition);
    setCurrentPage(0);
    // 참여자 검색 관련 상태 초기화
    setParticipantName("");
    setParticipantResults([]);
    setSelectedParticipant(null);
    fetchContracts(0, resetCondition);
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
    <div className="container mx-auto p-6">
      {/* 헤더 영역 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              계약 관리 대시보드
            </h1>
            <p className="text-gray-600 mt-1">
              계약서 관리 및 진행 상황을 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`contracts/create`}
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              계약서 생성
            </Link>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-md hover:bg-gray-50 transition-colors shadow-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              {showFilters ? "필터 숨기기" : "필터 보기"}
            </button>
          </div>
        </div>

        {/* 카테고리 선택 및 요약 정보 */}
        <div className="mt-6 border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => handleCategoryChange(ContractCategory.EXTERNAL)}
                className={`px-6 py-2.5 text-sm font-medium rounded-l-md ${
                  category === ContractCategory.EXTERNAL
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                외부 계약
              </button>
              <button
                onClick={() => handleCategoryChange(ContractCategory.INTERNAL)}
                className={`px-6 py-2.5 text-sm font-medium rounded-r-md ${
                  category === ContractCategory.INTERNAL
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                내부 계약
              </button>
            </div>

            <div className="flex gap-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center min-w-[120px]">
                <span className="text-lg font-semibold text-blue-700">
                  {totalElements}
                </span>
                <p className="text-xs text-blue-600">총 계약</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center min-w-[120px]">
                <span className="text-lg font-semibold text-green-700">
                  {
                    contracts.filter((c) => c.status === ContractStatus.ACTIVE)
                      .length
                  }
                </span>
                <p className="text-xs text-green-600">활성 계약</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center min-w-[120px]">
                <span className="text-lg font-semibold text-yellow-700">
                  {
                    contracts.filter(
                      (c) =>
                        c.status === ContractStatus.PENDING ||
                        c.status === ContractStatus.REVIEW
                    ).length
                  }
                </span>
                <p className="text-xs text-yellow-600">진행 중</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center min-w-[120px]">
                <span className="text-lg font-semibold text-red-700">
                  {
                    contracts.filter((c) => c.status === ContractStatus.EXPIRED)
                      .length
                  }
                </span>
                <p className="text-xs text-red-600">만료 계약</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}{" "}
        </div>
      )}
      {/* 필터링 영역 */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>{" "}
              상세 검색
            </h2>{" "}
            <div className="text-sm text-gray-500">
              선택한 필터:
              {
                Object.keys(searchCondition).filter(
                  (key) =>
                    searchCondition[key as keyof ContractSearchCondition] !==
                      undefined && key !== "contractCategory"
                ).length
              }
              개
            </div>{" "}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {/* 팀 ID */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="팀 ID 입력"
              />
            </div>
            {/* 참여자 검색 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                참여자 검색
              </label>{" "}
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={participantName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setParticipantName(value);

                      // 기존 타이머가 있으면 취소
                      if (searchTimer) {
                        clearTimeout(searchTimer);
                      }

                      if (value.trim().length >= 2) {
                        // 300ms 디바운스로 검색 지연 (불필요한 API 호출 방지)
                        const timer = setTimeout(() => {
                          handleParticipantSearch();
                        }, 300);
                        setSearchTimer(timer);
                      } else if (value.trim().length === 0) {
                        // 입력값이 없을 때는 결과 초기화
                        setParticipantResults([]);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder="참여자 이름 입력 (2글자 이상)"
                    disabled={!!selectedParticipant}
                  />
                  {participantResults.length > 0 && !selectedParticipant && (
                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto">
                      {participantResults.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleSelectParticipant(user)}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedParticipant && (
                  <button
                    type="button"
                    onClick={handleClearParticipant}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm whitespace-nowrap"
                  >
                    {selectedParticipant.name} 해제
                  </button>
                )}
              </div>
            </div>
            {/* 계약 상태 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">모든 상태</option>
                <option
                  disabled
                  className="font-medium text-gray-500 bg-gray-100"
                >
                  ─── 진행 상태 ───
                </option>
                <option value={ContractStatus.DRAFT}>초안</option>
                <option value={ContractStatus.REVIEW}>검토 중</option>
                <option value={ContractStatus.PENDING}>대기 중</option>
                <option
                  disabled
                  className="font-medium text-gray-500 bg-gray-100"
                >
                  ─── 서명 상태 ───
                </option>
                <option value={ContractStatus.SIGNED_OFFLINE}>
                  오프라인 서명
                </option>
                <option value={ContractStatus.SIGNED}>서명됨</option>
                <option
                  disabled
                  className="font-medium text-gray-500 bg-gray-100"
                >
                  ─── 완료 상태 ───
                </option>
                <option value={ContractStatus.CONFIRMED}>확인됨</option>
                <option value={ContractStatus.ACTIVE}>활성화</option>
                <option
                  disabled
                  className="font-medium text-gray-500 bg-gray-100"
                >
                  ─── 종료 상태 ───
                </option>
                <option value={ContractStatus.EXPIRED}>만료됨</option>
                <option value={ContractStatus.TERMINATED}>종료됨</option>
              </select>
            </div>
            {/* 계약 타입 */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">모든 타입</option>
                <option value={ContractType.PAPER}>종이 계약</option>{" "}
                <option value={ContractType.ELECTRONIC}>전자 계약</option>
              </select>
            </div>
            {/* 참여자 사용자 ID */}
            {/* 날짜 범위 (시작 ~ 종료) */}
            <div className="space-y-1 col-span-4">
              <label className="block text-sm font-medium text-gray-700">
                계약 기간
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={tempCondition.startDateFrom || ""}
                  onChange={(e) =>
                    setTempCondition({
                      ...tempCondition,
                      startDateFrom: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <span className="text-gray-500 w-4 text-center">~</span>
                <input
                  type="date"
                  value={tempCondition.startDateTo || ""}
                  onChange={(e) =>
                    setTempCondition({
                      ...tempCondition,
                      startDateTo: e.target.value || undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
          {/* 검색 버튼 */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {totalElements > 0
                ? `총 ${totalElements}개의 계약서`
                : "검색 결과가 없습니다."}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                초기화
              </button>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                검색
              </button>
            </div>
          </div>{" "}
        </div>
      )}
      {/* 계약서 목록 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="text-lg font-medium text-gray-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            계약서 목록
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <label className="text-sm text-gray-600 mr-2">정렬:</label>
              <select
                value={`${sortField}_${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split("_");
                  setSortField(field);
                  setSortDirection(direction as "asc" | "desc");
                }}
                className="border border-gray-300 rounded-md text-sm px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="createdAt_desc">최근 생성순</option>
                <option value="createdAt_asc">오래된 순</option>
                <option value="startDate_desc">시작일 최신순</option>
                <option value="startDate_asc">시작일 오래된순</option>
                <option value="endDate_desc">종료일 최신순</option>
                <option value="endDate_asc">종료일 오래된순</option>
                <option value="title_asc">제목 (오름차순)</option>
                <option value="title_desc">제목 (내림차순)</option>
              </select>
            </div>
          </div>
        </div>
        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="pl-6 pr-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                  ID
                </th>
                <th
                  className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    <span>계약 제목</span>
                    {sortField === "title" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            sortDirection === "asc"
                              ? "M7 11l5-5 5 5m-5 9V6"
                              : "M7 13l5 5 5-5M12 18V6"
                          }
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  담당자
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  팀
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  계약 상대방
                </th>
                <th
                  className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("startDate")}
                >
                  <div className="flex items-center">
                    <span>시작일</span>
                    {sortField === "startDate" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            sortDirection === "asc"
                              ? "M7 11l5-5 5 5m-5 9V6"
                              : "M7 13l5 5 5-5M12 18V6"
                          }
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("endDate")}
                >
                  <div className="flex items-center">
                    <span>종료일</span>
                    {sortField === "endDate" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            sortDirection === "asc"
                              ? "M7 11l5-5 5 5m-5 9V6"
                              : "M7 13l5 5 5-5M12 18V6"
                          }
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  구분
                </th>
                <th className="pr-6 pl-3 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contracts.map((contract) => {
                // 만료일까지 남은 일수 계산
                const today = new Date();
                const endDate = new Date(contract.endDate);
                const daysLeft = Math.ceil(
                  (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                );
                const isExpiringSoon = daysLeft > 0 && daysLeft <= 30;
                const isExpired = daysLeft <= 0;

                return (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="pl-6 pr-3 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      #{contract.id}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <div className="flex flex-col">
                        <div className="font-medium text-blue-600 hover:text-blue-800">
                          <Link
                            href={`contracts/${contract.id}?category=${contract.category}`}
                          >
                            {contract.title}
                          </Link>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {contract.category === ContractCategory.INTERNAL
                            ? "📋 내부계약"
                            : "📄 외부계약"}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span className="font-medium">{contract.nickname}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      -
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{contract.companyName || "-"}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(contract.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span
                          className={
                            isExpired
                              ? "text-red-600"
                              : isExpiringSoon
                              ? "text-orange-600"
                              : "text-gray-900"
                          }
                        >
                          {new Date(contract.endDate).toLocaleDateString()}
                        </span>
                        {isExpiringSoon && !isExpired && (
                          <span className="ml-2 px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                            D-{daysLeft}
                          </span>
                        )}
                        {isExpired && (
                          <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                            만료됨
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClass(
                          contract.status
                        )}`}
                      >
                        {getStatusText(contract.status)}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.category === ContractCategory.INTERNAL ? (
                        <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">
                          내부
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded">
                          외부
                        </span>
                      )}
                    </td>
                    <td className="pr-6 pl-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`contracts/${contract.id}?category=${contract.category}`}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded-md hover:bg-blue-50"
                        >
                          상세보기
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* 빈 결과 */}
        {!loading && contracts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              계약서가 없습니다
            </h3>{" "}
            <p className="text-gray-500">
              조건에 맞는 계약서를 찾을 수 없습니다.
            </p>
          </div>
        )}
        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
            <p className="text-gray-700 font-medium">데이터를 불러오는 중...</p>
            <p className="text-sm text-gray-500 mt-1">잠시만 기다려주세요.</p>
          </div>
        )}
      </div>{" "}
      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">페이지당 항목 수:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setPageSize(newSize);
                  setCurrentPage(0);
                  fetchContracts(0, searchCondition, newSize);
                }}
                className="border border-gray-300 rounded-md text-sm px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="10">10개</option>
                <option value="20">20개</option>
                <option value="30">30개</option>
                <option value="50">50개</option>
              </select>
              <span className="text-sm text-gray-500">
                총 <span className="font-medium">{totalElements}</span>개 중{" "}
                <span className="font-medium">
                  {currentPage * pageSize + 1}-
                  {Math.min((currentPage + 1) * pageSize, totalElements)}
                </span>
                개 표시
              </span>
            </div>{" "}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  title="첫 페이지"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  title="이전 페이지"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {/* 페이지 번호 */}
                <div className="flex">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const startPage = Math.max(
                      0,
                      Math.min(currentPage - 2, totalPages - 5)
                    );
                    const pageNumber = startPage + i;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-9 h-9 mx-0.5 flex items-center justify-center rounded-md text-sm font-medium ${
                          currentPage === pageNumber
                            ? "bg-blue-50 border border-blue-400 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber + 1}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  title="다음 페이지"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  title="마지막 페이지"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

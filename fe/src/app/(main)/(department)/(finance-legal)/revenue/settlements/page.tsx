"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { settlementService } from "@/features/department/finance-legal/revenue/services/settlementService";
import { SettlementDto } from "@/features/department/finance-legal/revenue/types/Settlement";

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState<SettlementDto[]>([]);
  const [contractId, setContractId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 페이지 로드 시 모든 정산 조회
  useEffect(() => {
    loadAllSettlements();
  }, []);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] =
    useState<SettlementDto | null>(null);

  // 필터링 상태
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // 정렬 상태
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  // 새 정산 생성용 상태
  const [newSettlement, setNewSettlement] = useState({
    contractId: 0,
  });

  // 정산 수정용 상태
  const [updateData, setUpdateData] = useState({
    totalAmount: 0,
    memo: "",
    isSettled: false,
    source: "",
    incomeDate: "",
  }); // 모든 정산 목록 조회
  const loadAllSettlements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settlementService.getAllSettlements();
      console.log("정산 데이터:", data); // 디버깅용 로그

      // 백엔드가 페이지네이션된 응답을 반환하는 경우 처리
      if (data && typeof data === "object" && "content" in data) {
        setSettlements((data as any).content);
      } else if (Array.isArray(data)) {
        setSettlements(data);
      } else {
        console.error("예상치 못한 데이터 형태:", data);
        setSettlements([]);
      }
    } catch (error) {
      console.error("정산 목록 조회 실패:", error);
      setError("정산 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 계약별 정산 목록 조회
  const loadSettlementsByContract = async () => {
    if (contractId <= 0) {
      setError("올바른 계약 ID를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await settlementService.getSettlementsByContract(contractId);
      setSettlements(data);
    } catch (error) {
      console.error("정산 목록 조회 실패:", error);
      setError("정산 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  // 필터링된 정산 목록
  const filteredSettlements = Array.isArray(settlements)
    ? settlements
        .filter((settlement) => {
          // 상태 필터
          if (statusFilter === "pending" && settlement.isSettled) return false;
          if (statusFilter === "completed" && !settlement.isSettled)
            return false;

          // 날짜 필터
          if (dateFilter.startDate && settlement.date < dateFilter.startDate)
            return false;
          if (dateFilter.endDate && settlement.date > dateFilter.endDate)
            return false;

          return true;
        })
        .sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case "date":
              comparison =
                new Date(a.date).getTime() - new Date(b.date).getTime();
              break;
            case "amount":
              comparison = a.amount - b.amount;
              break;
            case "status":
              comparison = Number(a.isSettled) - Number(b.isSettled);
              break;
          }

          return sortOrder === "asc" ? comparison : -comparison;
        })
    : [];
  // 통계 계산
  const statistics = {
    total: Array.isArray(settlements) ? settlements.length : 0,
    completed: Array.isArray(settlements)
      ? settlements.filter((s) => s.isSettled).length
      : 0,
    pending: Array.isArray(settlements)
      ? settlements.filter((s) => !s.isSettled).length
      : 0,
    totalAmount: Array.isArray(settlements)
      ? settlements.reduce((sum, s) => sum + s.amount, 0)
      : 0,
    completedAmount: Array.isArray(settlements)
      ? settlements
          .filter((s) => s.isSettled)
          .reduce((sum, s) => sum + s.amount, 0)
      : 0,
    pendingAmount: Array.isArray(settlements)
      ? settlements
          .filter((s) => !s.isSettled)
          .reduce((sum, s) => sum + s.amount, 0)
      : 0,
  }; // 정산 생성
  const handleCreateSettlement = async () => {
    if (newSettlement.contractId <= 0) {
      setError("올바른 계약 ID를 입력해주세요.");
      return;
    }

    try {
      await settlementService.createSettlementForContract(
        newSettlement.contractId
      );
      setShowCreateForm(false);
      setNewSettlement({ contractId: 0 });
      setError(null); // 현재 조회중인 계약과 같으면 목록 새로고침
      if (contractId === newSettlement.contractId) {
        loadSettlementsByContract();
      } else if (contractId === 0) {
        // 전체 조회 상태면 전체 목록 새로고침
        loadAllSettlements();
      }
    } catch (error) {
      console.error("정산 생성 실패:", error);
      setError("정산 생성에 실패했습니다.");
    }
  };

  // 정산 수정
  const handleUpdateSettlement = async () => {
    if (!selectedSettlement) return;

    try {
      await settlementService.updateSettlement(
        selectedSettlement.id,
        updateData
      );
      setShowUpdateModal(false);
      setSelectedSettlement(null);
      setError(null);

      // 계약 ID 필터가 설정되어 있으면 해당 계약의 정산만, 아니면 전체 조회
      if (contractId > 0) {
        loadSettlementsByContract();
      } else {
        loadAllSettlements();
      }
    } catch (error) {
      console.error("정산 수정 실패:", error);
      setError("정산 수정에 실패했습니다.");
    }
  };

  // 정산 삭제
  const handleDeleteSettlement = async (settlementId: number) => {
    if (!confirm("정말로 이 정산을 삭제하시겠습니까?")) return;
    try {
      await settlementService.deleteSettlement(settlementId);

      // 계약 ID 필터가 설정되어 있으면 해당 계약의 정산만, 아니면 전체 조회
      if (contractId > 0) {
        loadSettlementsByContract();
      } else {
        loadAllSettlements();
      }
    } catch (error) {
      console.error("정산 삭제 실패:", error);
      setError("정산 삭제에 실패했습니다.");
    }
  };

  // 정산 상태 변경
  const handleStatusChange = async (
    settlementId: number,
    isSettled: boolean
  ) => {
    try {
      await settlementService.changeSettlementStatus(settlementId, {
        isSettled,
      });

      // 계약 ID 필터가 설정되어 있으면 해당 계약의 정산만, 아니면 전체 조회
      if (contractId > 0) {
        loadSettlementsByContract();
      } else {
        loadAllSettlements();
      }
    } catch (error) {
      console.error("상태 변경 실패:", error);
      setError("상태 변경에 실패했습니다.");
    }
  };
  // 수정 모달 열기
  const openUpdateModal = (settlement: SettlementDto) => {
    setSelectedSettlement(settlement);
    setUpdateData({
      totalAmount: settlement.amount,
      memo: settlement.memo,
      isSettled: settlement.isSettled,
      source: "",
      incomeDate: settlement.date,
    });
    setShowUpdateModal(true);
  };

  // 정렬 변경
  const handleSort = (field: "date" | "amount" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  }; // 필터 초기화
  const resetFilters = () => {
    setStatusFilter("all");
    setDateFilter({ startDate: "", endDate: "" });
    setSortBy("date");
    setSortOrder("desc");
    setContractId(0);
    setError(null);
    // 전체 정산 목록으로 되돌리기
    loadAllSettlements();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  return (
    <div className="container mx-auto p-6">
      {/* 헤더 영역 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            {" "}
            <h1 className="text-2xl font-bold text-gray-800">정산 관리</h1>
            <p className="text-gray-600 mt-1">
              모든 정산을 조회하거나 특정 계약 ID로 필터링하여 정산을 관리합니다
            </p>
          </div>{" "}
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`inline-flex items-center px-4 py-2.5 rounded-md transition-colors shadow-sm font-medium ${
                showCreateForm
                  ? "bg-gray-100 text-gray-700 border border-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 mr-1.5 transition-transform ${
                  showCreateForm ? "rotate-45" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              {showCreateForm ? "취소" : "새 정산 생성"}
            </button>
          </div>
        </div>
      </div>
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>{" "}
        </div>
      )}
      {/* 인라인 정산 생성 폼 */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="border-l-4 border-blue-500 pl-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              새 정산 생성
            </h3>{" "}
            <p className="text-sm text-gray-600">
              계약 ID를 입력하여 새로운 정산을 생성합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                계약 ID *
              </label>
              <input
                type="number"
                value={newSettlement.contractId || ""}
                onChange={(e) =>
                  setNewSettlement({
                    ...newSettlement,
                    contractId: Number(e.target.value),
                  })
                }
                placeholder="계약 ID를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewSettlement({ contractId: 0 });
                setError(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              취소
            </button>{" "}
            <button
              onClick={handleCreateSettlement}
              disabled={loading || newSettlement.contractId <= 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  생성 중...
                </div>
              ) : (
                "정산 생성"
              )}
            </button>
          </div>
        </div>
      )}
      {/* 검색 및 필터 영역 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {" "}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계약 ID (선택사항)
            </label>
            <input
              type="number"
              value={contractId || ""}
              onChange={(e) => setContractId(Number(e.target.value))}
              placeholder="특정 계약의 정산만 보려면 ID 입력"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상태 필터
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "pending" | "completed"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="pending">대기 중</option>
              <option value="completed">완료</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작일
            </label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료일
            </label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>{" "}
        </div>{" "}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            {settlements.length > 0 && (
              <>
                총 {filteredSettlements.length}개의 정산 (전체{" "}
                {settlements.length}개)
              </>
            )}
          </div>{" "}
          <div className="flex items-center gap-3">
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md 
                         hover:bg-gray-50 hover:border-gray-400 
                         active:bg-gray-100 active:scale-95 
                         transition-all duration-150 ease-in-out
                         focus:outline-none"
            >
              <span className="flex items-center gap-1">🔄 필터 초기화</span>
            </button>{" "}
            <button
              onClick={() => {
                if (contractId > 0) {
                  loadSettlementsByContract();
                } else {
                  loadAllSettlements();
                }
              }}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading
                ? "로딩중..."
                : contractId > 0
                ? "계약별 조회"
                : "전체 조회"}
            </button>
          </div>
        </div>
      </div>
      {/* 통계 카드 */}
      {settlements.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 정산</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statistics.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">완료</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statistics.completed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">대기 중</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {statistics.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4 min-w-0">
                <p className="text-sm font-medium text-gray-600">총 금액</p>
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {formatCurrency(statistics.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* 정산 목록 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            정산 목록
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <label className="text-sm text-gray-600 mr-2">정렬:</label>
              <select
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("_");
                  setSortBy(field as "date" | "amount" | "status");
                  setSortOrder(order as "asc" | "desc");
                }}
                className="border border-gray-300 rounded-md text-sm px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="date_desc">날짜 (최신순)</option>
                <option value="date_asc">날짜 (오래된순)</option>
                <option value="amount_desc">금액 (높은순)</option>
                <option value="amount_asc">금액 (낮은순)</option>
                <option value="status_desc">상태별</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    <span>ID</span>
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    <span>금액</span>
                    {sortBy === "amount" && (
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
                            sortOrder === "asc"
                              ? "M7 11l5-5 5 5m-5 9V6"
                              : "M7 13l5 5 5-5M12 18V6"
                          }
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    <span>상태</span>
                    {sortBy === "status" && (
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
                            sortOrder === "asc"
                              ? "M7 11l5-5 5 5m-5 9V6"
                              : "M7 13l5 5 5-5M12 18V6"
                          }
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    <span>날짜</span>
                    {sortBy === "date" && (
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
                            sortOrder === "asc"
                              ? "M7 11l5-5 5 5m-5 9V6"
                              : "M7 13l5 5 5-5M12 18V6"
                          }
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  메모
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSettlements.length > 0 ? (
                filteredSettlements.map((settlement) => (
                  <tr
                    key={settlement.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{settlement.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {formatCurrency(settlement.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          settlement.isSettled
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <svg
                          className={`w-1.5 h-1.5 mr-1.5 ${
                            settlement.isSettled
                              ? "text-green-400"
                              : "text-yellow-400"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 8 8"
                        >
                          <circle cx={4} cy={4} r={3} />
                        </svg>
                        {settlement.isSettled ? "완료" : "대기"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(settlement.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {settlement.memo || "메모 없음"}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openUpdateModal(settlement)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteSettlement(settlement.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          삭제
                        </button>{" "}
                        <button
                          onClick={() =>
                            handleStatusChange(
                              settlement.id,
                              !settlement.isSettled
                            )
                          }
                          className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                          {settlement.isSettled ? "대기" : "완료"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-300 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-700 mb-1">
                        정산 데이터가 없습니다
                      </h3>
                      <p className="text-gray-500">
                        계약 ID를 입력하고 조회하거나 새 정산을 생성해주세요.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              정산 목록을 불러오는 중...
            </div>
          </div>
        )}{" "}
      </div>{" "}
      {/* 정산 수정 모달 */}
      {showUpdateModal && selectedSettlement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                정산 수정 (ID: #{selectedSettlement.id})
              </h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  총 금액
                </label>
                <input
                  type="number"
                  value={updateData.totalAmount || ""}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      totalAmount: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {updateData.totalAmount > 0 &&
                    formatCurrency(updateData.totalAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메모
                </label>
                <textarea
                  value={updateData.memo}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, memo: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  placeholder="메모를 입력하세요 (선택사항)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  소스
                </label>
                <input
                  type="text"
                  value={updateData.source}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, source: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="수익 소스를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  수익 날짜
                </label>
                <input
                  type="date"
                  value={updateData.incomeDate}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, incomeDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <input
                  type="checkbox"
                  id="isSettled"
                  checked={updateData.isSettled}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      isSettled: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isSettled"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  정산 완료 처리
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdateSettlement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 네비게이션 */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">관련 페이지</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="../dashboard"
            className="flex items-center justify-center bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
              />
            </svg>
            대시보드
          </Link>
          <Link
            href="../analytics"
            className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            수익 분석
          </Link>
          <Link
            href="../contracts"
            className="flex items-center justify-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform"
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
            계약별 조회
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { settlementService } from "@/features/department/finance-legal/revenue/services/settlementService";
import {
  SettlementDto,
  SettlementDetailResponse,
} from "@/features/department/finance-legal/revenue/types/Settlement";

export default function ContractsPage() {
  const [contractId, setContractId] = useState<number>(0);
  const [settlements, setSettlements] = useState<SettlementDto[]>([]);
  const [settlementDetails, setSettlementDetails] = useState<
    SettlementDetailResponse[]
  >([]);
  const [contractRevenue, setContractRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "details" | "revenue">(
    "list"
  );
  // 계약별 데이터 조회
  const loadContractData = async () => {
    if (contractId <= 0) {
      setError("올바른 계약 ID를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [settlementsData, detailsData, revenueData] = await Promise.all([
        settlementService.getSettlementsByContract(contractId),
        settlementService.getSettlementDetailsByContract(contractId),
        settlementService.getRevenueByContract(contractId),
      ]);

      setSettlements(settlementsData);
      setSettlementDetails(detailsData);
      setContractRevenue(revenueData);
    } catch (error) {
      console.error("계약 데이터 조회 실패:", error);
      setError("계약 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
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

  const getRatioTypeLabel = (ratioType: string) => {
    const labels: Record<string, string> = {
      ARTIST: "아티스트",
      AGENCY: "기획사",
      PLATFORM: "플랫폼",
      OTHER: "기타",
    };
    return labels[ratioType] || ratioType;
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📋 계약별 조회
              </h1>
              <p className="text-gray-600">
                특정 계약의 정산 목록, 상세 내역, 수익을 조회하세요
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/revenue/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                📊 대시보드
              </Link>
              <Link
                href="/revenue/analytics"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                📈 분석 보기
              </Link>
            </div>
          </div>
        </div>
        {/* 오류 메시지 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  오류가 발생했습니다
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setError(null)}
                    className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 검색 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">계약 검색</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                계약 ID
              </label>
              <input
                type="number"
                value={contractId || ""}
                onChange={(e) => setContractId(Number(e.target.value))}
                placeholder="계약 ID를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={loadContractData}
                disabled={loading || contractId <= 0}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
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
                    조회중...
                  </>
                ) : (
                  "조회"
                )}
              </button>
            </div>
          </div>
        </div>{" "}
        {/* 계약 수익 요약 */}
        {contractRevenue > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  계약 {contractId} 총 수익
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(contractRevenue)}
                </p>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 px-3 py-2 rounded-md">
                    <p className="text-blue-600 font-medium">정산 건수</p>
                    <p className="text-blue-800 font-bold">
                      {settlements.length}건
                    </p>
                  </div>
                  <div className="bg-green-50 px-3 py-2 rounded-md">
                    <p className="text-green-600 font-medium">완료 건수</p>
                    <p className="text-green-800 font-bold">
                      {settlements.filter((s) => s.isSettled).length}건
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("list")}
                className={`relative px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === "list"
                    ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  정산 목록
                  <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full">
                    {settlements.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`relative px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === "details"
                    ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  정산 상세
                  <span className="ml-1 bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full">
                    {settlementDetails.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("revenue")}
                className={`relative px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === "revenue"
                    ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                    />
                  </svg>
                  수익 정보
                </div>
              </button>{" "}
            </nav>
          </div>

          <div className="p-6">
            {/* 정산 목록 탭 */}
            {activeTab === "list" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    정산 목록
                  </h3>
                </div>

                {settlements.length > 0 ? (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            금액
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            상태
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            날짜
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            메모
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {settlements.map((settlement) => (
                          <tr
                            key={settlement.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{settlement.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                              {formatCurrency(settlement.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  settlement.isSettled
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                <svg
                                  className={`w-2 h-2 mr-1 ${
                                    settlement.isSettled
                                      ? "text-green-400"
                                      : "text-yellow-400"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 8 8"
                                >
                                  <circle cx="4" cy="4" r="3" />
                                </svg>
                                {settlement.isSettled ? "완료" : "대기"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(settlement.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {settlement.memo || (
                                <span className="text-gray-400 italic">
                                  메모 없음
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      정산 데이터 없음
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      해당 계약에 대한 정산 데이터가 없습니다.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 정산 상세 탭 */}
            {activeTab === "details" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    정산 상세 내역
                  </h3>
                </div>
                {settlementDetails.length > 0 ? (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            정산 ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            사용자 ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            금액
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            비율
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            유형
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {settlementDetails.map((detail, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{detail.settlementId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {detail.userId ? (
                                `#${detail.userId}`
                              ) : (
                                <span className="text-gray-700 font-semibold">
                                  Mingle
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                              {formatCurrency(detail.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {detail.percentage.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {getRatioTypeLabel(detail.ratioType)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      상세 데이터 없음
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      해당 계약에 대한 정산 상세 데이터가 없습니다.
                    </p>
                  </div>
                )}{" "}
              </div>
            )}

            {/* 수익 정보 탭 */}
            {activeTab === "revenue" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    수익 정보
                  </h3>
                </div>
                {contractRevenue > 0 ? (
                  <div>
                    {/* 주요 지표 카드 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">
                              총 수익
                            </p>
                            <p className="text-2xl font-bold text-blue-700">
                              {formatCurrency(contractRevenue)}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600 mb-1">
                              정산 건수
                            </p>
                            <p className="text-2xl font-bold text-green-700">
                              {settlements.length}건
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              평균{" "}
                              {settlements.length > 0
                                ? formatCurrency(
                                    contractRevenue / settlements.length
                                  )
                                : "₩0"}{" "}
                              / 건
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600 mb-1">
                              완료된 정산
                            </p>
                            <p className="text-2xl font-bold text-purple-700">
                              {settlements.filter((s) => s.isSettled).length}건
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                              {settlements.length > 0
                                ? (
                                    (settlements.filter((s) => s.isSettled)
                                      .length /
                                      settlements.length) *
                                    100
                                  ).toFixed(1)
                                : 0}
                              % 완료율
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 상세 분석 */}
                    {settlementDetails.length > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z"
                            />
                          </svg>
                          비율별 분배 현황
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {Object.entries(
                            settlementDetails.reduce((acc, detail) => {
                              const type = getRatioTypeLabel(detail.ratioType);
                              acc[type] = (acc[type] || 0) + detail.amount;
                              return acc;
                            }, {} as Record<string, number>)
                          ).map(([type, amount], index) => {
                            const colors = [
                              {
                                bg: "bg-blue-50",
                                text: "text-blue-900",
                                border: "border-blue-200",
                              },
                              {
                                bg: "bg-green-50",
                                text: "text-green-900",
                                border: "border-green-200",
                              },
                              {
                                bg: "bg-purple-50",
                                text: "text-purple-900",
                                border: "border-purple-200",
                              },
                              {
                                bg: "bg-yellow-50",
                                text: "text-yellow-900",
                                border: "border-yellow-200",
                              },
                            ];
                            const color = colors[index % colors.length];
                            const percentage =
                              contractRevenue > 0
                                ? ((amount / contractRevenue) * 100).toFixed(1)
                                : 0;

                            return (
                              <div
                                key={type}
                                className={`${color.bg} ${color.border} border rounded-lg p-4 hover:shadow-sm transition-shadow`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <p
                                    className={`text-sm font-medium ${color.text}`}
                                  >
                                    {type}
                                  </p>
                                  <span
                                    className={`text-xs ${color.text} bg-white px-2 py-1 rounded-full`}
                                  >
                                    {percentage}%
                                  </span>
                                </div>
                                <p
                                  className={`text-lg font-bold ${color.text}`}
                                >
                                  {formatCurrency(amount)}
                                </p>
                                <div
                                  className={`mt-2 bg-white rounded-full h-2`}
                                >
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${color.bg.replace(
                                      "50",
                                      "400"
                                    )}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      수익 정보 없음
                    </h3>{" "}
                    <p className="mt-1 text-sm text-gray-500">
                      계약 ID를 입력하고 조회 버튼을 클릭하세요.
                    </p>
                  </div>
                )}{" "}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          빠른 이동
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/revenue/dashboard"
            className="group bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 hover:from-gray-100 hover:to-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-gray-700">
                  📊 대시보드
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  전체 수익 현황과 월별 통계를 확인하세요
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/revenue/analytics"
            className="group bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 hover:from-blue-100 hover:to-blue-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-blue-900 group-hover:text-blue-700">
                  📈 수익 분석
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  상세 분석과 아티스트별 수익을 확인하세요
                </p>
              </div>
              <svg
                className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            href="/revenue/settlements"
            className="group bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 hover:from-green-100 hover:to-green-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-green-900 group-hover:text-green-700">
                  💰 정산 관리
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  정산 내역을 생성하고 관리하세요
                </p>
              </div>
              <svg
                className="w-5 h-5 text-green-400 group-hover:text-green-600 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

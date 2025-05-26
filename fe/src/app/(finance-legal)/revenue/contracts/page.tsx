"use client";

import { useState, useEffect } from "react";
import { settlementService } from "@/features/finance-legal/services/settlementService";
import {
  SettlementDto,
  SettlementDetailResponse,
} from "@/features/finance-legal/types/Settlement";

export default function ContractsPage() {
  const [contractId, setContractId] = useState<number>(0);
  const [settlements, setSettlements] = useState<SettlementDto[]>([]);
  const [settlementDetails, setSettlementDetails] = useState<
    SettlementDetailResponse[]
  >([]);
  const [contractRevenue, setContractRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "details" | "revenue">(
    "list"
  );

  // 계약별 데이터 조회
  const loadContractData = async () => {
    if (contractId <= 0) {
      alert("올바른 계약 ID를 입력해주세요.");
      return;
    }

    setLoading(true);
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
      alert("계약 데이터를 불러오는데 실패했습니다.");
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">계약별 조회</h1>
        <p className="text-gray-600">
          특정 계약의 정산 목록, 상세 내역, 수익을 조회하세요
        </p>
      </div>

      {/* 검색 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              계약 ID
            </label>
            <input
              type="number"
              value={contractId || ""}
              onChange={(e) => setContractId(Number(e.target.value))}
              placeholder="계약 ID 입력"
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
            />
          </div>
          <button
            onClick={loadContractData}
            disabled={loading}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "로딩중..." : "조회"}
          </button>
        </div>
      </div>

      {/* 계약 수익 요약 */}
      {contractRevenue > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            계약 {contractId} 총 수익
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(contractRevenue)}
          </p>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "list"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              정산 목록 ({settlements.length})
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "details"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              정산 상세 ({settlementDetails.length})
            </button>
            <button
              onClick={() => setActiveTab("revenue")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "revenue"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              수익 정보
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* 정산 목록 탭 */}
          {activeTab === "list" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                정산 목록
              </h3>
              {settlements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          금액
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          상태
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          날짜
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          메모
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {settlements.map((settlement) => (
                        <tr key={settlement.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {settlement.id}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {formatCurrency(settlement.amount)}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                settlement.isSettled
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {settlement.isSettled ? "완료" : "대기"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {formatDate(settlement.date)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {settlement.memo || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  정산 데이터가 없습니다.
                </p>
              )}
            </div>
          )}

          {/* 정산 상세 탭 */}
          {activeTab === "details" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                정산 상세 내역
              </h3>
              {settlementDetails.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          정산 ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          사용자 ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          금액
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          비율
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          유형
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {settlementDetails.map((detail, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {detail.settlementId}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {detail.userId || "-"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {formatCurrency(detail.amount)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {detail.percentage.toFixed(2)}%
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {getRatioTypeLabel(detail.ratioType)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  정산 상세 데이터가 없습니다.
                </p>
              )}
            </div>
          )}

          {/* 수익 정보 탭 */}
          {activeTab === "revenue" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                수익 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">
                    총 수익
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(contractRevenue)}
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-700 mb-2">
                    정산 건수
                  </h4>
                  <p className="text-2xl font-bold text-green-600">
                    {settlements.length}건
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-700 mb-2">
                    완료된 정산
                  </h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {settlements.filter((s) => s.isSettled).length}건
                  </p>
                </div>
              </div>

              {/* 상세 분석 */}
              {settlementDetails.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    비율별 분배 현황
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(
                      settlementDetails.reduce((acc, detail) => {
                        const type = getRatioTypeLabel(detail.ratioType);
                        acc[type] = (acc[type] || 0) + detail.amount;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, amount]) => (
                      <div key={type} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 font-medium">
                          {type}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/revenue/dashboard"
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          대시보드로
        </a>
        <a
          href="/revenue/analytics"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          수익 분석
        </a>
        <a
          href="/revenue/settlements"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          정산 관리
        </a>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { settlementService } from "@/features/finance-legal/services/settlementService";
import { SettlementSummaryDto } from "@/features/finance-legal/types/Settlement";

export default function RevenueDashboardPage() {
  const [summary, setSummary] = useState<SettlementSummaryDto | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [agencyNetRevenue, setAgencyNetRevenue] = useState<number>(0);
  const [monthlyData, setMonthlyData] = useState<Record<string, number>>({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // 데이터 로드
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryData, totalData, netData, monthlyDataResult] =
        await Promise.all([
          settlementService.getSettlementSummary(),
          settlementService.getTotalRevenue(
            startDate || undefined,
            endDate || undefined
          ),
          settlementService.getAgencyNetRevenue(
            startDate || undefined,
            endDate || undefined
          ),
          settlementService.getMonthlyRevenueSummary(),
        ]);

      setSummary(summaryData);
      setTotalRevenue(totalData);
      setAgencyNetRevenue(netData);
      setMonthlyData(monthlyDataResult);
    } catch (error) {
      console.error("대시보드 데이터 로드 실패:", error);
      alert("대시보드 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // 기간별 조회
  const handleDateFilter = () => {
    loadDashboardData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">수익 대시보드</h1>
        <p className="text-gray-600">전체 수익 현황과 통계를 확인하세요</p>
      </div>

      {/* 기간 필터 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              시작일
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              종료일
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <button
            onClick={handleDateFilter}
            disabled={loading}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "로딩중..." : "조회"}
          </button>
        </div>
      </div>

      {/* 메인 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">총 수익</h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(totalRevenue)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            회사 순수익
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(agencyNetRevenue)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            정산 건수
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {summary?.count || 0}건
          </p>
          <p className="text-sm text-gray-500 mt-1">
            총 {formatCurrency(summary?.totalAmount || 0)}
          </p>
        </div>
      </div>

      {/* 월별 수익 현황 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          월별 수익 현황
        </h3>
        {Object.keys(monthlyData).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(monthlyData).map(([month, revenue]) => (
              <div key={month} className="text-center p-4 border rounded-lg">
                <p className="text-sm text-gray-600 font-medium">{month}</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(revenue)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">월별 데이터가 없습니다.</p>
        )}
      </div>

      {/* 네비게이션 */}
      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/revenue/analytics"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          수익 분석 보기
        </a>
        <a
          href="/revenue/settlements"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          정산 관리
        </a>
        <a
          href="/revenue/contracts"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          계약별 조회
        </a>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { settlementService } from "@/features/department/finance-legal/revenue/services/settlementService";
import {
  SettlementDto,
  SettlementSummaryDto,
  ArtistRevenueDto,
} from "@/features/department/finance-legal/revenue/types/Settlement";

export default function RevenueManagementPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  // Dashboard state
  const [settlementSummary, setSettlementSummary] =
    useState<SettlementSummaryDto | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [agencyNetRevenue, setAgencyNetRevenue] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<Record<string, number>>(
    {}
  );

  // Analytics state
  const [topArtists, setTopArtists] = useState<ArtistRevenueDto[]>([]);
  const [revenueByRatio, setRevenueByRatio] = useState<Record<string, number>>(
    {}
  );

  // Settlements state
  const [allSettlements, setAllSettlements] = useState<SettlementDto[]>([]);

  // Filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedContractId, setSelectedContractId] = useState("");

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [summary, total, netRevenue, monthly] = await Promise.all([
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

      setSettlementSummary(summary);
      setTotalRevenue(total);
      setAgencyNetRevenue(netRevenue);
      setMonthlyRevenue(monthly);
    } catch (error) {
      console.error("Dashboard 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load analytics data
  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [artists, ratioRevenue] = await Promise.all([
        settlementService.getTopArtists(10),
        settlementService.getRevenueByRatioType(),
      ]);

      setTopArtists(artists);
      setRevenueByRatio(ratioRevenue);
    } catch (error) {
      console.error("Analytics 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load settlements data
  const loadSettlementsData = async () => {
    setLoading(true);
    try {
      const settlements = await settlementService.getAllSettlements();
      setAllSettlements(settlements);
    } catch (error) {
      console.error("정산 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case "dashboard":
        loadDashboardData();
        break;
      case "analytics":
        loadAnalyticsData();
        break;
      case "settlements":
        loadSettlementsData();
        break;
      default:
        break;
    }
  }, [activeTab, startDate, endDate]);

  const handleRefresh = () => {
    switch (activeTab) {
      case "dashboard":
        loadDashboardData();
        break;
      case "analytics":
        loadAnalyticsData();
        break;
      case "settlements":
        loadSettlementsData();
        break;
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

  return (
    <div
      className="container mx-auto p-6 space-y-6"
      style={{ maxWidth: "1200px" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-600">
            전체 수익 현황과 정산 내역을 조회하고 분석할 수 있습니다.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          새로고침
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "analytics", label: "Analytics" },
            { id: "settlements", label: "Settlements" },
            { id: "contracts", label: "Contracts" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">필터 설정</h3>
        <div className="flex gap-4 items-end">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              시작 날짜
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStartDate(e.target.value)
              }
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              종료 날짜
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEndDate(e.target.value)
              }
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            초기화
          </button>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    총 정산 건수
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {settlementSummary?.count.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-gray-500">건</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    총 정산 금액
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(settlementSummary?.totalAmount || 0)}
                  </p>
                  <p className="text-xs text-gray-500">누적 정산액</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 수익</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {startDate && endDate
                      ? `${startDate} ~ ${endDate}`
                      : "전체 기간"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    에이전시 순수익
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(agencyNetRevenue)}
                  </p>
                  <p className="text-xs text-gray-500">순수익</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">월별 수익 현황</h3>
            <div className="space-y-4">
              {Object.entries(monthlyRevenue).map(([month, revenue]) => (
                <div
                  key={month}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="font-medium">{month}</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              상위 아티스트 (수익 기준)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">순위</th>
                    <th className="text-left py-2">아티스트명</th>
                    <th className="text-right py-2">총 수익</th>
                  </tr>
                </thead>
                <tbody>
                  {topArtists.map((artist, index) => (
                    <tr
                      key={artist.artistId}
                      className="border-b border-gray-100"
                    >
                      <td className="py-2 font-bold">#{index + 1}</td>
                      <td className="py-2">{artist.artistName}</td>
                      <td className="py-2 text-right font-mono">
                        {formatCurrency(artist.totalRevenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              비율 타입별 수익 분배
            </h3>
            <div className="space-y-4">
              {Object.entries(revenueByRatio).map(([ratioType, revenue]) => (
                <div
                  key={ratioType}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded">
                    {ratioType}
                  </span>
                  <span className="text-lg font-mono">
                    {formatCurrency(revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settlements Tab */}
      {activeTab === "settlements" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">모든 정산 내역</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">정산 ID</th>
                  <th className="text-left py-2">총 금액</th>
                  <th className="text-left py-2">수익 날짜</th>
                  <th className="text-left py-2">상태</th>
                  <th className="text-left py-2">메모</th>
                </tr>
              </thead>
              <tbody>
                {allSettlements.map((settlement) => (
                  <tr key={settlement.id} className="border-b border-gray-100">
                    <td className="py-2 font-mono">#{settlement.id}</td>
                    <td className="py-2 font-mono">
                      {formatCurrency(settlement.amount)}
                    </td>
                    <td className="py-2">{formatDate(settlement.date)}</td>
                    <td className="py-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          settlement.isSettled
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {settlement.isSettled ? "정산 완료" : "정산 대기"}
                      </span>
                    </td>
                    <td className="py-2 max-w-xs truncate">
                      {settlement.memo || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contracts Tab */}
      {activeTab === "contracts" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">계약별 수익 조회</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contractId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  계약 ID
                </label>
                <input
                  id="contractId"
                  type="number"
                  placeholder="계약 ID를 입력하세요"
                  value={selectedContractId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedContractId(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  사용자 ID
                </label>
                <input
                  id="userId"
                  type="number"
                  placeholder="사용자 ID를 입력하세요"
                  value={selectedUserId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedUserId(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
              <p>
                * 계약별 정산 내역과 수익 조회 기능은 특정 계약 ID나 사용자 ID를
                입력한 후 해당 데이터를 조회할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

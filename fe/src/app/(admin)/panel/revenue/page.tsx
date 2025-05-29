"use client";

import React, { useState, useEffect } from "react";
import { settlementService } from "@/features/department/finance-legal/revenue/services/settlementService";
import {
  SettlementDto,
  SettlementSummaryDto,
  ArtistRevenueDto,
} from "@/features/department/finance-legal/revenue/types/Settlement";

export default function AdminRevenueManagementPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

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
  const [statusFilter, setStatusFilter] = useState("all");

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
      case "overview":
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
      case "overview":
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
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  const filteredSettlements = allSettlements.filter((settlement) => {
    const matchesSearch =
      settlement.memo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      settlement.id.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "settled" && settlement.isSettled) ||
      (statusFilter === "pending" && !settlement.isSettled);
    return matchesSearch && matchesStatus;
  });

  // Chart data preparation
  const monthlyChartData = Object.entries(monthlyRevenue).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );

  const ratioChartData = Object.entries(revenueByRatio).map(
    ([type, value]) => ({
      name: type,
      value,
    })
  );

  const COLORS = [
    "#8B5CF6",
    "#06B6D4",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6366F1",
    "#3B82F6",
    "#22C55E",
    "#FBBF24",
    "#F87171",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Revenue Management
              </h1>
              <p className="text-sm text-slate-600">관리자 수익 관리 시스템</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
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
                ) : null}
                새로고침
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "analytics", label: "Analytics", icon: "📈" },
              { id: "settlements", label: "Settlements", icon: "💰" },
              { id: "management", label: "Management", icon: "⚙️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-violet-500 text-violet-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                기간 선택
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 rounded-lg border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 rounded-lg border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                빠른 선택
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-lg border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
              >
                <option value="week">최근 1주</option>
                <option value="month">최근 1개월</option>
                <option value="quarter">최근 3개월</option>
                <option value="year">최근 1년</option>
              </select>
            </div>
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSelectedPeriod("month");
              }}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {" "}
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-violet-300 to-violet-400 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-100 text-sm font-medium">
                      총 정산 건수
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {settlementSummary?.count.toLocaleString() || 0}
                    </p>
                    <p className="text-violet-100 text-xs mt-1">건</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-300 to-purple-400 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      총 정산 금액
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {formatCurrency(settlementSummary?.totalAmount || 0)}
                    </p>
                    <p className="text-purple-100 text-xs mt-1">누적 정산액</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-300 to-violet-400 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-violet-50 text-sm font-medium">
                      총 수익
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {formatCurrency(totalRevenue)}
                    </p>
                    <p className="text-violet-50 text-xs mt-1">
                      {startDate && endDate
                        ? `${startDate} ~ ${endDate}`
                        : "전체 기간"}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-300 to-purple-400 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-50 text-sm font-medium">
                      에이전시 순수익
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {formatCurrency(agencyNetRevenue)}
                    </p>
                    <p className="text-purple-50 text-xs mt-1">순수익</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  월별 수익 트렌드
                </h3>{" "}
                <div className="flex items-center justify-center h-[300px] bg-slate-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📈</div>
                    <p className="text-slate-600">월별 수익 차트</p>
                    <p className="text-sm text-slate-500 mt-2">
                      총 {Object.keys(monthlyRevenue).length}개월 데이터
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  비율 타입별 수익 분배
                </h3>{" "}
                <div className="flex items-center justify-center h-[300px] bg-slate-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🥧</div>
                    <p className="text-slate-600">비율 타입별 수익 차트</p>
                    <p className="text-sm text-slate-500 mt-2">
                      총 {Object.keys(revenueByRatio).length}개 타입
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    상위 아티스트
                  </h3>
                  <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    TOP 10
                  </span>
                </div>
                <div className="space-y-4">
                  {topArtists.map((artist, index) => (
                    <div
                      key={artist.artistId}
                      className="flex items-center space-x-4"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index < 3
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                            : "bg-slate-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {artist.artistName}
                        </p>
                        <p className="text-sm text-slate-500">
                          ID: {artist.artistId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          {formatCurrency(artist.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  수익 분석
                </h3>{" "}
                <div className="flex items-center justify-center h-[400px] bg-slate-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-slate-600">수익 분석 차트</p>
                    <p className="text-sm text-slate-500 mt-2">
                      총 {Object.keys(revenueByRatio).length}개 타입 데이터
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settlements Tab */}
        {activeTab === "settlements" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-64">
                  <input
                    type="text"
                    placeholder="정산 ID 또는 메모 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                >
                  <option value="all">전체 상태</option>
                  <option value="settled">정산 완료</option>
                  <option value="pending">정산 대기</option>
                </select>
              </div>
            </div>

            {/* Settlements Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  정산 내역
                </h3>
                <p className="text-sm text-slate-600">
                  총 {filteredSettlements.length}건
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        정산 ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        금액
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        수익 날짜
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        메모
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredSettlements.map((settlement) => (
                      <tr key={settlement.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">
                          #{settlement.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                          {formatCurrency(settlement.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {formatDate(settlement.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              settlement.isSettled
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {settlement.isSettled ? "정산 완료" : "정산 대기"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                          {settlement.memo || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-violet-600 hover:text-violet-800 mr-4">
                            상세보기
                          </button>
                          <button className="text-emerald-600 hover:text-emerald-800">
                            수정
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Management Tab */}
        {activeTab === "management" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  계약별 수익 조회
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      계약 ID
                    </label>
                    <input
                      type="number"
                      placeholder="계약 ID를 입력하세요"
                      value={selectedContractId}
                      onChange={(e) => setSelectedContractId(e.target.value)}
                      className="w-full rounded-lg border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      사용자 ID
                    </label>
                    <input
                      type="number"
                      placeholder="사용자 ID를 입력하세요"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full rounded-lg border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
                    />
                  </div>
                  <button className="w-full bg-violet-600 text-white py-2 px-4 rounded-lg hover:bg-violet-700 transition-colors">
                    조회하기
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  시스템 설정
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <span className="text-sm text-slate-700">
                      자동 정산 처리
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <span className="text-sm text-slate-700">이메일 알림</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-slate-700">데이터 백업</span>
                    <button className="text-sm text-violet-600 hover:text-violet-800 font-medium">
                      지금 백업
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-1">
                    관리자 기능 안내
                  </h4>
                  <p className="text-sm text-slate-600">
                    이 페이지에서는 전체 수익 현황 모니터링, 정산 승인/반려,
                    계약별 수익 분석 등의 관리자 전용 기능을 사용할 수 있습니다.
                    문제가 발생한 경우 시스템 관리자에게 문의하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

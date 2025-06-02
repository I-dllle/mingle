"use client";

import React, { useState, useEffect } from "react";
import { settlementService } from "@/features/department/finance-legal/revenue/services/settlementService";
import {
  SettlementDto,
  SettlementSummaryDto,
  ArtistRevenueDto,
} from "@/features/department/finance-legal/revenue/types/Settlement";

// Components
import Header from "./components/Header";
import NavigationTabs from "./components/NavigationTabs";
import FilterControls from "./components/FilterControls";
import OverviewTab from "./components/OverviewTab";
import AnalyticsTab from "./components/AnalyticsTab";
import SettlementsTab from "./components/SettlementsTab";
import ManagementTab from "./components/ManagementTab";

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
        loadAnalyticsData(); // Also load analytics data for charts
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
        loadAnalyticsData();
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
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header loading={loading} onRefresh={handleRefresh} />

      {/* Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} onActiveTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Controls */}
        <FilterControls
          startDate={startDate}
          endDate={endDate}
          selectedPeriod={selectedPeriod}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSelectedPeriodChange={setSelectedPeriod}
        />
        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab
            loading={loading}
            settlementSummary={settlementSummary}
            totalRevenue={totalRevenue}
            agencyNetRevenue={agencyNetRevenue}
            monthlyRevenue={monthlyRevenue}
            revenueByRatio={revenueByRatio}
            formatCurrency={formatCurrency}
          />
        )}{" "}
        {activeTab === "analytics" && (
          <AnalyticsTab
            loading={loading}
            topArtists={topArtists}
            revenueByRatio={revenueByRatio}
            formatCurrency={formatCurrency}
          />
        )}
        {activeTab === "settlements" && (
          <SettlementsTab
            loading={loading}
            allSettlements={filteredSettlements}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchTermChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        )}
        {activeTab === "management" && (
          <ManagementTab
            selectedUserId={selectedUserId}
            selectedContractId={selectedContractId}
            onSelectedUserIdChange={setSelectedUserId}
            onSelectedContractIdChange={setSelectedContractId}
          />
        )}
      </div>
    </div>
  );
}

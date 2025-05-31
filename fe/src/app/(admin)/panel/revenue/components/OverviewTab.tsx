"use client";

import React from "react";
import { SettlementSummaryDto } from "@/features/department/finance-legal/revenue/types/Settlement";
import MonthlyTrendChart from "./charts/MonthlyTrendChart";
import RevenueDistributionChart from "./charts/RevenueDistributionChart";

interface OverviewTabProps {
  loading: boolean;
  settlementSummary: SettlementSummaryDto | null;
  totalRevenue: number;
  agencyNetRevenue: number;
  monthlyRevenue: Record<string, number>;
  revenueByRatio: Record<string, number>;
  formatCurrency: (amount: number) => string;
}

export default function OverviewTab({
  loading,
  settlementSummary,
  totalRevenue,
  agencyNetRevenue,
  monthlyRevenue,
  revenueByRatio,
  formatCurrency,
}: OverviewTabProps) {
  return (
    <div className="space-y-8">
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
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
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
              <p className="text-purple-100 text-xs mt-1">누적</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-300 to-violet-400 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">총 수익</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-green-100 text-xs mt-1">전체</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
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
              <p className="text-blue-100 text-sm font-medium">
                에이전시 순수익
              </p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(agencyNetRevenue)}
              </p>
              <p className="text-blue-100 text-xs mt-1">순수익</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MonthlyTrendChart monthlyRevenue={monthlyRevenue} />
        <RevenueDistributionChart revenueByRatio={revenueByRatio} />
      </div>
    </div>
  );
}

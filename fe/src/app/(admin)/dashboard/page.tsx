"use client";

import React, { useState, useEffect } from "react";
import { settlementService } from "@/features/finance-legal/services/settlementService";
import { contractService } from "@/features/finance-legal/services/contractService";
import { ContractCategory } from "@/features/finance-legal/types/Contract";
import {
  SettlementSummaryDto,
  ArtistRevenueDto,
} from "@/features/finance-legal/types/Settlement";

interface DashboardData {
  settlementSummary: SettlementSummaryDto | null;
  totalRevenue: number;
  agencyNetRevenue: number;
  monthlyRevenue: Record<string, number>;
  topArtists: ArtistRevenueDto[];
  totalContracts: number;
  expiringContracts: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    settlementSummary: null,
    totalRevenue: 0,
    agencyNetRevenue: 0,
    monthlyRevenue: {},
    topArtists: [],
    totalContracts: 0,
    expiringContracts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [
        settlementSummary,
        totalRevenue,
        agencyNetRevenue,
        monthlyRevenue,
        topArtists,
        externalContracts,
        internalContracts,
        expiringExternal,
        expiringInternal,
      ] = await Promise.all([
        settlementService.getSettlementSummary(),
        settlementService.getTotalRevenue(),
        settlementService.getAgencyNetRevenue(),
        settlementService.getMonthlyRevenueSummary(),
        settlementService.getTopArtists(5),
        contractService.getAllContracts(ContractCategory.EXTERNAL, 0, 1000),
        contractService.getAllContracts(ContractCategory.INTERNAL, 0, 1000),
        contractService.getExpiringContracts(ContractCategory.EXTERNAL),
        contractService.getExpiringContracts(ContractCategory.INTERNAL),
      ]);

      setData({
        settlementSummary,
        totalRevenue,
        agencyNetRevenue,
        monthlyRevenue,
        topArtists,
        totalContracts:
          externalContracts.totalElements + internalContracts.totalElements,
        expiringContracts: expiringExternal.length + expiringInternal.length,
      });
    } catch (err) {
      setError("대시보드 데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("Dashboard load error:", err);
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

  const getMonthName = (monthKey: string) => {
    const months = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];
    const monthNum = parseInt(monthKey);
    return months[monthNum - 1] || monthKey;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">대시보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {" "}
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-600 mt-2">
            전체 시스템 현황을 한눈에 확인하세요
          </p>
        </div>
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {" "}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">총 수익</p>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="text-lg lg:text-xl font-bold text-gray-900 break-words">
                {formatCurrency(data.totalRevenue)}
              </p>
            </div>
          </div>{" "}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">
                  에이전시 순수익
                </p>
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="text-lg lg:text-xl font-bold text-gray-900 break-words">
                {formatCurrency(data.agencyNetRevenue)}
              </p>
            </div>
          </div>{" "}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">전체 계약</p>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="text-lg lg:text-xl font-bold text-gray-900 break-words">
                {data.totalContracts.toLocaleString()}건
              </p>
            </div>
          </div>{" "}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">
                  만료 예정 계약
                </p>
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 19.5c-.77.833.192 2.5 1.732 2.5z"
                    ></path>
                  </svg>
                </div>
              </div>
              <p className="text-lg lg:text-xl font-bold text-gray-900 break-words">
                {data.expiringContracts}건
              </p>
            </div>
          </div>
        </div>
        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              월별 수익 현황
            </h3>
            <div className="space-y-4">
              {Object.entries(data.monthlyRevenue).map(([month, revenue]) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    {getMonthName(month)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (revenue /
                              Math.max(...Object.values(data.monthlyRevenue))) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-24 text-right">
                      {formatCurrency(revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Artists */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              상위 아티스트 (수익 기준)
            </h3>
            <div className="space-y-4">
              {data.topArtists.map((artist, index) => (
                <div
                  key={artist.artistId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {artist.artistName}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(artist.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Settlement Summary */}
        {data.settlementSummary && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              정산 현황 요약
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">총 정산 금액</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(data.settlementSummary.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">정산 건수</p>
                <p className="text-xl font-bold text-gray-900">
                  {data.settlementSummary.count.toLocaleString()}건
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            빠른 작업
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/panel/revenue"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">수익 관리</h4>
                <p className="text-sm text-gray-600">정산 및 수익 상세 관리</p>
              </div>
            </a>

            <a
              href="/contracts"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">계약 관리</h4>
                <p className="text-sm text-gray-600">계약서 생성 및 관리</p>
              </div>
            </a>

            <a
              href="/analytics"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">분석 리포트</h4>
                <p className="text-sm text-gray-600">상세 분석 및 통계</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { ArtistRevenueDto } from "@/features/department/finance-legal/revenue/types/Settlement";
import TopArtistsChart from "./charts/TopArtistsChart";
import RevenueDistributionChart from "./charts/RevenueDistributionChart";

interface AnalyticsTabProps {
  loading: boolean;
  topArtists: ArtistRevenueDto[];
  revenueByRatio: Record<string, number>;
  formatCurrency: (amount: number) => string;
}

export default function AnalyticsTab({
  loading,
  topArtists,
  revenueByRatio,
  formatCurrency,
}: AnalyticsTabProps) {
  // 분석 데이터 계산
  const totalRevenue = topArtists.reduce(
    (sum, artist) => sum + artist.totalRevenue,
    0
  );
  const averageRevenue =
    topArtists.length > 0 ? totalRevenue / topArtists.length : 0;
  const topPerformer = topArtists[0];
  const revenueGrowth = 12.3; // 실제로는 API에서 가져와야 함
  const activeArtists = topArtists.length;

  // 수익 분포 분석
  const revenueRanges = {
    high: topArtists.filter((artist) => artist.totalRevenue >= 10000000).length,
    medium: topArtists.filter(
      (artist) =>
        artist.totalRevenue >= 5000000 && artist.totalRevenue < 10000000
    ).length,
    low: topArtists.filter((artist) => artist.totalRevenue < 5000000).length,
  };

  const kpiCards = [
    {
      title: "총 수익",
      value: formatCurrency(totalRevenue),
      change: "+12.3%",
      changeType: "positive" as const,
      icon: "💰",
      description: "전월 대비",
    },
    {
      title: "평균 수익",
      value: formatCurrency(Math.round(averageRevenue)),
      change: "+8.7%",
      changeType: "positive" as const,
      icon: "📊",
      description: "아티스트당",
    },
    {
      title: "활성 아티스트",
      value: `${activeArtists}명`,
      change: "+5",
      changeType: "positive" as const,
      icon: "👥",
      description: "이번 달",
    },
    {
      title: "수익 성장률",
      value: `${revenueGrowth}%`,
      change: "+2.1%",
      changeType: "positive" as const,
      icon: "📈",
      description: "월간 성장",
    },
  ];

  return (
    <div className="space-y-8">
      {" "}
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div
            key={index}
            className="relative bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200/50 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-full -translate-y-6 translate-x-6"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                      {kpi.icon}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {kpi.title}
                    </p>
                    <p className="text-xs text-slate-500">{kpi.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">
                    {kpi.value}
                  </p>
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                      kpi.changeType === "positive"
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    <span className="mr-1 text-sm">
                      {kpi.changeType === "positive" ? "📈" : "📉"}
                    </span>
                    {kpi.change}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>{" "}
      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {" "}
        {/* Revenue Trend Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                수익 트렌드 분석
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                월별 수익 변화 및 성장률 추이
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                6개월
              </button>
              <button className="px-4 py-2 text-sm font-medium text-violet-600 bg-violet-100 rounded-lg hover:bg-violet-200 transition-colors">
                1년
              </button>
            </div>
          </div>
          <TopArtistsChart
            topArtists={topArtists}
            formatCurrency={formatCurrency}
          />
        </div>
        {/* Revenue Distribution & Analysis */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                수익 분배 현황
              </h3>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <RevenueDistributionChart revenueByRatio={revenueByRatio} />
          </div>

          {/* 수익 분포 분석 - Enhanced */}
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-2 h-2 bg-violet-500 rounded-full mr-3"></span>
              수익 분포 분석
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "고수익 (1,000만원 이상)",
                  count: revenueRanges.high,
                  color: "emerald",
                  percentage:
                    totalRevenue > 0
                      ? ((revenueRanges.high / activeArtists) * 100).toFixed(1)
                      : "0",
                  bgFrom: "from-emerald-500",
                  bgTo: "to-teal-600",
                },
                {
                  label: "중수익 (500-1,000만원)",
                  count: revenueRanges.medium,
                  color: "amber",
                  percentage:
                    totalRevenue > 0
                      ? ((revenueRanges.medium / activeArtists) * 100).toFixed(
                          1
                        )
                      : "0",
                  bgFrom: "from-amber-500",
                  bgTo: "to-orange-600",
                },
                {
                  label: "기타 (500만원 미만)",
                  count: revenueRanges.low,
                  color: "slate",
                  percentage:
                    totalRevenue > 0
                      ? ((revenueRanges.low / activeArtists) * 100).toFixed(1)
                      : "0",
                  bgFrom: "from-slate-400",
                  bgTo: "to-slate-600",
                },
              ].map((range, index) => (
                <div key={index} className="relative overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-4 h-4 bg-gradient-to-r ${range.bgFrom} ${range.bgTo} rounded-full shadow-sm`}
                      ></div>
                      <div>
                        <span className="text-sm font-semibold text-slate-700">
                          {range.label}
                        </span>
                        <div className="text-xs text-slate-500">
                          {range.percentage}% 비율
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">
                        {range.count}
                      </span>
                      <span className="text-sm text-slate-500 ml-1">명</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 인사이트 */}
            <div className="mt-6 p-4 bg-violet-50 rounded-xl border border-violet-200">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                  💡
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-violet-900">
                    분석 인사이트
                  </h4>
                  <p className="text-xs text-violet-700 mt-1">
                    고수익 아티스트가 전체의{" "}
                    {totalRevenue > 0
                      ? ((revenueRanges.high / activeArtists) * 100).toFixed(1)
                      : "0"}
                    %를 차지하고 있습니다. 중간 수익층 확대를 통한 안정적 성장
                    전략을 고려해보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* 상세 분석 테이블 - Enhanced */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center">
                <span className="w-2 h-2 bg-violet-500 rounded-full mr-3"></span>
                아티스트 수익 상세 분석
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                실시간 업데이트 • 총 {activeArtists}명
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-slate-600">
                  실시간
                </span>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                📊 내보내기
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg hover:from-violet-600 hover:to-purple-700 transition-colors shadow-sm">
                📈 상세보기
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <span>순위</span>
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                  아티스트 정보
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  총 수익
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                  시장 점유율
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                  성과 등급
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                  트렌드
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {topArtists.slice(0, 10).map((artist, index) => {
                const marketShare =
                  totalRevenue > 0
                    ? (artist.totalRevenue / totalRevenue) * 100
                    : 0;
                const grade =
                  artist.totalRevenue >= 10000000
                    ? "S"
                    : artist.totalRevenue >= 5000000
                    ? "A"
                    : artist.totalRevenue >= 1000000
                    ? "B"
                    : "C";
                const gradeConfig = {
                  S: {
                    bg: "bg-gradient-to-r from-purple-500 to-violet-600",
                    text: "text-white",
                    label: "최우수",
                  },
                  A: {
                    bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
                    text: "text-white",
                    label: "우수",
                  },
                  B: {
                    bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
                    text: "text-white",
                    label: "양호",
                  },
                  C: {
                    bg: "bg-gradient-to-r from-slate-400 to-slate-500",
                    text: "text-white",
                    label: "보통",
                  },
                };

                return (
                  <tr
                    key={artist.artistId}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`relative w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${
                            index < 3
                              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                              : "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-600"
                          }`}
                        >
                          {index + 1}
                          {index < 3 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-sm">
                            {artist.artistName.charAt(0)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                            {artist.artistName}
                          </div>
                          <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md mt-1">
                            ID: {artist.artistId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="text-lg font-bold text-slate-900">
                        {formatCurrency(artist.totalRevenue)}
                      </div>
                      <div className="text-xs text-slate-500">월간 수익</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-bold text-slate-900">
                          {marketShare.toFixed(1)}%
                        </div>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-gradient-to-r from-violet-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, marketShare * 2)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span
                          className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-xl shadow-sm ${gradeConfig[grade].bg} ${gradeConfig[grade].text}`}
                        >
                          {grade}
                        </span>
                        <span className="text-xs text-slate-500">
                          {gradeConfig[grade].label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center">
                        <div className="text-emerald-500 text-sm">📈</div>
                        <span className="text-xs text-emerald-600 font-medium ml-1">
                          +{(Math.random() * 20 + 5).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 text-slate-600">
              <div>
                <span className="font-medium">총 아티스트:</span>
                <span className="ml-2 font-bold text-slate-900">
                  {activeArtists}명
                </span>
              </div>
              <div>
                <span className="font-medium">평균 수익:</span>
                <span className="ml-2 font-bold text-slate-900">
                  {formatCurrency(Math.round(averageRevenue))}
                </span>
              </div>
              <div>
                <span className="font-medium">총 수익:</span>{" "}
                <span className="ml-2 font-bold text-violet-600">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              마지막 업데이트: {new Date().toLocaleTimeString("ko-KR")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

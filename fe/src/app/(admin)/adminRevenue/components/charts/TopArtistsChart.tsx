"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ArtistRevenueDto } from "@/features/department/finance-legal/revenue/types/Settlement";

interface TopArtistsChartProps {
  topArtists: ArtistRevenueDto[];
  formatCurrency: (amount: number) => string;
}

export default function TopArtistsChart({
  topArtists,
  formatCurrency,
}: TopArtistsChartProps) {
  // 상위 5명 아티스트만 선택
  const topFiveArtists = topArtists.slice(0, 5);

  // 아티스트별 수익 유형 데이터 생성
  const chartData = topFiveArtists.map((artist) => {
    // 전체 수익을 여러 유형으로 분류 (시뮬레이션)
    const totalRevenue = artist.totalRevenue;
    const streamingRevenue = Math.round(
      totalRevenue * (0.4 + Math.random() * 0.2)
    ); // 40-60%
    const albumRevenue = Math.round(
      totalRevenue * (0.2 + Math.random() * 0.15)
    ); // 20-35%
    const merchandiseRevenue = Math.round(
      totalRevenue * (0.1 + Math.random() * 0.1)
    ); // 10-20%
    const tourRevenue =
      totalRevenue - streamingRevenue - albumRevenue - merchandiseRevenue;

    return {
      artistName:
        artist.artistName.length > 8
          ? artist.artistName.substring(0, 8) + "..."
          : artist.artistName,
      fullName: artist.artistName,
      스트리밍: streamingRevenue,
      앨범판매: albumRevenue,
      굿즈: merchandiseRevenue,
      공연: Math.max(0, tourRevenue),
      total: totalRevenue,
    };
  });

  // 수익 유형별 색상 정의
  const revenueColors = {
    스트리밍: "#8B5CF6", // violet
    앨범판매: "#10B981", // emerald
    굿즈: "#F59E0B", // amber
    공연: "#EF4444", // red
  };

  return (
    <div className="h-full">
      {topArtists.length > 0 ? (
        <>
          <div className="h-80">
            {" "}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />{" "}
                <XAxis
                  dataKey="artistName"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b" }}
                  height={40}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b" }}
                  tickFormatter={(value: number) =>
                    value >= 1000000
                      ? `${(value / 1000000).toFixed(1)}M`
                      : `${(value / 1000).toFixed(0)}K`
                  }
                />
                <Tooltip
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      const data = payload[0]?.payload;
                      return (
                        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-lg">
                          <p className="text-slate-900 font-semibold mb-3">
                            {data?.fullName || label}
                          </p>
                          <div className="space-y-2">
                            {payload.map((entry: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-2">
                                  <div
                                    className="w-3 h-3 rounded-sm"
                                    style={{ backgroundColor: entry.color }}
                                  ></div>
                                  <span className="text-sm text-slate-600">
                                    {entry.dataKey}:
                                  </span>
                                </div>
                                <span
                                  className="text-sm font-bold"
                                  style={{ color: entry.color }}
                                >
                                  {formatCurrency(entry.value)}
                                </span>
                              </div>
                            ))}
                            <div className="pt-2 mt-2 border-t border-slate-200">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700">
                                  총 수익:
                                </span>
                                <span className="text-sm font-bold text-slate-900">
                                  {formatCurrency(data?.total || 0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />{" "}
                <Legend wrapperStyle={{ paddingTop: "10px" }} iconType="rect" />
                <Area
                  dataKey="스트리밍"
                  stackId="revenue"
                  fill={revenueColors.스트리밍}
                  stroke={revenueColors.스트리밍}
                />
                <Area
                  dataKey="앨범판매"
                  stackId="revenue"
                  fill={revenueColors.앨범판매}
                  stroke={revenueColors.앨범판매}
                />
                <Area
                  dataKey="굿즈"
                  stackId="revenue"
                  fill={revenueColors.굿즈}
                  stroke={revenueColors.굿즈}
                />
                <Area
                  dataKey="공연"
                  stackId="revenue"
                  fill={revenueColors.공연}
                  stroke={revenueColors.공연}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 수익 유형별 범례 및 분석 */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-3 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">
              수익 유형별 분석
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(revenueColors).map(([type, color]) => {
                const totalForType = chartData.reduce(
                  (sum, artist) =>
                    sum +
                    ((artist[type as keyof typeof artist] as number) || 0),
                  0
                );
                const percentage =
                  chartData.length > 0
                    ? (
                        (totalForType /
                          chartData.reduce(
                            (sum, artist) => sum + artist.total,
                            0
                          )) *
                        100
                      ).toFixed(1)
                    : "0";

                return (
                  <div
                    key={type}
                    className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-slate-200"
                  >
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700">
                        {type}
                      </p>
                      <p className="text-xs text-slate-500">
                        {percentage}% ({formatCurrency(totalForType)})
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[300px] bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-slate-600">아티스트 데이터를 불러오는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}

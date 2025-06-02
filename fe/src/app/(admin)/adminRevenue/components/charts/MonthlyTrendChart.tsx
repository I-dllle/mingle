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
} from "recharts";

interface MonthlyTrendChartProps {
  monthlyRevenue: Record<string, number>;
}

export default function MonthlyTrendChart({
  monthlyRevenue,
}: MonthlyTrendChartProps) {
  const monthlyChartData = Object.entries(monthlyRevenue).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        월별 수익 트렌드
      </h3>
      <div className="h-[300px]">
        {Object.keys(monthlyRevenue).length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value >= 1000000
                    ? `${(value / 1000000).toFixed(1)}M`
                    : `${(value / 1000).toFixed(0)}K`
                }
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                        <p className="text-slate-900 font-medium">{`${label}`}</p>
                        <p className="text-violet-600">
                          {`수익: ₩${payload[0].value?.toLocaleString()}`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <p className="text-slate-600">데이터를 불러오는 중...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

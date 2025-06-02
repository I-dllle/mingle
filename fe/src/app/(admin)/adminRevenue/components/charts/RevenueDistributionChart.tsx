"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

interface RevenueDistributionChartProps {
  revenueByRatio: Record<string, number>;
}

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

export default function RevenueDistributionChart({
  revenueByRatio,
}: RevenueDistributionChartProps) {
  const ratioChartData = Object.entries(revenueByRatio).map(
    ([type, value]) => ({
      name: type,
      value,
    })
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        비율 타입별 수익 분배
      </h3>
      <div className="h-[300px]">
        {Object.keys(revenueByRatio).length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ratioChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ratioChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `₩${value.toLocaleString()}`,
                  "수익",
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-4">🥧</div>
              <p className="text-slate-600">데이터를 불러오는 중...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

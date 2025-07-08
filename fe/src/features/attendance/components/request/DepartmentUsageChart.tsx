"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  DepartmentUsage,
  AttendanceRequestDetail,
} from "@/features/attendance/types/attendanceRequest";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";
import styles from "@/features/attendance/styles/chart.module.css";

interface DepartmentUsageChartProps {
  month: string;
  status?: string;
  searchTerm?: string;
  filteredRequests?: AttendanceRequestDetail[]; // 필터링된 요청 데이터
}

export default function DepartmentUsageChart({
  month,
  status,
  searchTerm,
  filteredRequests,
}: DepartmentUsageChartProps) {
  const [data, setData] = useState<DepartmentUsage[]>([]);
  const [loading, setLoading] = useState(true);

  // 안정적인 값들을 만들어서 사용
  const normalizedStatus = status || "ALL";
  const normalizedSearchTerm = searchTerm || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let chartData: DepartmentUsage[] = [];

        if (filteredRequests && filteredRequests.length >= 0) {
          // 필터링된 요청 데이터가 있으면 이를 기반으로 차트 데이터 생성
          const departmentCounts = new Map<string, number>();

          filteredRequests.forEach((request) => {
            const deptName = request.departmentName || "알 수 없음";
            departmentCounts.set(
              deptName,
              (departmentCounts.get(deptName) || 0) + 1
            );
          });

          chartData = Array.from(departmentCounts.entries()).map(
            ([departmentName, count]) => ({
              departmentName,
              count,
            })
          );
        } else {
          // 필터링된 데이터가 없으면 기존 방식 사용
          const response =
            await attendanceRequestService.getDepartmentUsageStats(month);
          chartData = response;

          // 검색어로 필터링
          if (normalizedSearchTerm && normalizedSearchTerm.trim() !== "") {
            const searchLower = normalizedSearchTerm.toLowerCase().trim();
            chartData = chartData.filter((dept) =>
              dept.departmentName.toLowerCase().includes(searchLower)
            );
          }
        }

        setData(chartData);
      } catch (error) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, normalizedStatus, normalizedSearchTerm, filteredRequests]);

  if (loading) {
    return (
      <div className={`${styles.chartWrapper} ${styles.departmentChart}`}>
        <h3 className={styles.chartTitle}>부서별 휴가 신청 현황</h3>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 데이터가 없거나 모든 값이 0인 경우
  if (!data || data.length === 0) {
    return (
      <div className={`${styles.chartWrapper} ${styles.departmentChart}`}>
        <h3 className={styles.chartTitle}>부서별 휴가 신청 현황</h3>
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}></div>
          <div className={styles.emptyMessage}>신청 데이터가 없습니다</div>
          <div className={styles.emptyDescription}>
            해당 월에 휴가 신청이 없습니다.
          </div>
        </div>
      </div>
    );
  }

  // 모든 값이 0인 경우
  if (data.every((item) => item.count === 0)) {
    return (
      <div className={`${styles.chartWrapper} ${styles.departmentChart}`}>
        <h3 className={styles.chartTitle}>부서별 휴가 신청 현황</h3>
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}></div>
          <div className={styles.emptyMessage}>데이터 처리 오류</div>
          <div className={styles.emptyDescription}>
            차트 데이터를 처리하는 중 문제가 발생했습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.chartWrapper} ${styles.departmentChart}`}>
      <h3 className={styles.chartTitle}>부서별 휴가 신청 현황</h3>
      <div style={{ height: "calc(100% - 60px)" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            className={styles.barChart}
          >
            <defs>
              <linearGradient
                id="departmentGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="departmentName"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [value, "신청 수"]}
              labelFormatter={(label) => `부서: ${label}`}
              contentStyle={{
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 32px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            />
            <Bar
              dataKey="count"
              fill="url(#departmentGradient)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

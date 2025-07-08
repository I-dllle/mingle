"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type {
  LeaveTypeUsage,
  AttendanceRequestDetail,
} from "@/features/attendance/types/attendanceRequest";
import { leaveTypeLabels } from "@/features/attendance/utils/attendanceLabels";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";
import styles from "@/features/attendance/styles/chart.module.css";

interface LeaveTypeChartProps {
  month: string;
  status?: string;
  searchTerm?: string;
  filteredRequests?: AttendanceRequestDetail[]; // 필터링된 요청 데이터
}

const COLORS = [
  "#8B5CF6", // 보라색
  "#06B6D4", // 청록색
  "#10B981", // 초록색
  "#F59E0B", // 주황색
  "#EF4444", // 빨간색
  "#6366F1", // 인디고
  "#EC4899", // 핑크색
];

export default function LeaveTypeChart({
  month,
  status,
  searchTerm,
  filteredRequests,
}: LeaveTypeChartProps) {
  const [data, setData] = useState<LeaveTypeUsage[]>([]);
  const [loading, setLoading] = useState(true);

  // 안정적인 값들을 만들어서 사용
  const normalizedStatus = status || "ALL";
  const normalizedSearchTerm = searchTerm || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let chartData: LeaveTypeUsage[] = [];

        if (filteredRequests && filteredRequests.length >= 0) {
          // 필터링된 요청 데이터가 있으면 이를 기반으로 차트 데이터 생성
          const leaveTypeCounts = new Map<string, number>();

          filteredRequests.forEach((request) => {
            const leaveType = request.leaveType;
            leaveTypeCounts.set(
              leaveType,
              (leaveTypeCounts.get(leaveType) || 0) + 1
            );
          });

          chartData = Array.from(leaveTypeCounts.entries()).map(
            ([leaveType, count]) => ({
              leaveType,
              count,
            })
          );
        } else {
          // 필터링된 데이터가 없으면 기존 방식 사용
          const response =
            await attendanceRequestService.getLeaveTypeUsageStats(month);
          chartData = response;
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

  const formatData = data.map((item) => ({
    name:
      leaveTypeLabels[item.leaveType as keyof typeof leaveTypeLabels] ||
      item.leaveType,
    value: item.count,
    leaveType: item.leaveType,
  }));

  if (loading) {
    return (
      <div className={`${styles.chartWrapper} ${styles.leaveTypeChart}`}>
        <h3 className={styles.chartTitle}>유형별 신청 비율</h3>
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
      <div className={`${styles.chartWrapper} ${styles.leaveTypeChart}`}>
        <h3 className={styles.chartTitle}>유형별 신청 비율</h3>
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

  // formatData가 비어있거나 모든 값이 0인 경우
  if (formatData.length === 0 || formatData.every((item) => item.value === 0)) {
    return (
      <div className={`${styles.chartWrapper} ${styles.leaveTypeChart}`}>
        <h3 className={styles.chartTitle}>유형별 신청 비율</h3>
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
    <div className={`${styles.chartWrapper} ${styles.leaveTypeChart}`}>
      <h3 className={styles.chartTitle}>유형별 신청 비율</h3>
      <div style={{ height: "calc(100% - 60px)" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className={styles.pieChart}>
            <Pie
              data={formatData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {formatData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [value, "신청 수"]}
              contentStyle={{
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 32px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={40}
              wrapperStyle={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#475569",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

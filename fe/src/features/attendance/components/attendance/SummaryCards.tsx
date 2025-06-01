"use client";

import { useEffect, useState } from "react";
import attendanceService from "@/features/attendance/services/attendanceService";
import { AttendanceMonthStats } from "@/features/attendance/types/attendance";

interface SummaryCardsProps {
  yearMonth?: string; // 'YYYY-MM' 형식, 기본값은 현재 월
}

export default function SummaryCards({ yearMonth }: SummaryCardsProps) {
  const [stats, setStats] = useState<AttendanceMonthStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 년월 설정 (기본값: 현재 월)
  const currentYearMonth = yearMonth || new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await attendanceService.getMonthlyStatistics(
          currentYearMonth
        );
        setStats(data);
      } catch (err: any) {
        setError(err.message || "통계를 불러오는데 실패했습니다.");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentYearMonth]);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 animate-pulse h-24 rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  // 기본값 설정
  const safeStats = stats || {
    presentCount: 0,
    lateCount: 0,
    earlyLeaveCount: 0,
    vacationCount: 0,
    businessTripCount: 0,
    absentCount: 0,
    yearMonth: currentYearMonth,
    userId: 0,
  };

  // 카드 데이터
  const cards = [
    {
      label: "이번달 정상 출근",
      value: safeStats.presentCount,
      color: "bg-green-100 text-green-800",
      unit: "일",
    },
    {
      label: "이번달 지각",
      value: safeStats.lateCount,
      color: "bg-red-100 text-red-800",
      unit: "회",
    },
    {
      label: "이번달 휴가",
      value: safeStats.vacationCount + safeStats.businessTripCount,
      color: "bg-blue-100 text-blue-800",
      unit: "일",
    },
    {
      label: "이번달 조퇴",
      value: safeStats.earlyLeaveCount,
      color: "bg-orange-100 text-orange-800",
      unit: "회",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className={`${card.color} rounded-lg p-4 shadow-sm`}>
          <div className="text-sm font-medium">{card.label}</div>
          <div className="mt-2 flex items-end">
            <span className="text-2xl font-bold">{card.value}</span>
            <span className="ml-1 text-sm">{card.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

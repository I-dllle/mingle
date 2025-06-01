"use client";

import { useState, useEffect } from "react";
import { WorkHoursChartPoint } from "@/features/attendance/types/attendance";
import attendanceService from "@/features/attendance/services/attendanceService";
import { format, subDays, startOfWeek, isWithinInterval } from "date-fns";
import { ko } from "date-fns/locale";

interface RecordChartProps {
  userId?: number;
  initialStartDate?: string;
  initialEndDate?: string;
}

export default function RecordChart({
  userId,
  initialStartDate,
  initialEndDate,
}: RecordChartProps) {
  const [chartData, setChartData] = useState<WorkHoursChartPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"week" | "month">("week");

  // 기본값: 현재 날짜부터 일주일 전까지
  const today = new Date();
  const defaultEndDate = format(today, "yyyy-MM-dd");
  const defaultStartDate = format(subDays(today, 6), "yyyy-MM-dd");

  const [startDate, setStartDate] = useState<string>(
    initialStartDate || defaultStartDate
  );
  const [endDate, setEndDate] = useState<string>(
    initialEndDate || defaultEndDate
  );

  // 평균 근무 시간 (점선)
  const [averageHours, setAverageHours] = useState<number>(8);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await attendanceService.getChartData(startDate, endDate);
      setChartData(data);

      // 평균 근무 시간 계산
      if (data.length > 0) {
        const sum = data.reduce(
          (total, point) => total + point.workingHours,
          0
        );
        setAverageHours(sum / data.length);
      }
    } catch (err: any) {
      setError(err.message || "차트 데이터를 불러오는데 실패했습니다.");
      console.error("Error fetching chart data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 기간이 변경되면 차트 데이터를 다시 가져옴
  useEffect(() => {
    fetchChartData();
  }, [startDate, endDate]);

  // 기간 변경 핸들러
  const handleViewChange = (newView: "week" | "month") => {
    setView(newView);

    // 주간 보기
    if (newView === "week") {
      setEndDate(defaultEndDate);
      setStartDate(defaultStartDate);
    }
    // 월간 보기
    else if (newView === "month") {
      const lastMonthStartDate = format(subDays(today, 30), "yyyy-MM-dd");
      setStartDate(lastMonthStartDate);
      setEndDate(defaultEndDate);
    }
  };

  // 최대 근무 시간 (차트 높이 계산용)
  const maxHours = Math.max(...chartData.map((item) => item.workingHours), 10);

  // 데이터가 없을 때 표시할 더미 데이터
  const emptyChartData = Array(7).fill({ date: "", workingHours: 0 });

  // 실제 렌더링할 데이터
  const displayData = chartData.length > 0 ? chartData : emptyChartData;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-gray-800">주간 근무시간</h3>

        <div className="flex space-x-2">
          <button
            onClick={() => handleViewChange("week")}
            className={`px-3 py-1 rounded text-sm ${
              view === "week"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            주간
          </button>
          <button
            onClick={() => handleViewChange("month")}
            className={`px-3 py-1 rounded text-sm ${
              view === "month"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            월간
          </button>
        </div>
      </div>

      {loading && !chartData.length ? (
        <div className="flex justify-center items-center h-60">
          <p>로딩 중...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-60 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <div className="relative h-60">
          {" "}
          {/* 평균 근무 시간 점선 */}
          <div
            className="absolute w-full border-t border-dashed border-red-400 z-10"
            style={{
              top: `${Math.min(90, 100 - (averageHours / maxHours) * 100)}%`,
            }}
          />
          {/* 차트 막대 */}
          <div className="flex justify-between items-end h-full">
            {displayData.map((item, index) => {
              const height = item.workingHours
                ? (item.workingHours / maxHours) * 100
                : 5;

              const date = item.date
                ? new Date(item.date)
                : new Date(
                    Number(startDate.split("-")[0]),
                    Number(startDate.split("-")[1]) - 1,
                    index + 1
                  );

              const dayLabel = format(date, "M.d", { locale: ko });
              const dayOfWeek = format(date, "EEE", { locale: ko });

              // 현재 날짜와 같으면 다른 색상 적용
              const isToday =
                format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

              // 8시간보다 많이 근무했는지 여부
              const isOvertime = item.workingHours > 8;

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="relative flex flex-col items-center w-full">
                    <div
                      className={`w-4/5 ${
                        isToday ? "bg-purple-700" : "bg-purple-500"
                      } rounded-sm`}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    {isOvertime && (
                      <div className="absolute top-0 w-4/5 h-1 bg-red-500 rounded-t-sm" />
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <div>{dayLabel}</div>
                    <div className="text-center">{dayOfWeek}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 범례 */}
      <div className="flex justify-end mt-4 space-x-4 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 mr-1 rounded-sm"></div>
          <span>근무 시간</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0 border-t border-dashed border-red-400 mr-1"></div>
          <span>평균 {averageHours.toFixed(1)}시간</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-700 mr-1 rounded-sm"></div>
          <span>오늘</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { WorkHoursChartPoint } from "@/features/attendance/types/attendance";
import attendanceService from "@/features/attendance/services/attendanceService";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  isWithinInterval,
  differenceInDays,
  eachDayOfInterval,
  isSameDay,
  getDay,
  isMonday,
  isFriday,
  isSaturday,
  isSunday,
} from "date-fns";
import { ko } from "date-fns/locale";
import { isWeekend } from "@/features/attendance/utils/attendanceTimeUtils";
import styles from "@/features/attendance/styles/chart.module.css";

/**
 * RecordChart 컴포넌트
 *
 * 주간/월간 근무 시간 차트를 표시합니다.
 * - 주간 뷰: 월요일부터 금요일까지 표시 (토요일, 일요일 제외)
 * - 월간 뷰: 현재 월의 1일부터 말일까지 표시 (토요일, 일요일 제외)
 */

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
  const [refreshKey, setRefreshKey] = useState<number>(0); // 강제 리렌더링을 위한 키

  // 현재 날짜 및 기준일 계산
  const today = new Date();

  // 현재 주의 월요일~금요일 (토요일과 일요일 제외)
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // 1: 월요일부터 시작

  // 항상 금요일까지만 표시 (월~금)
  const currentWeekEnd = addDays(currentWeekStart, 4); // 월요일 + 4일 = 금요일

  // 현재 월의 시작일과 마지막일
  const currentMonthStart = startOfMonth(today);
  const currentMonthEnd = endOfMonth(today);

  // 기본값: 현재 주의 월요일부터 금요일까지
  const defaultStartDate = format(currentWeekStart, "yyyy-MM-dd");
  const defaultEndDate = format(currentWeekEnd, "yyyy-MM-dd");

  const [startDate, setStartDate] = useState<string>(
    initialStartDate || defaultStartDate
  );
  const [endDate, setEndDate] = useState<string>(
    initialEndDate || defaultEndDate
  );

  // 평균 근무 시간 (점선)
  const [averageHours, setAverageHours] = useState<number>(8);

  // 차트 데이터를 가져오는 함수
  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`차트 데이터 요청: ${startDate} ~ ${endDate}`);
      const data = await attendanceService.getChartData(startDate, endDate);
      console.log("차트 데이터 응답:", data);

      // 데이터 유효성 검사
      if (!data || !Array.isArray(data)) {
        throw new Error("유효한 차트 데이터가 아닙니다.");
      }

      // 데이터가 비어있는 경우 빈 배열 대신 날짜별 0값 데이터 생성
      if (data.length === 0) {
        const emptyData = generateEmptyChartData(startDate, endDate);
        setChartData(emptyData);
      } else {
        setChartData(data);
      }

      // 평균 근무 시간 계산 (주말 제외)
      if (data.length > 0) {
        // 주말이 아닌 데이터만 필터링
        const weekdayData = data.filter((point) => {
          const date = new Date(point.date);
          return !isSaturday(date) && !isSunday(date); // 토요일, 일요일 제외
        });

        if (weekdayData.length > 0) {
          const totalHours = weekdayData.reduce(
            (total, point) => total + point.workingHours,
            0
          );
          setAverageHours(totalHours / weekdayData.length);
        } else {
          setAverageHours(8); // 평일 데이터가 없으면 기본값
        }
      } else {
        setAverageHours(8); // 기본값으로 8시간 설정
      }
    } catch (err: any) {
      setError(err.message || "차트 데이터를 불러오는데 실패했습니다.");
      console.error("Error fetching chart data:", err);
      // 오류 시 빈 차트 표시를 위한 더미 데이터 설정
      setChartData(generateEmptyChartData(startDate, endDate));
    } finally {
      setLoading(false);
    }
  };

  // 날짜 범위에 대한 빈 차트 데이터 생성 함수
  const generateEmptyChartData = (
    start: string,
    end: string
  ): WorkHoursChartPoint[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray: WorkHoursChartPoint[] = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateArray.push({
        date: format(currentDate, "yyyy-MM-dd"),
        workingHours: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };
  // 기간이 변경되면 차트 데이터를 다시 가져옴
  useEffect(() => {
    fetchChartData();

    // 1분마다 주간/월간 보기에서 자동 새로고침
    const intervalId = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 60000); // 1분마다 갱신

    return () => clearInterval(intervalId);
  }, [startDate, endDate, refreshKey]);

  // 수동 새로고침 핸들러
  const handleRefresh = () => {
    setLoading(true);
    fetchChartData();
  };

  // 기간 변경 핸들러
  const handleViewChange = (newView: "week" | "month") => {
    setView(newView);
    setLoading(true);

    const today = new Date();

    // 주간 보기: 항상 현재 주의 월요일~금요일(토요일 제외)
    if (newView === "week") {
      // 월요일부터 시작하는 주의 시작일 계산
      const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // 1: 월요일

      // 항상 금요일까지만 표시
      const weekEnd = addDays(weekStart, 4); // 월요일 + 4일 = 금요일

      setStartDate(format(weekStart, "yyyy-MM-dd"));
      setEndDate(format(weekEnd, "yyyy-MM-dd"));
      console.log(
        `주간 보기 설정: ${format(weekStart, "yyyy-MM-dd")} ~ ${format(
          weekEnd,
          "yyyy-MM-dd"
        )}`
      );
    }
    // 월간 보기: 항상 현재 월의 1일부터 말일까지 (전체 월)
    else if (newView === "month") {
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);

      setStartDate(format(monthStart, "yyyy-MM-dd"));
      setEndDate(format(monthEnd, "yyyy-MM-dd"));
      console.log(
        `월간 보기 설정: ${format(monthStart, "yyyy-MM-dd")} ~ ${format(
          monthEnd,
          "yyyy-MM-dd"
        )}`
      );
    }
  }; // 최대 근무 시간 (차트 높이 계산용)
  const maxHours = useMemo(() => {
    // 실제 최대값을 가져오되, averageHours가 있으면 포함
    // 데이터가 전혀 없는 경우 기본값을 설정
    const hasData = chartData.some((item) => item.workingHours > 0);

    if (!hasData) {
      // 데이터가 없는 경우 기본값 설정 - 평균이 8이므로 10으로 설정
      return 10;
    }

    // 실제 최대값 계산
    const maxWorkHours = Math.max(
      ...chartData.map((item) => item.workingHours),
      averageHours, // 평균 시간도 고려
      8, // 기본 8시간 기준점도 고려
      0
    );

    // 최대값에 약간의 여유를 더해 차트 시각적 효과 개선 (약 20% 추가)
    const maxWithBuffer = Math.max(maxWorkHours * 1.2, 10); // 최소값을 10으로 설정
    return maxWithBuffer;
  }, [chartData, averageHours]);

  // 차트 데이터 처리 - 날짜 기간 내 모든 날짜에 데이터 채우기
  const filledChartData = useMemo(() => {
    // 시작일부터 종료일까지 모든 날짜 생성
    const allDays = eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate),
    });

    // 모든 날짜에 대한 데이터 맵 생성
    return allDays.map((day) => {
      const dateString = format(day, "yyyy-MM-dd");
      // 해당 날짜의 데이터가 있으면 사용, 없으면 0으로 생성
      const existingData = chartData.find((item) =>
        isSameDay(new Date(item.date), day)
      );

      return (
        existingData || {
          date: dateString,
          workingHours: 0,
        }
      );
    });
  }, [chartData, startDate, endDate]);

  // 실제 렌더링할 데이터 처리 - 주간/월간에 맞게 필터링
  const displayData = useMemo(() => {
    if (filledChartData.length === 0) {
      return generateEmptyChartData(startDate, endDate);
    }

    // 필터된 데이터 - 토요일과 일요일 모두 제외하고 표시함
    let filteredData = filledChartData.filter((item) => {
      const itemDate = new Date(item.date);
      return !isSunday(itemDate) && !isSaturday(itemDate); // 주말(토요일, 일요일) 제외
    });

    // view가 month 또는 week인 경우의 적절한 범위 설정
    if (view === "month") {
      // 월간 뷰: 항상 현재 월의 1일부터 말일까지
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);

      // 월간 뷰가 선택된 경우 시작일과 종료일을 사용하여 필터링
      // (handleViewChange에서 월 전체로 설정되었음)
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        // startDate와 endDate 사이에 있는 데이터만 표시
        return isWithinInterval(itemDate, {
          start: new Date(startDate),
          end: new Date(endDate),
        });
      });
    } else if (view === "week") {
      // 주간 뷰: 항상 월요일부터 금요일까지
      // (handleViewChange에서 설정된 startDate와 endDate 사용)
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return isWithinInterval(itemDate, {
          start: new Date(startDate),
          end: new Date(endDate),
        });
      });
    }

    return filteredData;
  }, [filledChartData, view, startDate, endDate, today]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-gray-800">
          {view === "week" ? "주간 근무시간" : "월간 근무시간"}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({startDate} ~ {endDate})
          </span>
        </h3>

        <div className="flex space-x-2 items-center">
          <button
            onClick={handleRefresh}
            className="p-1 rounded-full hover:bg-gray-100 mr-2 text-gray-600 transition-colors"
            title="새로고침"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </button>

          <button
            onClick={() => handleViewChange("week")}
            className={`px-3 py-1 rounded text-sm ${
              view === "week"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-colors`}
          >
            주간
          </button>
          <button
            onClick={() => handleViewChange("month")}
            className={`px-3 py-1 rounded text-sm ${
              view === "month"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-colors`}
          >
            월간
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-purple-200 mb-2"></div>
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-60 text-red-500">
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative ${styles.chartWrapper}`}
          style={{ height: "280px", paddingBottom: "50px" }}
        >
          {/* 8시간 기준선 */}
          <div
            className="absolute w-full border-t border-dotted border-gray-300 z-0"
            style={{
              top: `${100 - (8 / maxHours) * 100}%`,
              bottom: "auto",
            }}
          >
            <span className="absolute -top-5 left-0 text-xs text-gray-500">
              8시간
            </span>
          </div>
          {/* 평균 근무 시간 점선 */}
          <div
            className="absolute w-full border-t border-dashed border-red-400 z-10"
            style={{
              top: `${100 - (averageHours / maxHours) * 100}%`,
              bottom: "auto",
            }}
          >
            <span className="absolute -top-5 right-0 text-xs text-red-500">
              평균 {averageHours.toFixed(1)}시간
            </span>
          </div>
          {/* 차트 막대 */}
          <div
            className="flex justify-between h-full"
            style={{ gap: "8px", position: "relative" }}
          >
            {displayData.map((item: WorkHoursChartPoint, index: number) => {
              // 근무시간이 있거나 평균값에 맞춰 최소 높이 설정
              const height = item.workingHours
                ? (item.workingHours / maxHours) * 100
                : 0; // 데이터가 없을 때 0으로 설정

              // 날짜 처리
              const date = new Date(item.date);
              const dayLabel = format(date, "M.d", { locale: ko });
              const dayOfWeek = format(date, "EEE", { locale: ko });

              // 현재 날짜와 같으면 다른 색상 적용
              const isToday =
                format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

              // 8시간보다 많이 근무했는지 여부
              const isOvertime = item.workingHours > 8;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 h-full relative"
                >
                  {/* 근무 시간 표시 */}
                  <div className="text-xs mb-1 font-medium absolute top-0 w-full text-center">
                    {item.workingHours > 0 && (
                      <span
                        className={
                          isOvertime ? "text-red-500" : "text-purple-600"
                        }
                      >
                        {item.workingHours.toFixed(1)}h
                      </span>
                    )}
                  </div>
                  {/* 막대 차트 */}
                  <div className="h-full w-full flex justify-center relative">
                    <div
                      className={`w-3/4 rounded-t-sm ${
                        isToday
                          ? `bg-purple-700 ${styles.barToday}`
                          : "bg-purple-500"
                      } ${styles.bar}`}
                      style={{
                        height: `${height}%`,
                        minHeight: item.workingHours > 0 ? "4px" : "0px",
                        opacity: item.workingHours > 0 ? 1 : 0.3,
                        position: "absolute",
                        bottom: "0",
                      }}
                    />
                  </div>
                  {/* 날짜 라벨 */}
                  <div
                    className="absolute"
                    style={{
                      bottom: "-35px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <div className="text-xs text-gray-600 mt-1">{dayLabel}</div>
                    <div
                      className={`text-xs ${
                        isToday
                          ? "font-semibold text-purple-700"
                          : "text-gray-500"
                      }`}
                    >
                      {dayOfWeek}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 범례 */}
      <div className="flex flex-wrap justify-end mt-8 gap-4 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 mr-1.5 rounded-sm"></div>
          <span>근무 시간</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0 border-t border-dashed border-red-400 mr-1.5"></div>
          <span>평균 {averageHours.toFixed(1)}시간</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-700 mr-1.5 rounded-sm"></div>
          <span>오늘</span>
        </div>
        {displayData.some((item) => item.workingHours > 8) && (
          <div className="flex items-center">
            <div className="w-3 h-1.5 bg-red-500 mr-1.5 rounded-sm"></div>
            <span>초과근무</span>
          </div>
        )}
      </div>

      {/* 데이터 요약 */}
      {!loading && !error && displayData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-2 rounded-md">
              <div className="text-xs text-gray-500 mb-1">총 근무시간</div>
              <div className="font-semibold text-purple-700">
                {displayData
                  .reduce(
                    (sum: number, item: WorkHoursChartPoint) =>
                      sum + item.workingHours,
                    0
                  )
                  .toFixed(1)}
                시간
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <div className="text-xs text-gray-500 mb-1">평균 근무시간</div>
              <div className="font-semibold text-purple-700">
                {averageHours.toFixed(1)}시간/일
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

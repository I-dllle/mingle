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

// 확장된 차트 포인트 타입 (야근 시간 포함)
interface ExtendedWorkHoursChartPoint extends WorkHoursChartPoint {
  regularHours: number; // 정규 근무시간 (최대 8시간)
  overtimeHours: number; // 초과 근무시간
}

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
  const [chartData, setChartData] = useState<ExtendedWorkHoursChartPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"week" | "month">("week");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [hoveredBar, setHoveredBar] = useState<{
    index: number;
    data: ExtendedWorkHoursChartPoint;
    x: number;
    y: number;
  } | null>(null);

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

  // 시간을 시:분 형식으로 변환하는 함수
  const formatHoursToHoursMinutes = (hours: number): string => {
    if (hours === 0) return "0시간";

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    if (minutes === 0) {
      return `${wholeHours}시간`;
    } else if (wholeHours === 0) {
      return `${minutes}분`;
    } else {
      return `${wholeHours}시간 ${minutes}분`;
    }
  };

  // WorkHoursChartPoint를 ExtendedWorkHoursChartPoint로 변환하는 함수
  const convertToExtendedData = (
    data: WorkHoursChartPoint[]
  ): ExtendedWorkHoursChartPoint[] => {
    return data.map((point) => ({
      ...point,
      // 백엔드에서 overtimeHours가 제공되면 사용, 없으면 기존 로직 사용
      regularHours:
        point.overtimeHours !== undefined
          ? Math.max(point.workingHours - (point.overtimeHours || 0), 0) // 전체 - 야근 = 정규
          : Math.min(point.workingHours, 8), // 기존 로직: 정규 시간은 최대 8시간
      overtimeHours:
        point.overtimeHours !== undefined
          ? point.overtimeHours // 백엔드에서 제공된 야근시간 사용
          : Math.max(point.workingHours - 8, 0), // 기존 로직: 8시간 초과분은 야근시간
    }));
  };

  // 빈 데이터 생성 함수
  const generateEmptyExtendedData = (
    start: string,
    end: string
  ): ExtendedWorkHoursChartPoint[] => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray: ExtendedWorkHoursChartPoint[] = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dateArray.push({
        date: format(currentDate, "yyyy-MM-dd"),
        workingHours: 0,
        overtimeHours: 0, // 백엔드 구조에 맞춤
        regularHours: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };

  // 차트 데이터를 가져오는 함수
  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`차트 데이터 요청: ${startDate} ~ ${endDate}`);
      const data = await attendanceService.getChartData(startDate, endDate);
      console.log("차트 데이터 응답:", data);
      console.log("샘플 데이터 포인트:", data[0]); // 첫 번째 데이터 포인트의 구조 확인

      // 데이터 유효성 검사
      if (!data || !Array.isArray(data)) {
        throw new Error("유효한 차트 데이터가 아닙니다.");
      }

      // 데이터가 비어있는 경우 빈 배열 대신 날짜별 0값 데이터 생성
      if (data.length === 0) {
        const emptyData = generateEmptyExtendedData(startDate, endDate);
        setChartData(emptyData);
      } else {
        const extendedData = convertToExtendedData(data);
        console.log("변환된 확장 데이터:", extendedData[0]); // 변환 결과 확인
        setChartData(extendedData);
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
          setAverageHours(0); // 평일 데이터가 없으면 0으로 설정
        }
      } else {
        setAverageHours(0); // 데이터가 없으면 0으로 설정
      }
    } catch (err: any) {
      setError(err.message || "차트 데이터를 불러오는데 실패했습니다.");
      console.error("Error fetching chart data:", err);
      // 오류 시 빈 차트 표시를 위한 더미 데이터 설정
      setChartData(generateEmptyExtendedData(startDate, endDate));
    } finally {
      setLoading(false);
    }
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
          overtimeHours: 0, // 백엔드 구조에 맞춤
          regularHours: 0,
        }
      );
    });
  }, [chartData, startDate, endDate]);

  // 실제 렌더링할 데이터 처리 - 주간/월간에 맞게 필터링
  const displayData = useMemo(() => {
    if (filledChartData.length === 0) {
      return generateEmptyExtendedData(startDate, endDate);
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
    <div className={styles.recordChartWrapper}>
      <div className={styles.recordChartHeader}>
        <div>
          <h3 className={styles.recordChartTitle}>
            {view === "week" ? "주간 근무시간" : "월간 근무시간"}
          </h3>
          <span className={styles.chartDateRange}>
            {startDate} ~ {endDate}
          </span>
        </div>

        <div className={styles.recordChartControls}>
          <button
            onClick={handleRefresh}
            className={styles.refreshButton}
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

          <div className={styles.viewToggleGroup}>
            <button
              onClick={() => handleViewChange("week")}
              className={`${styles.viewToggleButton} ${
                view === "week" ? styles.active : ""
              }`}
            >
              주간
            </button>
            <button
              onClick={() => handleViewChange("month")}
              className={`${styles.viewToggleButton} ${
                view === "month" ? styles.active : ""
              }`}
            >
              월간
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>로딩 중...</p>
        </div>
      ) : error ? (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}></div>
          <div className={styles.emptyMessage}>데이터를 불러올 수 없습니다</div>
          <div className={styles.emptyDescription}>{error}</div>
          <button
            onClick={handleRefresh}
            className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition-colors"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <div className={styles.recordChartContainer}>
          {/* 8시간 기준선 */}
          <div
            className={`${styles.baselineLabelContainer} ${styles.standardBaseline}`}
            style={{
              top: `${100 - (8 / maxHours) * 100}%`,
            }}
          >
            <span className={styles.baselineLabel}>8시간</span>
          </div>

          {/* 평균 근무 시간 점선 */}
          {averageHours > 0 && (
            <div
              className={`${styles.baselineLabelContainer} ${styles.averageBaseline}`}
              style={{
                top: `${100 - (averageHours / maxHours) * 100}%`,
              }}
            >
              {" "}
              <span className={styles.baselineLabel}>
                평균 {formatHoursToHoursMinutes(averageHours)}
              </span>
            </div>
          )}

          {/* 차트 막대 */}
          <div className={styles.chartBarsContainer}>
            {displayData.map(
              (item: ExtendedWorkHoursChartPoint, index: number) => {
                // 정규 시간과 야근 시간 높이 계산
                const regularHeight = item.regularHours
                  ? (item.regularHours / maxHours) * 100
                  : 0;
                const overtimeHeight = item.overtimeHours
                  ? (item.overtimeHours / maxHours) * 100
                  : 0;

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
                  <div key={index} className={styles.chartBarColumn}>
                    {/* 근무 시간 표시 */}
                    {item.workingHours > 0 && (
                      <div
                        className={`${styles.workHoursLabel} ${
                          isOvertime ? styles.overtime : styles.normal
                        }`}
                      >
                        {formatHoursToHoursMinutes(item.workingHours)}
                        {isOvertime && (
                          <div style={{ fontSize: "0.6rem", marginTop: "1px" }}>
                            (+{formatHoursToHoursMinutes(item.overtimeHours)})
                          </div>
                        )}
                      </div>
                    )}

                    {/* 막대 차트 */}
                    <div className={styles.chartBarContainer}>
                      {/* 전체 근무시간 막대 (단일 차트) */}
                      {item.workingHours > 0 && (
                        <div
                          className={`${styles.chartBar} ${
                            isToday ? styles.today : styles.normal
                          } ${styles.chartBarWithTooltip}`}
                          style={{
                            height: `${(item.workingHours / maxHours) * 100}%`,
                            bottom: "0%",
                          }}
                          onMouseEnter={(e) => {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setHoveredBar({
                              index,
                              data: item,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 10,
                            });
                          }}
                          onMouseLeave={() => setHoveredBar(null)}
                        />
                      )}

                      {/* 야근 표시 인디케이터 (작은 점) */}
                      {item.overtimeHours > 0 && (
                        <div
                          className={styles.overtimeIndicator}
                          style={{
                            top: `${
                              100 - (item.workingHours / maxHours) * 100 - 5
                            }%`,
                          }}
                        />
                      )}
                    </div>

                    {/* 날짜 라벨 */}
                    <div className={styles.dateLabelContainer}>
                      <div className={styles.dateLabel}>{dayLabel}</div>
                      <div
                        className={`${styles.dayLabel} ${
                          isToday ? styles.today : ""
                        }`}
                      >
                        {dayOfWeek}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* 커스텀 툴팁 */}
      {hoveredBar && (
        <div
          className={styles.customTooltipOverlay}
          style={{
            position: "fixed",
            left: hoveredBar.x,
            top: hoveredBar.y,
            transform: "translateX(-50%)",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipHeader}>
              {format(new Date(hoveredBar.data.date), "M월 d일 (EEE)", {
                locale: ko,
              })}
            </div>
            <div className={styles.tooltipBody}>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>총 근무시간:</span>
                <span className={styles.tooltipValue}>
                  {formatHoursToHoursMinutes(hoveredBar.data.workingHours)}
                </span>
              </div>
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>정규시간:</span>
                <span className={styles.tooltipValue}>
                  {formatHoursToHoursMinutes(hoveredBar.data.regularHours)}
                </span>
              </div>
              {hoveredBar.data.overtimeHours > 0 && (
                <div className={styles.tooltipRow}>
                  <span className={styles.tooltipLabel}>야근시간:</span>
                  <span
                    className={`${styles.tooltipValue} ${styles.overtimeValue}`}
                  >
                    {formatHoursToHoursMinutes(hoveredBar.data.overtimeHours)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 범례 */}
      <div className={styles.chartLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.normal}`}></div>
          <span>근무시간</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={styles.overtimeIndicator}
            style={{ position: "static", margin: 0 }}
          ></div>
          <span>야근 있음</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.averageLine}`}></div>
          <span>평균 {formatHoursToHoursMinutes(averageHours)}</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.today}`}></div>
          <span>오늘</span>
        </div>
      </div>

      {/* 데이터 요약 */}
      {!loading && !error && displayData.length > 0 && (
        <div className={styles.dataSummary}>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>총 근무시간</div>
              <div className={styles.summaryValue}>
                {formatHoursToHoursMinutes(
                  displayData.reduce(
                    (sum: number, item: ExtendedWorkHoursChartPoint) =>
                      sum + item.workingHours,
                    0
                  )
                )}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>평균 근무시간</div>
              <div className={styles.summaryValue}>
                {formatHoursToHoursMinutes(averageHours)}/일
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>총 초과근무</div>
              <div className={styles.summaryValue}>
                {formatHoursToHoursMinutes(
                  displayData.reduce(
                    (sum: number, item: ExtendedWorkHoursChartPoint) =>
                      sum + item.overtimeHours,
                    0
                  )
                )}
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryLabel}>근무일수</div>
              <div className={styles.summaryValue}>
                {
                  displayData.filter(
                    (item: ExtendedWorkHoursChartPoint) => item.workingHours > 0
                  ).length
                }
                일
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

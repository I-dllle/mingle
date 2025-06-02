// 파일 경로: app/attendance/page.tsx
"use client";

import { useState, useEffect } from "react";
import type { AttendanceRecord } from "@/features/attendance/types/attendance";
import attendanceService from "@/features/attendance/services/attendanceService";

// 아래 컴포넌트들은 제공해주신 대로 각각의 기능을 담당합니다.
import CheckInOutButtons from "@/features/attendance/components/attendance/CheckInOutButtons";
import SummaryCards from "@/features/attendance/components/attendance/SummaryCards";
import RecentRecordsTable from "@/features/attendance/components/attendance/RecentRecordsTable";
import RecordChart from "@/features/attendance/components/attendance/RecordChart";

// 페이지 전반의 레이아웃 · 간격을 조정하기 위한 CSS 모듈
import dashboardStyles from "@/features/attendance/styles/dashboard.module.css";

export default function AttendancePage() {
  // 오늘 날짜(YYYY-MM-DD) 포맷
  const todayString = new Date().toISOString().slice(0, 10);

  // ────────── 1) 오늘 출퇴근 정보 조회 ──────────
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [todayLoading, setTodayLoading] = useState<boolean>(true);
  const [todayError, setTodayError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToday = async () => {
      try {
        setTodayLoading(true);
        setTodayError(null);
        const data = await attendanceService.getDailyAttendance(todayString);
        setTodayRecord(data);
      } catch (err: any) {
        console.error("오늘 출퇴근 정보 조회 에러:", err);
        setTodayError(
          err.message || "오늘 출퇴근 정보를 불러오는데 실패했습니다."
        );
        setTodayRecord(null);
      } finally {
        setTodayLoading(false);
      }
    };
    fetchToday();
  }, [todayString]);

  // ────────── 2) 현재 연·월 (SummaryCards, RecordChart 등에서 사용) ──────────
  const [yearMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // ex: "2025-05"
  );

  // ────────── 3) 출퇴근 버튼 동작 후 todayRecord 갱신 ──────────
  const handleCheckSuccess = (newRecord: AttendanceRecord) => {
    setTodayRecord(newRecord);
  };

  return (
    <div className={`${dashboardStyles.container} p-6 bg-gray-50 min-h-screen`}>
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ① 출퇴근 버튼 + 현재 시간/상태 요약 */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <CheckInOutButtons
          todayRecord={todayRecord}
          onSuccess={handleCheckSuccess}
        />
        {todayError && (
          <div className="mt-2 text-sm text-red-500">{todayError}</div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ② 요약 카드 (이번달 정상 출근, 지각, 휴가, 조퇴) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className={`mb-8 ${dashboardStyles.summarySection}`}>
        <SummaryCards yearMonth={yearMonth} />
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ③ 근무시간 차트 (주간/월간 토글) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className={`mb-8 ${dashboardStyles.chartSection}`}>
        <RecordChart initialStartDate={undefined} initialEndDate={undefined} />
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ④ 최근 근태 기록 테이블 (페이지네이션 포함) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className={dashboardStyles.tableSection}>
        <RecentRecordsTable
          // 일반 사용자 모드이므로 isAdmin 을 전달하지 않거나 false 로 두면 됩니다.
          recordsPerPage={5}
          initialPage={1}
          onPageChange={(newPage) => {
            // 필요 시 페이지 변화에 따른 로직 처리
          }}
        />
      </div>
    </div>
  );
}

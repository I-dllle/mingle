"use client";

import { useState, useEffect } from "react";
import AdminAttendanceToolbar from "@/features/attendance/components/attendance/AdminAttendanceToolbar";
import AttendanceTable from "@/features/attendance/components/attendance/RecentRecordsTable";
import SummaryCards from "@/features/attendance/components/attendance/SummaryCards";
import RecordChart from "@/features/attendance/components/attendance/RecordChart";
import { AttendanceStatus } from "@/features/attendance/types/attendanceCommonTypes";
import attendanceService from "@/features/attendance/services/attendanceService";

import type { StatusType } from "@/features/attendance/components/attendance/AdminAttendanceToolbar";

export default function AdminAttendancePage() {
  // 1) 필터 상태 관리
  const [selectedStatus, setSelectedStatus] = useState<StatusType | "ALL">(
    "ALL"
  );
  const [yearMonth, setYearMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [deptId, setDeptId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage] = useState<number>(10);

  // 2) "엑셀 다운로드"를 위한 날짜 범위와 기타 필터
  const handleExport = () => {
    const url = attendanceService.getExcelDownloadUrl(
      dateRange.start,
      dateRange.end,
      deptId || undefined,
      userId || undefined,
      keyword || undefined,
      selectedStatus === "ALL" ? undefined : selectedStatus
    );
    window.open(url, "_blank");
  };
  // 3) 툴바에서 상태가 바뀔 때
  const onStatusFilter = (status: StatusType | "ALL") => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // 4) 툴바에서 날짜 범위가 바뀔 때
  const onDateRangeChange = (start: string, end: string) => {
    setDateRange({ start, end });
    setCurrentPage(1);
  };

  // 5) 툴바 검색 입력이 들어왔을 때
  const onSearch = (q: string) => {
    setKeyword(q);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 1. 상단 툴바 */}{" "}
      <AdminAttendanceToolbar
        selectedStatus={selectedStatus}
        onStatusFilter={onStatusFilter}
        onDateRangeChange={onDateRangeChange}
        onSearch={onSearch}
        onExport={handleExport}
        statusType="attendance"
      />
      {/* 2. 필터된 전체 근태 테이블 (페이지네이션 포함) */}
      <AttendanceTable
        isAdmin={true}
        yearMonth={yearMonth}
        keyword={keyword}
        statusFilter={selectedStatus === "ALL" ? undefined : selectedStatus}
        departmentId={deptId}
        userIdFilter={userId}
        page={currentPage}
        size={recordsPerPage}
        onPageChange={setCurrentPage}
      />
      {/* 3. 페이지 하단: 요약 카드 (이번달 통계) */}
      <div className="mt-12">
        <SummaryCards yearMonth={yearMonth} />
      </div>
      {/* 4. 페이지 맨 아래: 근무시간 차트 (주간/월간) */}
      <div className="mt-8">
        <RecordChart
          /** 관리자용 차트도 사용자별? 아니면 부서별?
           *  필요하면 props로서 userId나 departmentId를 넘겨서 필터링할 수 있습니다.
           *  여기서는 단순히 “전체 합계 차트”가 아니라면, 유저 본인차트만 보여줘야 한다면 isAdmin 분기 로직을 넣으세요.
           */
          initialStartDate={dateRange.start || undefined}
          initialEndDate={dateRange.end || undefined}
          userId={userId || undefined}
        />
      </div>
    </div>
  );
}

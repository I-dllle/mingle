// 파일 경로: app/(admin)/panel/requests/page.tsx
"use client";

import AdminRequestToolbar from "@/features/attendance/components/request/AdminRequestToolbar";
import AdminRequestList from "@/features/attendance/components/request/AdminRequestList";
import DepartmentUsageChart from "@/features/attendance/components/request/DepartmentUsageChart";
import LeaveTypeChart from "@/features/attendance/components/request/LeaveTypeChart";
import { useState } from "react";
import { format } from "date-fns";
import styles from "@/features/attendance/styles/dashboard.module.css";
import type { AttendanceRequestDetail } from "@/features/attendance/types/attendanceRequest";

export default function AdminAttendanceRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredRequests, setFilteredRequests] = useState<
    AttendanceRequestDetail[]
  >([]);

  // AdminRequestList에서 필터링된 데이터를 받는 핸들러
  const handleDataFiltered = (data: AttendanceRequestDetail[]) => {
    console.log("필터링된 데이터:", data);
    setFilteredRequests(data);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>휴가신청 관리 대시보드</h1>
        <p className={styles.subtitle}>
          직원들의 휴가 신청을 효율적으로 관리하고 현황을 확인하세요
        </p>
      </header>

      <div className={styles.filterSection}>
        <AdminRequestToolbar
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      <div className={styles.requestsSection}>
        <AdminRequestList
          status={selectedStatus}
          month={selectedMonth}
          searchTerm={searchTerm}
          onDataFiltered={handleDataFiltered}
        />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <DepartmentUsageChart
            month={selectedMonth}
            status={selectedStatus}
            searchTerm={searchTerm}
            filteredRequests={filteredRequests}
          />
        </div>
        <div className={styles.chartCard}>
          <LeaveTypeChart
            month={selectedMonth}
            status={selectedStatus}
            searchTerm={searchTerm}
            filteredRequests={filteredRequests}
          />
        </div>
      </div>
    </div>
  );
}

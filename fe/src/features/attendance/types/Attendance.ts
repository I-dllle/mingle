// types/attendance.ts

import { AttendanceStatus, LeaveType } from "./attendanceCommonTypes";

export interface AttendanceRecord {
  userId: number;
  checkInTime: string | null;
  checkOutTime: string | null;
  overtimeStart: string | null;
  overtimeEnd: string | null;
  date: string; // yyyy-MM-dd
  attendanceStatus: AttendanceStatus;
  workingHours: number;
  overtimeHours: number;
}

export interface AttendanceDetail extends AttendanceRecord {
  id: number;
  reason?: string;
  requestId?: number;
  leaveType?: LeaveType; // string에서 LeaveType으로 변경
}

export interface AttendanceAdminRecord {
  id: number;
  date: string;
  nickName: string;
  departmentName: string;
  attendanceStatus: AttendanceStatus;
  checkIn: string | null;
  checkOut: string | null;
}

export interface AttendanceMonthStats {
  yearMonth: string; // e.g. "2025-06"
  userId: number;
  presentCount: number;
  lateCount: number;
  earlyLeaveCount: number;
  absentCount: number;
  vacationCount: number;
  businessTripCount: number;
}

export interface AttendancePageResponse {
  content: AttendanceRecord[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface WorkHoursChartPoint {
  date: string;
  workingHours: number;
}

export interface AttendanceExcelRow {
  name: string;
  nickName: string;
  departmentName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  attendanceStatus: string; // "정상 출근" 등 가공된 텍스트
  leaveReason?: string;
}

export interface OvertimeRequest {
  date: string;
  reason: string;
}

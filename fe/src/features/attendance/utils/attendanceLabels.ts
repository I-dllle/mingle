// features/attendance/utils/attendanceLabels.ts

import type {
  AttendanceStatus,
  ApprovalStatus,
  LeaveType,
} from "../types/attendanceCommonTypes";

// 색상 매핑 - 배경색 (배지 등에서 사용)
export const statusBackgroundColorMap: Record<AttendanceStatus, string> = {
  PRESENT: "bg-green-500",
  LATE: "bg-yellow-500",
  ABSENT: "bg-red-500",
  EARLY_LEAVE: "bg-orange-400",
  OVERTIME: "bg-blue-500",
  ON_ANNUAL_LEAVE: "bg-indigo-500",
  ON_SICK_LEAVE: "bg-purple-500",
  ON_HALF_DAY_AM: "bg-pink-500",
  ON_HALF_DAY_PM: "bg-pink-500",
  ON_OFFICIAL_LEAVE: "bg-sky-500",
  ON_BUSINESS_TRIP: "bg-teal-500",
  ON_SPECIAL_LEAVE: "bg-gray-600",
};

// 색상 매핑 - 텍스트 색상 (텍스트에서 사용)
export const statusTextColorMap: Record<AttendanceStatus, string> = {
  PRESENT: "text-green-500",
  LATE: "text-red-500",
  ABSENT: "text-red-600",
  EARLY_LEAVE: "text-orange-500",
  OVERTIME: "text-purple-500",
  ON_ANNUAL_LEAVE: "text-blue-500",
  ON_SICK_LEAVE: "text-blue-600",
  ON_HALF_DAY_AM: "text-blue-400",
  ON_HALF_DAY_PM: "text-blue-400",
  ON_BUSINESS_TRIP: "text-indigo-500",
  ON_OFFICIAL_LEAVE: "text-teal-500",
  ON_SPECIAL_LEAVE: "text-cyan-500",
};

// 근태 상태 → 한글 라벨
export const attendanceStatusLabels: Record<AttendanceStatus, string> = {
  PRESENT: "정상 출근",
  LATE: "지각",
  ABSENT: "결근",
  EARLY_LEAVE: "조퇴",
  OVERTIME: "연장근무",

  ON_ANNUAL_LEAVE: "연차",
  ON_SICK_LEAVE: "병가",
  ON_HALF_DAY_AM: "오전 반차",
  ON_HALF_DAY_PM: "오후 반차",
  ON_OFFICIAL_LEAVE: "공가",
  ON_BUSINESS_TRIP: "출장",
  ON_SPECIAL_LEAVE: "특별 휴가",
};

// 승인 상태 → 한글 라벨
export const approvalStatusLabels: Record<ApprovalStatus, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "반려",
};

// 승인 상태 색상 매핑
export const approvalColorMap: Record<ApprovalStatus, string> = {
  PENDING: "bg-yellow-600",
  APPROVED: "bg-green-600",
  REJECTED: "bg-red-600",
};

// 휴가 유형 → 한글 라벨
export const leaveTypeLabels: Record<LeaveType, string> = {
  ANNUAL: "연차",
  SICK: "병가",
  OFFICIAL: "공가",
  HALF_DAY_AM: "오전 반차",
  HALF_DAY_PM: "오후 반차",
  MARRIAGE: "결혼 휴가",
  BEREAVEMENT: "조의 휴가",
  PARENTAL: "육아 휴가",
  BUSINESS_TRIP: "출장",
  EARLY_LEAVE: "조퇴",
  OTHER: "기타",
};

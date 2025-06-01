// 파일: attendanceCommonTypes.ts

// 공통 상태 타입 (Attendance와 AttendanceRequest에서 모두 사용)
export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "ABSENT"
  | "EARLY_LEAVE"
  | "OVERTIME"
  | "ON_ANNUAL_LEAVE"
  | "ON_SICK_LEAVE"
  | "ON_HALF_DAY_AM"
  | "ON_HALF_DAY_PM"
  | "ON_OFFICIAL_LEAVE"
  | "ON_BUSINESS_TRIP"
  | "ON_SPECIAL_LEAVE";

// 휴가 유형
export type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "OFFICIAL"
  | "HALF_DAY_AM"
  | "HALF_DAY_PM"
  | "BUSINESS_TRIP"
  | "MARRIAGE"
  | "BEREAVEMENT"
  | "PARENTAL"
  | "EARLY_LEAVE"
  | "OTHER";

// 승인 상태
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

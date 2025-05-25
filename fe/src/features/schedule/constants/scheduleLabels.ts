import { ScheduleStatus, ScheduleType } from "../types/Enums";

// 상태 표시용 레이블
export const scheduleStatusLabels = {
  [ScheduleStatus.IMPORTANT_MEETING]: "중요회의",
  [ScheduleStatus.BUSINESS_TRIP]: "출장",
  [ScheduleStatus.COMPLETED]: "일정완료",
  [ScheduleStatus.CANCELED]: "일정취소",
  [ScheduleStatus.VACATION]: "휴가",
};

// 일정 타입 표시용 레이블
export const scheduleTypeLabels = {
  [ScheduleType.PERSONAL]: "개인 일정",
  [ScheduleType.DEPARTMENT]: "부서 일정",
  [ScheduleType.COMPANY]: "회사 일정",
};

// 일정 타입별 색상 매핑
export const scheduleTypeColors = {
  [ScheduleType.PERSONAL]: "#FFC107", // 노란색 (개인일정)
  [ScheduleType.DEPARTMENT]: "#2196F3", // 파란색 (부서 일정)
  [ScheduleType.COMPANY]: "#F44336", // 빨간색 (회사 일정)
};

// 일정 상태별 색상 매핑
export const scheduleStatusColors = {
  [ScheduleStatus.IMPORTANT_MEETING]: "#E91E63", // 핑크색
  [ScheduleStatus.BUSINESS_TRIP]: "#9C27B0", // 보라색
  [ScheduleStatus.COMPLETED]: "#8BC34A", // 연두색
  [ScheduleStatus.CANCELED]: "#9E9E9E", // 회색
  [ScheduleStatus.VACATION]: "#00BCD4", // 하늘색
};

import { ScheduleStatus, ScheduleType } from "../types/Enums";

// 상태 표시용 레이블
export const scheduleStatusLabels: Record<ScheduleStatus, string> = {
  [ScheduleStatus.NONE]: "없음",
  [ScheduleStatus.IMPORTANT_MEETING]: "중요회의",
  [ScheduleStatus.MEETING]: "회의",
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
  [ScheduleType.PERSONAL]: "#9333ea",
  [ScheduleType.DEPARTMENT]: "#FFD8B1",
  [ScheduleType.COMPANY]: "#ec4899",
};

// 일정 상태별 색상 매핑
export const scheduleStatusColors = {
  [ScheduleStatus.NONE]: "#BDBDBD", // 연한 회색
  [ScheduleStatus.IMPORTANT_MEETING]: "#E91E63", // 핑크색
  [ScheduleStatus.MEETING]: "#FF9800", // 오렌지색
  [ScheduleStatus.BUSINESS_TRIP]: "#3B82F6", // 진한 블루
  [ScheduleStatus.COMPLETED]: "#10B981", // 초록색
  [ScheduleStatus.CANCELED]: "#9E9E9E", // 회색
  [ScheduleStatus.VACATION]: "#00BCD4", // 하늘색
};

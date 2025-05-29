import { ScheduleType, ScheduleStatus } from "./Enums";

export interface Schedule {
  id: number;
  userId: number;
  postId?: number | null;
  title: string;
  description: string;
  startTime: string; // ISO 형식 문자열 (2025-05-13T10:00:00)
  endTime: string; // ISO 형식 문자열 (2025-05-13T11:00:00)
  memo: string;
  scheduleType: ScheduleType;
  scheduleStatus: ScheduleStatus;
  departmentId?: number | null;
  departmentName?: string;
}

export interface ScheduleFormData {
  postId?: number | null;
  title: string;
  description: string;
  startTime: string; // ISO 형식 문자열
  endTime: string; // ISO 형식 문자열
  memo: string;
  scheduleType: ScheduleType;
  scheduleStatus: ScheduleStatus;
  departmentId?: number | null;
}

// 백엔드 API 응답과 일치하는 인터페이스
export interface ScheduleResponse {
  id: number;
  userId: number;
  postId?: number | null;
  title: string;
  description: string;
  startTime: string; // ISO 형식 문자열
  endTime: string; // ISO 형식 문자열
  memo: string;
  scheduleType: ScheduleType;
  scheduleStatus: ScheduleStatus;
  departmentId?: number | null;
}

// 페이징 응답 인터페이스
export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // 현재 페이지 (0-based)
  first: boolean; // 첫 페이지 여부
  last: boolean; // 마지막 페이지 여부
  empty: boolean; // 결과가 비어있는지 여부
}

// 부서 정보 인터페이스
export interface DepartmentResponse {
  departmentId: number;
  departmentName: string;
}

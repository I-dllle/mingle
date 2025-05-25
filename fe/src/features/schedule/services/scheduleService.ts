import apiClient from "@/lib/apiClient";
import {
  Schedule,
  ScheduleFormData,
  ScheduleResponse,
  PagedResponse,
  DepartmentResponse,
} from "../types/Schedule";
import { ScheduleType, ScheduleStatus } from "../types/Enums";

const BASE_URL = "/api/v1/schedule";

export const scheduleService = {
  // 월간 일정 조회
  getMonthlySchedules: async (
    date: Date,
    type?: ScheduleType,
    departmentId?: number
  ) => {
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD 포맷
    const response = await apiClient.get<ScheduleResponse[]>(
      `${BASE_URL}/monthly`,
      {
        params: {
          date: formattedDate,
          type,
          departmentId,
        },
      }
    );
    return response.data;
  },

  // 주간 일정 조회
  getWeeklySchedules: async (
    date: Date,
    type?: ScheduleType,
    departmentId?: number
  ) => {
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD 포맷
    const response = await apiClient.get<ScheduleResponse[]>(
      `${BASE_URL}/weekly`,
      {
        params: {
          date: formattedDate,
          type,
          departmentId,
        },
      }
    );
    return response.data;
  },

  // 일간 일정 조회
  getDailySchedules: async (
    date: Date,
    type?: ScheduleType,
    departmentId?: number
  ) => {
    const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD 포맷
    const response = await apiClient.get<ScheduleResponse[]>(
      `${BASE_URL}/daily`,
      {
        params: {
          date: formattedDate,
          type,
          departmentId,
        },
      }
    );
    return response.data;
  },

  // 상태별 일정 필터링
  getSchedulesByStatus: async (
    status: ScheduleStatus,
    scheduleType: ScheduleType,
    page: number = 1,
    size: number = 15
  ) => {
    const response = await apiClient.get<PagedResponse<ScheduleResponse>>(
      `${BASE_URL}/status`,
      {
        params: { status, scheduleType, page, size },
      }
    );
    return response.data;
  },

  // 특정 일정 상세 조회 (API에는 없지만 필요시 추가)
  getScheduleById: async (id: number) => {
    try {
      const response = await apiClient.get<ScheduleResponse>(
        `${BASE_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("일정 상세 조회 실패:", error);
      throw error;
    }
  },

  // 일정 생성 (개인 일정)
  createSchedule: async (scheduleData: ScheduleFormData) => {
    const response = await apiClient.post<ScheduleResponse>(
      BASE_URL,
      scheduleData
    );
    return response.data;
  },

  // 회사 일정 생성 (관리자)
  createCompanySchedule: async (scheduleData: ScheduleFormData) => {
    const response = await apiClient.post<ScheduleResponse>(
      `${BASE_URL}/admin/company`,
      scheduleData
    );
    return response.data;
  },

  // 부서 일정 생성 (관리자)
  createDepartmentSchedule: async (scheduleData: ScheduleFormData) => {
    const response = await apiClient.post<ScheduleResponse>(
      `${BASE_URL}/admin/department`,
      scheduleData
    );
    return response.data;
  },

  // 일정 수정
  updateSchedule: async (id: number, scheduleData: ScheduleFormData) => {
    const response = await apiClient.put<ScheduleResponse>(
      `${BASE_URL}/${id}`,
      scheduleData
    );
    return response.data;
  },

  // 일정 수정 (관리자)
  updateScheduleAdmin: async (id: number, scheduleData: ScheduleFormData) => {
    const response = await apiClient.put<ScheduleResponse>(
      `${BASE_URL}/admin/${id}`,
      scheduleData
    );
    return response.data;
  },

  // 일정 삭제
  deleteSchedule: async (id: number) => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  // 부서 목록 조회
  getDepartments: async () => {
    const response = await apiClient.get<DepartmentResponse[]>(
      `${BASE_URL}/departments`
    );
    return response.data;
  },
};

import { apiClient } from "@/lib/api/apiClient";
import {
  Schedule,
  ScheduleFormData,
  ScheduleResponse,
  PagedResponse,
} from "@/features/schedule/types/Schedule";
import { ScheduleType } from "@/features/schedule/types/Enums";

// API 기본 경로 (이미 apiClient에서 /api/v1 접두사가 추가됨)
const BASE = "/schedule";

// 날짜 문자열에 초(":00") 추가하는 함수
export function formatDateTimeWithSeconds(dateTimeString: string): string {
  if (dateTimeString.match(/T\d{2}:\d{2}:\d{2}/)) {
    if (dateTimeString.includes(".")) {
      return dateTimeString.split(".")[0];
    }
    return dateTimeString;
  }
  if (dateTimeString.match(/T\d{2}:\d{2}$/)) {
    return `${dateTimeString}:00`;
  }
  return dateTimeString;
}

// 일정 시간 포맷팅
export function formatScheduleTime(dateTime: string | Date): string {
  if (dateTime instanceof Date) {
    return dateTime.toISOString().slice(0, 16);
  }
  if (typeof dateTime === "string" && dateTime.includes("T")) {
    const [date, time] = dateTime.split("T");
    return `${date}T${time.substring(0, 5)}`;
  }
  return dateTime as string;
}

// ScheduleFormData를 API에 맞게 변환
function prepareScheduleDataForApi(formData: ScheduleFormData) {
  return {
    ...formData,
    startTime: formatDateTimeWithSeconds(formData.startTime),
    endTime: formatDateTimeWithSeconds(formData.endTime),
    postId: formData.postId || null,
    scheduleStatus:
      formData.scheduleStatus === "NONE" ? null : formData.scheduleStatus,
  };
}

// 백엔드 응답 → 프론트 모델
function mapResponseToSchedule(r: ScheduleResponse): Schedule {
  return { ...r, startTime: r.startTime, endTime: r.endTime };
}

// 공통 조회 헬퍼
async function fetchSchedules(
  view: "monthly" | "weekly" | "daily",
  date: Date,
  scheduleType?: ScheduleType,
  departmentId?: number
): Promise<Schedule[]> {
  const params = new URLSearchParams();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  params.append("date", `${yyyy}-${mm}-${dd}`);
  if (scheduleType) params.append("type", scheduleType);
  if (departmentId != null) params.append("departmentId", String(departmentId));
  const url = `${BASE}/${view}?${params.toString()}`;
  const resp = await apiClient<ScheduleResponse[]>(url);
  return resp.map(mapResponseToSchedule);
}

// 일정 생성
export async function createSchedule(
  data: ScheduleFormData
): Promise<Schedule> {
  const prepared = prepareScheduleDataForApi(data);
  const response = await apiClient<ScheduleResponse>(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(prepared),
  });
  return mapResponseToSchedule(response);
}

// 부서 일정 생성 (본인 부서 자동 지정)
export async function createDepartmentSchedule(
  data: ScheduleFormData
): Promise<Schedule> {
  const prepared = prepareScheduleDataForApi(data);
  const response = await apiClient<ScheduleResponse>(`${BASE}/department`, {
    method: "POST",
    body: JSON.stringify(prepared),
  });
  return mapResponseToSchedule(response);
}

// 회사 일정 생성 (관리자 전용)
export async function createCompanySchedule(
  data: ScheduleFormData
): Promise<Schedule> {
  const prepared = prepareScheduleDataForApi(data);
  const response = await apiClient<ScheduleResponse>(`${BASE}/admin/company`, {
    method: "POST",
    body: JSON.stringify(prepared),
  });
  return mapResponseToSchedule(response);
}

// 일정 수정
export async function updateSchedule(
  id: number,
  data: ScheduleFormData
): Promise<Schedule> {
  const prepared = prepareScheduleDataForApi(data);
  const response = await apiClient<ScheduleResponse>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(prepared),
  });
  return mapResponseToSchedule(response);
}

// 회사 일정 수정 (관리자 전용)
export async function updateAnySchedule(
  id: number,
  data: ScheduleFormData
): Promise<Schedule> {
  const prepared = prepareScheduleDataForApi(data);
  const response = await apiClient<ScheduleResponse>(`${BASE}/admin/${id}`, {
    method: "PUT",
    body: JSON.stringify(prepared),
  });
  return mapResponseToSchedule(response);
}

// 일정 삭제
export async function deleteSchedule(id: number): Promise<void> {
  await apiClient(`${BASE}/${id}`, { method: "DELETE" });
}

// 페이징 조회
export async function getSchedules(
  params: {
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
    scheduleType?: string;
  } = {}
): Promise<PagedResponse<Schedule>> {
  const qp = new URLSearchParams();
  if (params.startDate) qp.append("startDate", params.startDate);
  if (params.endDate) qp.append("endDate", params.endDate);
  if (params.page != null) qp.append("page", String(params.page));
  if (params.size) qp.append("size", String(params.size));
  if (params.scheduleType) qp.append("scheduleType", params.scheduleType);
  const resp = await apiClient<PagedResponse<ScheduleResponse>>(
    `${BASE}?${qp.toString()}`
  );
  return { ...resp, content: resp.content.map(mapResponseToSchedule) };
}

// 전체 조회 (캘린더용)
export async function getAllSchedules(
  params: { startDate?: string; endDate?: string; scheduleType?: string } = {}
): Promise<Schedule[]> {
  const qp = new URLSearchParams();
  if (params.startDate) qp.append("startDate", params.startDate);
  if (params.endDate) qp.append("endDate", params.endDate);
  if (params.scheduleType) qp.append("scheduleType", params.scheduleType);
  return await apiClient<Schedule[]>(`${BASE}/all?${qp.toString()}`);
}

// 검색
export async function searchSchedules(
  keyword: string,
  includeMemo = false
): Promise<Schedule[]> {
  const qp = new URLSearchParams();
  qp.append("keyword", keyword);
  qp.append("includeMemo", String(includeMemo));
  const url = `${BASE}/search?${qp.toString()}`;
  const resp = await apiClient<ScheduleResponse[]>(url);
  return resp.map(mapResponseToSchedule);
}

// 뷰별 조회
export const getMonthlySchedules = (
  date: Date,
  type?: ScheduleType,
  deptId?: number
) => fetchSchedules("monthly", date, type, deptId);
export const getWeeklyView = (
  date: Date,
  type?: ScheduleType,
  deptId?: number
) => fetchSchedules("weekly", date, type, deptId);
export const getDailyView = (
  date: Date,
  type?: ScheduleType,
  deptId?: number
) => fetchSchedules("daily", date, type, deptId);

// --- 추가 ---
export async function getScheduleById(id: number): Promise<Schedule> {
  const response = await apiClient<ScheduleResponse>(`${BASE}/${id}`, {
    method: "GET",
  });
  const schedule = mapResponseToSchedule(response);

  // DEPARTMENT 타입이면 부서 이름 추가
  if (
    schedule.scheduleType === ScheduleType.DEPARTMENT &&
    schedule.departmentId
  ) {
    try {
      const departments = await fetchAllDepartments();
      const department = departments.find(
        (d) => d.id === schedule.departmentId
      );
      if (department) {
        schedule.departmentName = department.departmentName;
      }
    } catch (e) {
      console.error("부서 정보를 가져오는데 실패했습니다.", e);
    }
  }
  return schedule;
}

export async function fetchAllDepartments() {
  const resp = await apiClient<{ id: number; departmentName: string }[]>(
    `${BASE}/departments`
  );
  return resp;
}

// export
export const scheduleService = {
  createSchedule,
  createDepartmentSchedule,
  createCompanySchedule,
  getScheduleById,
  updateSchedule,
  updateAnySchedule,
  deleteSchedule,
  getSchedules,
  getAllSchedules,
  searchSchedules,
  getMonthlySchedules,
  getWeeklyView,
  getDailyView,
};

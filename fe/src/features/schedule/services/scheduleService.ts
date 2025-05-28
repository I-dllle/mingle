import { apiClient } from "@/lib/api/apiClient";
import {
  Schedule,
  ScheduleFormData,
  ScheduleResponse,
  PagedResponse,
  DepartmentResponse,
} from "@/features/schedule/types/Schedule";
import { ScheduleType } from "@/features/schedule/types/Enums";

const BASE = "/schedule";

/**
 * 날짜 문자열에 초(":00") 추가하는 함수
 * 백엔드가 yyyy-MM-ddTHH:mm:ss 형식을 기대하는 경우 사용
 */
export function formatDateTimeWithSeconds(dateTimeString: string): string {
  // 이미 초를 포함하고 있는지 확인
  if (dateTimeString.match(/T\d{2}:\d{2}:\d{2}/)) {
    // 밀리초 부분이 있으면 제거 (2025-05-13T10:00:00.000Z -> 2025-05-13T10:00:00)
    if (dateTimeString.includes(".")) {
      return dateTimeString.split(".")[0];
    }
    return dateTimeString;
  }

  // yyyy-MM-ddTHH:mm 형식인 경우 초 추가
  if (dateTimeString.match(/T\d{2}:\d{2}$/)) {
    return `${dateTimeString}:00`;
  }

  return dateTimeString;
}

/**
 * 일정 시간 포맷팅 (시간 선택 UI에 적합한 형식으로)
 */
export function formatScheduleTime(dateTime: string | Date): string {
  // Date 객체인 경우
  if (dateTime instanceof Date) {
    return dateTime.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm 형식으로 변환
  }

  // 이미 문자열인 경우
  if (typeof dateTime === "string") {
    // 시간대 정보 또는 초 정보가 있는 경우 잘라내기
    if (dateTime.includes("T")) {
      const parts = dateTime.split("T");
      const date = parts[0];
      const time = parts[1].substring(0, 5); // HH:mm 부분만 추출
      return `${date}T${time}`;
    }
  }

  return dateTime as string;
}

/**
 * ScheduleFormData를 백엔드 API에 맞게 변환하는 함수
 */
function prepareScheduleDataForApi(formData: ScheduleFormData) {
  return {
    ...formData,
    startTime: formatDateTimeWithSeconds(formData.startTime),
    endTime: formatDateTimeWithSeconds(formData.endTime),
    departmentId: formData.departmentId || null,
    postId: formData.postId || null,
  };
}

/**
 * 백엔드 응답을 프론트엔드 모델로 변환하는 함수
 */
function mapResponseToSchedule(r: ScheduleResponse): Schedule {
  return { ...r, startTime: r.startTime, endTime: r.endTime };
}

//공통 fetch 헬퍼: view(monthly/weekly/daily)
async function fetchSchedules(
  view: "monthly" | "weekly" | "daily",
  date: Date,
  scheduleType?: ScheduleType,
  departmentId?: number
): Promise<Schedule[]> {
  const params = new URLSearchParams();
  // 한국 로컬 타임존 기준 yyyy-MM-dd
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  params.append("date", `${yyyy}-${mm}-${dd}`);

  if (scheduleType != null) {
    params.append("type", scheduleType);
  }
  if (departmentId != null) {
    params.append("departmentId", String(departmentId));
  }

  // BASE만 쓰면 apiClient(baseURL=/api/v1) + "/schedule/..." → /api/v1/schedule/...
  const url = `${BASE}/${view}?${params.toString()}`;
  const resp = await apiClient<ScheduleResponse[]>(url);
  return resp.map(mapResponseToSchedule);
}

/**
 * 일정 생성
 */
export async function createSchedule(
  data: ScheduleFormData
): Promise<Schedule> {
  const preparedData = prepareScheduleDataForApi(data);
  const response = await apiClient<ScheduleResponse>("/api/v1/schedule", {
    method: "POST",
    body: JSON.stringify(preparedData),
  });
  return mapResponseToSchedule(response);
}

/**
 * 일정 수정
 */
export async function updateSchedule(
  id: number,
  data: ScheduleFormData
): Promise<Schedule> {
  const preparedData = prepareScheduleDataForApi(data);
  const response = await apiClient<ScheduleResponse>(`/api/v1/schedule/${id}`, {
    method: "PUT",
    body: JSON.stringify(preparedData),
  });
  return mapResponseToSchedule(response);
}

/**
 * 일정 삭제
 */
export async function deleteSchedule(id: number): Promise<void> {
  await apiClient(`/api/v1/schedule/${id}`, {
    method: "DELETE",
  });
}

/**
 * 일정 목록 조회 (페이징)
 */
export async function getSchedules(
  params: {
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
    scheduleType?: string;
  } = {}
): Promise<PagedResponse<Schedule>> {
  // URL 쿼리 파라미터 구성
  const queryParams = new URLSearchParams();
  if (params.startDate) queryParams.append("startDate", params.startDate);
  if (params.endDate) queryParams.append("endDate", params.endDate);
  if (params.page !== undefined)
    queryParams.append("page", params.page.toString());
  if (params.size) queryParams.append("size", params.size.toString());
  if (params.scheduleType)
    queryParams.append("scheduleType", params.scheduleType);
  const url = `/api/v1/schedule?${queryParams.toString()}`;
  const response = await apiClient<PagedResponse<ScheduleResponse>>(url);

  return {
    ...response,
    content: response.content.map(mapResponseToSchedule),
  };
}

/**
 * 모든 일정 조회 (페이징 없이)
 * 주로 캘린더 표시용
 */
export async function getAllSchedules(
  params: {
    startDate?: string;
    endDate?: string;
    scheduleType?: string;
  } = {}
): Promise<Schedule[]> {
  // URL 쿼리 파라미터 구성
  const queryParams = new URLSearchParams();
  if (params.startDate) queryParams.append("startDate", params.startDate);
  if (params.endDate) queryParams.append("endDate", params.endDate);
  if (params.scheduleType)
    queryParams.append("scheduleType", params.scheduleType);
  const url = `/api/v1/schedule/all?${queryParams.toString()}`;
  const response = await apiClient<Schedule[]>(url);

  return response;
}

/**
 * 특정 일정 조회
 */
export async function getScheduleById(id: number): Promise<Schedule> {
  const response = await apiClient<ScheduleResponse>(`/api/v1/schedule/${id}`);
  return mapResponseToSchedule(response);
}

/**
 * 부서 목록 조회
 */
export async function getDepartments(): Promise<DepartmentResponse[]> {
  const response = await apiClient<DepartmentResponse[]>("/api/v1/departments");
  return response;
}

/**
 * 일정 검색
 */
export async function searchSchedules(
  keyword: string,
  includeMemo: boolean = false
): Promise<Schedule[]> {
  const queryParams = new URLSearchParams();
  queryParams.append("keyword", keyword);
  queryParams.append("includeMemo", String(includeMemo));

  const url = `/api/v1/schedule/search?${queryParams.toString()}`;
  const response = await apiClient<ScheduleResponse[]>(url);

  return response.map(mapResponseToSchedule);
}

// --- 월간/주간/일간 조회 함수들 ---
export function getMonthlySchedules(
  date: Date,
  scheduleType?: ScheduleType,
  departmentId?: number
): Promise<Schedule[]> {
  return fetchSchedules("monthly", date, scheduleType, departmentId);
}

export function getWeeklyView(
  date: Date,
  scheduleType?: ScheduleType,
  departmentId?: number
): Promise<Schedule[]> {
  return fetchSchedules("weekly", date, scheduleType, departmentId);
}

export function getDailyView(
  date: Date,
  scheduleType?: ScheduleType,
  departmentId?: number
): Promise<Schedule[]> {
  return fetchSchedules("daily", date, scheduleType, departmentId);
}

// 이전 방식과의 호환성을 위한 객체도 export
export const scheduleService = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedules,
  getAllSchedules,
  getScheduleById,
  getDepartments,
  formatScheduleTime,
  searchSchedules,
  getMonthlySchedules,
  getWeeklyView,
  getDailyView,
};

// features/attendance/services/attendanceService.ts
import { apiClient } from "@/lib/api/apiClient";
import type {
  AttendanceRecord,
  AttendanceDetail,
  AttendancePageResponse,
  AttendanceMonthStats,
  AttendanceAdminRecord,
  WorkHoursChartPoint,
  OvertimeRequest,
} from "@/features/attendance/types/attendance";
import { AttendanceStatus } from "../types/attendanceCommonTypes";

const BASE_URL = "/attendances";

/**
 * 출근 처리
 */
export const checkIn = async (): Promise<AttendanceRecord> => {
  const data = await apiClient<AttendanceRecord>(`${BASE_URL}/check-in`, {
    method: "POST",
  });
  return data;
};

/**
 * 퇴근 처리
 */
export const checkOut = async (): Promise<AttendanceRecord> => {
  const data = await apiClient<AttendanceRecord>(`${BASE_URL}/check-out`, {
    method: "POST",
  });
  return data;
};

/**
 * 야근 보고
 */
export const reportOvertime = async (
  overtimeData: OvertimeRequest
): Promise<AttendanceDetail> => {
  const data = await apiClient<AttendanceDetail>(`${BASE_URL}/overtime`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(overtimeData),
  });
  return data;
};

/**
 * 일별 근태 조회 (특정 날짜)
 */
export const getDailyAttendance = async (
  date: string
): Promise<AttendanceDetail> => {
  const params = new URLSearchParams({ date });
  const fullUrl = `${BASE_URL}/daily?${params.toString()}`;
  const data = await apiClient<AttendanceDetail>(fullUrl);
  return data;
};

/**
 * 특정 근태 ID로 상세 조회
 */
export const getAttendanceById = async (
  attendanceId: number
): Promise<AttendanceDetail> => {
  const data = await apiClient<AttendanceDetail>(`${BASE_URL}/${attendanceId}`);
  return data;
};

/**
 * 최근 근태 기록 목록 조회 (페이지네이션)
 */
export const getRecentRecords = async (
  page: number = 1,
  size: number = 5
): Promise<AttendancePageResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  const fullUrl = `${BASE_URL}/recent?${params.toString()}`;
  const data = await apiClient<AttendancePageResponse>(fullUrl);
  return data;
};

/**
 * 근무 시간 차트 데이터 조회
 */
export const getChartData = async (
  startDate: string,
  endDate: string
): Promise<WorkHoursChartPoint[]> => {
  const params = new URLSearchParams({
    startDate,
    endDate,
  });
  const fullUrl = `${BASE_URL}/chart?${params.toString()}`;
  const data = await apiClient<WorkHoursChartPoint[]>(fullUrl);
  return data;
};

/**
 * 월간 근태 통계 조회
 */
export const getMonthlyStatistics = async (
  yearMonth: string // 'YYYY-MM' 형식
): Promise<AttendanceMonthStats> => {
  const params = new URLSearchParams({ ym: yearMonth });
  const fullUrl = `${BASE_URL}/monthly-status?${params.toString()}`;
  const data = await apiClient<AttendanceMonthStats>(fullUrl);
  return data;
};

/**
 * 사용자별 근태 조회 (일반 사용자용 - 본인 부서 내)
 */
export const getAllAttendanceRecords = async (
  yearMonth: string,
  keyword?: string,
  status?: AttendanceStatus,
  page: number = 1,
  size: number = 15
): Promise<{
  content: AttendanceAdminRecord[];
  totalPages: number;
}> => {
  const params = new URLSearchParams();
  params.append("yearMonth", yearMonth);
  params.append("page", page.toString());
  params.append("size", size.toString());
  if (keyword) params.append("keyword", keyword);
  if (status) params.append("status", status);

  const fullUrl = `${BASE_URL}/all?${params.toString()}`;
  const data = await apiClient<{
    content: AttendanceAdminRecord[];
    totalPages: number;
  }>(fullUrl);
  return data;
};

// ================== 관리자 전용 함수 ==================

/**
 * 관리자용 모든 사용자 근태 조회
 */
export const getAllAttendanceRecordsForAdmin = async (
  yearMonth: string,
  departmentId?: number,
  userId?: number,
  keyword?: string,
  status?: AttendanceStatus,
  page: number = 1,
  size: number = 15
): Promise<AttendanceAdminRecord[]> => {
  const params = new URLSearchParams();
  params.append("yearMonth", yearMonth);
  params.append("page", page.toString());
  params.append("size", size.toString());
  if (departmentId !== undefined)
    params.append("departmentId", departmentId.toString());
  if (userId !== undefined) params.append("userId", userId.toString());
  if (keyword) params.append("keyword", keyword);
  if (status) params.append("status", status);

  const fullUrl = `${BASE_URL}/admin/all?${params.toString()}`;
  const data = await apiClient<AttendanceAdminRecord[]>(fullUrl);
  return data;
};

/**
 * 관리자용 개별 근태 상세 조회
 */
export const getAttendanceRecordByAdmin = async (
  attendanceId: number
): Promise<AttendanceDetail> => {
  const data = await apiClient<AttendanceDetail>(
    `${BASE_URL}/admin/${attendanceId}`
  );
  return data;
};

/**
 * 관리자용 개별 근태 수정
 */
export const updateAttendanceByAdmin = async (
  attendanceId: number,
  attendanceData: AttendanceDetail
): Promise<AttendanceDetail> => {
  const data = await apiClient<AttendanceDetail>(
    `${BASE_URL}/admin/${attendanceId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendanceData),
    }
  );
  return data;
};

/**
 * 관리자용 엑셀 다운로드 URL 생성 (이 함수는 URL을 반환하고, 실제 다운로드는 프론트에서 처리)
 */
export const getExcelDownloadUrl = (
  startDate: string,
  endDate: string,
  departmentId?: number,
  userId?: number,
  keyword?: string,
  status?: AttendanceStatus
): string => {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  if (departmentId !== undefined)
    params.append("departmentId", departmentId.toString());
  if (userId !== undefined) params.append("userId", userId.toString());
  if (keyword) params.append("keyword", keyword);
  if (status) params.append("status", status);

  return `${BASE_URL}/admin/exel-download?${params.toString()}`;
};

/**
 * Electron 환경을 위한 엑셀 다운로드 함수 (ArrayBuffer)
 */
export const downloadExcel = async (
  startDate: string,
  endDate: string,
  departmentId?: number,
  userId?: number,
  keyword?: string,
  status?: AttendanceStatus
): Promise<ArrayBuffer> => {
  // fetch를 직접 사용하여 arrayBuffer 형태로 받습니다.
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  if (departmentId !== undefined)
    params.append("departmentId", departmentId.toString());
  if (userId !== undefined) params.append("userId", userId.toString());
  if (keyword) params.append("keyword", keyword);
  if (status) params.append("status", status);

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }${BASE_URL}/admin/exel-download?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`엑셀 다운로드 실패: ${response.statusText}`);
  }

  return response.arrayBuffer();
};

export default {
  checkIn,
  checkOut,
  reportOvertime,
  getDailyAttendance,
  getAttendanceById,
  getRecentRecords,
  getChartData,
  getMonthlyStatistics,
  getAllAttendanceRecords,
  getAllAttendanceRecordsForAdmin,
  getAttendanceRecordByAdmin,
  updateAttendanceByAdmin,
  getExcelDownloadUrl,
  downloadExcel,
};

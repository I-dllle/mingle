// features/attendance/services/attendanceService.ts
import apiClient from "@/lib/api/apiClient";
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

// 근태 관련 API 서비스
const BASE_URL = "/attendances";

// 출근 처리
export const checkIn = async (): Promise<AttendanceRecord> => {
  const response = await apiClient.post<AttendanceRecord>(
    `${BASE_URL}/check-in`
  );
  return response.data;
};

// 퇴근 처리
export const checkOut = async (): Promise<AttendanceRecord> => {
  const response = await apiClient.post<AttendanceRecord>(
    `${BASE_URL}/check-out`
  );
  return response.data;
};

// 야근 보고
export const reportOvertime = async (
  overtimeData: OvertimeRequest
): Promise<AttendanceDetail> => {
  const response = await apiClient.post<AttendanceDetail>(
    `${BASE_URL}/overtime`,
    overtimeData
  );
  return response.data;
};

// 일별 근태 조회 (특정 날짜)
export const getDailyAttendance = async (
  date: string
): Promise<AttendanceDetail> => {
  const response = await apiClient.get<AttendanceDetail>(`${BASE_URL}/daily`, {
    params: { date },
  });
  return response.data;
};

// 최근 근태 기록 목록 조회 (페이지네이션)
export const getRecentRecords = async (
  page: number = 1,
  size: number = 5
): Promise<AttendancePageResponse> => {
  const response = await apiClient.get<AttendancePageResponse>(
    `${BASE_URL}/recent`,
    {
      params: { page, size },
    }
  );
  return response.data;
};

// 근무 시간 차트 데이터 조회
export const getChartData = async (
  startDate: string,
  endDate: string
): Promise<WorkHoursChartPoint[]> => {
  const response = await apiClient.get<WorkHoursChartPoint[]>(
    `${BASE_URL}/chart`,
    {
      params: { startDate, endDate },
    }
  );
  return response.data;
};

// 월간 근태 통계 조회
export const getMonthlyStatistics = async (
  yearMonth: string // 'YYYY-MM' 형식
): Promise<AttendanceMonthStats> => {
  const response = await apiClient.get<AttendanceMonthStats>(
    `${BASE_URL}/monthly-status`,
    {
      params: { ym: yearMonth },
    }
  );
  return response.data;
};

// 사용자별 근태 조회 (일반 사용자용 - 본인 부서 내)
export const getAllAttendanceRecords = async (
  yearMonth: string,
  keyword?: string,
  status?: AttendanceStatus,
  page: number = 1,
  size: number = 15
): Promise<AttendanceAdminRecord[]> => {
  const response = await apiClient.get<AttendanceAdminRecord[]>(
    `${BASE_URL}/all`,
    {
      params: {
        yearMonth,
        keyword,
        status,
        page,
        size,
      },
    }
  );
  return response.data;
};

// ================== 관리자 전용 함수 ==================

// 관리자용 모든 사용자 근태 조회
export const getAllAttendanceRecordsForAdmin = async (
  yearMonth: string,
  departmentId?: number,
  userId?: number,
  keyword?: string,
  status?: AttendanceStatus,
  page: number = 1,
  size: number = 15
) => {
  const response = await apiClient.get<AttendanceAdminRecord[]>(
    `${BASE_URL}/admin/all`,
    {
      params: {
        yearMonth,
        departmentId,
        userId,
        keyword,
        status,
        page,
        size,
      },
    }
  );
  return response.data;
};

// 관리자용 개별 근태 상세 조회
export const getAttendanceRecordByAdmin = async (
  attendanceId: number
): Promise<AttendanceDetail> => {
  const response = await apiClient.get<AttendanceDetail>(
    `${BASE_URL}/admin/${attendanceId}`
  );
  return response.data;
};

// 관리자용 개별 근태 수정
export const updateAttendanceByAdmin = async (
  attendanceId: number,
  data: AttendanceDetail
): Promise<AttendanceDetail> => {
  const response = await apiClient.put<AttendanceDetail>(
    `${BASE_URL}/admin/${attendanceId}`,
    data
  );
  return response.data;
};

// 관리자용 엑셀 다운로드 URL 생성 (이 함수는 URL을 반환하고, 실제 다운로드는 프론트에서 처리)
export const getExcelDownloadUrl = (
  startDate: string,
  endDate: string,
  departmentId?: number,
  userId?: number,
  keyword?: string,
  status?: AttendanceStatus
): string => {
  // URL 파라미터 구성
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);

  if (departmentId) params.append("departmentId", departmentId.toString());
  if (userId) params.append("userId", userId.toString());
  if (keyword) params.append("keyword", keyword);
  if (status) params.append("status", status);

  return `${BASE_URL}/admin/exel-download?${params.toString()}`;
};

// Electron 환경을 위한 엑셀 다운로드 함수
export const downloadExcel = async (
  startDate: string,
  endDate: string,
  departmentId?: number,
  userId?: number,
  keyword?: string,
  status?: AttendanceStatus
): Promise<ArrayBuffer> => {
  // Electron 환경에서는 blob으로 직접 다운로드
  const response = await apiClient.get<ArrayBuffer>(
    `${BASE_URL}/admin/exel-download`,
    {
      params: {
        startDate,
        endDate,
        departmentId,
        userId,
        keyword,
        status,
      },
      responseType: "arraybuffer",
    }
  );

  return response.data;
};

export default {
  checkIn,
  checkOut,
  reportOvertime,
  getDailyAttendance,
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

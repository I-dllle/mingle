// features/attendance/services/attendanceRequestService.ts
import apiClient from "@/lib/api/apiClient";
import type {
  AttendanceRequest,
  AttendanceRequestDetail,
  ApprovalAction,
} from "../types/attendanceRequest";
import { ApprovalStatus } from "../types/attendanceCommonTypes";

const BASE_URL = "/attendance-requests";

// ============================== 일반 사용자용 API ==============================

// 휴가/출장 등 요청 생성
export const submitRequest = async (
  requestData: AttendanceRequest
): Promise<AttendanceRequestDetail> => {
  const response = await apiClient.post<AttendanceRequestDetail>(
    BASE_URL,
    requestData
  );
  return response.data;
};

// 요청 생성 (FormData 처리)
export const createRequest = async (
  formData: FormData
): Promise<AttendanceRequestDetail> => {
  const response = await apiClient.post<AttendanceRequestDetail>(
    BASE_URL,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// 단일 요청 상세 조회
export const getRequestById = async (
  requestId: number
): Promise<AttendanceRequestDetail> => {
  const response = await apiClient.get<AttendanceRequestDetail>(
    `${BASE_URL}/${requestId}`
  );
  return response.data;
};

// 사용자 본인 요청 목록 조회
export const getUserRequests = async (
  status: ApprovalStatus = "PENDING",
  yearMonth?: string, // 'YYYY-MM' 형식
  page: number = 1,
  size: number = 15
) => {
  const params: Record<string, any> = {
    status,
    page,
    size,
  };

  if (yearMonth) {
    params.yearMonth = yearMonth;
  }

  const response = await apiClient.get(`${BASE_URL}`, { params });
  return response.data;
};

// 요청 수정
export const updateRequest = async (
  requestId: number,
  requestData: AttendanceRequest | FormData
): Promise<AttendanceRequestDetail> => {
  const isFormData = requestData instanceof FormData;

  const config = isFormData
    ? {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    : {};

  const response = await apiClient.put<AttendanceRequestDetail>(
    `${BASE_URL}/${requestId}`,
    requestData,
    config
  );
  return response.data;
};

// 요청 삭제
export const deleteRequest = async (requestId: number): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${requestId}`);
};

// ============================== 관리자용 API ==============================

// 관리자용 단일 요청 상세 조회
export const getRequestByIdForAdmin = async (
  requestId: number
): Promise<AttendanceRequestDetail> => {
  const response = await apiClient.get<AttendanceRequestDetail>(
    `${BASE_URL}/admin/${requestId}`
  );
  return response.data;
};

// 관리자용 전체 출결 요청 목록 조회
export const getAllRequests = async (
  status: ApprovalStatus = "PENDING",
  yearMonth?: string,
  page: number = 1,
  size: number = 15
) => {
  const params: Record<string, any> = {
    status,
    page,
    size,
  };

  if (yearMonth) {
    params.yearMonth = yearMonth;
  }

  const response = await apiClient.get(`${BASE_URL}/admin`, { params });
  return response.data;
};

// 관리자용 요청 승인
export const approveRequest = async (
  requestId: number,
  comment: string = ""
): Promise<AttendanceRequestDetail> => {
  const response = await apiClient.post<AttendanceRequestDetail>(
    `${BASE_URL}/admin/${requestId}/approve`,
    { comment }
  );
  return response.data;
};

// 관리자용 요청 반려
export const rejectRequest = async (
  requestId: number,
  comment: string
): Promise<AttendanceRequestDetail> => {
  // 반려 시에는 반드시 사유를 입력해야 함
  if (!comment || comment.trim() === "") {
    throw new Error("반려 사유를 입력해주세요");
  }

  const response = await apiClient.post<AttendanceRequestDetail>(
    `${BASE_URL}/admin/${requestId}/reject`,
    { comment }
  );
  return response.data;
};

// 관리자용 요청 상태 변경
export const changeRequestStatus = async (
  requestId: number,
  approvalStatus: ApprovalStatus,
  comment: string = ""
): Promise<AttendanceRequestDetail> => {
  const actionData: ApprovalAction = {
    approvalStatus,
    comment,
  };

  const response = await apiClient.patch<AttendanceRequestDetail>(
    `${BASE_URL}/admin/${requestId}/status`,
    actionData
  );
  return response.data;
};

// 확장성을 위해 Electron 환경에서도 API 호출 방식 통일
export const isElectron = (): boolean => {
  return process.env.NEXT_PUBLIC_ENV === "electron";
};

export default {
  // 일반 사용자용 API
  submitRequest,
  createRequest,
  getRequestById,
  getUserRequests,
  updateRequest,
  deleteRequest,

  // 관리자용 API
  getRequestByIdForAdmin,
  getAllRequests,
  approveRequest,
  rejectRequest,
  changeRequestStatus,

  // 유틸리티
  isElectron,
};

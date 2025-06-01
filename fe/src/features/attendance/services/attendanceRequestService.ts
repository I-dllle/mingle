// features/attendance/services/attendanceRequestService.ts
import { apiClient } from "@/lib/api/apiClient";
import type {
  AttendanceRequest,
  AttendanceRequestDetail,
  ApprovalAction,
} from "../types/attendanceRequest";
import { ApprovalStatus } from "../types/attendanceCommonTypes";

const BASE_URL = "/attendance-requests";

// ============================== 일반 사용자용 API ==============================

/**
 * 휴가/출장 등 요청 생성 (JSON)
 */
export const submitRequest = async (
  requestData: AttendanceRequest
): Promise<AttendanceRequestDetail> => {
  // POST 요청 시 JSON.stringify
  const data = await apiClient<AttendanceRequestDetail>(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });
  return data;
};

/**
 * 요청 생성 (FormData 처리)
 */
export const createRequest = async (
  formData: FormData
): Promise<AttendanceRequestDetail> => {
  // Content-Type을 multipart/form-data 로 지정하지 않으면 fetch가 자동으로
  // 올바른 boundary까지 함께 설정해 줍니다. 따라서 headers 생략해도 무방합니다.
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${BASE_URL}`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`요청 생성 실패: ${response.statusText}`);
  }
  return response.json();
};

/**
 * 단일 요청 상세 조회
 */
export const getRequestById = async (
  requestId: number
): Promise<AttendanceRequestDetail> => {
  const data = await apiClient<AttendanceRequestDetail>(
    `${BASE_URL}/${requestId}`
  );
  return data;
};

/**
 * 사용자 본인 요청 목록 조회 (페이지네이션, 쿼리스트링)
 */
export const getUserRequests = async (
  status: ApprovalStatus = "PENDING",
  yearMonth?: string,
  page: number = 1,
  size: number = 15
): Promise<{
  content: AttendanceRequestDetail[];
  totalPages: number;
}> => {
  const params = new URLSearchParams({
    status,
    page: page.toString(),
    size: size.toString(),
  });
  if (yearMonth) {
    params.append("yearMonth", yearMonth);
  }

  const fullUrl = `${BASE_URL}?${params.toString()}`;
  const data = await apiClient<{
    content: AttendanceRequestDetail[];
    totalPages: number;
  }>(fullUrl);
  return data;
};

/**
 * 요청 수정 (JSON 또는 FormData)
 */
export const updateRequest = async (
  requestId: number,
  requestData: AttendanceRequest | FormData
): Promise<AttendanceRequestDetail> => {
  // FormData 인스턴스인지 확인
  if (requestData instanceof FormData) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${BASE_URL}/${requestId}`,
      {
        method: "PUT",
        credentials: "include",
        body: requestData,
      }
    );
    if (!response.ok) {
      throw new Error(`요청 수정 실패: ${response.statusText}`);
    }
    return response.json();
  } else {
    // 일반 JSON 객체
    const data = await apiClient<AttendanceRequestDetail>(
      `${BASE_URL}/${requestId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      }
    );
    return data;
  }
};

/**
 * 요청 삭제
 */
export const deleteRequest = async (requestId: number): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${BASE_URL}/${requestId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error(`요청 삭제 실패: ${response.statusText}`);
  }
};

// ============================== 관리자용 API ==============================

/**
 * 관리자용 단일 요청 상세 조회
 */
export const getRequestByIdForAdmin = async (
  requestId: number
): Promise<AttendanceRequestDetail> => {
  const data = await apiClient<AttendanceRequestDetail>(
    `${BASE_URL}/admin/${requestId}`
  );
  return data;
};

/**
 * 관리자용 전체 출결 요청 목록 조회
 */
export const getAllRequests = async (
  status: ApprovalStatus = "PENDING",
  yearMonth?: string,
  page: number = 1,
  size: number = 15
): Promise<{
  content: AttendanceRequestDetail[];
  totalPages: number;
}> => {
  const params = new URLSearchParams({
    status,
    page: page.toString(),
    size: size.toString(),
  });
  if (yearMonth) {
    params.append("yearMonth", yearMonth);
  }

  const fullUrl = `${BASE_URL}/admin?${params.toString()}`;
  const data = await apiClient<{
    content: AttendanceRequestDetail[];
    totalPages: number;
  }>(fullUrl);
  return data;
};

/**
 * 관리자용 요청 승인
 */
export const approveRequest = async (
  requestId: number,
  comment: string = ""
): Promise<AttendanceRequestDetail> => {
  const data = await apiClient<AttendanceRequestDetail>(
    `${BASE_URL}/admin/${requestId}/approve`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    }
  );
  return data;
};

/**
 * 관리자용 요청 반려
 */
export const rejectRequest = async (
  requestId: number,
  comment: string
): Promise<AttendanceRequestDetail> => {
  if (!comment || comment.trim() === "") {
    throw new Error("반려 사유를 입력해주세요");
  }
  const data = await apiClient<AttendanceRequestDetail>(
    `${BASE_URL}/admin/${requestId}/reject`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    }
  );
  return data;
};

/**
 * 관리자용 요청 상태 변경 (PATCH)
 */
export const changeRequestStatus = async (
  requestId: number,
  approvalStatus: ApprovalStatus,
  comment: string = ""
): Promise<AttendanceRequestDetail> => {
  const actionData: ApprovalAction = {
    approvalStatus,
    comment,
  };
  const data = await apiClient<AttendanceRequestDetail>(
    `${BASE_URL}/admin/${requestId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actionData),
    }
  );
  return data;
};

/**
 * 확장성을 위해 Electron 환경에서도 API 호출 방식 통일
 */
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

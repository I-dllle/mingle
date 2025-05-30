import { apiClient } from "@/lib/api/apiClient";
import {
  ContractCategory,
  ContractStatus,
  CreateContractRequest,
  CreateInternalContractRequest,
  UpdateContractRequest,
  ChangeStatusRequest,
  OfflineSignRequest,
  ContractSimpleDto,
  ContractDetailDto,
  ContractResponse,
  ContractSearchCondition,
  UserSearchDto,
} from "../types/Contract";

const API_BASE_URL = "/legal";

// 계약서 생성 (외부 계약)
export const createContract = async (
  request: CreateContractRequest,
  file: File
): Promise<number> => {
  console.log("createContract - 요청 데이터:", request);
  console.log("createContract - teamId 상세:", {
    teamId: request.teamId,
    teamIdType: typeof request.teamId,
    isNull: request.teamId === null,
    isUndefined: request.teamId === undefined,
  });

  // teamId가 null이거나 undefined인 경우 요청에서 제외
  const cleanedRequest: Partial<CreateContractRequest> = { ...request };
  if (cleanedRequest.teamId === null || cleanedRequest.teamId === undefined) {
    delete cleanedRequest.teamId;
    console.log("teamId가 null 또는 undefined이므로 요청에서 제외합니다.");
  }

  console.log("정리된 요청 데이터:", cleanedRequest);

  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(cleanedRequest)], { type: "application/json" })
  );
  formData.append("file", file);

  // FormData에 추가된 request 내용 확인
  const requestBlob = formData.get("request") as Blob;
  const requestText = await requestBlob.text();
  console.log("FormData에 추가된 request JSON:", requestText);

  // multipart/form-data를 위해 직접 fetch 사용
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/contracts`;

  const res = await fetch(fullUrl, {
    method: "POST",
    body: formData,
    credentials: "include",
    cache: "no-store",
    // Content-Type 헤더를 설정하지 않음 (브라우저가 자동으로 multipart/form-data 설정)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[API Error] ${res.status}: ${errorText}`);
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  return res.json();
};

// 내부 계약 생성
export const createInternalContract = async (
  request: CreateInternalContractRequest,
  file: File
): Promise<number> => {
  console.log("Creating internal contract:", request);
  console.log("API URL:", `${API_BASE_URL}/internal/contracts`);

  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  );
  formData.append("file", file);

  // multipart/form-data를 위해 직접 fetch 사용
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/internal/contracts`;

  const res = await fetch(fullUrl, {
    method: "POST",
    body: formData,
    credentials: "include",
    cache: "no-store",
    // Content-Type 헤더를 설정하지 않음 (브라우저가 자동으로 multipart/form-data 설정)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[API Error] ${res.status}: ${errorText}`);
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  return res.json();
};

// 계약서 상태 변경
export const changeContractStatus = async (
  id: number,
  request: ChangeStatusRequest,
  category: ContractCategory
): Promise<void> => {
  // JSON이 아닌 텍스트 응답을 처리하기 위해 직접 fetch 사용
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/${id}/status?category=${category}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[API Error] ${res.status}: ${errorText}`);
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 JSON인지 텍스트인지 확인하여 적절히 처리
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      await res.json();
    } catch (error) {
      console.warn("JSON 파싱 실패, 텍스트로 처리:", error);
      await res.text();
    }
  } else {
    // JSON이 아닌 경우 텍스트로 처리
    const textResponse = await res.text();
    console.log("서버 응답 (텍스트):", textResponse);
  }
};

// 오프라인 서명 처리 (외부 계약자용)
export const signOfflineAsAdmin = async (
  id: number,
  request: OfflineSignRequest
): Promise<void> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/${id}/sign-offline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[API Error] ${res.status}: ${errorText}`);
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 JSON인지 텍스트인지 확인하여 적절히 처리
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      await res.json();
    } catch (error) {
      console.warn("JSON 파싱 실패, 텍스트로 처리:", error);
      await res.text();
    }
  } else {
    // JSON이 아닌 경우 텍스트로 처리
    const textResponse = await res.text();
    console.log("서버 응답 (텍스트):", textResponse);
  }
};

// 계약서 전자 서명 요청 생성 (대리)
export const signOnBehalf = async (
  id: number,
  userId: number
): Promise<string> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/${id}/sign?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[API Error] ${res.status}: ${errorText}`);
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 JSON인지 텍스트인지 확인하여 적절히 처리
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch (error) {
      console.warn("JSON 파싱 실패, 텍스트로 처리:", error);
      return await res.text();
    }
  } else {
    // JSON이 아닌 경우 텍스트로 처리
    return await res.text();
  }
};

// 특정 유저 계약서 리스트 조회
export const getContractsByUser = async (
  userId: number,
  category: ContractCategory,
  page: number = 0,
  size: number = 10
): Promise<ContractSimpleDto[]> => {
  const params = new URLSearchParams({
    userId: userId.toString(),
    category: category,
    page: page.toString(),
    size: size.toString(),
  });

  return await apiClient<ContractSimpleDto[]>(
    `${API_BASE_URL}/by-user?${params}`,
    {
      method: "GET",
    }
  );
};

// 계약 상세 조회
export const getContractDetail = async (
  id: number,
  category: ContractCategory
): Promise<ContractDetailDto> => {
  const params = new URLSearchParams({
    category: category,
  });

  return await apiClient<ContractDetailDto>(`${API_BASE_URL}/${id}?${params}`, {
    method: "GET",
  });
};

// 모든 계약서 리스트 조회 (페이징 포함)
export const getAllContracts = async (
  category: ContractCategory,
  page: number = 0,
  size: number = 10
): Promise<{
  content: ContractSimpleDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}> => {
  const params = new URLSearchParams({
    category: category,
    page: page.toString(),
    size: size.toString(),
  });

  return await apiClient<{
    content: ContractSimpleDto[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  }>(`${API_BASE_URL}?${params}`, {
    method: "GET",
  });
};

// 계약서 최종 확정
export const confirmContract = async (
  id: number,
  category: ContractCategory
): Promise<void> => {
  const params = new URLSearchParams({
    category: category,
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/${id}/confirm?${params}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[API Error] ${res.status}: ${errorText}`);
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 JSON인지 텍스트인지 확인하여 적절히 처리
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      await res.json();
    } catch (error) {
      console.warn("JSON 파싱 실패, 텍스트로 처리:", error);
      await res.text();
    }
  } else {
    // JSON이 아닌 경우 텍스트로 처리
    const textResponse = await res.text();
    console.log("서버 응답 (텍스트):", textResponse);
  }
};

// 계약서 파일 URL 조회
export const getContractFileUrl = async (
  id: number,
  category: ContractCategory
): Promise<string> => {
  const params = new URLSearchParams({
    category: category,
  });

  return await apiClient<string>(`${API_BASE_URL}/${id}/file-url?${params}`, {
    method: "GET",
  });
};

// 만료 예정 계약 조회
export const getExpiringContracts = async (
  category: ContractCategory
): Promise<ContractResponse[]> => {
  const params = new URLSearchParams({
    category: category,
  });

  return await apiClient<ContractResponse[]>(
    `${API_BASE_URL}/expiring?${params}`,
    {
      method: "GET",
    }
  );
};

// 계약서 수정
export const updateContract = async (
  contractId: number,
  request: UpdateContractRequest,
  file?: File
): Promise<number> => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  );

  if (file) {
    formData.append("file", file);
  }

  // multipart/form-data를 위해 직접 fetch 사용
  const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/${contractId}`;

  const res = await fetch(fullUrl, {
    method: "PUT",
    body: formData,
    credentials: "include",
    cache: "no-store",
    // Content-Type 헤더를 설정하지 않음 (브라우저가 자동으로 multipart/form-data 설정)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[API Error] ${res.status}: ${errorText}`);
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  return res.json();
};

// 계약서 삭제
export const deleteContract = async (
  contractId: number,
  category: ContractCategory
): Promise<void> => {
  const params = new URLSearchParams({
    category: category,
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/${contractId}?${params}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[API Error] ${res.status}: ${errorText}`);
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 JSON인지 텍스트인지 확인하여 적절히 처리
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      await res.json();
    } catch (error) {
      console.warn("JSON 파싱 실패, 텍스트로 처리:", error);
      await res.text();
    }
  } else {
    // JSON이 아닌 경우 텍스트로 처리
    const textResponse = await res.text();
    console.log("서버 응답 (텍스트):", textResponse);
  }
};

// 계약서 필터링 조회 (GET 방식)
export const getFilteredContracts = async (
  condition: ContractSearchCondition,
  page: number = 0,
  size: number = 10,
  sort: string = "createdAt",
  direction: string = "desc"
): Promise<{
  content: ContractResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: `${sort},${direction}`,
  });
  // 검색 조건이 있는 경우만 파라미터에 추가
  if (condition.teamId) params.append("teamId", condition.teamId.toString());
  if (condition.status) params.append("status", condition.status);
  if (condition.contractType)
    params.append("contractType", condition.contractType);
  if (condition.contractCategory)
    params.append("contractCategory", condition.contractCategory);
  if (condition.startDateFrom)
    params.append("startDateFrom", condition.startDateFrom);
  if (condition.startDateTo)
    params.append("startDateTo", condition.startDateTo);
  if (condition.participantUserId)
    params.append("participantUserId", condition.participantUserId.toString());

  return await apiClient<{
    content: ContractResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  }>(`${API_BASE_URL}/filtered?${params}`, {
    method: "GET",
  });
};

// 사용자 이름으로 검색
export const searchUsers = async (name: string): Promise<UserSearchDto[]> => {
  try {
    const params = new URLSearchParams({
      name: name,
    });
    return await apiClient<UserSearchDto[]>(
      `${API_BASE_URL}/search?${params}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("사용자 검색 API 호출 실패:", error);
    throw error;
  }
};

// 계약서 서비스 객체
export const contractService = {
  createContract,
  createInternalContract,
  changeContractStatus,
  signOfflineAsAdmin,
  signOnBehalf,
  getContractsByUser,
  getContractDetail,
  getAllContracts,
  confirmContract,
  getContractFileUrl,
  getExpiringContracts,
  updateContract,
  deleteContract,
  getFilteredContracts,
  searchUsers,
};

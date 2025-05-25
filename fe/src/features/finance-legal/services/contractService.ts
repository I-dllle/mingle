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
} from "../types/Contract";

const API_BASE_URL = "http://localhost:8080/api/v1/legal";

// 계약서 생성 (외부 계약)
export const createContract = async (
  request: CreateContractRequest,
  file: File
): Promise<number> => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  );
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/contracts`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("계약서 생성에 실패했습니다.");
  }

  return await response.json();
};

// 내부 계약 생성
export const createInternalContract = async (
  request: CreateInternalContractRequest,
  file: File
): Promise<number> => {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" })
  );
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/internal-contracts`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("내부 계약 생성에 실패했습니다.");
  }

  return await response.json();
};

// 계약서 상태 변경
export const changeContractStatus = async (
  id: number,
  request: ChangeStatusRequest,
  category: ContractCategory
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/${id}/status?category=${category}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error("계약서 상태 변경에 실패했습니다.");
  }
};

// 오프라인 서명 처리 (외부 계약자용)
export const signOfflineAsAdmin = async (
  id: number,
  request: OfflineSignRequest
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}/sign-offline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("오프라인 서명 처리에 실패했습니다.");
  }
};

// 계약서 전자 서명 요청 생성 (대리)
export const signOnBehalf = async (
  id: number,
  userId: number
): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/${id}/sign?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("전자 서명 요청 생성에 실패했습니다.");
  }

  return await response.text();
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

  const response = await fetch(`${API_BASE_URL}/by-user?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("사용자 계약서 목록 조회에 실패했습니다.");
  }

  return await response.json();
};

// 계약 상세 조회
export const getContractDetail = async (
  id: number,
  category: ContractCategory
): Promise<ContractDetailDto> => {
  const params = new URLSearchParams({
    category: category,
  });

  const response = await fetch(`${API_BASE_URL}/${id}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("계약서 상세 조회에 실패했습니다.");
  }

  return await response.json();
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

  const response = await fetch(`${API_BASE_URL}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("계약서 목록 조회에 실패했습니다.");
  }

  return await response.json();
};

// 계약서 최종 확정
export const confirmContract = async (
  id: number,
  category: ContractCategory
): Promise<void> => {
  const params = new URLSearchParams({
    category: category,
  });

  const response = await fetch(`${API_BASE_URL}/${id}/confirm?${params}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("계약서 확정에 실패했습니다.");
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

  const response = await fetch(`${API_BASE_URL}/${id}/file-url?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("계약서 파일 URL 조회에 실패했습니다.");
  }

  return await response.text();
};

// 만료 예정 계약 조회
export const getExpiringContracts = async (
  category: ContractCategory
): Promise<ContractResponse[]> => {
  const params = new URLSearchParams({
    category: category,
  });

  const response = await fetch(`${API_BASE_URL}/expiring?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("만료 예정 계약 조회에 실패했습니다.");
  }

  return await response.json();
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

  const response = await fetch(`${API_BASE_URL}/${contractId}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("계약서 수정에 실패했습니다.");
  }

  return await response.json();
};

// 계약서 삭제
export const deleteContract = async (
  contractId: number,
  category: ContractCategory
): Promise<void> => {
  const params = new URLSearchParams({
    category: category,
  });

  const response = await fetch(`${API_BASE_URL}/${contractId}?${params}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("계약서 삭제에 실패했습니다.");
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
};

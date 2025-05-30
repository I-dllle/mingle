import { apiClient } from "@/lib/api/apiClient";
import {
  ArtistRevenueDto,
  SettlementCreateRequest,
  SettlementDetailResponse,
  SettlementDto,
  SettlementSummaryDto,
  UpdateSettlementRequest,
  ChangeSettlementStatusRequest,
  RecentSettlementDto,
} from "../types/Settlement";

// 정산 생성 (확정된 계약 기준) - 계약 ID만 필요
const createSettlementForContract = async (
  contractId: number
): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance/contracts/${contractId}/settlements`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 JSON이 아닐 수 있으므로 text()로 처리
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    await res.json();
  } else {
    await res.text();
  }
};

// 특정 계약의 정산 목록 조회
const getSettlementsByContract = async (
  contractId: number
): Promise<SettlementDto[]> => {
  return await apiClient<SettlementDto[]>(
    `/finance/contracts/${contractId}/settlementList`,
    { method: "GET" }
  );
};

// 정산 수정
const updateSettlement = async (
  settlementId: number,
  request: UpdateSettlementRequest
): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance/${settlementId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify(request),
    }
  );

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 JSON이 아닐 수 있으므로 text()로 처리
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    await res.json();
  } else {
    await res.text();
  }
};

// 정산 삭제
const deleteSettlement = async (settlementId: number): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance/${settlementId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 JSON이 아닐 수 있으므로 text()로 처리
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    await res.json();
  } else {
    await res.text();
  }
};

// 정산 상태 변경
const changeSettlementStatus = async (
  settlementId: number,
  request: ChangeSettlementStatusRequest
): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/finance/${settlementId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify(request),
    }
  );

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 JSON이 아닐 수 있으므로 text()로 처리
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    await res.json();
  } else {
    await res.text();
  }
};

// 정산 통계 요약
const getSettlementSummary = async (): Promise<SettlementSummaryDto> => {
  return await apiClient<SettlementSummaryDto>("/finance/summary", {
    method: "GET",
  });
};

// 전체 또는 기간별 총 수익 조회
const getTotalRevenue = async (
  startDate?: string,
  endDate?: string
): Promise<number> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  return await apiClient<number>(
    `/finance/total-revenue?${params.toString()}`,
    { method: "GET" }
  );
};

// 특정 유저의 총 수익 조회
const getTotalRevenueByUser = async (userId: number): Promise<number> => {
  return await apiClient<number>(`/finance/users/${userId}/total-revenue`, {
    method: "GET",
  });
};

// 회사의 순수익 조회
const getAgencyNetRevenue = async (
  startDate?: string,
  endDate?: string
): Promise<number> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  return await apiClient<number>(`/finance/net-agency?${params.toString()}`, {
    method: "GET",
  });
};

// 월별 수익 요약 통계
const getMonthlyRevenueSummary = async (): Promise<Record<string, number>> => {
  return await apiClient<Record<string, number>>("/finance/monthly-summary", {
    method: "GET",
  });
};

// 수익 상위 아티스트 리스트
const getTopArtists = async (
  limit: number = 10
): Promise<ArtistRevenueDto[]> => {
  return await apiClient<ArtistRevenueDto[]>(
    `/finance/top-artists?limit=${limit}`,
    { method: "GET" }
  );
};

// RatioType별 총 수익 분배 요약
const getRevenueByRatioType = async (): Promise<Record<string, number>> => {
  return await apiClient<Record<string, number>>("/finance/ratio-summary", {
    method: "GET",
  });
};

// 특정 계약서 기준 수익 조회
const getRevenueByContract = async (contractId: number): Promise<number> => {
  return await apiClient<number>(`/finance/contracts/${contractId}/revenue`, {
    method: "GET",
  });
};

// 계약서 기준 정산 상세 내역 조회
const getSettlementDetailsByContract = async (
  contractId: number
): Promise<SettlementDetailResponse[]> => {
  return await apiClient<SettlementDetailResponse[]>(
    `/finance/contracts/${contractId}/settlements`,
    { method: "GET" }
  );
};

// 모든 정산 리스트 조회
const getAllSettlements = async (): Promise<SettlementDto[]> => {
  const response = await apiClient<any>("/finance", { method: "GET" });

  // 백엔드가 페이지네이션된 응답을 반환하는 경우 처리
  if (response && typeof response === "object" && "content" in response) {
    return response.content;
  } else if (Array.isArray(response)) {
    return response;
  } else {
    console.warn("예상치 못한 정산 데이터 형태:", response);
    return [];
  }
};

export const settlementService = {
  createSettlementForContract,
  getSettlementsByContract,
  updateSettlement,
  deleteSettlement,
  changeSettlementStatus,
  getSettlementSummary,
  getTotalRevenue,
  getTotalRevenueByUser,
  getAgencyNetRevenue,
  getMonthlyRevenueSummary,
  getTopArtists,
  getRevenueByRatioType,
  getRevenueByContract,
  getSettlementDetailsByContract,
  getAllSettlements,
};

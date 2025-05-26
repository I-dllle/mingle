import { apiClient } from "@/lib/apiClient";
import {
  ArtistRevenueDto,
  SettlementCreateRequest,
  SettlementDetailResponse,
  SettlementDto,
  SettlementSummaryDto,
  UpdateSettlementRequest,
  ChangeSettlementStatusRequest,
  RecentSettlementDto,
  SettlementRequest,
} from "../types/Settlement";

// 정산 생성 (확정된 계약 기준)
const createSettlementForContract = async (
  contractId: number,
  request: SettlementRequest
): Promise<void> => {
  await apiClient.post(
    `/api/v1/finance/contracts/${contractId}/settlements`,
    request
  );
};

// 특정 계약의 정산 목록 조회
const getSettlementsByContract = async (
  contractId: number
): Promise<SettlementDto[]> => {
  const response = await apiClient.get(
    `/api/v1/finance/contracts/${contractId}/settlementList`
  );
  return response.data;
};

// 정산 수정
const updateSettlement = async (
  settlementId: number,
  request: UpdateSettlementRequest
): Promise<void> => {
  await apiClient.put(`/api/v1/finance/${settlementId}`, request);
};

// 정산 삭제
const deleteSettlement = async (settlementId: number): Promise<void> => {
  await apiClient.delete(`/api/v1/finance/${settlementId}`);
};

// 정산 상태 변경
const changeSettlementStatus = async (
  settlementId: number,
  request: ChangeSettlementStatusRequest
): Promise<void> => {
  await apiClient.put(`/api/v1/finance/${settlementId}/status`, request);
};

// 정산 통계 요약
const getSettlementSummary = async (): Promise<SettlementSummaryDto> => {
  const response = await apiClient.get("/api/v1/finance/summary");
  return response.data;
};

// 전체 또는 기간별 총 수익 조회
const getTotalRevenue = async (
  startDate?: string,
  endDate?: string
): Promise<number> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await apiClient.get(
    `/api/v1/finance/total-revenue?${params.toString()}`
  );
  return response.data;
};

// 특정 유저의 총 수익 조회
const getTotalRevenueByUser = async (userId: number): Promise<number> => {
  const response = await apiClient.get(
    `/api/v1/finance/users/${userId}/total-revenue`
  );
  return response.data;
};

// 회사의 순수익 조회
const getAgencyNetRevenue = async (
  startDate?: string,
  endDate?: string
): Promise<number> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await apiClient.get(
    `/api/v1/finance/net-agency?${params.toString()}`
  );
  return response.data;
};

// 월별 수익 요약 통계
const getMonthlyRevenueSummary = async (): Promise<Record<string, number>> => {
  const response = await apiClient.get("/api/v1/finance/monthly-summary");
  return response.data;
};

// 수익 상위 아티스트 리스트
const getTopArtists = async (
  limit: number = 10
): Promise<ArtistRevenueDto[]> => {
  const response = await apiClient.get(
    `/api/v1/finance/top-artists?limit=${limit}`
  );
  return response.data;
};

// RatioType별 총 수익 분배 요약
const getRevenueByRatioType = async (): Promise<Record<string, number>> => {
  const response = await apiClient.get("/api/v1/finance/ratio-summary");
  return response.data;
};

// 특정 계약서 기준 수익 조회
const getRevenueByContract = async (contractId: number): Promise<number> => {
  const response = await apiClient.get(
    `/api/v1/finance/contracts/${contractId}/revenue`
  );
  return response.data;
};

// 계약서 기준 정산 상세 내역 조회
const getSettlementDetailsByContract = async (
  contractId: number
): Promise<SettlementDetailResponse[]> => {
  const response = await apiClient.get(
    `/api/v1/finance/contracts/${contractId}/settlements`
  );
  return response.data;
};

// 모든 정산 리스트 조회
const getAllSettlements = async (): Promise<SettlementDto[]> => {
  const response = await apiClient.get("/api/v1/finance");
  return response.data;
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

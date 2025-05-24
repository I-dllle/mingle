import { RatioType } from "./Contract";

// 아티스트 수익 DTO - Java의 ArtistRevenueDto 클래스와 동일한 구조
export interface ArtistRevenueDto {
  artistId: number; // Long → number로 변환
  artistName: string;
  totalRevenue: number; // BigDecimal → number로 변환
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const ArtistRevenueDtoUtils = {
  // 객체로부터 ArtistRevenueDto 생성
  from: (data: any): ArtistRevenueDto => {
    return {
      artistId: data.artistId || data.userId || 0,
      artistName: data.artistName || data.userName || "",
      totalRevenue:
        typeof data.totalRevenue === "string"
          ? parseFloat(data.totalRevenue)
          : data.totalRevenue || 0,
    };
  },
};

// 정산 업데이트 요청 DTO - Java의 UpdateSettlementRequest 클래스와 동일한 구조
export interface UpdateSettlementRequest {
  totalAmount: number; // BigDecimal → number로 변환
  memo: string;
  isSettled: boolean;
  source: string;
  incomeDate: string; // LocalDate → string으로 변환
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const UpdateSettlementRequestUtils = {
  // 객체로부터 UpdateSettlementRequest 생성
  from: (data: any): UpdateSettlementRequest => {
    return {
      totalAmount:
        typeof data.totalAmount === "string"
          ? parseFloat(data.totalAmount)
          : data.totalAmount,
      memo: data.memo || "",
      isSettled: data.isSettled,
      source: data.source || "",
      incomeDate: data.incomeDate,
    };
  },
};

// 정산 요약 DTO - Java의 SettlementSummaryDto 클래스와 동일한 구조
export interface SettlementSummaryDto {
  totalAmount: number; // BigDecimal → number로 변환
  count: number;
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const SettlementSummaryDtoUtils = {
  // 객체로부터 SettlementSummaryDto 생성
  from: (data: any): SettlementSummaryDto => {
    return {
      totalAmount:
        typeof data.totalAmount === "string"
          ? parseFloat(data.totalAmount)
          : data.totalAmount,
      count: data.count,
    };
  },
};

// 정산 요청 DTO - Java의 SettlementRequest 클래스와 동일한 구조
export interface SettlementRequest {
  totalRevenue: number; // BigDecimal → number로 변환
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const SettlementRequestUtils = {
  // 객체로부터 SettlementRequest 생성
  from: (data: any): SettlementRequest => {
    return {
      totalRevenue:
        typeof data.totalRevenue === "string"
          ? parseFloat(data.totalRevenue)
          : data.totalRevenue,
    };
  },
};

// 정산 비율 DTO - Java의 SettlementRatioDto 레코드와 동일한 구조
export interface SettlementRatioDto {
  userId: number;
  contractInternalId: number;
  ratioType: RatioType;
  percentage: number; // BigDecimal → number로 변환
}

// 정산 생성 요청 DTO - Java의 SettlementCreateRequest 레코드와 동일한 구조
export interface SettlementCreateRequest {
  contractExternalId: number;
  incomeDate: string; // LocalDate → string으로 변환
  totalAmount: number; // BigDecimal → number로 변환
  ratios: SettlementRatioDto[];
}

// 정산 상세 응답 DTO - Java의 SettlementDetailResponse 클래스와 동일한 구조
export interface SettlementDetailResponse {
  settlementId: number;
  userId: number | null;
  amount: number; // BigDecimal → number로 변환
  percentage: number; // BigDecimal → number로 변환
  ratioType: RatioType;
}

// 정산 DTO - Java의 SettlementDto 레코드와 동일한 구조
export interface SettlementDto {
  id: number;
  amount: number; // BigDecimal → number로 변환
  isSettled: boolean;
  date: string; // LocalDate → string으로 변환
  memo: string;
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const SettlementRatioDtoUtils = {
  // 객체로부터 SettlementRatioDto 생성
  from: (data: any): SettlementRatioDto => {
    return {
      userId: data.userId,
      contractInternalId: data.contractInternalId,
      ratioType: data.ratioType,
      percentage:
        typeof data.percentage === "string"
          ? parseFloat(data.percentage)
          : data.percentage,
    };
  },
};

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const SettlementCreateRequestUtils = {
  // 객체로부터 SettlementCreateRequest 생성
  from: (data: any): SettlementCreateRequest => {
    return {
      contractExternalId: data.contractExternalId,
      incomeDate: data.incomeDate,
      totalAmount:
        typeof data.totalAmount === "string"
          ? parseFloat(data.totalAmount)
          : data.totalAmount,
      ratios: Array.isArray(data.ratios)
        ? data.ratios.map((ratio: any) => SettlementRatioDtoUtils.from(ratio))
        : [],
    };
  },
};

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const SettlementDetailResponseUtils = {
  // SettlementDetail 객체로부터 SettlementDetailResponse 생성
  from: (settlementDetail: any): SettlementDetailResponse => {
    return {
      settlementId: settlementDetail.settlement?.id,
      userId: settlementDetail.user?.id || null,
      amount:
        typeof settlementDetail.amount === "string"
          ? parseFloat(settlementDetail.amount)
          : settlementDetail.amount,
      percentage:
        typeof settlementDetail.percentage === "string"
          ? parseFloat(settlementDetail.percentage)
          : settlementDetail.percentage,
      ratioType: settlementDetail.ratioType,
    };
  },
};

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const SettlementDtoUtils = {
  // Settlement 객체로부터 SettlementDto 생성
  from: (settlement: any): SettlementDto => {
    return {
      id: settlement.id,
      amount:
        typeof settlement.totalAmount === "string"
          ? parseFloat(settlement.totalAmount)
          : settlement.totalAmount,
      isSettled: settlement.isSettled,
      date: settlement.incomeDate,
      memo: settlement.memo || "",
    };
  },
};

// 정산 상태 변경 요청 DTO - Java의 ChangeSettlementStatusRequest 클래스와 동일한 구조
export interface ChangeSettlementStatusRequest {
  isSettled: boolean;
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const ChangeSettlementStatusRequestUtils = {
  // 객체로부터 ChangeSettlementStatusRequest 생성
  from: (data: any): ChangeSettlementStatusRequest => {
    return {
      isSettled: data.isSettled,
    };
  },
};

// 최근 정산 DTO - Java의 RecentSettlementDto 클래스와 동일한 구조
export interface RecentSettlementDto {
  id: number;
  incomeDate: string; // LocalDate → string으로 변환
  totalAmount: number; // BigDecimal → number로 변환
  memo: string;
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const RecentSettlementDtoUtils = {
  // Settlement 엔티티로부터 RecentSettlementDto 생성
  fromEntity: (settlement: any): RecentSettlementDto => {
    return {
      id: settlement.id,
      incomeDate: settlement.incomeDate,
      totalAmount:
        typeof settlement.totalAmount === "string"
          ? parseFloat(settlement.totalAmount)
          : settlement.totalAmount,
      memo: settlement.memo || "",
    };
  },
};

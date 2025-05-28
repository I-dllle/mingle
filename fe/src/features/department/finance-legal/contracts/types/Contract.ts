// 계약서 상태를 나타내는 열거형
export enum ContractStatus {
  DRAFT = "DRAFT", // 초안
  REVIEW = "REVIEW", // 검토 중
  SIGNED_OFFLINE = "SIGNED_OFFLINE", // 오프라인 서명
  SIGNED = "SIGNED", // 서명됨
  CONFIRMED = "CONFIRMED", // 확인됨
  ACTIVE = "ACTIVE", // 활성화됨
  EXPIRED = "EXPIRED", // 만료됨
  PENDING = "PENDING", // 대기 중
  TERMINATED = "TERMINATED", // 종료됨
}

// 상태 변경 요청 DTO
export interface ChangeStatusRequest {
  nextStatus: ContractStatus; // 다음 상태
}

// 계약서 상세 정보 DTO - Java의 ContractDetailDto 레코드와 동일한 구조
export interface ContractDetailDto {
  id: number;
  summary: string;
  signerName: string;
  signerMemo: string;
  status: ContractStatus;
  startDate: string; // ISO 형식의 날짜 문자열 (YYYY-MM-DD)
  endDate: string; // ISO 형식의 날짜 문자열 (YYYY-MM-DD)
  fileUrl: string;
  userId: number; // InternalContract 전용 필드
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const ContractDetailDtoUtils = {
  // Contract 엔티티로부터 ContractDetailDto 생성
  from: (contract: any): ContractDetailDto => {
    return {
      id: contract.id,
      summary: contract.summary,
      signerName: contract.signerName,
      signerMemo: contract.signerMemo,
      status: contract.status,
      startDate: contract.startDate as string, // LocalDate → string으로 변환 필요
      endDate: contract.endDate as string, // LocalDate → string으로 변환 필요
      fileUrl: contract.fileUrl,
      userId: 0, // 외부 계약은 0으로 설정
    };
  },

  // InternalContract 엔티티로부터 ContractDetailDto 생성
  fromInternal: (internalContract: any): ContractDetailDto => {
    return {
      id: internalContract.id,
      summary: "요약", // 고정값
      signerName: internalContract.signerName,
      signerMemo: internalContract.signerMemo,
      status: internalContract.status,
      startDate: internalContract.startDate as string, // LocalDate → string으로 변환 필요
      endDate: internalContract.endDate as string, // LocalDate → string으로 변환 필요
      fileUrl: internalContract.fileUrl,
      userId: internalContract.user?.id || internalContract.userId, // 내부 계약의 실제 유저 ID
    };
  },
};

// 계약서 종료일 응답 DTO - Java의 ContractResponseEndDate 클래스와 동일한 구조
export interface ContractResponseEndDate {
  id: number;
  title: string;
  userName: string;
  teamName: string | null;
  startDate: string; // ISO 형식의 날짜 문자열 (YYYY-MM-DD)
  endDate: string; // ISO 형식의 날짜 문자열 (YYYY-MM-DD)
  status: ContractStatus;
}

// Java의 정적 메서드와 빌더 패턴을 TypeScript 유틸리티 함수로 구현
export const ContractResponseEndDateUtils = {
  // Contract 엔티티로부터 ContractResponseEndDate 생성
  from: (contract: any): ContractResponseEndDate => {
    return {
      id: contract.id,
      title: contract.title || contract.summary, // title이 없으면 summary 사용
      userName: contract.user?.name || contract.userName || contract.signerName, // 우선순위: user.name > userName > signerName
      teamName: contract.team?.name || contract.teamName || null,
      startDate: contract.startDate as string, // LocalDate → string으로 변환 필요
      endDate: contract.endDate as string, // LocalDate → string으로 변환 필요
      status: contract.status,
    };
  },
};

// 계약서 카테고리를 나타내는 열거형
export enum ContractCategory {
  INTERNAL = "INTERNAL", // 내부 계약
  EXTERNAL = "EXTERNAL", // 외부 계약
}

// 계약서 타입을 나타내는 열거형
export enum ContractType {
  PAPER = "PAPER", // 종이 계약
  ELECTRONIC = "ELECTRONIC", // 전자 계약
}

// 정산 비율 타입을 나타내는 열거형
export enum RatioType {
  ARTIST = "ARTIST", // 아티스트
  PRODUCER = "PRODUCER", // 프로듀서
  AGENCY = "AGENCY", // 회사
}

// 계약서 간단 정보 DTO - Java의 ContractSimpleDto 클래스와 동일한 구조
export interface ContractSimpleDto {
  id: number;
  title: string;
  companyName: string; // 회사명 (계약 당사자)
  status: ContractStatus; // 계약 상태
  startDate: string; // ISO 형식의 날짜 문자열 (YYYY-MM-DD)
  endDate: string; // ISO 형식의 날짜 문자열 (YYYY-MM-DD)
  nickname: string; // 사용자 닉네임 (외부 계약자 이름)
  category: ContractCategory;
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const ContractSimpleDtoUtils = {
  // Contract 엔티티로부터 ContractSimpleDto 생성
  from: (contract: any): ContractSimpleDto => {
    return {
      id: contract.id,
      title: contract.title,
      companyName: contract.companyName,
      status: contract.status,
      startDate: contract.startDate as string, // LocalDate → string으로 변환 필요
      endDate: contract.endDate as string, // LocalDate → string으로 변환 필요
      nickname: contract.user.nickname || "외부 사용자", // 우선순위: user.nickname > userName > signerName
      category: contract.contractCategory,
    };
  },
  // InternalContract 엔티티로부터 ContractSimpleDto 생성
  fromInternal: (internal: any): ContractSimpleDto => {
    return {
      id: internal.id,
      title: "(내부계약) 사용자 정산 계약",
      companyName: "Mingle",
      status: internal.status,
      startDate: internal.startDate as string, // LocalDate → string으로 변환 필요
      endDate: internal.endDate as string, // LocalDate → string으로 변환 필요
      nickname: internal.user.nickname || "내부 사용자", // 내부 계약의 경우 고정값 사용
      category: ContractCategory.INTERNAL,
    };
  },
};

// 정산 비율 DTO - Java의 SettlementRatioDto 레코드와 동일한 구조
export interface SettlementRatioDto {
  ratioType: RatioType; // 비율 타입 (아티스트, 프로듀서, 회사 등)
  userId: number; // 사용자 ID
  percentage: number; // 백분율 (BigDecimal → number로 변환)
}

// 계약 생성 요청 DTO - Java의 CreateContractRequest 레코드와 동일한 구조
export interface CreateContractRequest {
  userId: number; // 사용자 ID
  teamId?: number | null; // 팀 ID (선택적, null 허용)
  summary: string; // 요약
  title: string; // 제목
  contractCategory: ContractCategory; // 계약 카테고리
  startDate: string; // 시작일 (ISO 형식의 날짜 문자열)
  endDate: string; // 종료일 (ISO 형식의 날짜 문자열)
  contractType: ContractType; // 계약 타입
  contractAmount: number; // 계약 금액 (BigDecimal → number로 변환)
  counterpartyCompanyName: string; // 상대 회사 이름
  useManualRatios: boolean; // true면 수동 입력, false면 내부계약 기준
  ratios: SettlementRatioDto[]; // 수동 입력용 정산 비율 목록
  targetUserIds: number[]; // 내부계약 기준 유저 ID 리스트
}

// 내부 계약 생성 요청 DTO - Java의 CreateInternalContractRequest 레코드와 동일한 구조
export interface CreateInternalContractRequest {
  userId: number; // 사용자 ID
  ratioType: RatioType; // 비율 타입 (ARTIST, PRODUCER 등)
  defaultRatio: number; // 기본 비율 (BigDecimal → number로 변환)
  startDate: string; // 시작일 (ISO 형식의 날짜 문자열)
  endDate: string; // 종료일 (ISO 형식의 날짜 문자열)
}

// 사용자 기본 정보 인터페이스
export interface User {
  id: number; // 사용자 ID
  name: string; // 사용자 이름
  email?: string; // 이메일 (선택적)
  role?: string; // 역할 (선택적)
  department?: string; // 부서 (선택적)
}

// 내부 계약 응답 DTO - Java의 InternalContractResponse 레코드와 동일한 구조
export interface InternalContractResponse {
  id: number; // 계약 ID
  user: User; // 사용자 정보
  defaultRatio: number; // 기본 비율 (BigDecimal → number로 변환)
  status: ContractStatus; // 계약 상태
  startDate: string; // 시작일 (ISO 형식의 날짜 문자열)
  endDate: string; // 종료일 (ISO 형식의 날짜 문자열)
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const InternalContractResponseUtils = {
  // InternalContract 엔티티로부터 InternalContractResponse 생성
  from: (internalContract: any): InternalContractResponse => {
    return {
      id: internalContract.id,
      user: internalContract.user,
      defaultRatio: internalContract.defaultRatio,
      status: internalContract.status,
      startDate: String(internalContract.startDate), // LocalDate → string으로 변환 필요
      endDate: String(internalContract.endDate), // LocalDate → string으로 변환 필요
    };
  },
};

// 오프라인 서명 요청 DTO - Java의 OfflineSignRequest 클래스와 동일한 구조
export interface OfflineSignRequest {
  signerName: string; // 외부 계약 상대방 이름
  memo: string; // 추가 메모 (날짜, 위치 등)
}

// 계약 업데이트 요청 DTO - Java의 UpdateContractRequest 레코드와 동일한 구조
export interface UpdateContractRequest {
  title: string; // 제목
  summary: string; // 요약
  startDate: string; // 시작일 (ISO 형식의 날짜 문자열)
  endDate: string; // 종료일 (ISO 형식의 날짜 문자열)
  contractAmount: number; // 계약 금액 (BigDecimal → number로 변환)
  contractCategory: ContractCategory; // 계약 카테고리
  contractType: ContractType; // 계약 타입
  status: ContractStatus; // 계약 상태
  useManualRatios: boolean; // true면 수동 입력, false면 내부계약 기준
  ratios: SettlementRatioDto[]; // 수동 입력용 정산 비율 목록
  targetUserIds: number[]; // 내부계약 기준 유저 ID 리스트
}

// 계약 조건 응답 DTO - Java의 ContractConditionResponse 클래스와 동일한 구조
export interface ContractConditionResponse {
  id: number; // 계약 ID
  title: string; // 제목
  userName: string; // 사용자 이름
  teamName: string | null; // 팀 이름 (없을 수 있음)
  startDate: string; // 시작일 (ISO 형식의 날짜 문자열)
  endDate: string; // 종료일 (ISO 형식의 날짜 문자열)
  summary: string; // 요약
  companyName: string; // 회사 이름
  fileUrl: string; // 파일 URL
  status: ContractStatus; // 계약 상태
  contractType: ContractType; // 계약 타입
  contractCategory: ContractCategory; // 계약 카테고리
  isSettlementCreated: boolean | null; // 정산 생성 여부
  signerName: string; // 서명자 이름
  signerMemo: string; // 서명자 메모
  isTerminated: boolean; // 종료 여부
}

// Java의 빌더 패턴을 TypeScript 유틸리티 함수로 구현
export const ContractConditionResponseUtils = {
  // Contract 엔티티로부터 ContractConditionResponse 생성
  from: (contract: any): ContractConditionResponse => {
    const now = new Date().toISOString().split("T")[0]; // 현재 날짜 YYYY-MM-DD 형식

    return {
      id: contract.id,
      title: contract.title,
      userName: contract.user?.name,
      teamName: contract.team?.name || null,
      startDate: contract.startDate as string, // LocalDate → string으로 변환 필요
      endDate: contract.endDate as string, // LocalDate → string으로 변환 필요
      summary: contract.summary,
      companyName: contract.companyName,
      fileUrl: contract.fileUrl,
      status: contract.status,
      contractType: contract.contractType,
      contractCategory: contract.contractCategory,
      isSettlementCreated: contract.isSettlementCreated,
      signerName: contract.signerName,
      signerMemo: contract.signerMemo,
      isTerminated: new Date(contract.endDate) < new Date(now), // endDate가 현재보다 이전인지 확인
    };
  },
};

// 계약 응답 DTO - Java의 ContractResponse 레코드와 동일한 구조
export interface ContractResponse {
  id: number; // 계약 ID
  title: string; // 제목
  userName: string; // 사용자 이름
  teamName: string | null; // 팀 이름 (없을 수 있음)
  companyName: string; // 회사 이름
  startDate: string; // 시작일 (ISO 형식의 날짜 문자열)
  endDate: string; // 종료일 (ISO 형식의 날짜 문자열)
  status: ContractStatus; // 계약 상태
  contractCategory: ContractCategory; // 계약 카테고리
  contractType: ContractType; // 계약 타입
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const ContractResponseUtils = {
  // Contract 엔티티로부터 ContractResponse 생성
  from: (contract: any): ContractResponse => {
    return {
      id: contract.id,
      title: contract.title,
      userName: contract.user?.name,
      teamName: contract.team?.name || null,
      companyName: contract.companyName,
      startDate: contract.startDate as string, // LocalDate → string으로 변환 필요
      endDate: contract.endDate as string, // LocalDate → string으로 변환 필요
      status: contract.status,
      contractCategory: contract.contractCategory,
      contractType: contract.contractType,
    };
  },
  // InternalContract 엔티티로부터 ContractResponse 생성
  fromInternal: (contract: any): ContractResponse => {
    return {
      id: contract.id,
      title: "(내부계약) 사용자 정산 계약",
      userName: contract.user?.name,
      teamName: "team",
      companyName: "mingle",
      startDate: contract.startDate as string, // LocalDate → string으로 변환 필요
      endDate: contract.endDate as string, // LocalDate → string으로 변환 필요
      status: contract.status,
      contractCategory: ContractCategory.INTERNAL,
      contractType: ContractType.ELECTRONIC,
    };
  },
};

// 계약 검색 조건 DTO - Java의 ContractSearchCondition 클래스와 동일한 구조
export interface ContractSearchCondition {
  teamId?: number; // 팀 ID (선택적)
  status?: ContractStatus; // 계약 상태 (선택적)
  contractType?: ContractType; // 계약 타입 (선택적)
  contractCategory?: ContractCategory; // 계약 카테고리 (선택적)
  startDateFrom?: string; // 시작일 범위 시작 (ISO 형식의 날짜 문자열) (선택적)
  startDateTo?: string; // 시작일 범위 종료 (ISO 형식의 날짜 문자열) (선택적)
  participantUserId?: number; // 참여자 사용자 ID (선택적)
}

// 페이징된 응답을 위한 제네릭 인터페이스
export interface PagedResponse<T = any> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// 최근 계약 DTO - Java의 RecentContractDto 클래스와 동일한 구조
export interface RecentContractDto {
  id: number; // 계약 ID
  nickName: string; // 사용자 닉네임
  startDate: string; // 시작일 (ISO 형식의 날짜 문자열)
  status: ContractStatus; // 계약 상태
}

// Java의 빌더 패턴을 TypeScript 유틸리티 함수로 구현
export const RecentContractDtoUtils = {
  // Contract 엔티티로부터 RecentContractDto 생성
  fromEntity: (contract: any): RecentContractDto => {
    return {
      id: contract.id,
      nickName: contract.user?.nickname,
      startDate: contract.startDate as string, // LocalDate → string으로 변환 필요
      status: contract.status,
    };
  },
};

// 사용자 검색 DTO
export interface UserSearchDto {
  id: number;
  name: string;
  email: string;
}

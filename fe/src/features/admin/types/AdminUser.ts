// UserRole enum - Java의 UserRole enum과 동일한 구조
export enum UserRole {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  ARTIST = "ARTIST",
  MANAGER = "MANAGER",
}

// AdminRoleUpdate DTO - Java의 AdminRoleUpdate 레코드와 동일한 구조
export interface AdminRoleUpdate {
  role: UserRole;
}

// AdminUpdateUser DTO - Java의 AdminUpdateUser 레코드와 동일한 구조
export interface AdminUpdateUser {
  name: string;
  phoneNum: string;
  departmentId: number; // Long → number로 변환
  positionId: number; // Long → number로 변환
}

// UserStatus enum - Java의 UserStatus enum과 동일한 구조 (일반적인 사용자 상태)
export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
}

// AdminRequestUser DTO - Java의 AdminRequestUser 레코드와 동일한 구조
export interface AdminRequestUser {
  id: number; // Long → number로 변환
  loginId: string;
  name: string;
  nickname: string;
  email: string;
  phoneNum: string;
  imageUrl: string;
  departmentName: string;
  Name: string; // Java 코드에서 positionName이어야 할 것 같지만 원본 그대로 유지
  role: UserRole;
  status: UserStatus;
}

// Java의 정적 메서드를 TypeScript 유틸리티 함수로 구현
export const AdminRequestUserUtils = {
  // 객체로부터 AdminRequestUser 생성
  from: (data: any): AdminRequestUser => {
    return {
      id: data.id || 0,
      loginId: data.loginId || "",
      name: data.name || "",
      nickname: data.nickname || "",
      email: data.email || "",
      phoneNum: data.phoneNum || "",
      imageUrl: data.imageUrl || "",
      departmentName: data.departmentName || "",
      Name: data.Name || data.positionName || "", // Name 또는 positionName 처리
      role: data.role || UserRole.ARTIST,
      status: data.status || UserStatus.ACTIVE,
    };
  },
};

// PositionCode enum - Java의 PositionCode enum과 동일한 구조 (일반적인 직책 코드)
export enum PositionCode {
  // Planning & A&R 부서
  A_AND_R_PLANNER = "A_AND_R_PLANNER",
  A_AND_R_COORDINATOR = "A_AND_R_COORDINATOR",
  CONTENT_PLANNER = "CONTENT_PLANNER",

  // Creative Studio 부서
  CREATIVE_DIRECTOR = "CREATIVE_DIRECTOR",
  CONTENT_PRODUCER = "CONTENT_PRODUCER",
  DESIGN_LEAD = "DESIGN_LEAD",

  // Finance & Legal 부서
  FINANCE_MANAGER = "FINANCE_MANAGER",
  LEGAL_COUNSEL = "LEGAL_COUNSEL",
  ACCOUNTING_LEAD = "ACCOUNTING_LEAD",

  // Marketing & PR 부서
  MARKETING_MANAGER = "MARKETING_MANAGER",
  PR_LEAD = "PR_LEAD",
  SOCIAL_MEDIA_COORDINATOR = "SOCIAL_MEDIA_COORDINATOR",

  // Artist & Manager 부서
  ARTIST_COORDINATOR = "ARTIST_COORDINATOR",
  FAN_COMMUNICATION_LEAD = "FAN_COMMUNICATION_LEAD",
  SCHEDULE_MANAGER = "SCHEDULE_MANAGER",

  // System Operations 부서
  WEBOPS_MANAGER = "WEBOPS_MANAGER",
  INFRA_COORDINATOR = "INFRA_COORDINATOR",
  TECHOPS_PARTNER = "TECHOPS_PARTNER",

  // Executive 부서
  STRATEGY_LEAD = "STRATEGY_LEAD",
  EXECUTIVE_ASSISTANT = "EXECUTIVE_ASSISTANT",
  CHIEF_CULTURE_OFFICER = "CHIEF_CULTURE_OFFICER",
}

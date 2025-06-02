import { apiClient } from "@/lib/api/apiClient";
import {
  AdminRequestUser,
  AdminUpdateUser,
  AdminRoleUpdate,
  AdminStatusUpdate,
  UserRole,
  PositionCode,
} from "../types/AdminUser";
import { UserSearchDto } from "@/features/department/finance-legal/contracts/types/Contract";

const API_BASE_URL = "/admin/users";

// 페이지네이션된 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// 부서와 포지션에 해당하는 유저 조회 (페이징)
const getUsersFiltered = async (
  departmentId?: number,
  positionCode?: PositionCode,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<AdminRequestUser>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (departmentId !== undefined) {
    params.append("departmentId", departmentId.toString());
  }
  if (positionCode !== undefined) {
    params.append("positionCode", positionCode);
  }

  return await apiClient<PageResponse<AdminRequestUser>>(
    `${API_BASE_URL}?${params}`,
    { method: "GET" }
  );
};

// 유저 상세 조회
const getUser = async (id: number): Promise<AdminRequestUser> => {
  return await apiClient<AdminRequestUser>(`${API_BASE_URL}/${id}`, {
    method: "GET",
  });
};

// 유저 정보 변경 (부서, 포지션 등)
const updateUser = async (
  userId: number,
  updateData: AdminUpdateUser
): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 비어있는 경우를 처리
  const text = await res.text();
  if (text) {
    try {
      JSON.parse(text);
    } catch (e) {
      // JSON이 아닌 경우 무시
    }
  }
};

// 유저 권한 변경
const updateRole = async (
  id: number,
  roleData: AdminRoleUpdate
): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/${id}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleData),
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 비어있는 경우를 처리
  const text = await res.text();
  if (text) {
    try {
      JSON.parse(text);
    } catch (e) {
      // JSON이 아닌 경우 무시
    }
  }
};

// 유저 상태 변경
const updateStatus = async (
  id: number,
  statusData: AdminStatusUpdate
): Promise<void> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_BASE_URL}/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusData),
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.statusText}`);
  }

  // 응답이 비어있는 경우를 처리
  const text = await res.text();
  if (text) {
    try {
      JSON.parse(text);
    } catch (e) {
      // JSON이 아닌 경우 무시
    }
  }
};

// 이름으로 유저 검색
const searchByName = async (name: string): Promise<UserSearchDto[]> => {
  const params = new URLSearchParams({ name });
  return await apiClient<UserSearchDto[]>(`${API_BASE_URL}/search?${params}`, {
    method: "GET",
  });
};

export const adminUserService = {
  getUsersFiltered,
  getUser,
  updateUser,
  updateRole,
  updateStatus,
  searchByName,
};

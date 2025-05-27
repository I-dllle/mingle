import { apiClient } from "@/lib/api/apiClient";
import {
  AdminRequestUser,
  AdminUpdateUser,
  AdminRoleUpdate,
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
  await apiClient(`${API_BASE_URL}/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
};

// 유저 권한 변경
const updateRole = async (
  id: number,
  roleData: AdminRoleUpdate
): Promise<void> => {
  await apiClient(`${API_BASE_URL}/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify(roleData),
  });
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
  searchByName,
};

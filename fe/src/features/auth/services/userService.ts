import apiClient from "@/lib/apiClient";
import { User } from "../types/user";

export const userService = {
  // 현재 로그인한 사용자 정보 조회
  getMyProfile: async (): Promise<User> => {
    const response = await apiClient.get("/v1/users/me");
    return response.data;
  },

  // 특정 사용자 정보 조회
  getUserProfile: async (userId: number): Promise<User> => {
    const response = await apiClient.get(`/v1/users/${userId}`);
    return response.data;
  },

  // 부서별 사용자 목록 조회
  getUsersByDepartment: async (departmentName: string): Promise<User[]> => {
    const response = await apiClient.get("/v1/users/users/by-department", {
      params: { name: departmentName },
    });
    return response.data;
  },
};

export type { User };

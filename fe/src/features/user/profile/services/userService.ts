import { apiClient } from "@/lib/api/apiClient";
import type { CurrentUser } from "@/features/user/auth/types/user";
import type { UserSimpleDto } from "@/features/user/search/types/UserSimpleDto";

export const userService = {
  getMyProfile: async (): Promise<CurrentUser | null> => {
    try {
      return await apiClient<CurrentUser>("/users/profile"); // 예시 API
    } catch (e) {
      console.error("getMyProfile 실패:", e);
      return null;
    }
  },
};

export const fetchDmCandidates = async (): Promise<UserSimpleDto[]> => {
  return await apiClient<UserSimpleDto[]>("/dm-chat/candidates");
};

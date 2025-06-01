import { apiClient } from '@/lib/api/apiClient';
import type { CurrentUser } from '@/features/user/auth/types/user';

export const userService = {
  getMyProfile: async (): Promise<CurrentUser | null> => {
    try {
      return await apiClient<CurrentUser>('/users/profile'); // 예시 API
    } catch (e) {
      console.error('getMyProfile 실패:', e);
      return null;
    }
  },
};

'use client';

import { useAuth } from '@/features/user/auth/AuthProvider';

export function useMyTeamRoomId(): number | null {
  const { user } = useAuth();
  // 예시: user.teamRoomId가 대표 팀 채팅방 id라고 가정
  return user?.departmentId ?? null;
}

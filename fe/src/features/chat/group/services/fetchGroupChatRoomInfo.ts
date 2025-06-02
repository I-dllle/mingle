'use client';

import { apiClient } from '@/lib/api/apiClient';
import { GroupChatRoom } from '@/features/chat/group/types/GroupChatRoom';

/**
 * 그룹 채팅방 정보를 가져오는 함수
 * - GET /api/v1/group-chats/{roomId}
 * - 실패 시 콘솔 출력 + 예외 전파
 */
export async function fetchGroupChatRoomInfo(
  roomId: number
): Promise<GroupChatRoom> {
  try {
    // 백엔드로부터 채팅방 정보 요청
    const res = await apiClient<GroupChatRoom>(`/api/v1/group-chats/${roomId}`);
    console.log('채팅방 정보 불러오기 성공:', res);

    // 정상 응답 반환
    return res;
  } catch (error) {
    // 실패 시 콘솔 출력 및 에러 전파
    console.error(`채팅방 정보 조회 실패(roomId: ${roomId})`, error);
    throw error;
  }
}

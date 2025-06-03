// 그룹 채팅방 요약 목록을 받아오는 API 호출 함수
import { apiClient } from '@/lib/api/apiClient';
import { GroupChatRoomSummary } from '@/features/chat/group/types/GroupChatRoomSummary';
import { ChatScope } from '@/features/chat/common/types/ChatScope';

// scope에 따라 그룹 채팅방 목록 조회 API 요청
export async function fetchGroupChatRoomSummaries(
  scope: ChatScope
): Promise<GroupChatRoomSummary[]> {
  const res = await apiClient<GroupChatRoomSummary[]>(
    `/group-chats/rooms?scope=${scope}`
  );
  return res;
}

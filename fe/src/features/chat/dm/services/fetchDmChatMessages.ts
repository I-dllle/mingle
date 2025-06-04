// DM 채팅방 메시지 목록 불러오기 함수
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import { apiClient } from '@/lib/api/apiClient';

export async function fetchDmChatMessages(
  roomId: number
): Promise<ChatMessagePayload[]> {
  // GET 요청으로 해당 roomId의 DM 메시지 조회
  return await apiClient<ChatMessagePayload[]>(`/dm-chat/${roomId}/messages`);
}

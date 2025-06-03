import { apiClient } from '@/lib/api/apiClient';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';

/**
 * 특정 그룹 채팅방의 메시지 목록을 가져오는 함수
 * @param roomId - 조회할 채팅방 ID
 * @returns 메시지 목록 (최신순)
 * - 기본적으로 최신 메시지 20개를 가져옵니다.
 * - 이후 무한스크롤이 필요할 경우 cursor 파라미터 활용 가능
 */
export async function fetchGroupChatMessages(
  roomId: number
): Promise<ChatMessagePayload[]> {
  try {
    const res = await apiClient<ChatMessagePayload[]>(
      `/group-chats/${roomId}/messages`
    );
    return res;
  } catch (error) {
    console.error('그룹 채팅 메시지 불러오기 실패:', error);
    return [];
  }
}

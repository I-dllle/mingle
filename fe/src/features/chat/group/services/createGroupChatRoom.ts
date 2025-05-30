import { apiClient } from '@/lib/api/apiClient';
import { GroupChatRoomCreateRequest } from '../types/GroupChatRoomCreateRequest';

export async function createGroupChatRoom(
  payload: GroupChatRoomCreateRequest
): Promise<void> {
  await apiClient('/api/v1/group-chats', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

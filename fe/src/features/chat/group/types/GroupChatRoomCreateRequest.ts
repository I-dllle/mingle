import { ChatScope } from '@/features/chat/common/types/ChatScope';

export interface GroupChatRoomCreateRequest {
  name: string;
  scope: ChatScope;
  teamId: number;
}

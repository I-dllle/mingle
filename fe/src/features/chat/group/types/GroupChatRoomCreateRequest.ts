import { RoomType } from '@/features/chat/common/types/RoomType';
import { ChatScope } from '@/features/chat/common/types/ChatScope';

export interface GroupChatRoomCreateRequest {
  name: string;
  roomType: RoomType;
  scope: ChatScope;
  teamId: number;
  projectEndDate: string | null;
}

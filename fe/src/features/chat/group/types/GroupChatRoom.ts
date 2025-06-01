import { ChatScope } from '@/features/chat/common/types/ChatScope';
import { RoomType } from '@/features/chat/common/types/RoomType';

export interface GroupChatRoom {
  roomId: number;
  name: string;
  roomType: RoomType; // 'NORMAL' | 'ARCHIVE'
  teamId: number;
  scope: ChatScope; // 'DEPARTMENT' | 'PROJECT'
  createdBy: number;
  projectEndDate?: string | null;
}

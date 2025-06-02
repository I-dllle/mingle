import { ChatRoomType } from './ChatRoomType';
import { MessageFormat } from './MessageFormat';
export interface ChatMessagePayload {
  roomId: number;
  senderId: number; // 보낸 사람의 아이디
  receiverId?: number; // 받는 사람의 아이디 - DM일 때만 사용
  content: string;
  format: MessageFormat; // TEXT, ARCHIVE, etc
  chatType: ChatRoomType; // 'dm' | 'group'
  createdAt: string; //
  tagNames?: string[];
}

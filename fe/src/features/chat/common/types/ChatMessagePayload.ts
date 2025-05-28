import { ChatRoomType } from './ChatRoomType';
import { ChatScope } from './ChatScope';
import { MessageFormat } from './MessageFormat';
export interface ChatMessagePayload {
  roomId: number;
  chatType: ChatRoomType; // 'dm' | 'group'
  content: string;
  format: MessageFormat; // TEXT, ARCHIVE, etc
  scope?: ChatScope; // (group 채팅방일 때만 사용)
}

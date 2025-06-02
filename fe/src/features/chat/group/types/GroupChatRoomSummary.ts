import { MessageFormat } from '@/features/chat/common/types/MessageFormat';
import { RoomType } from '../../common/types/RoomType';

export interface GroupChatRoomSummary {
  roomId: number; // 채팅방 ID
  name: string; // 그룹(방) 이름
  roomType: RoomType; // 방 타입: NORMAL(일반 채팅방) or ARCHIVE(자료방)
  previewMessage: string; // 최근 메시지 내용
  format: MessageFormat; // 메시지 형식 (TEXT, ARCHIVE 등)
  unreadCount: number; // 읽지 않은 메시지 수
  sentAt: string | null; // 메시지 전송 시각 (ISO 문자열 - nullable)
  completed: boolean; // 프로젝트 완료 여부
}

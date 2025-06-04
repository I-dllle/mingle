import { MessageFormat } from '@/features/chat/common/types/MessageFormat';

export interface DmChatRoomSummary {
  roomId: number; // 채팅방 ID
  opponentNickname: string; // 상대방 닉네임
  opponentProfileImageUrl?: string; // 상대방 프로필 이미지 URL (optional)
  previewMessage: string; // 최근 메시지 내용
  format: MessageFormat; // 메시지 형식 (TEXT, ARCHIVE 등)
  unreadCount: number; // 읽지 않은 메시지 수
  sentAt: string; // 메시지 전송 시각 (ISO 문자열)
}

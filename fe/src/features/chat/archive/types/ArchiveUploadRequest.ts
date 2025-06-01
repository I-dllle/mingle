// 자료 메시지 업로드 요청 DTO

import { MessageFormat } from '@/features/chat/common/types/MessageFormat';

export interface ArchiveUploadRequest {
  roomId: number; // 채팅방 ID
  senderId: number; // 보낸 사람 ID (나중에 auth에서 추출 예정)
  content: string; // 자료 설명 또는 파일명 (태그 포함 가능)
  format: MessageFormat; // 메시지 형식 (ARCHIVE로 고정)
  tagNames: string[]; // 태그 이름 목록 (예: ['사후르', '기획안'])
  createdAt: string; // 전송 시각 (ISO 문자열)
}

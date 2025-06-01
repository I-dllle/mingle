'use client';

import { uploadClient } from '@/lib/api/uploadClient'; // 새로 만든 업로드 전용 client
import { ChatRoomType } from '@/features/chat/common/types/ChatRoomType';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';

interface UploadArchiveParams {
  roomId: number;
  file: File;
  uploaderId: number;
  chatType: ChatRoomType; // 'DEPARTMENT' | 'PROJECT'
}

export async function uploadArchiveItem({
  roomId,
  file,
  uploaderId,
  chatType,
}: UploadArchiveParams) {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('roomId', String(roomId));
  formData.append('uploaderId', String(uploaderId));
  formData.append('chatType', chatType);
  formData.append('format', MessageFormat.ARCHIVE); // 자료 메시지로 지정

  return await uploadClient('/api/v1/archive/upload', formData);
}

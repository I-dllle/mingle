'use client';

import { useState } from 'react';
import { uploadArchiveItem } from '@/features/chat/archive/services/uploadArchiveItem';
import { useArchive } from '@/features/chat/archive/services/useArchive';
import { extractTagsFromFilename } from '@/features/chat/common/utils/chatUtils';
import { sendMessage } from '@/lib/socket';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';
import { ChatRoomType } from '@/features/chat/common/types/ChatRoomType';

interface ArchiveUploadFormProps {
  roomId: number;
}

export default function ArchiveUploadForm({ roomId }: ArchiveUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const { fetchItems } = useArchive(roomId);

  const handleUpload = async () => {
    if (!file) return;

    const tags = extractTagsFromFilename(file.name);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('roomId', String(roomId));
    tags.forEach((tag) => formData.append('tags', tag));

    try {
      await uploadArchiveItem({
        roomId,
        file,
        uploaderId: Number(localStorage.getItem('userId')),
        chatType: ChatRoomType.GROUP,
      });
      fetchItems(); // 자료 목록 갱신

      sendMessage({
        roomId,
        senderId: Number(localStorage.getItem('userId')), // 향후 auth 적용
        chatType: ChatRoomType.GROUP,
        format: MessageFormat.ARCHIVE,
        content: file.name,
        createdAt: new Date().toISOString(),
      });
      setFile(null);
    } catch (err) {
      alert('업로드 실패');
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={!file}>
        업로드
      </button>
    </div>
  );
}

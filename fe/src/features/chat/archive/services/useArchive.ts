'use client';

import { useState, useCallback, useEffect } from 'react';
import { ArchiveItem } from '@/features/chat/archive/types/ArchiveItem';
import { ArchiveTag } from '@/features/chat/archive/types/ArchiveTag';
import { fetchArchiveItems } from './fetchArchiveItems';
import { useSocket } from '@/hooks/useSocket';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';

export function useArchive(roomId: number) {
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);

  const token = sessionStorage.getItem('token')!;
  const { isConnected } = useSocket(roomId, token, (msg: ChatMessagePayload) => {
    // 메시지 수신 시 자료 메시지만 반영
    if (msg.roomId === roomId && msg.format === MessageFormat.ARCHIVE) {
      setArchiveItems((prev) => [
        {
          id: Date.now(),
          roomId: msg.roomId,
          uploaderId: msg.senderId,
          uploaderNickname: `사용자 ${msg.senderId}`,
          originalFilename: msg.content,
          storedFilename: '',
          url: '',
          createdAt: msg.createdAt,
          tags: [] as ArchiveTag[],
        },
        ...prev,
      ]);
    }
  });

  // 자료 목록 불러오기
  const fetchItems = useCallback(async () => {
    try {
      const data = await fetchArchiveItems(roomId);
      setArchiveItems(data);
    } catch (err) {
      console.error('자료 목록 불러오기 실패:', err);
    }
  }, [roomId]);

  useEffect(() => {
    if (isConnected) {
      fetchItems();
    }
  }, [isConnected, fetchItems]);

  return {
    archiveItems,
    fetchItems,
  };
}

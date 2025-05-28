'use client';

import { useEffect } from 'react';
import { connectWebSocket, sendMessage } from '@/lib/socket';
import { ChatRoomType } from '@/features/chat/common/types/ChatRoomType';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';

export default function ChatTestPage() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      connectWebSocket(token);

      // 테스트 메시지
      setTimeout(() => {
        sendMessage({
          roomId: 1,
          chatType: ChatRoomType.DM,
          content: 'WebSocket 테스트',
          format: MessageFormat.TEXT,
          senderId: 1,
          createdAt: new Date().toISOString(),
        });
      }, 1000);
    }
  }, []);

  return <div>WebSocket 연결 테스트 중 (chat-detail)</div>;
}

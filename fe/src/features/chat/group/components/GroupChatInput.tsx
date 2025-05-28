'use client';

import { useState } from 'react';
import { useGroupChat } from '@/features/chat/group/services/useGroupChat';

interface GroupChatInputProps {
  roomId: number;
}

export default function GroupChatInput({ roomId }: GroupChatInputProps) {
  const [content, setContent] = useState('');
  const { sendGroupMessage } = useGroupChat(roomId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendGroupMessage(content);
    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', gap: '8px', padding: '12px' }}
    >
      <input
        type="text"
        placeholder="메시지를 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ flex: 1, padding: '8px' }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>
        전송
      </button>
    </form>
  );
}

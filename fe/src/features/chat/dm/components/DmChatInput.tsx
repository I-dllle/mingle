'use client';

import { useState } from 'react';

interface DmChatInputProps {
  onSend: (content: string) => void;
}

export default function DmChatInput({ onSend }: DmChatInputProps) {
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (content.trim() === '') return;
    onSend(content);
    setContent('');
  };

  return (
    <div>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={handleSend}>전송</button>
    </div>
  );
}

import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface ChatPanelInputProps {
  onSend: (message: string) => void;
}

export default function ChatPanelInput({ onSend }: ChatPanelInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full h-14 bg-violet-100/60 rounded-[20px] flex items-center px-6">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 bg-transparent border-none outline-none text-black text-base placeholder:text-neutral-400"
        />
        <button
          type="submit"
          className="ml-2 p-2 rounded-full hover:bg-violet-200 transition"
          aria-label="전송"
          disabled={!message.trim()}
        >
          <PaperAirplaneIcon className="w-6 h-6 text-gray-500" />
        </button>
      </div>
    </form>
  );
}

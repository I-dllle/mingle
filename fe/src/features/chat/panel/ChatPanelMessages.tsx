import React from 'react';

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    role: string;
    roleColor: string;
    avatar?: string;
  };
  timestamp: string;
}

interface ChatPanelMessagesProps {
  messages: Message[];
}

export default function ChatPanelMessages({
  messages,
}: ChatPanelMessagesProps) {
  return (
    <div className="w-full min-h-full flex flex-col gap-6 bg-violet-400/20">
      {messages.map((message) => (
        <div
          key={message.id}
          className="relative w-full min-h-24 flex items-start px-8"
        >
          {/* 아바타 */}
          {message.sender.avatar ? (
            <img
              src={message.sender.avatar}
              alt={message.sender.name}
              className="w-14 h-14 rounded-full absolute left-0 top-2"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center absolute left-0 top-2">
              <div className="w-8 h-9 outline outline-4 outline-offset-[-2px] outline-Icon-Default-Default" />
            </div>
          )}
          {/* 본문 */}
          <div className="ml-20 flex flex-col w-[80%]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-violet-600 text-2xl font-semibold font-['Inter'] leading-tight">
                {message.sender.name}
              </span>
              <span
                className={`text-2xl font-semibold font-['Alkatra'] leading-tight`}
                style={{ color: message.sender.roleColor }}
              >
                {message.sender.role}
              </span>
            </div>
            <div className="text-black text-xl font-medium font-['Inter'] leading-snug bg-white/80 rounded-xl px-4 py-2 shadow-sm">
              {message.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

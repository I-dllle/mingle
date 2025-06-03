import React from 'react';

interface ChatPanelWelcomeProps {
  title: string; // 환영 메시지(커스텀/관리자 수정 가능)
  description: string; // 안내 메시지
  type: 'team' | 'project';
  isAdmin?: boolean;
  onEdit?: () => void;
}

export default function ChatPanelWelcome({
  title,
  description,
  type,
  isAdmin = false,
  onEdit,
}: ChatPanelWelcomeProps) {
  return (
    <div className="relative w-full h-44 mb-2">
      {/* 환영 메시지(커스텀/관리자 수정) */}
      <div className="absolute left-8 top-4 flex items-center h-8">
        <span className="text-black text-3xl font-bold font-['Inter'] leading-tight">
          {title}
        </span>
        {isAdmin && onEdit && (
          <button
            className="ml-3 text-gray-400 hover:text-gray-700 transition"
            onClick={onEdit}
            title="환영 메시지 수정"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"
              />
            </svg>
          </button>
        )}
      </div>
      {/* 안내 메시지 */}
      <div className="absolute left-8 top-16 w-[90%] h-16 text-black text-xl font-medium font-['Inter'] leading-loose">
        {description}
      </div>
    </div>
  );
}

import React from 'react';

interface ChatPanelWelcomeProps {
  title: string; // 프로젝트명 또는 팀명
  description: string; // 안내 메시지
  type: 'team' | 'project';
}

export default function ChatPanelWelcome({
  title,
  description,
  type,
}: ChatPanelWelcomeProps) {
  // type에 따라 환영 메시지 분기
  const welcomeMessage =
    type === 'team'
      ? '팀 채널에 오신 걸 환영합니다!'
      : '프로젝트 채널에 오신 걸 환영합니다!';

  return (
    <div className="relative w-full h-44 mb-2">
      {/* 프로젝트명 + 환영 메시지 */}
      <div className="absolute left-8 top-4 flex items-center h-8">
        <span className="text-black text-3xl font-medium font-['Inter'] leading-tight">
          #{' '}
        </span>
        <span className="text-black text-3xl font-bold font-['Inter'] leading-tight ml-2">
          {title}
        </span>
        <span className="text-black text-3xl font-medium font-['Inter'] leading-tight ml-2">
          {welcomeMessage}
        </span>
      </div>
      {/* 안내 메시지 */}
      <div className="absolute left-8 top-16 w-[90%] h-16 text-black text-xl font-medium font-['Inter'] leading-loose">
        {description}
      </div>
    </div>
  );
}

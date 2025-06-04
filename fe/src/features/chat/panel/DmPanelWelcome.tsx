import React from 'react';

interface DMPanelWelcomeProps {
  profileImageUrl: string;
  nickname: string;
}

export default function DmPanelWelcome({
  profileImageUrl,
  nickname,
}: DMPanelWelcomeProps) {
  return (
    <div className="flex flex-col items-start w-full px-8 pt-8 pb-4">
      <img
        src={profileImageUrl || '/default-avatar.png'}
        alt={nickname}
        className="w-16 h-16 rounded-full object-cover mb-2"
      />
      <span className="text-[24px] font-bold text-black mb-1">{nickname}</span>
      <span className="text-gray-500 text-base mb-2">비즈니스 채팅</span>
      <span className="text-black text-base">
        <b>{nickname}</b> 님과 나눈 다이렉트 메시지의 첫 부분이에요.
      </span>
    </div>
  );
}

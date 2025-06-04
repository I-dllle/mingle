import React from 'react';

interface ChatPanelHeaderProps {
  title: string;
  type: 'team' | 'project';
  onSearch?: () => void;
  onBack?: () => void;
}

export default function ChatPanelHeader({
  title,
  type,
  onSearch,
  onBack,
}: ChatPanelHeaderProps) {
  // Figma: font-medium for project, font-normal for team
  const fontWeight = type === 'project' ? 'font-medium' : 'font-normal';

  return (
    <div className="relative w-full h-28 flex items-center px-8">
      <div
        className={`absolute left-8 top-1/2 -translate-y-1/2 w-64 h-8 flex items-center justify-start text-neutral-700 text-3xl ${fontWeight} font-['Alkatra'] leading-loose`}
      >
        {/* type에 따라 다른 아이콘/텍스트/스타일 등 */}
        {type === 'team' && <span className="mr-2">👥</span>}
        {type === 'project' && <span className="mr-2">📁</span>}
        {title}
      </div>
      {/* 아이콘 버튼들 */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-6">
        {onSearch && (
          <button
            className="w-9 h-9 flex items-center justify-center overflow-hidden"
            onClick={onSearch}
            aria-label="검색"
          >
            <div className="w-7 h-7 outline outline-4 outline-offset-[-2px] outline-Icon-Default-Default" />
          </button>
        )}
        {onBack && (
          <button
            className="w-12 h-12 flex items-center justify-center overflow-hidden"
            onClick={onBack}
            aria-label="접기"
          >
            <div className="w-3 h-6 outline outline-4 outline-offset-[-2px] outline-Icon-Default-Default" />
          </button>
        )}
      </div>
    </div>
  );
}

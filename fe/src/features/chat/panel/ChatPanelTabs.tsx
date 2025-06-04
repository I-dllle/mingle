import React from 'react';

interface ChatPanelTabsProps {
  activeTab: 'chat' | 'archive';
  onTabChange: (tab: 'chat' | 'archive') => void;
}

export default function ChatPanelTabs({
  activeTab,
  onTabChange,
}: ChatPanelTabsProps) {
  return (
    <div className="inline-flex ml-8 mt-2">
      <button
        data-active={activeTab === 'chat' ? 'On' : 'Off'}
        className={`px-3 py-1 border-b flex justify-center items-center
          ${activeTab === 'chat' ? 'border-[#222]' : 'border-[#bbb]'}
        `}
        aria-selected={activeTab === 'chat'}
        onClick={() => onTabChange('chat')}
      >
        <div
          className={`text-base leading-snug
            ${
              activeTab === 'chat'
                ? 'text-[#222] font-bold'
                : 'text-[#999] font-normal'
            }
          `}
        >
          채팅방
        </div>
      </button>
      <button
        data-active={activeTab === 'archive' ? 'On' : 'Off'}
        className={`px-3 py-1 border-b flex justify-center items-center
          ${activeTab === 'archive' ? 'border-[#222]' : 'border-[#bbb]'}
        `}
        aria-selected={activeTab === 'archive'}
        onClick={() => onTabChange('archive')}
      >
        <div
          className={`text-base leading-snug
            ${
              activeTab === 'archive'
                ? 'text-[#222] font-bold'
                : 'text-[#999] font-normal'
            }
          `}
        >
          자료방
        </div>
      </button>
    </div>
  );
}

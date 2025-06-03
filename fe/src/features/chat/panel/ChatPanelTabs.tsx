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
    <div className="inline-flex justify-start items-start overflow-hidden ml-8 mt-2">
      <button
        data-active={activeTab === 'chat' ? 'On' : 'Off'}
        className={`px-3 py-1 rounded-tl rounded-tr border-b flex justify-center items-center
          ${
            activeTab === 'chat'
              ? 'border-Border-Neutral-Default'
              : 'border-Border-Neutral-tertiary'
          }
        `}
        aria-selected={activeTab === 'chat'}
        onClick={() => onTabChange('chat')}
      >
        <div
          className={`text-base font-normal font-['Inter'] leading-snug ${
            activeTab === 'chat'
              ? 'text-Text-Neutral-Default'
              : 'text-Text-Neutral-Tertiary'
          }`}
        >
          채팅방
        </div>
      </button>
      <button
        data-active={activeTab === 'archive' ? 'On' : 'Off'}
        className={`px-3 py-1 rounded-tl rounded-tr border-b flex justify-center items-center
          ${
            activeTab === 'archive'
              ? 'border-Border-Neutral-Default'
              : 'border-Border-Neutral-tertiary'
          }
        `}
        aria-selected={activeTab === 'archive'}
        onClick={() => onTabChange('archive')}
      >
        <div
          className={`text-base font-normal font-['Inter'] leading-snug ${
            activeTab === 'archive'
              ? 'text-Text-Neutral-Default'
              : 'text-Text-Neutral-Tertiary'
          }`}
        >
          자료방
        </div>
      </button>
    </div>
  );
}

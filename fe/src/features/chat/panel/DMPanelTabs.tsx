import React from 'react';

interface DMPanelTabsProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export default function DMPanelTabs({
  tabs,
  activeTab,
  onTabChange,
}: DMPanelTabsProps) {
  return (
    <div className="inline-flex ml-8 mt-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`px-3 py-1 border-b flex justify-center items-center
            ${activeTab === tab.key ? 'border-[#222]' : 'border-[#bbb]'}
          `}
          aria-selected={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
        >
          <div
            className={`text-base leading-snug
              ${
                activeTab === tab.key
                  ? 'text-[#222] font-bold'
                  : 'text-[#999] font-normal'
              }
            `}
          >
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  );
}

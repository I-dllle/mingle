import React from 'react';

export default function ChatPanelListLayout({
  title,
  tabs,
  children,
  onBack,
}: {
  title: React.ReactNode;
  tabs?: React.ReactNode;
  children: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="border-b border-gray-100">
        <div className="flex items-center h-28 px-8">
          <div className="flex-1">{title}</div>
          {onBack && (
            <button
              className="bg-transparent border-none text-3xl cursor-pointer ml-4"
              onClick={onBack}
              aria-label="접기"
            >
              &gt;
            </button>
          )}
        </div>
      </div>
      {tabs && <div className="pt-4 px-8">{tabs}</div>}
      <div className="flex-1 overflow-y-auto pt-4 px-8">{children}</div>
    </div>
  );
}

import React from 'react';

export default function ChatPanelChatLayout({
  title,
  welcome,
  tabs,
  children,
  input,
}: {
  title: React.ReactNode;
  welcome?: React.ReactNode;
  tabs?: React.ReactNode;
  children: React.ReactNode;
  input?: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-full w-full bg-violet-400/20 border-l border-indigo-100 overflow-hidden">
      {/* 상단 헤더 */}
      <div className="z-10">{title}</div>
      {/* 안내/환영 메시지 */}
      {welcome && <div className="z-10">{welcome}</div>}
      {/* 탭 */}
      {tabs && <div className="z-10">{tabs}</div>}
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto z-0">{children}</div>
      {/* 입력창 */}
      {input && (
        <div className="w-full px-8 pb-8 z-10 bg-transparent absolute left-0 bottom-0">
          {input}
        </div>
      )}
    </div>
  );
}

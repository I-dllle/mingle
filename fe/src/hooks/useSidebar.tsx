'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type SidebarContextType = {
  isLeftOpen: boolean;
  setLeftOpen: (open: boolean) => void;
  isDeptOpen: boolean;
  setDeptOpen: (open: boolean) => void;
  isRightOpen: boolean;
  setRightOpen: (open: boolean) => void;

  activeIconId: string | null; // 공통 사이드바에서 현재 선택된 아이콘 ID
  setActiveIconId: (id: string | null) => void; // 아이콘 ID 상태를 변경하는 setter
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isLeftOpen, setLeftOpen] = useState(true);
  const [isDeptOpen, setDeptOpen] = useState(false);
  const [isRightOpen, setRightOpen] = useState(true);
  const [activeIconId, setActiveIconId] = useState<string | null>(null); // 현재 선택된 공통 사이드바 아이콘 ID 상태 저장 (null은 아무것도 선택 안 됨)

  return (
    <SidebarContext.Provider
      value={{
        isLeftOpen,
        setLeftOpen,
        isDeptOpen,
        setDeptOpen,
        isRightOpen,
        setRightOpen,
        activeIconId,
        setActiveIconId,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within a SidebarProvider');
  return ctx;
}

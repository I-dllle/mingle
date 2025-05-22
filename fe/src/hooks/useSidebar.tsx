'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type SidebarContextType = {
  isLeftOpen: boolean;
  setLeftOpen: (open: boolean) => void;
  isDeptOpen: boolean;
  setDeptOpen: (open: boolean) => void;
  isRightOpen: boolean;
  setRightOpen: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isLeftOpen, setLeftOpen] = useState(true);
  const [isDeptOpen, setDeptOpen] = useState(false);
  const [isRightOpen, setRightOpen] = useState(true);

  return (
    <SidebarContext.Provider
      value={{
        isLeftOpen,
        setLeftOpen,
        isDeptOpen,
        setDeptOpen,
        isRightOpen,
        setRightOpen,
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

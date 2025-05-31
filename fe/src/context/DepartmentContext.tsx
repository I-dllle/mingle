import React, { createContext, useContext } from "react";
import { departmentMenus } from "./departmentMenus"; // ← 방금 만든 파일

export interface DepartmentMenu {
  icon: string;
  name: string;
  id: number;
  path: string;
  isActive?: boolean;
}

export interface DepartmentInfo {
  name: string;
  menus: DepartmentMenu[];
}

export const DepartmentContext = createContext<DepartmentInfo>({
  name: "",
  menus: [],
});

export const useDepartment = () => useContext(DepartmentContext);

// Provider 생성 시, menus 자동 연결되도록 리팩토링
export function DepartmentProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: { name: string };
}) {
  const menus = departmentMenus[value.name] || departmentMenus.default;
  return (
    <DepartmentContext.Provider
      value={{
        name: value.name,
        menus,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
}

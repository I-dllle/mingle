'use client';

import { DepartmentProvider } from '@/context/DepartmentContext';

export default function ClientDepartmentProvider({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  return <DepartmentProvider value={{ name }}>{children}</DepartmentProvider>;
}

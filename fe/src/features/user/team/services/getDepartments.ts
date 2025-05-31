import { DepartmentResponse } from '../types/department';

export async function getDepartments(): Promise<DepartmentResponse[]> {
  const res = await fetch('/api/v1/departments');
  if (!res.ok) throw new Error('부서 목록 조회 실패');
  return res.json();
}

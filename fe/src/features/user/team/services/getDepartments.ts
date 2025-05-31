import { DepartmentResponse } from '../types/department';

export async function getDepartments(): Promise<DepartmentResponse[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${apiUrl}/departments`);
  if (!res.ok) throw new Error('부서 목록 조회 실패');
  return res.json();
}

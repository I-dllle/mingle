// 부서명과 부서 ID 매핑
export const departmentNameToId: Record<string, number> = {
  "Artist & Manager": 5,
  "System Operations": 6,
  "Creative Studio": 2,
  "Planning & A&R": 1,
  "Marketing & PR": 4,
  "Finance & Legal": 3,
};

// 부서명으로 부서 ID 조회하는 함수
export function getDepartmentIdByName(departmentName: string): number {
  return departmentNameToId[departmentName] || 1; // 기본값 1
}

// 사용 가능한 모든 부서명 목록 조회
export function getAllDepartmentNames(): string[] {
  return Object.keys(departmentNameToId);
}

// 주요 부서명만 조회 (공지사항 탭 등에서 사용)
export function getMainDepartmentNames(): string[] {
  return [
    "Artist & Manager",
    "Marketing & PR", 
    "Finance & Legal",
    "Creative Studio",
    "Planning & A&R",
    "System Operations"
  ];
}

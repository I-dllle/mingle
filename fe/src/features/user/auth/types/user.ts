// 사용자 타입 정의
import { Role, DepartmentRole, ProjectRole } from './roles';
export interface Department {
  departmentName: string;
}

export interface CurrentUser {
  id: number;
  name: string;
  nickname: string;
  departmentId: number;
  departmentName: string;
  departmentRole: DepartmentRole;
  projectRole: ProjectRole;
  role: Role;
  email: string;
}

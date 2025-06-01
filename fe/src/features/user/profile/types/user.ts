import { Department } from "../../auth/types/user";

export type User = {
  id: number;
  name: string;
  nickname: string;
  email: string;
  role: string;
  department: Department;
  // 필요한 필드 추가
};

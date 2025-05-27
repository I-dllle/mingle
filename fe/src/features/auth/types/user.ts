// 사용자 타입 정의

export interface Department {
  departmentName: string;
}

export interface CurrentUser {
  id: number;
  name: string;
  nickname: string;
  departmentName: string;
  role: string;
  email: string;
}

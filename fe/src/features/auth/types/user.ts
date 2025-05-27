export interface User {
  id: number;
  loginId: string;
  email?: string;
  nickname?: string;
  role: string;
  phoneNum?: string;
  imageUrl?: string;
  departmentId?: number;
  departmentName?: string;
  positionId?: number;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "ADMIN" | "STAFF" | "ARTIST";

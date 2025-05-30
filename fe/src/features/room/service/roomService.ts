import { apiClient } from "@/lib/api/apiClient";
import { Room } from "@/features/room/types/room";

export const roomService = {
  // 전체 방 조회
  async getAll(): Promise<Room[]> {
    return await apiClient<Room[]>("/room");
  },

  // 방 생성
  async create(room: Omit<Room, "id">): Promise<Room> {
    return await apiClient<Room>("/room", {
      method: "POST",
      body: JSON.stringify(room),
    });
  },

  // 방 수정
  async update(id: number, room: Omit<Room, "id">): Promise<Room> {
    return await apiClient<Room>(`/room/${id}`, {
      method: "PUT",
      body: JSON.stringify(room),
    });
  },

  // 방 삭제
  async delete(id: number): Promise<void> {
    await apiClient(`/room/${id}`, {
      method: "DELETE",
    });
  },

  // 방 단건 조회 (필요시)
  async getById(id: number): Promise<Room> {
    return await apiClient<Room>(`/room/${id}`);
  },
};

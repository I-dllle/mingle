// features/reservation/services/reservationService.ts

import { apiClient } from "@/lib/api/apiClient";
import type {
  Reservation,
  ReservationFormInput,
  ReservationStatus,
} from "@/features/reservation/types/reservation";
import { RoomWithReservations } from "@/features/reservation/types/roomWithReservations";
import type { RoomType } from "@/features/room/types/room";

export const reservationService = {
  // ✅ 전체 시간표 조회 (방 타입 + 날짜)
  async getRoomWithReservations(
    type: RoomType,
    date: string
  ): Promise<RoomWithReservations[]> {
    return await apiClient(`/reservations?type=${type}&date=${date}`);
  },

  // ✅ 내 예약 목록 조회
  async getMyReservations(): Promise<Reservation[]> {
    return await apiClient("/reservations/my");
  },

  // ✅ 단건 예약 조회 (상세 모달용)
  async getById(id: number): Promise<Reservation> {
    return await apiClient(`/reservations/${id}`);
  },

  // ✅ 예약 생성
  async create(data: ReservationFormInput): Promise<Reservation> {
    return await apiClient("/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ✅ 예약 수정 (사용자)
  async update(id: number, data: ReservationFormInput): Promise<Reservation> {
    return await apiClient(`/reservations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // ✅ 예약 취소 (사용자)
  async cancel(id: number): Promise<void> {
    return await apiClient(`/reservations/${id}`, {
      method: "PATCH",
    });
  },

  // ✅ 관리자 전용: 월간 예약 리스트
  async getAdminReservationsByMonth(month: string): Promise<Reservation[]> {
    return await apiClient(`/reservations/admin?month=${month}`);
  },

  // ✅ 관리자 전용: 수정
  async adminUpdate(
    id: number,
    data: ReservationFormInput
  ): Promise<Reservation> {
    return await apiClient(`/reservations/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // ✅ 관리자 전용: 강제 삭제
  async adminDelete(id: number): Promise<void> {
    return await apiClient(`/reservations/admin${id}`, {
      method: "DELETE",
    });
  },
};

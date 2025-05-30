// features/reservation/types/reservation.ts

import { ReservationStatus } from "./reservationStatus";

export interface Reservation {
  id: number;
  roomId: number;
  roomName: string;
  roomType: "MEETING_ROOM" | "PRACTICE_ROOM";
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  reservationStatus: ReservationStatus;
  userId: number;
  userName: string;
  title: string | null; // 예약 제목
}

// 예약 폼 입력 데이터 타입
export interface ReservationFormInput {
  roomId: number;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  reservations?: Reservation[]; // 충돌 체크용 기존 예약 목록
}

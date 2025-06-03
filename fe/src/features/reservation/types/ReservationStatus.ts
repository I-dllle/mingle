// reservationStatus.ts
export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: "예약 대기",
  [ReservationStatus.CONFIRMED]: "예약 확정",
  [ReservationStatus.CANCELLED]: "예약 취소",
  [ReservationStatus.COMPLETED]: "예약 완료",
};

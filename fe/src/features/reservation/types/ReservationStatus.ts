// reservationStatus.ts
export enum ReservationStatus {
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
}

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  [ReservationStatus.CONFIRMED]: "예약 확정",
  [ReservationStatus.CANCELED]: "예약 취소",
};

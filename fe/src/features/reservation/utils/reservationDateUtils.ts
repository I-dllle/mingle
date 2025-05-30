// features/reservation/utils/reservationDateUtils.ts

import { Reservation } from "@/features/reservation/types/reservation";
import { combineDateAndTime } from "@/lib/date";

/**
 * 두 시간 구간이 겹치는지 확인
 */
export const isTimeOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string,
  date: string
): boolean => {
  const aStart = combineDateAndTime(date, startA);
  const aEnd = combineDateAndTime(date, endA);
  const bStart = combineDateAndTime(date, startB);
  const bEnd = combineDateAndTime(date, endB);

  return aStart < bEnd && bStart < aEnd;
};

/**
 * 특정 시간대에 겹치는 예약이 있는지 확인
 */
export const hasConflict = (
  reservations: Reservation[],
  date: string,
  startTime: string,
  endTime: string
): boolean => {
  return reservations.some((res) => {
    if (res.date !== date || res.reservationStatus === "CANCELED") return false;
    return isTimeOverlap(startTime, endTime, res.startTime, res.endTime, date);
  });
};

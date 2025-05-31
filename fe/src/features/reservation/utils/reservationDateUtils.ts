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
    // 같은 날짜에서만 충돌 확인, 취소된 예약은 제외
    if (res.date !== date || res.reservationStatus === "CANCELED") return false;

    // 시간 겹침 확인
    return isTimeOverlap(startTime, endTime, res.startTime, res.endTime, date);
  });
};

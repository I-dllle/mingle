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
 * 시작 시간이 종료 시간보다 이전인지 검사
 */
export const isValidTimeRange = (
  startTime: string,
  endTime: string,
  date: string
): boolean => {
  const start = combineDateAndTime(date, startTime);
  const end = combineDateAndTime(date, endTime);
  return start < end;
};

/**
 * 오늘 날짜인지, 그리고 선택된 시작시간이 현재 시각 이전인지 검사
 *  - date가 오늘이고, combineDateAndTime(date, startTime) < now 라면 false 리턴
 *  - 그 외의 경우 (미래 날짜 혹은 시작시간 >= now)엔 true 리턴
 */
export const isNotPastStartTime = (
  date: string,
  startTime: string
): boolean => {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
  if (date !== todayStr) {
    // 오늘이 아닌 날짜를 선택했으면 무조건 OK
    return true;
  }

  const startDt = combineDateAndTime(date, startTime); // Date 객체
  return startDt >= now;
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

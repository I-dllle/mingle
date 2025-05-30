import {
  format,
  parseISO,
  formatISO,
  isSameDay as dfIsSameDay,
  getHours,
  getMinutes,
  set,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 날짜 포맷 (기본: yyyy-MM-dd)
 */
export const formatDate = (
  date: Date | string,
  formatString: string = "yyyy-MM-dd"
): string => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, formatString, { locale: ko });
};

/**
 * 시간 포맷 (24시간 HH:mm)
 */
export const formatTime = (time: Date | string): string => {
  const d = typeof time === "string" ? parseISO(time) : time;
  return format(d, "HH:mm");
};

/**
 * 날짜 + 시간 문자열을 Date 객체로 변환
 */
export const combineDateAndTime = (dateStr: string, timeStr: string): Date => {
  const [hour, minute] = timeStr.split(":").map(Number);
  const baseDate = parseISO(dateStr);
  return set(baseDate, {
    hours: hour,
    minutes: minute,
    seconds: 0,
    milliseconds: 0,
  });
};

/**
 * 시간 값을 HH:mm 문자열로 변환
 */
export const formatTimeFromParts = (hours: number, minutes: number): string =>
  `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

/**
 * ISO Date 문자열 (yyyy-MM-dd)
 */
export const toIsoDateString = (date: Date): string =>
  formatISO(date, { representation: "date" });

/**
 * 두 날짜가 같은 날인지 확인
 */
export const isSameDay = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const d2 = typeof date2 === "string" ? parseISO(date2) : date2;
  return dfIsSameDay(d1, d2);
};

/**
 * 날짜 객체의 요일 반환 (예: 월요일)
 */
export const getDayOfWeek = (date: Date | string): string =>
  formatDate(date, "EEEE");

/**
 * 간단한 요일 (예: 월, 화, 수)
 */
export const getShortDayOfWeek = (date: Date | string): string =>
  formatDate(date, "EEE");

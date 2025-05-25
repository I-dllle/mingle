import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  parseISO,
  addDays,
} from "date-fns";
import { ko } from "date-fns/locale";

// 특정 달의 모든 날짜 배열 가져오기
export const getMonthDays = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  return eachDayOfInterval({ start, end });
};

// 특정 날짜의 요일 가져오기 (0: 일요일, 6: 토요일)
export const getDayOfWeek = (date: Date) => {
  return getDay(date);
};

// 날짜 포맷팅 함수
export const formatDate = (
  date: Date | string,
  formatStr: string = "yyyy-MM-dd"
) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: ko });
};

// 시간 포맷팅 함수
export const formatTime = (
  date: Date | string,
  formatStr: string = "HH:mm"
) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

// 일정 텍스트 생성 (10:00 - 11:00 회의)
export const formatEventTime = (start: string, end: string, title: string) => {
  return `${formatTime(start)} - ${formatTime(end)} ${title}`;
};

/**
 * 날짜가 같은지 비교하는 함수
 * @param date1 첫번째 날짜
 * @param date2 두번째 날짜
 * @returns 날짜가 같으면 true, 다르면 false
 */
export const isSameDay = (
  date1: string | Date,
  date2: string | Date
): boolean => {
  const d1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const d2 = typeof date2 === "string" ? parseISO(date2) : date2;

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// FullCalendar 이벤트로 변환
export const convertToCalendarEvents = (schedules: any[]) => {
  if (!schedules || !Array.isArray(schedules)) return [];

  return schedules.map((schedule) => ({
    id: schedule.id.toString(),
    title: schedule.title,
    start: schedule.startTime,
    end: schedule.endTime,
    allDay:
      !schedule.startTime?.includes("T") ||
      isAllDayEvent(schedule.startTime, schedule.endTime),
    extendedProps: {
      description: schedule.description,
      memo: schedule.memo,
      scheduleType: schedule.scheduleType,
      scheduleStatus: schedule.scheduleStatus,
      departmentId: schedule.departmentId,
      userId: schedule.userId,
      postId: schedule.postId,
    },
  }));
};

// 종일 일정인지 확인하는 함수
export const isAllDayEvent = (startTime: string, endTime: string): boolean => {
  // startTime이 00:00:00이고 endTime이 23:59:59 또는 23:59:00인 경우 종일 일정으로 간주
  if (!startTime || !endTime) return false;

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const isStartMidnight =
      start.getHours() === 0 &&
      start.getMinutes() === 0 &&
      start.getSeconds() === 0;

    const isEndDayEnd =
      (end.getHours() === 23 && end.getMinutes() === 59) ||
      (end.getHours() === 23 &&
        end.getMinutes() === 59 &&
        (end.getSeconds() === 59 || end.getSeconds() === 0));

    return isStartMidnight && isEndDayEnd;
  } catch (error) {
    return false;
  }
};

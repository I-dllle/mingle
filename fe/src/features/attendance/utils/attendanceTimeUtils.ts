import {
  formatDate,
  formatTime,
  combineDateAndTime,
  isSameDay,
} from "@/lib/date";
import type {
  AttendanceStatus,
  LeaveType,
} from "../types/attendanceCommonTypes";
// 텍스트 색상이 필요한 경우 아래 import를 사용
// import { statusTextColorMap } from "./attendanceLabels";

/**
 * 출근 시간이 표준 출근 시간(09:00)보다 늦은지 확인
 */
export const isLateCheckIn = (checkInTime: Date | string): boolean => {
  const time =
    typeof checkInTime === "string" ? checkInTime : formatTime(checkInTime);
  return time > "09:00";
};

/**
 * 퇴근 시간이 표준 퇴근 시간(18:00)보다 빠른지 확인
 */
export const isEarlyCheckOut = (checkOutTime: Date | string): boolean => {
  const time =
    typeof checkOutTime === "string" ? checkOutTime : formatTime(checkOutTime);
  return time < "18:00";
};

/**
 * 현재 시간이 퇴근 가능 시간(18:00)인지 확인
 */
export const canCheckOut = (): boolean => {
  const now = new Date();
  const currentTime = formatTime(now);
  return currentTime >= "18:00";
};

/**
 * 야근 시간 계산 (18:00 이후 근무 시간)
 */
export const calculateOvertimeHours = (
  checkOutTime: Date | string,
  standardEndTime: string = "18:00"
): number => {
  if (!checkOutTime) return 0;

  const endTimeStr =
    typeof checkOutTime === "string" ? checkOutTime : formatTime(checkOutTime);

  if (endTimeStr <= standardEndTime) return 0;

  const [endHour, endMin] = endTimeStr.split(":").map(Number);
  const [stdHour, stdMin] = standardEndTime.split(":").map(Number);

  const endMinutes = endHour * 60 + endMin;
  const stdMinutes = stdHour * 60 + stdMin;

  return parseFloat(((endMinutes - stdMinutes) / 60).toFixed(2));
};

/**
 * 근무 시간 계산 (점심시간 1시간 제외)
 */
export const calculateWorkingHours = (
  checkInTime: Date | string,
  checkOutTime: Date | string,
  lunchHours: number = 1
): number => {
  if (!checkInTime || !checkOutTime) return 0;

  let start: Date;
  let end: Date;

  if (typeof checkInTime === "string" && typeof checkOutTime === "string") {
    // "HH:mm" 형식의 문자열일 경우, 같은 날짜로 가정하고 계산
    if (
      /^\d{2}:\d{2}$/.test(checkInTime) &&
      /^\d{2}:\d{2}$/.test(checkOutTime)
    ) {
      const today = new Date();
      const todayStr = formatDate(today);

      start = combineDateAndTime(todayStr, checkInTime);
      end = combineDateAndTime(todayStr, checkOutTime);

      // 퇴근이 다음날인 경우 (퇴근 시간이 출근 시간보다 이른 경우)
      if (end < start) {
        end.setDate(end.getDate() + 1);
      }
    } else {
      // ISO 문자열인 경우
      start = new Date(checkInTime);
      end = new Date(checkOutTime);
    }
  } else {
    start =
      typeof checkInTime === "string" ? new Date(checkInTime) : checkInTime;
    end =
      typeof checkOutTime === "string" ? new Date(checkOutTime) : checkOutTime;
  }

  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // 점심 시간 제외 (근무시간이 점심시간보다 짧으면 점심시간 제외 안함)
  return diffHours > lunchHours ? diffHours - lunchHours : diffHours;
};

/**
 * 출근 상태 반환
 * PRESENT: 정상 출근
 * LATE: 지각
 * ON_ANNUAL_LEAVE: 연차
 * ON_HALF_DAY_AM: 오전 반차
 * ON_HALF_DAY_PM: 오후 반차
 * 등의 상태 반환
 */
export const getAttendanceStatus = (
  checkInTime: Date | string | null,
  standardStartTime: string = "09:00"
): AttendanceStatus => {
  if (!checkInTime) return "ABSENT"; // 출근 기록 없음: 결근

  const time =
    typeof checkInTime === "string" ? checkInTime : formatTime(checkInTime);

  return time <= standardStartTime ? "PRESENT" : "LATE";
};

/**
 * 오늘 날짜인지 확인
 */
export const isToday = (date: Date | string): boolean => {
  return isSameDay(date, new Date());
};

/**
 * 주말인지 확인 (토요일, 일요일)
 */
export const isWeekend = (date: Date | string): boolean => {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = d.getDay();
  return day === 0 || day === 6; // 0: 일요일, 6: 토요일
};

/**
 * 주어진 날짜가 지정된 일수 이후인지 확인 (영업일 기준)
 */
export const isAtLeastBusinessDaysAhead = (
  targetDate: Date | string,
  days: number
): boolean => {
  let current = new Date();
  let businessDays = 0;
  let target =
    typeof targetDate === "string" ? new Date(targetDate) : targetDate;

  // 날짜 비교를 위해 시간 정보 초기화
  current = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate()
  );
  target = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  while (businessDays < days) {
    current.setDate(current.getDate() + 1); // 다음 날로 이동

    // 주말이 아닌 경우에만 영업일 카운트 증가
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      businessDays++;
    }
  }

  // 타겟 날짜가 계산된 일수 이후인지 확인
  return target >= current;
};

/**
 * 휴가 유형에 따른 유효성 검증
 */
export const validateLeaveRequest = (
  leaveType: LeaveType,
  startDate: Date | string,
  endDate?: Date | string
): { isValid: boolean; errorMessage?: string } => {
  const now = new Date();
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = endDate
    ? typeof endDate === "string"
      ? new Date(endDate)
      : endDate
    : start;

  // 종료일이 시작일보다 이전인 경우
  if (end < start) {
    return {
      isValid: false,
      errorMessage: "종료일이 시작일보다 이전일 수 없습니다.",
    };
  }

  switch (leaveType) {
    case "HALF_DAY_AM":
    case "HALF_DAY_PM":
      // 반차는 하루만 신청 가능
      if (!isSameDay(start, end)) {
        return {
          isValid: false,
          errorMessage: "반차는 하루만 신청 가능합니다.",
        };
      }
      break;

    case "EARLY_LEAVE":
      // 조퇴는 당일만 신청 가능
      if (!isToday(start)) {
        return {
          isValid: false,
          errorMessage: "조퇴는 당일만 신청 가능합니다.",
        };
      }
      break;

    case "MARRIAGE":
    case "PARENTAL":
    case "BEREAVEMENT":
    case "ANNUAL":
    case "SICK":
      // 휴가 유형들은 1영업일 전에 신청해야 함
      if (!isAtLeastBusinessDaysAhead(start, 1)) {
        return {
          isValid: false,
          errorMessage: "휴가는 최소 1영업일 전에 신청해야 합니다.",
        };
      }
      break;
  }

  return { isValid: true };
};

/**
 * 휴가 요청이 중복되는지 확인
 */
export const hasOverlappingLeaveRequests = (
  existingRequests: { leaveType: LeaveType; startDate: string | Date }[],
  newRequestType: LeaveType,
  startDate: Date | string
): boolean => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const startDateStr = formatDate(start);

  return existingRequests.some((request) => {
    // 같은 날짜에 같은 유형의 반차가 이미 있으면 중복
    if (
      request.leaveType === newRequestType &&
      isSameDay(request.startDate, startDateStr)
    ) {
      return true;
    }

    // 같은 날짜에 연차가 이미 있으면 중복
    if (
      request.leaveType === "ANNUAL" &&
      isSameDay(request.startDate, startDateStr)
    ) {
      return true;
    }

    return false;
  });
};

/**
 * 출근/퇴근 가능 여부 확인
 */
export const canCheckInOut = (
  currentStatus: AttendanceStatus | null,
  isCheckIn: boolean
): boolean => {
  if (!currentStatus) return true;

  // 출근 가능 여부
  if (isCheckIn) {
    switch (currentStatus) {
      case "ON_ANNUAL_LEAVE":
      case "ON_SICK_LEAVE":
      case "ON_OFFICIAL_LEAVE":
      case "ON_SPECIAL_LEAVE":
        return false;
      case "ON_HALF_DAY_AM":
        // 오전 반차는 오후에만 출근 가능
        const now = new Date();
        const isAfternoon = now.getHours() >= 12;
        return isAfternoon;
      case "ON_HALF_DAY_PM":
        // 오후 반차는 오전에만 출근 가능
        const now2 = new Date();
        const isMorning = now2.getHours() < 12;
        return isMorning;
      default:
        return true;
    }
  }
  // 퇴근 가능 여부
  else {
    // 출근했을 때만 퇴근 가능
    return ["PRESENT", "LATE", "ON_HALF_DAY_AM", "ON_HALF_DAY_PM"].includes(
      currentStatus
    );
  }
};

/**
 * 근무 상태에 따른 표시 텍스트 변환
 */
export const getAttendanceStatusText = (
  status: AttendanceStatus | null
): string => {
  if (!status) return "미출근";

  // attendanceLabels.ts 파일에서 가져온 레이블 사용
  // 직접 import하여 사용하는 것이 좋지만, 여기서는 순환 참조를 방지하기 위해 이 방법을 사용
  try {
    // attendanceLabels.ts에서 정의된 레이블을 사용
    const { attendanceStatusLabels } = require("./attendanceLabels");
    if (attendanceStatusLabels && attendanceStatusLabels[status]) {
      return attendanceStatusLabels[status];
    }
  } catch (e) {
    console.error("Failed to load attendanceLabels", e);
  }

  // fallback: 기본 레이블
  return status;
};

/**
 * 소수점 형태의 시간을 'X시간 Y분' 형식으로 변환합니다.
 * @param totalHours - 소수점 형태의 시간 (예: 5.5는 5시간 30분)
 * @returns 'X시간 Y분' 형식의 문자열
 */
export const formatHoursAndMinutes = (totalHours: number): string => {
  if (totalHours === null || totalHours === undefined || totalHours < 0) {
    return "0분";
  }

  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  if (minutes === 60) {
    return `${hours + 1}시간`;
  }

  const hourString = hours > 0 ? `${hours}시간` : "";
  const minuteString = minutes > 0 ? `${minutes}분` : "";

  if (hourString && minuteString) {
    return `${hourString} ${minuteString}`;
  }
  if (hourString) {
    return hourString;
  }
  if (minuteString) {
    return minuteString;
  }
  return "0분";
};

// 색상 관련 코드는 StatusBadge.tsx의 statusColorMap을 사용하거나 attendanceLabels.ts에서 가져와 사용

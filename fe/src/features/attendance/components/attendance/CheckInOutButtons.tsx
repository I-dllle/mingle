// CheckInOutButtons.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AttendanceRecord } from "@/features/attendance/types/attendance";
import attendanceService from "@/features/attendance/services/attendanceService";
import {
  isLateCheckIn,
  isEarlyCheckOut,
  canCheckOut,
} from "@/features/attendance/utils/attendanceTimeUtils";

interface CheckInOutButtonsProps {
  todayRecord?: AttendanceRecord | null;
  onSuccess?: (newRecord: AttendanceRecord) => void;
}

export default function CheckInOutButtons({
  todayRecord,
  onSuccess,
}: CheckInOutButtonsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const hasCheckedIn = !!todayRecord?.checkInTime;
  const hasCheckedOut = !!todayRecord?.checkOutTime;

  // 현재 시간을 한국 시간으로 표시
  const now = new Date();
  const currentTime = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  // 출근 버튼 클릭 핸들러
  const handleCheckIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await attendanceService.checkIn(); // 지각 여부 검사
      const isLate = result.checkInTime
        ? isLateCheckIn(result.checkInTime)
        : false;

      // 토스트 메시지 또는 알림 표시
      if (isLate) {
        // 지각 메시지 표시
      }

      // 상태 업데이트 및 콜백 호출
      if (onSuccess) {
        onSuccess(result);
      }

      // 출석 화면을 새로고침 또는 데이터 갱신
      router.refresh();
    } catch (err: any) {
      setError(err.message || "출근 처리 중 오류가 발생했습니다.");
      console.error("Check-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 퇴근 버튼 클릭 핸들러
  const handleCheckOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await attendanceService.checkOut(); // 조퇴 여부 검사
      const isEarly = result.checkOutTime
        ? isEarlyCheckOut(result.checkOutTime)
        : false;

      // 토스트 메시지 또는 알림 표시
      if (isEarly) {
        // 조퇴 메시지 표시
      }

      // 상태 업데이트 및 콜백 호출
      if (onSuccess) {
        onSuccess(result);
      }

      // 출석 화면을 새로고침 또는 데이터 갱신
      router.refresh();
    } catch (err: any) {
      setError(err.message || "퇴근 처리 중 오류가 발생했습니다.");
      console.error("Check-out error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  // 휴가 신청 페이지로 이동
  const handleLeaveRequest = () => {
    router.push("/attendance/requests/new");
  };

  // 연장근무 보고 페이지로 이동
  const handleOvertimeReport = () => {
    router.push("/attendance/requests/overtime");
  };
  // 근무 상태 요약
  const getStatusSummary = () => {
    if (!todayRecord) {
      return "아직 출근하지 않았습니다.";
    }

    if (hasCheckedIn && !hasCheckedOut && todayRecord.checkInTime) {
      const checkInTime = new Date(todayRecord.checkInTime);
      const currentTime = new Date();
      const diffMs = currentTime.getTime() - checkInTime.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `현재 ${diffHrs}시간 ${diffMins}분 근무 중`;
    }

    if (
      hasCheckedIn &&
      hasCheckedOut &&
      todayRecord.checkInTime &&
      todayRecord.checkOutTime
    ) {
      const checkInTime = new Date(todayRecord.checkInTime);
      const checkOutTime = new Date(todayRecord.checkOutTime);
      const diffMs = checkOutTime.getTime() - checkInTime.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `오늘 총 ${diffHrs}시간 ${diffMins}분 근무`;
    }

    return "";
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
      <div className="text-3xl font-bold text-gray-700 mb-2">{currentTime}</div>
      <div className="text-sm text-purple-600 font-medium mb-4">
        {getStatusSummary()}
      </div>
      {/* 출퇴근 버튼 */}
      <div className="grid grid-cols-2 gap-4 w-full mb-4">
        <button
          onClick={handleCheckIn}
          disabled={isLoading || hasCheckedIn}
          className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
            hasCheckedIn
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isLoading && !hasCheckedOut ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              처리중...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg
                className="mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              출근하기
            </div>
          )}
        </button>{" "}
        <button
          onClick={handleCheckOut}
          disabled={
            isLoading || !hasCheckedIn || hasCheckedOut || !canCheckOut()
          }
          className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
            !hasCheckedIn || hasCheckedOut || !canCheckOut()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isLoading && hasCheckedIn ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              처리중...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {" "}
              <svg
                className="mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-6 0l3-3m0 0l3 3m-3-3v12"
                />
              </svg>
              <span className="relative group">
                퇴근하기
                {!canCheckOut() && (
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    18:00 이후에 퇴근 가능합니다
                  </span>
                )}
              </span>
            </div>
          )}
        </button>
      </div>
      {/* 부가 기능 버튼 */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <button
          onClick={handleLeaveRequest}
          className="px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center"
        >
          <svg
            className="mr-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
            />
          </svg>
          휴가 신청
        </button>

        <button
          onClick={handleOvertimeReport}
          className="px-4 py-2 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center"
        >
          <svg
            className="mr-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          연장근무 보고
        </button>
      </div>
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}{" "}
      {/* 오늘의 출퇴근 상태 표시 */}
      {todayRecord && (
        <div className="mt-6 text-sm text-gray-600 border-t border-gray-100 pt-4 w-full">
          <div className="grid grid-cols-2 gap-2">
            {todayRecord.checkInTime && (
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <span className="font-medium">출근:</span>{" "}
                  {new Date(todayRecord.checkInTime).toLocaleTimeString(
                    "ko-KR",
                    { hour: "2-digit", minute: "2-digit" }
                  )}
                  {todayRecord.checkInTime &&
                    isLateCheckIn(todayRecord.checkInTime) && (
                      <span className="ml-2 text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full">
                        지각
                      </span>
                    )}
                </div>
              </div>
            )}
            {todayRecord.checkOutTime && (
              <div className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                <div>
                  <span className="font-medium">퇴근:</span>{" "}
                  {new Date(todayRecord.checkOutTime).toLocaleTimeString(
                    "ko-KR",
                    { hour: "2-digit", minute: "2-digit" }
                  )}
                  {todayRecord.checkOutTime &&
                    isEarlyCheckOut(todayRecord.checkOutTime) && (
                      <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full">
                        조퇴
                      </span>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

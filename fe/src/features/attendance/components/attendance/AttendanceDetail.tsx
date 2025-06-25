"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AttendanceDetail as AttendanceDetailType } from "@/features/attendance/types/attendance";
import attendanceService from "@/features/attendance/services/attendanceService";
import { AttendanceStatusBadge } from "./StatusBadge";
import { formatHoursAndMinutes } from "../../utils/attendanceTimeUtils";

interface AttendanceDetailProps {
  attendanceId: number | string;
  isAdmin?: boolean;
}

export default function AttendanceDetail({
  attendanceId,
  isAdmin = false,
}: AttendanceDetailProps) {
  const router = useRouter();

  const [attendance, setAttendance] = useState<AttendanceDetailType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 근태 데이터 로딩
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = isAdmin
          ? await attendanceService.getAttendanceRecordByAdmin(
              Number(attendanceId)
            )
          : await attendanceService.getAttendanceById(Number(attendanceId));

        setAttendance(data);
      } catch (err: any) {
        setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (attendanceId) {
      fetchAttendance();
    }
  }, [attendanceId, isAdmin]);

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // 오류 표시
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <p>{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-2 text-sm text-purple-600 hover:text-purple-800"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
        <p>근태 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.back()}
          className="mt-2 text-sm text-purple-600 hover:text-purple-800"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  // 날짜 형식화
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  // 시간 형식화
  const formatTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return "-";
    return new Date(dateTimeString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">근태 상세</h2>
        <AttendanceStatusBadge status={attendance.attendanceStatus} />
      </div>

      <div className="space-y-6">
        {/* 근태 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <p className="text-sm text-gray-500">날짜</p>
            <p className="font-medium text-gray-800">
              {formatDate(attendance.date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">상태</p>
            <p className="font-medium text-gray-800">
              <AttendanceStatusBadge status={attendance.attendanceStatus} />
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">출근 시간</p>
            <p className="font-medium text-gray-800">
              {attendance.checkInTime
                ? formatTime(attendance.checkInTime)
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">퇴근 시간</p>
            <p className="font-medium text-gray-800">
              {attendance.checkOutTime
                ? formatTime(attendance.checkOutTime)
                : "-"}
            </p>
          </div>
        </div>

        {/* 근무 시간 */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">근무 시간</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <p className="text-sm text-gray-500">일반 근무</p>
              <p className="font-medium text-gray-800">
                {formatHoursAndMinutes(attendance.workingHours)}
              </p>
            </div>

            {attendance.overtimeHours > 0 && (
              <div>
                <p className="text-sm text-gray-500">연장 근무</p>
                <p className="font-medium text-gray-800">
                  {formatHoursAndMinutes(attendance.overtimeHours)}
                </p>
              </div>
            )}

            {attendance.overtimeStart && (
              <div>
                <p className="text-sm text-gray-500">연장 근무 시작</p>
                <p className="font-medium text-gray-800">
                  {formatTime(attendance.overtimeStart)}
                </p>
              </div>
            )}

            {attendance.overtimeEnd && (
              <div>
                <p className="text-sm text-gray-500">연장 근무 종료</p>
                <p className="font-medium text-gray-800">
                  {formatTime(attendance.overtimeEnd)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 사유 */}
        {attendance.reason && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">사유</h3>
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
              {attendance.reason}
            </p>
          </div>
        )}

        {/* 버튼 그룹 */}
        <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
          {isAdmin && (
            <button
              type="button"
              onClick={() =>
                router.push(`/admin/panel/attendance/${attendanceId}/edit`)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

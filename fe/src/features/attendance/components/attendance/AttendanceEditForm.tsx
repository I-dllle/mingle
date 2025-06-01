"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  AttendanceStatus,
  LeaveType,
} from "@/features/attendance/types/attendanceCommonTypes";
import type { AttendanceDetail } from "@/features/attendance/types/attendance";
import attendanceService from "@/features/attendance/services/attendanceService";

import {
  attendanceStatusLabels,
  statusTextColorMap,
  leaveTypeLabels,
} from "@/features/attendance/utils/attendanceLabels";

interface AttendanceEditFormProps {
  attendanceId: string | number;
  onSuccess?: () => void;
}

export default function AttendanceEditForm({
  attendanceId,
  onSuccess,
}: AttendanceEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AttendanceDetail | null>(null);

  // 페이지가 로드되면 서버에서 근태 정보를 가져옴
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await attendanceService.getAttendanceRecordByAdmin(
          Number(attendanceId)
        );
        setFormData(data);
      } catch (err: any) {
        setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (attendanceId) {
      fetchAttendance();
    }
  }, [attendanceId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (!prev) return null;

      // “time” 필드 처리 (input type="time”)
      if (
        name === "checkInTime" ||
        name === "checkOutTime" ||
        name === "overtimeStart" ||
        name === "overtimeEnd"
      ) {
        if (!value) return { ...prev, [name]: null };
        const [hours, minutes] = value.split(":").map(Number);
        const newDate = new Date(prev.date);
        newDate.setHours(hours, minutes, 0, 0);
        return { ...prev, [name]: newDate.toISOString() };
      }

      // 숫자 필드 처리
      if (name === "workingHours" || name === "overtimeHours") {
        return {
          ...prev,
          [name]: value === "" ? 0 : parseFloat(value),
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setSubmitting(true);
      setError(null);
      await attendanceService.updateAttendanceByAdmin(
        Number(attendanceId),
        formData
      );
      alert("근태 기록이 성공적으로 수정되었습니다.");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/admin/panel/attendance/${attendanceId}`);
      }
    } catch (err: any) {
      setError(err.message || "근태 기록 수정 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

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

  if (!formData) {
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

  // “HH:mm” 형태로 만드는 헬퍼
  const formatTimeForInput = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  };

  // AttendanceStatus enum 배열 (타입스크립트가 직접 순회할 수는 없으므로, keyof로 변환)
  const attendanceStatusOptions = Object.keys(
    attendanceStatusLabels
  ) as AttendanceStatus[];

  // LeaveType enum 배열 (leaveTypeLabels를 순회)
  const leaveTypeOptions = Object.keys(leaveTypeLabels) as LeaveType[];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        근태 기록 수정
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 날짜(읽기 전용) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            날짜
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            날짜는 수정할 수 없습니다.
          </p>
        </div>

        {/* 근태 상태 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            근태 상태
          </label>
          <select
            name="attendanceStatus"
            value={formData.attendanceStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {attendanceStatusOptions.map((option) => (
              <option key={option} value={option}>
                {attendanceStatusLabels[option]}
              </option>
            ))}
          </select>
        </div>

        {/* 휴가 유형: “LEAVE” 상태일 때만 보이게 */}
        {formData.attendanceStatus.includes("LEAVE") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              휴가 유형
            </label>
            <select
              name="leaveType"
              value={formData.leaveType || "ANNUAL"}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {leaveTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {leaveTypeLabels[option]}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 출근/퇴근 시간 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              출근 시간
            </label>
            <input
              type="time"
              name="checkInTime"
              value={formatTimeForInput(formData.checkInTime)}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              퇴근 시간
            </label>
            <input
              type="time"
              name="checkOutTime"
              value={formatTimeForInput(formData.checkOutTime)}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* 근무 시간 / 연장근무 시간 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              근무 시간 (시간)
            </label>
            <input
              type="number"
              name="workingHours"
              value={formData.workingHours || 0}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연장 근무 시간 (시간)
            </label>
            <input
              type="number"
              name="overtimeHours"
              value={formData.overtimeHours || 0}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* 연장근무 시작/종료 (필요 시에만) */}
        {(formData.overtimeHours > 0 ||
          formData.attendanceStatus === "OVERTIME") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연장 근무 시작
              </label>
              <input
                type="time"
                name="overtimeStart"
                value={formatTimeForInput(formData.overtimeStart)}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                연장 근무 종료
              </label>
              <input
                type="time"
                name="overtimeEnd"
                value={formatTimeForInput(formData.overtimeEnd)}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}

        {/* 사유 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            사유
          </label>
          <textarea
            name="reason"
            value={formData.reason || ""}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="필요시 근태 관련 사유를 입력하세요"
          />
        </div>

        {/* 취소/저장 버튼 */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={submitting}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            disabled={submitting}
          >
            {submitting ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    </div>
  );
}

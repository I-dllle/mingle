"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";
import { LeaveType } from "@/features/attendance/types/attendanceCommonTypes";
import { leaveTypeLabels } from "@/features/attendance/utils/attendanceLabels";
import { AttendanceRequest } from "@/features/attendance/types/attendanceRequest";
import { useAuth } from "@/features/user/auth/hooks/useAuth";
import {
  validateLeaveRequest,
  hasOverlappingLeaveRequests,
} from "@/features/attendance/utils/attendanceTimeUtils";

interface RequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  userId?: number;
  isModal?: boolean; // 모달 방식인지 여부에 따라 UI 조정
  initialData?: {
    userId?: number;
    type: LeaveType;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    reason: string;
  };
  isEdit?: boolean;
  requestId?: number;
}

export default function RequestForm({
  onSuccess,
  onCancel,
  userId: propUserId,
  isModal = false,
  initialData,
  isEdit = false,
  requestId,
}: RequestFormProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [userId, setUserId] = useState<number | undefined>(
    initialData?.userId || propUserId
  );

  useEffect(() => {
    if (!initialData?.userId && !propUserId && user?.id) {
      setUserId(user.id);
    }
  }, [propUserId, user, initialData]);

  // 휴가 종류에 따라 시간 입력 필드가 필요한지 여부
  const timeBasedLeaveTypes: LeaveType[] = [
    "HALF_DAY_AM",
    "HALF_DAY_PM",
    "EARLY_LEAVE",
  ]; // 폼 상태
  const [formData, setFormData] = useState<{
    type: LeaveType; // 내부 폼 상태는 type으로 유지 (타입만 변경)
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    reason: string;
  }>(
    initialData
      ? {
          type: initialData.type,
          startDate:
            initialData.startDate || new Date().toISOString().split("T")[0],
          endDate:
            initialData.endDate || new Date().toISOString().split("T")[0],
          startTime: initialData.startTime || "09:00",
          endTime: initialData.endTime || "18:00",
          reason: initialData.reason || "",
        }
      : {
          type: "ANNUAL",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
          startTime: "09:00",
          endTime: "18:00",
          reason: "",
        }
  );

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showTimeFields, setShowTimeFields] = useState<boolean>(
    initialData ? timeBasedLeaveTypes.includes(initialData.type) : false
  );

  // 초기 데이터가 있을 경우 시간 필드 표시 여부를 설정
  useEffect(() => {
    if (initialData) {
      setShowTimeFields(timeBasedLeaveTypes.includes(initialData.type));
    }
  }, [initialData]);

  // 폼 입력값 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // 휴가 유형이 변경되었을 때 시간 필드 표시 여부 결정
    if (name === "type") {
      const leaveType = value as LeaveType;
      const needsTimeInput = timeBasedLeaveTypes.includes(leaveType);
      setShowTimeFields(needsTimeInput);

      // 반차(오전/오후)인 경우 시간 자동 설정
      if (value === "HALF_DAY_AM") {
        setFormData((prev) => ({
          ...prev,
          [name]: value as LeaveType,
          startTime: "09:00",
          endTime: "13:00",
          // 반차는 시작일과 종료일이 같아야 함
          endDate: prev.startDate,
        }));
        return;
      } else if (value === "HALF_DAY_PM") {
        setFormData((prev) => ({
          ...prev,
          [name]: value as LeaveType,
          startTime: "13:00",
          endTime: "18:00",
          // 반차는 시작일과 종료일이 같아야 함
          endDate: prev.startDate,
        }));
        return;
      } else if (value === "EARLY_LEAVE") {
        // 조퇴는 퇴근 시간만 변경
        setFormData((prev) => ({
          ...prev,
          [name]: value as LeaveType,
          endTime: "16:00",
          // 조퇴는 시작일과 종료일이 같아야 함
          endDate: prev.startDate,
        }));
        return;
      }
    }

    // 시작 날짜가 변경되면 종료 날짜도 업데이트 (종료 날짜는 시작 날짜보다 빠를 수 없음)
    if (name === "startDate") {
      if (new Date(value) > new Date(formData.endDate)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          endDate: value,
        }));
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: name === "type" ? (value as LeaveType) : value,
    }));
  };
  // 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!userId) {
      setError("사용자 정보를 불러올 수 없습니다.");
      setIsSubmitting(false);
      return;
    }

    try {
      // 휴가 신청 데이터 유효성 검사
      const validation = validateLeaveRequest(
        formData.type,
        formData.startDate,
        formData.endDate
      );

      if (!validation.isValid) {
        setError(validation.errorMessage || "유효하지 않은 요청입니다.");
        setIsSubmitting(false);
        return;
      }

      // 요청 데이터 준비
      const requestData: AttendanceRequest = {
        userId: userId || 0, // userId가 없으면 서버에서 현재 사용자 ID 사용
        leaveType: formData.type, // type -> leaveType으로 변경 (백엔드 DTO와 일치)
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        reason: formData.reason,
      };

      let response;
      // 수정 모드인 경우 updateRequest 호출
      if (isEdit && requestId) {
        console.log(`요청 ID ${requestId} 수정 시작:`, requestData);
        response = await attendanceRequestService.updateRequest(
          requestId,
          requestData
        );
        console.log("요청 수정 완료:", response);
      } else {
        // 신규 요청인 경우 submitRequest 호출
        console.log("새 요청 제출 시작:", requestData);
        response = await attendanceRequestService.submitRequest(requestData);
        console.log("새 요청 제출 완료:", response);
      } // 성공 처리
      if (isEdit) {
        alert("요청이 성공적으로 수정되었습니다.");
      } else {
        alert("요청이 성공적으로 제출되었습니다.");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        // 모달이 아닌 경우 목록 페이지로 이동
        router.push("/attendance/requests");
        router.refresh();
      }
    } catch (err: any) {
      const errorMessage = isEdit
        ? `요청 수정 중 오류가 발생했습니다: ${
            err.message || "알 수 없는 오류"
          }`
        : `요청 생성 중 오류가 발생했습니다: ${
            err.message || "알 수 없는 오류"
          }`;
      setError(errorMessage);
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-white ${
        isModal
          ? "rounded-lg p-6"
          : "rounded-lg shadow-md p-8 max-w-2xl mx-auto my-8"
      }`}
    >
      {!isModal && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? "휴가/출장 수정" : "휴가/출장 신청"}
        </h2>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* 휴가 유형 */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="type"
            >
              신청 유형
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              {(Object.keys(leaveTypeLabels) as LeaveType[]).map((type) => (
                <option key={type} value={type}>
                  {leaveTypeLabels[type]}
                </option>
              ))}
            </select>
          </div>

          {/* 날짜 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="startDate"
              >
                시작 날짜
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="endDate"
              >
                종료 날짜
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                disabled={
                  formData.type === "HALF_DAY_AM" ||
                  formData.type === "HALF_DAY_PM" ||
                  formData.type === "EARLY_LEAVE"
                }
              />
            </div>
          </div>

          {/* 시간 필드 (반차나 조퇴 등 시간 지정이 필요한 경우에만 표시) */}
          {showTimeFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="startTime"
                >
                  시작 시간
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required={showTimeFields}
                  disabled={
                    formData.type === "HALF_DAY_AM" ||
                    formData.type === "HALF_DAY_PM"
                  }
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="endTime"
                >
                  종료 시간
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required={showTimeFields}
                  disabled={
                    formData.type === "HALF_DAY_AM" ||
                    formData.type === "HALF_DAY_PM"
                  }
                />
              </div>
            </div>
          )}

          {/* 사유 */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="reason"
            >
              신청 사유
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="신청 사유를 입력하세요"
              required
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel || (() => router.back())}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isSubmitting}
            >
              취소
            </button>{" "}
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "제출 중..." : isEdit ? "수정하기" : "신청하기"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/user/auth/hooks/useAuth";
import attendanceService from "@/features/attendance/services/attendanceService";

interface OvertimeReportFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  userId?: number;
  isModal?: boolean;
}

export default function OvertimeReportForm({
  onSuccess,
  onCancel,
  userId: propUserId,
  isModal = false,
}: OvertimeReportFormProps) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [userId, setUserId] = useState<number | undefined>(propUserId);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 오늘 날짜
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  // 폼 데이터 상태 - 백엔드 DTO에 맞춤 (date, reason만 필요)
  const [formData, setFormData] = useState({
    date: formattedToday,
    reason: "", // 야근 사유
  });

  // 사용자 ID 설정
  useEffect(() => {
    if (!propUserId && user?.id) {
      setUserId(user.id);
    }
  }, [propUserId, user]);

  // 입력값 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 야근 보고 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // 유효성 검사
    if (!userId) {
      setError("사용자 정보를 불러올 수 없습니다.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.date) {
      setError("날짜를 입력해주세요.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.reason) {
      setError("야근 사유를 입력해주세요.");
      setIsSubmitting(false);
      return;
    }
    try {
      // API 요청 데이터 준비 - 백엔드 DTO에 맞춤 (userId 제거)
      const requestData = {
        date: formData.date,
        reason: formData.reason,
      };

      // 서버에 야근 보고 제출
      const response = await attendanceService.reportOvertime(requestData);

      // 성공 메시지 표시
      setSuccessMessage("야근 보고가 성공적으로 제출되었습니다.");

      // 콜백 호출 또는 페이지 이동
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setTimeout(() => {
          router.push("/attendance");
        }, 1500);
      }
    } catch (err: any) {
      console.error("오류 발생:", err);

      // 백엔드에서 반환한 상세 오류 메시지 파싱
      let errorDetail = "";
      let friendlyErrorMessage = "야근 보고 제출 중 오류가 발생했습니다.";

      try {
        // 오류 응답에서 메시지 추출 시도
        const errorResponse = err.response?.data || JSON.parse(err.message);
        errorDetail =
          errorResponse.message || errorResponse.error || err.message;
      } catch (e) {
        // JSON 파싱에 실패한 경우 원본 메시지 사용
        errorDetail = err.message || "";
      }

      // 특정 오류 메시지에 따른 사용자 친화적 메시지
      if (errorDetail.includes("미래 날짜에 대한 야근 보고는 불가능합니다")) {
        friendlyErrorMessage =
          "미래 날짜에 대한 야근 보고는 불가능합니다. 오늘 또는 과거 날짜를 선택해주세요.";
      } else if (errorDetail.includes("해당 날짜의 근태 기록이 없습니다")) {
        friendlyErrorMessage =
          "선택한 날짜의 출근 기록이 없습니다. 출근 기록이 있는 날짜를 선택해주세요.";
      } else if (
        errorDetail.includes("야근으로 기록된 날짜만 보고할 수 있습니다")
      ) {
        friendlyErrorMessage =
          "야근으로 기록된 날짜만 보고할 수 있습니다. 퇴근 시간이 18시 이후인 날짜를 선택해주세요.";
      } else if (errorDetail.includes("야근 시간이 기록되지 않았습니다")) {
        friendlyErrorMessage =
          "야근 시간이 기록되지 않았습니다. 올바른 퇴근 기록이 있는 날짜를 선택해주세요.";
      } else if (errorDetail.includes("ATTENDANCE_NOT_FOUND")) {
        friendlyErrorMessage =
          "출결 기록을 찾을 수 없습니다. 출근 기록이 있는 날짜를 선택해주세요.";
      }
      // JSON 파싱 오류인 경우
      else if (
        errorDetail.includes("JSON parse error") ||
        errorDetail.includes("Unrecognized field")
      ) {
        friendlyErrorMessage =
          "양식이 올바르게 제출되지 않았습니다. 모든 정보를 정확히 입력해주세요.";
      }
      // 기타 오류 처리
      else if (errorDetail) {
        friendlyErrorMessage = errorDetail;
      }
      setError(friendlyErrorMessage);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">연장근무 보고</h2>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            날짜
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={formattedToday}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            연장근무 사유
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded-md"
            placeholder="연장근무 사유를 자세히 입력해주세요."
            required
          ></textarea>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "제출 중..." : "보고서 제출"}
          </button>
        </div>
      </form>
    </div>
  );
}

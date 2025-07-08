"use client";

import { useState } from "react";
import { ApprovalStatus } from "@/features/attendance/types/attendanceCommonTypes";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";

interface AdminStatusChangeProps {
  requestId: number;
  currentStatus: ApprovalStatus;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const statusLabels: Record<ApprovalStatus, string> = {
  PENDING: "대기중",
  APPROVED: "승인됨",
  REJECTED: "반려됨",
};

const statusColors: Record<ApprovalStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  APPROVED: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
};

export default function AdminStatusChange({
  requestId,
  currentStatus,
  onSuccess,
  onCancel,
}: AdminStatusChangeProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<ApprovalStatus>(currentStatus);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 상태가 변경되지 않았으면 그냥 취소
    if (selectedStatus === currentStatus) {
      if (onCancel) onCancel();
      return;
    }

    // 반려로 변경할 때는 코멘트 필수
    if (selectedStatus === "REJECTED" && !comment.trim()) {
      setError("반려 시 사유를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await attendanceRequestService.changeRequestStatus(
        requestId,
        selectedStatus,
        comment
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "상태 변경 중 오류가 발생했습니다.");
      console.error("Status change error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        요청 상태 변경 (관리자)
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 현재 상태 표시 */}
        <div>
          <p className="text-sm text-gray-600 mb-2">현재 상태</p>
          <div
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${statusColors[currentStatus]}`}
          >
            {statusLabels[currentStatus]}
          </div>
        </div>

        {/* 새 상태 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            변경할 상태
          </label>
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as ApprovalStatus)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {(Object.keys(statusLabels) as ApprovalStatus[]).map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        {/* 변경 사유 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            변경 사유{" "}
            {selectedStatus === "REJECTED" && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={
              selectedStatus === "REJECTED"
                ? "반려 사유를 입력해주세요 (필수)"
                : "변경 사유를 입력해주세요 (선택사항)"
            }
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* 버튼들 */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              취소
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400"
            disabled={isSubmitting || selectedStatus === currentStatus}
          >
            {isSubmitting ? "변경 중..." : "상태 변경"}
          </button>
        </div>
      </form>
    </div>
  );
}

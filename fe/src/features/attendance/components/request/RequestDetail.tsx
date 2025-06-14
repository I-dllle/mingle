"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LeaveType,
  ApprovalStatus,
} from "@/features/attendance/types/attendanceCommonTypes";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";
import {
  leaveTypeLabels,
  approvalColorMap,
  statusBackgroundColorMap,
} from "@/features/attendance/utils/attendanceLabels";
import {
  ApprovalStatusBadge,
  LeaveTypeBadge,
} from "@/features/attendance/components/attendance/StatusBadge";
import ConfirmModal from "./ConfirmModal";

// LeaveType에 따른 배경색 매핑
const leaveTypeColorMap: Record<LeaveType, string> = {
  ANNUAL: "bg-indigo-100 text-indigo-800",
  SICK: "bg-purple-100 text-purple-800",
  HALF_DAY_AM: "bg-pink-100 text-pink-800",
  HALF_DAY_PM: "bg-pink-100 text-pink-800",
  OFFICIAL: "bg-sky-100 text-sky-800",
  BUSINESS_TRIP: "bg-teal-100 text-teal-800",
  MARRIAGE: "bg-green-100 text-green-800",
  BEREAVEMENT: "bg-gray-100 text-gray-800",
  PARENTAL: "bg-blue-100 text-blue-800",
  EARLY_LEAVE: "bg-orange-100 text-orange-800",
  OTHER: "bg-gray-100 text-gray-800",
};

interface RequestDetailProps {
  requestId: number | string;
  isAdmin?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function RequestDetail({
  requestId,
  isAdmin = false,
  onApprove,
  onReject,
}: RequestDetailProps) {
  const router = useRouter();

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<boolean>(false);

  // 모달 상태 관리
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);

  // 요청 데이터 로딩
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = isAdmin
          ? await attendanceRequestService.getRequestByIdForAdmin(
              Number(requestId)
            )
          : await attendanceRequestService.getRequestById(Number(requestId));
        console.log("API 응답 데이터:", data);
        console.log("날짜 필드 확인:", {
          startDate: data.startDate,
          endDate: data.endDate,
          startDateType: typeof data.startDate,
          endDateType: typeof data.endDate,
        });

        setRequest(data);
      } catch (err: any) {
        setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRequest();
    }
  }, [requestId, isAdmin]);
  // 승인 처리
  const handleApprove = async (comment: string = "") => {
    try {
      setProcessingAction(true);
      await attendanceRequestService.approveRequest(Number(requestId), comment);
      setShowApproveModal(false);

      if (onApprove) {
        onApprove();
      } else {
        // 요청 데이터 다시 로드
        const updatedRequest =
          await attendanceRequestService.getRequestByIdForAdmin(
            Number(requestId)
          );
        setRequest(updatedRequest);
      }
    } catch (err: any) {
      setError(err.message || "요청 승인 중 오류가 발생했습니다.");
      console.error("Approval error:", err);
    } finally {
      setProcessingAction(false);
    }
  };
  // 거부 처리
  const handleReject = async (comment?: string) => {
    // comment가 undefined이거나 빈 문자열이면 오류 처리
    if (!comment || !comment.trim()) {
      setError("거부 사유를 입력해주세요.");
      return;
    }

    try {
      setProcessingAction(true);
      await attendanceRequestService.rejectRequest(Number(requestId), comment);
      setShowRejectModal(false);

      if (onReject) {
        onReject();
      } else {
        // 요청 데이터 다시 로드
        const updatedRequest =
          await attendanceRequestService.getRequestByIdForAdmin(
            Number(requestId)
          );
        setRequest(updatedRequest);
      }
    } catch (err: any) {
      setError(err.message || "요청 거부 중 오류가 발생했습니다.");
      console.error("Rejection error:", err);
    } finally {
      setProcessingAction(false);
    }
  };
  // 요청 취소(삭제)
  const handleCancel = async () => {
    try {
      setProcessingAction(true);
      await attendanceRequestService.deleteRequest(Number(requestId));
      setShowCancelConfirm(false);

      alert("요청이 취소되었습니다.");
      router.push("/attendance/requests");
    } catch (err: any) {
      setError(err.message || "요청 취소 중 오류가 발생했습니다.");
      console.error("Cancel error:", err);
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <p className="font-semibold">오류 발생</p>
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

  if (!request) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md text-yellow-700">
        <p>요청 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.back()}
          className="mt-2 text-sm text-purple-600 hover:text-purple-800"
        >
          뒤로 가기
        </button>
      </div>
    );
  }
  const isRequestEditable = request.approvalStatus === "PENDING" && !isAdmin;
  const isRequestCancelable = request.approvalStatus === "PENDING" && !isAdmin;
  const canApproveOrReject = request.approvalStatus === "PENDING" && isAdmin; // 날짜 형식화 - 더 안정적인 날짜 처리를 위해 개선
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";

    try {
      // yyyy-MM-dd 형식인 경우 (백엔드에서 받은 LocalDate)
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        // yyyy-MM-dd 형식은 직접 파싱해서 처리
        const [year, month, day] = dateString.split("-").map(Number);

        // 날짜 객체 생성 (월은 0부터 시작하므로 -1 해줌)
        return new Date(year, month - 1, day).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short",
        });
      }
      // ISO 형식 문자열인 경우 (yyyy-MM-ddTHH:mm:ss.SSSZ)
      else if (/^\d{4}-\d{2}-\d{2}T.*/.test(dateString)) {
        const date = new Date(dateString);

        // 유효한 날짜인지 확인
        if (isNaN(date.getTime())) {
          console.log("유효하지 않은 날짜:", dateString);
          return dateString; // 원본 반환
        }

        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short",
        });
      }
      // 이미 변환된 경우 등 다른 형식의 문자열
      else {
        return dateString;
      }
    } catch (e) {
      console.error("날짜 형식 변환 오류:", e, "입력값:", dateString);
      return dateString;
    }
  };

  // 시간 형식화
  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return "-";

    try {
      // HH:mm 형식인지 확인
      if (/^\d{2}:\d{2}$/.test(timeString)) {
        return timeString; // 이미 HH:mm 형식이면 그대로 반환
      }

      // ISO 형식의 전체 날짜시간 문자열이라면
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(timeString)) {
        const date = new Date(timeString);

        // 유효한 날짜인지 확인
        if (isNaN(date.getTime())) {
          console.log("유효하지 않은 시간:", timeString);
          return timeString;
        }

        return date.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      return timeString;
    } catch (e) {
      console.error("시간 형식 변환 오류:", e, "입력값:", timeString);
      return timeString;
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">휴가 요청 상세</h2>
        <ApprovalStatusBadge status={request.approvalStatus} />
      </div>
      <div className="space-y-6">
        {/* 요청 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          {" "}
          <div>
            <p className="text-sm text-gray-500">요청 유형</p>
            <div className="mt-1">
              <LeaveTypeBadge leaveType={request.leaveType as LeaveType} />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">요청자</p>
            <p className="font-medium text-gray-800">
              {request.userName || "(정보 없음)"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">부서</p>
            <p className="font-medium text-gray-800">
              {request.departmentName || "(정보 없음)"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">요청일</p>
            <p className="font-medium text-gray-800">
              {request.createdAt
                ? formatDate(request.createdAt)
                : "(정보 없음)"}
            </p>
          </div>
        </div>
        {/* 휴가 기간 */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">휴가 기간</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <p className="text-sm text-gray-500">시작일</p>
              <p className="font-medium text-gray-800">
                {formatDate(request.startDate)}
              </p>
              {request.startTime && (
                <p className="text-sm text-gray-500">
                  {formatTime(request.startTime)}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">종료일</p>
              <p className="font-medium text-gray-800">
                {formatDate(request.endDate)}
              </p>
              {request.endTime && (
                <p className="text-sm text-gray-500">
                  {formatTime(request.endTime)}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <p className="text-sm text-gray-500">총 기간</p>
              <p className="font-medium text-gray-800">
                {request.leaveDays || request.days || 1}일
              </p>
            </div>
          </div>
        </div>
        {/* 요청 사유 */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">요청 사유</h3>
          <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
            {request.reason || "(사유 없음)"}
          </p>
        </div>
        {/* 승인/거부 정보 */}
        {request.approvalStatus !== "PENDING" && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              승인/거부 정보
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <p className="text-sm text-gray-500">처리자</p>
                <p className="font-medium text-gray-800">
                  {request.approverName || "(정보 없음)"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">처리일</p>
                <p className="font-medium text-gray-800">
                  {request.updatedAt
                    ? formatDate(request.updatedAt)
                    : "(정보 없음)"}
                </p>
              </div>
              {request.approvalStatus === "REJECTED" &&
                request.rejectReason && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">거부 사유</p>
                    <p className="text-red-600 bg-red-50 p-3 rounded-md whitespace-pre-wrap">
                      {request.rejectReason}
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}
        {/* 첨부 파일 */}
        {request.attachments && request.attachments.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              첨부 파일
            </h3>
            <div className="space-y-2">
              {request.attachments.map((file: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 hover:underline"
                  >
                    {file.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* 버튼 그룹 */}
        <div className="border-t border-gray-200 pt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            뒤로 가기
          </button>

          {isRequestEditable && (
            <button
              type="button"
              onClick={() =>
                router.push(`/attendance/requests/${requestId}/edit`)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={processingAction}
            >
              수정하기
            </button>
          )}

          {isRequestCancelable && (
            <button
              type="button"
              onClick={() => setShowCancelConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              disabled={processingAction}
            >
              {processingAction ? "처리중..." : "취소하기"}
            </button>
          )}

          {canApproveOrReject && (
            <>
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={processingAction}
              >
                {processingAction ? "처리중..." : "거부하기"}
              </button>

              <button
                type="button"
                onClick={() => setShowApproveModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={processingAction}
              >
                {processingAction ? "처리중..." : "승인하기"}
              </button>
            </>
          )}
        </div>
      </div>{" "}
      {/* 모달 컴포넌트들 */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancel}
        title="요청 취소"
        message="정말로 이 요청을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="취소하기"
        cancelText="닫기"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
        type="simple"
      />
      <ConfirmModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
        title="승인 의견"
        message="승인 관련 코멘트를 남길 수 있습니다."
        showCommentInput={true}
        commentRequired={false}
        commentPlaceholder="승인과 함께 남길 코멘트가 있다면 입력해주세요 (선택사항)"
        confirmText="승인"
        cancelText="취소"
        type="approve"
      />
      <ConfirmModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        title="반려 사유"
        message="반려 사유를 입력해주세요."
        showCommentInput={true}
        commentRequired={true}
        commentPlaceholder="반려 사유를 자세히 작성해주세요 (필수)"
        confirmText="반려"
        cancelText="취소"
        type="reject"
      />
    </div>
  );
}

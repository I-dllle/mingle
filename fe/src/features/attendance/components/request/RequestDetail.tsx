"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LeaveType,
  ApprovalStatus,
} from "@/features/attendance/types/attendanceCommonTypes";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";
import { leaveTypeLabels } from "@/features/attendance/utils/attendanceLabels";
import { ApprovalStatusBadge } from "@/features/attendance/components/attendance/StatusBadge";

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
  const [rejectReason, setRejectReason] = useState<string>("");
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);

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
  const handleApprove = async () => {
    try {
      setProcessingAction(true);
      await attendanceRequestService.approveRequest(Number(requestId));

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
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError("거부 사유를 입력해주세요.");
      return;
    }

    try {
      setProcessingAction(true);
      await attendanceRequestService.rejectRequest(
        Number(requestId),
        rejectReason
      );

      setShowRejectDialog(false);

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
    if (!window.confirm("정말로 이 요청을 취소하시겠습니까?")) {
      return;
    }

    try {
      setProcessingAction(true);
      await attendanceRequestService.deleteRequest(Number(requestId));

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
  const canApproveOrReject = request.approvalStatus === "PENDING" && isAdmin;

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
  const formatTime = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    return new Date(dateTimeString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {" "}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">휴가 요청 상세</h2>
        <ApprovalStatusBadge status={request.approvalStatus} />
      </div>
      <div className="space-y-6">
        {/* 요청 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <p className="text-sm text-gray-500">요청 유형</p>
            <p className="font-medium text-gray-800">
              {leaveTypeLabels[request.type as LeaveType] || request.type}
            </p>
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
        </div>{" "}
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
              </div>{" "}
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
                router.push(`/attendance/requests/edit/${requestId}`)
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
              onClick={handleCancel}
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
                onClick={() => setShowRejectDialog(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={processingAction}
              >
                {processingAction ? "처리중..." : "거부하기"}
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={processingAction}
              >
                {processingAction ? "처리중..." : "승인하기"}
              </button>
            </>
          )}
        </div>
      </div>
      {/* 거부 사유 입력 다이얼로그 */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              거부 사유 입력
            </h3>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
              placeholder="거부 사유를 입력하세요"
            />

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectReason("");
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={processingAction}
              >
                {processingAction ? "처리중..." : "거부 확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

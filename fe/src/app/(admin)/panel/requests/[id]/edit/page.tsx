"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import AdminStatusChange from "@/features/attendance/components/request/AdminStatusChange";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";
import type { AttendanceRequestDetail } from "@/features/attendance/types/attendanceRequest";

export default function AdminRequestEditPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [requestData, setRequestData] =
    useState<AttendanceRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 요청 데이터 로딩
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const data = await attendanceRequestService.getRequestByIdForAdmin(
          Number(requestId)
        );
        setRequestData(data);
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
  }, [requestId]);

  const handleSuccess = () => {
    // 상태 변경 성공 시 상세보기로 이동
    router.push(`/panel/requests/${requestId}/detail`);
  };

  const handleCancel = () => {
    // 취소 시 상세보기로 이동
    router.push(`/panel/requests/${requestId}/detail`);
  };

  if (loading) {
    return (
      <Modal
        maxWidth="max-w-2xl"
        onClose={() => router.push(`/panel/requests/${requestId}/detail`)}
      >
        <div className="flex justify-center items-center h-40 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Modal>
    );
  }

  if (error || !requestData) {
    return (
      <Modal
        maxWidth="max-w-2xl"
        onClose={() => router.push(`/panel/requests/${requestId}/detail`)}
      >
        <div className="bg-red-50 p-4 rounded-md text-red-700 m-8">
          <p className="font-semibold">오류 발생</p>
          <p>{error || "요청 정보를 불러올 수 없습니다."}</p>
          <button
            onClick={() => router.push(`/panel/requests/${requestId}/detail`)}
            className="mt-2 text-sm text-purple-600 hover:text-purple-800"
          >
            뒤로 가기
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal maxWidth="max-w-2xl" onClose={handleCancel}>
      <div className="p-2">
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            요청 정보
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">요청자:</span>{" "}
              <span className="font-medium">
                {requestData.nickname || requestData.userName || "(정보 없음)"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">부서:</span>{" "}
              <span className="font-medium">
                {requestData.departmentName || "(정보 없음)"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">요청 유형:</span>{" "}
              <span className="font-medium">{requestData.leaveType}</span>
            </div>
            <div>
              <span className="text-gray-600">기간:</span>{" "}
              <span className="font-medium">
                {requestData.startDate} ~ {requestData.endDate}
              </span>
            </div>
          </div>
        </div>

        <AdminStatusChange
          requestId={Number(requestId)}
          currentStatus={requestData.approvalStatus}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </Modal>
  );
}

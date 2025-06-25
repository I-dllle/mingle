"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import RequestForm from "@/features/attendance/components/request/RequestForm";
import attendanceRequestService from "@/features/attendance/services/attendanceRequestService";
import { LeaveType } from "@/features/attendance/types/attendanceCommonTypes";
import { AttendanceRequestDetail } from "@/features/attendance/types/attendanceRequest";

interface EditRequestPageProps {
  params: {
    id: string;
  };
}

export default function EditRequestPage({ params }: EditRequestPageProps) {
  const router = useRouter();
  // React.use()는 서버 컴포넌트에서만 사용 가능
  // Next.js 향후 버전 변경에 대비
  const requestId = parseInt(params.id, 10);

  // requestId가 유효하지 않으면 404 페이지 표시
  if (isNaN(requestId)) {
    notFound();
  }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] =
    useState<AttendanceRequestDetail | null>(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        setLoading(true);
        const data = await attendanceRequestService.getRequestById(requestId);

        // 자신의 요청만 수정 가능
        if (!data) {
          notFound();
          return;
        }

        // 대기 상태의 요청만 수정 가능
        if (data.approvalStatus !== "PENDING") {
          setError("승인되었거나 거부된 요청은 수정할 수 없습니다.");
          return;
        }

        setRequestData(data);
      } catch (err: any) {
        console.error("요청을 불러오는 중 에러 발생:", err);
        setError(err.message || "요청을 불러오는 중 에러가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(requestId)) {
      fetchRequestData();
    } else {
      notFound();
    }
  }, [requestId]);

  const handleSuccess = () => {
    router.push(`/attendance/requests/${requestId}`);
    router.refresh();
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
          <p className="font-semibold">오류 발생</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  if (!requestData) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6"></div>

      <RequestForm
        initialData={{
          userId: requestData.userId,
          type: requestData.leaveType as LeaveType,
          startDate: requestData.startDate,
          endDate: requestData.endDate,
          startTime: requestData.startTime || "09:00",
          endTime: requestData.endTime || "18:00",
          reason: requestData.reason || "",
        }}
        isEdit={true}
        requestId={requestId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}

"use client";

import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import RequestDetail from "@/features/attendance/components/request/RequestDetail";

export default function AdminRequestDetailModal() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  // 승인 후 콜백
  const handleApprove = () => {
    // 승인 성공 시 모달 닫고 목록으로 이동
    router.push("/panel/requests");
  };

  // 반려 후 콜백
  const handleReject = () => {
    // 반려 성공 시 모달 닫고 목록으로 이동
    router.push("/panel/requests");
  };

  return (
    <Modal maxWidth="max-w-5xl" onClose={() => router.push("/panel/requests")}>
      <RequestDetail
        requestId={requestId}
        isAdmin={true}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Modal>
  );
}

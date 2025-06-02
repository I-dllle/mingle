"use client";

import { useParams } from "next/navigation";
import RequestDetail from "@/features/attendance/components/request/RequestDetail";

export default function AttendanceRequestDetailPage() {
  const params = useParams();
  const requestId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">휴가 요청 상세</h1>
      <RequestDetail requestId={requestId} />
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import RequestDetail from "@/features/attendance/components/request/RequestDetail";

export default function AttendanceRequestDetailPage() {
  const params = useParams();
  const requestId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <RequestDetail requestId={requestId} />
    </div>
  );
}

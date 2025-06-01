"use client";

import { useParams } from "next/navigation";
import AttendanceDetail from "@/features/attendance/components/attendance/AttendanceDetail";

export default function AttendanceDetailPage() {
  const params = useParams();
  const attendanceId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">근태 상세</h1>
      <AttendanceDetail attendanceId={attendanceId} />
    </div>
  );
}

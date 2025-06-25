"use client";

import { useParams } from "next/navigation";
import AttendanceDetail from "@/features/attendance/components/attendance/AttendanceDetail";

export default function AttendanceDetailPage() {
  const params = useParams();
  const attendanceId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <AttendanceDetail attendanceId={attendanceId} />
    </div>
  );
}

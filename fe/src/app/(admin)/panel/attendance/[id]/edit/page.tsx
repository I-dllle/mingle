"use client";

import { useParams } from "next/navigation";
import AttendanceEditForm from "@/features/attendance/components/attendance/AttendanceEditForm";

export default function AttendanceEditPage() {
  const params = useParams();
  const attendanceId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">근태 기록 수정</h1>
      <AttendanceEditForm attendanceId={attendanceId} />
    </div>
  );
}

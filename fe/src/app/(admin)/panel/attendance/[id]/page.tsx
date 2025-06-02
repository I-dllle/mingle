"use client";

import { useParams } from "next/navigation";
import AttendanceDetail from "@/features/attendance/components/attendance/AttendanceDetail";

export default function AdminAttendanceDetailPage() {
  const params = useParams();
  const attendanceId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">근태 상세 관리</h1>
          <p className="text-gray-600 mt-2">
            직원의 근태 정보를 확인하고 수정할 수 있습니다.
          </p>
        </div>

        <AttendanceDetail attendanceId={attendanceId} isAdmin={true} />
      </div>
    </div>
  );
}

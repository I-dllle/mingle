"use client";

import { useParams } from "next/navigation";
import Modal from "@/components/ui/Modal";
import AttendanceDetail from "@/features/attendance/components/attendance/AttendanceDetail";

export default function AdminAttendanceDetailPage() {
  const params = useParams();
  const attendanceId = params.id as string;

  return (
    <Modal maxWidth="max-w-4xl">
      <div className="p-6">
        <AttendanceDetail attendanceId={attendanceId} isAdmin={true} />
      </div>
    </Modal>
  );
}

"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import ScheduleDetailModal from "@/features/schedule/components/modals/ScheduleDetailModal";

interface ScheduleDetailPageProps {
  params: Promise<{
    scheduleId: string;
  }>;
}

export default function ScheduleDetailPage({
  params,
}: ScheduleDetailPageProps) {
  const router = useRouter();
  const { scheduleId } = use(params);
  const scheduleIdNum = parseInt(scheduleId);

  const handleClose = () => {
    // 모달을 닫으면 메인 스케줄 페이지로 돌아갑니다
    router.back();
  };

  // scheduleId가 유효한 숫자가 아니면 메인 페이지로 리디렉션
  if (isNaN(scheduleIdNum)) {
    router.replace("/schedule");
    return null;
  }

  return (
    <ScheduleDetailModal scheduleId={scheduleIdNum} onClose={handleClose} />
  );
}

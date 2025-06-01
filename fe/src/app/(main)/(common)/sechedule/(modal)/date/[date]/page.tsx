"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import ScheduleListModal from "@/features/schedule/components/modals/ScheduleListModal";

interface DaySchedulePageProps {
  params: Promise<{
    date: string;
  }>;
}

export default function DaySchedulePage({ params }: DaySchedulePageProps) {
  const router = useRouter();
  const { date } = use(params);

  // date가 유효한 형식인지 확인 (YYYY-MM-DD)
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);

  const handleClose = () => {
    // 모달을 닫으면 메인 스케줄 페이지로 돌아갑니다
    router.back();
  };

  // 날짜 형식이 유효하지 않으면 모달을 표시하지 않고 메인 페이지로 리디렉션
  if (!isValidDate) {
    router.replace("/schedule");
    return null;
  }

  return <ScheduleListModal date={date} onClose={handleClose} />;
}

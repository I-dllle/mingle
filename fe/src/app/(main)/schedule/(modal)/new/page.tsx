"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Modal from "@/features/schedule/components/ui/Modal";
import ScheduleForm from "@/features/schedule/components/forms/ScheduleForm";

export default function NewScheduleModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const handleClose = () => {
    // 모달을 닫으면 메인 스케줄 페이지로 돌아갑니다
    router.back();
  };
  return (
    <Modal title="새 일정 등록" onClose={handleClose}>
      <ScheduleForm initialDate={date} onClose={handleClose} />
    </Modal>
  );
}

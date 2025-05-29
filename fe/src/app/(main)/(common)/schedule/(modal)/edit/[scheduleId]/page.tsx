"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Modal from "@/features/schedule/components/ui/Modal";
import ScheduleForm from "@/features/schedule/components/forms/ScheduleForm";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { Schedule } from "@/features/schedule/types/Schedule";

interface EditSchedulePageProps {
  params: Promise<{
    scheduleId: string;
  }>;
}

export default function EditScheduleModal({ params }: EditSchedulePageProps) {
  const router = useRouter();
  const { scheduleId } = use(params);
  const scheduleIdNum = parseInt(scheduleId);

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedule() {
      if (isNaN(scheduleIdNum)) {
        router.replace("/schedule");
        return;
      }

      setIsLoading(true);
      try {
        const data = await scheduleService.getScheduleById(scheduleIdNum);
        setSchedule(data);
      } catch (error) {
        console.error("일정을 불러오는데 실패했습니다", error);
        setError("일정을 불러오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSchedule();
  }, [scheduleIdNum, router]);

  const handleClose = () => {
    // 모달을 닫으면 메인 스케줄 페이지로 돌아갑니다
    router.back();
  };
  return (
    <Modal title="일정 수정" onClose={handleClose}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : schedule ? (
        <ScheduleForm
          initialData={schedule}
          isEditing={true}
          onClose={handleClose}
        />
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">일정을 찾을 수 없습니다.</p>
        </div>
      )}
    </Modal>
  );
}

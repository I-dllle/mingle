"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ScheduleForm from "@/features/schedule/components/ScheduleForm";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { Schedule } from "@/features/schedule/types/Schedule";

export default function EditSchedulePage() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = Number(params.scheduleId);

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await scheduleService.getScheduleById(scheduleId);
        setSchedule(data);
      } catch (error) {
        console.error("일정을 불러오는 중 오류가 발생했습니다", error);
        router.push("/schedule");
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchSchedule();
    }
  }, [scheduleId, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center">
        <p>일정 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-xl font-bold mb-4">일정을 찾을 수 없습니다</h2>
        <button
          onClick={() => router.push("/schedule")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          일정 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">일정 수정</h1>
        <ScheduleForm initialData={schedule} isEditing={true} />
      </div>
    </div>
  );
}

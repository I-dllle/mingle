"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { Schedule } from "@/features/schedule/types/Schedule";
import { formatDate } from "@/features/schedule/utils/calendarUtils";
import StatusBadge from "@/features/schedule/components/StatusBadge";

export default function ScheduleDetailPage() {
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
      } finally {
        setLoading(false);
      }
    };

    if (scheduleId) {
      fetchSchedule();
    }
  }, [scheduleId]);

  const handleDelete = async () => {
    if (confirm("정말 이 일정을 삭제하시겠습니까?")) {
      try {
        await scheduleService.deleteSchedule(scheduleId);
        router.push("/schedule");
      } catch (error) {
        console.error("일정 삭제 중 오류가 발생했습니다", error);
      }
    }
  };

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
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{schedule.title}</h1>
            <StatusBadge status={schedule.scheduleStatus} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-gray-500 mb-2">일정 정보</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">시작:</span>{" "}
                  {formatDate(schedule.startTime, "yyyy년 MM월 dd일 HH:mm")}
                </p>
                <p>
                  <span className="font-medium">종료:</span>{" "}
                  {formatDate(schedule.endTime, "yyyy년 MM월 dd일 HH:mm")}
                </p>
                <p>
                  <span className="font-medium">일정 유형:</span>{" "}
                  {schedule.scheduleType}
                </p>
                {schedule.departmentId && (
                  <p>
                    <span className="font-medium">부서 ID:</span>{" "}
                    {schedule.departmentId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {schedule.description && (
            <div className="mb-6">
              <h3 className="text-gray-500 mb-2">설명</h3>
              <p className="bg-gray-50 p-3 rounded">{schedule.description}</p>
            </div>
          )}

          {schedule.memo && (
            <div className="mb-6">
              <h3 className="text-gray-500 mb-2">메모</h3>
              <p className="bg-gray-50 p-3 rounded whitespace-pre-line">
                {schedule.memo}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => router.push("/schedule")}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md"
            >
              목록으로
            </button>
            <button
              onClick={() => router.push(`/schedule/edit/${scheduleId}`)}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md"
            >
              수정하기
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-md"
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

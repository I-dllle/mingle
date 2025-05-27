"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { Schedule } from "../../types/Schedule";
import { formatDate } from "../../utils/calendarUtils";
import StatusBadge from "../ui/StatusBadge";
import { scheduleService } from "../../services/scheduleService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ScheduleFormModal } from "./ScheduleFormModal";
import { scheduleTypeLabels } from "../../constants/scheduleLabels";

interface ScheduleDetailModalProps {
  scheduleId: number;
  onClose: () => void;
}

export default function ScheduleDetailModal({
  scheduleId,
  onClose,
}: ScheduleDetailModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isAdmin =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUPER_ADMIN";
  const canEditDelete = isAdmin || schedule?.userId === user?.id;

  useEffect(() => {
    async function fetchSchedule() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await scheduleService.getScheduleById(scheduleId);
        setSchedule(data);
      } catch (error) {
        console.error("일정을 불러오는데 실패했습니다", error);
        setError(
          "일정 상세 정보를 불러오는데 실패했습니다. 다시 시도해주세요."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchSchedule();
  }, [scheduleId]);

  const handleDeleteSchedule = async () => {
    if (!schedule || !confirm("정말 이 일정을 삭제하시겠습니까?")) return;

    setIsLoading(true);
    try {
      await scheduleService.deleteSchedule(schedule.id);
      onClose();
      router.refresh();
    } catch (error) {
      console.error("일정 삭제에 실패했습니다", error);
      setError("일정 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComplete = () => {
    setIsEditModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <Modal onClose={onClose}>
        <div className="w-full max-w-2xl bg-white rounded-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="py-16 flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : schedule ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {schedule.title}
                  </h2>
                  <StatusBadge status={schedule.scheduleStatus} />
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      시간
                    </h3>
                    <p className="text-gray-900">
                      {formatDate(schedule.startTime, "yyyy년 MM월 dd일 HH:mm")}{" "}
                      ~
                      <br />
                      {formatDate(schedule.endTime, "yyyy년 MM월 dd일 HH:mm")}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      일정 유형
                    </h3>
                    <p className="text-gray-900">
                      {scheduleTypeLabels[schedule.scheduleType]}
                    </p>
                  </div>
                  {schedule.departmentId && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        부서
                      </h3>
                      <p className="text-gray-900">{schedule.departmentId}</p>
                    </div>
                  )}
                </div>

                {schedule.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      설명
                    </h3>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                      {schedule.description}
                    </p>
                  </div>
                )}
              </div>

              {schedule.memo && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    메모
                  </h3>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-line">
                    {schedule.memo}
                  </p>
                </div>
              )}

              {canEditDelete && (
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteSchedule}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    삭제
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </Modal>

      {isEditModalOpen && schedule && (
        <ScheduleFormModal
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditComplete}
          schedule={schedule}
          mode="edit"
        />
      )}
    </>
  );
}

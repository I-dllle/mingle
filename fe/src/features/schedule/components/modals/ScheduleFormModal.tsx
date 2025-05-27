import React, { useState } from "react";
import { Schedule, ScheduleFormData } from "../../types/Schedule";
import { ScheduleType, ScheduleStatus } from "../../types/Enums";
import { scheduleService } from "../../services/scheduleService";
import { formatDate } from "../../utils/calendarUtils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Modal from "@/features/schedule/components/ui/Modal";
import { scheduleStatusLabels } from "../../constants/scheduleLabels";

interface ScheduleFormModalProps {
  onClose: () => void;
  onSubmit: () => void;
  schedule?: Schedule;
  mode: "create" | "edit";
  initialStartDate?: string;
}

export function ScheduleFormModal({
  onClose,
  onSubmit,
  schedule,
  mode,
  initialStartDate,
}: ScheduleFormModalProps) {
  const { user } = useAuth();
  const isAdmin =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUPER_ADMIN";
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: schedule?.title || "",
    description: schedule?.description || "",
    startTime:
      schedule?.startTime ||
      (initialStartDate
        ? `${initialStartDate}T09:00:00`
        : (() => {
            const date = new Date();
            date.setHours(9, 0, 0);
            return formatDate(date, "yyyy-MM-dd'T'HH:mm");
          })()),
    endTime:
      schedule?.endTime ||
      (initialStartDate
        ? `${initialStartDate}T10:00:00`
        : (() => {
            const date = new Date();
            date.setHours(10, 0, 0);
            return formatDate(date, "yyyy-MM-dd'T'HH:mm");
          })()),
    memo: schedule?.memo || "",
    scheduleType: schedule?.scheduleType || ScheduleType.PERSONAL,
    scheduleStatus: schedule?.scheduleStatus || ScheduleStatus.NONE,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "startTime") {
      const startDate = new Date(value);
      if (!isNaN(startDate.getTime())) {
        const endDate = new Date(formData.endTime);
        if (startDate > endDate) {
          // 종료 시간을 시작 시간 1시간 후로 자동 설정
          const newEndTime = new Date(startDate.getTime() + 60 * 60 * 1000);
          setFormData((prev) => ({
            ...prev,
            [name]: value,
            endTime: formatDate(newEndTime, "yyyy-MM-dd'T'HH:mm"),
          }));
          return;
        }
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        await scheduleService.createSchedule(formData);
      } else {
        await scheduleService.updateSchedule(schedule!.id, formData);
      }
      onSubmit();
      onClose();
    } catch (error) {
      setError("일정 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {mode === "create" ? "새 일정 만들기" : "일정 수정하기"}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시작 시간
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400"
                step="1800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종료 시간
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400"
                min={formData.startTime}
                step="1800"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                일정 유형
              </label>
              <select
                name="scheduleType"
                value={formData.scheduleType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value={ScheduleType.PERSONAL}>개인 일정</option>
                {isAdmin && (
                  <>
                    <option value={ScheduleType.DEPARTMENT}>부서 일정</option>
                    <option value={ScheduleType.COMPANY}>회사 일정</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태
              </label>
              <select
                name="scheduleStatus"
                value={formData.scheduleStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(scheduleStatusLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메모
            </label>
            <textarea
              name="memo"
              value={formData.memo}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isLoading
                ? "저장 중..."
                : mode === "create"
                ? "생성하기"
                : "수정하기"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

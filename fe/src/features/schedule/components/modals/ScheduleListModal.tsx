"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { EventInput } from "@fullcalendar/core";
import Modal from "@/features/schedule/components/ui/Modal";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { ScheduleType } from "../../types/Enums";
import ScheduleCard from "@/features/schedule/components/ui/ScheduleCard";
import { CalendarIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ScheduleFormModal } from "./ScheduleFormModal";
import ScheduleDetailModal from "./ScheduleDetailModal";

interface ScheduleListModalProps {
  date: string;
  onClose: () => void;
}

export default function ScheduleListModal({
  date,
  onClose,
}: ScheduleListModalProps) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ScheduleType | "ALL">("ALL");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const dateObj = new Date(date);
      // daily API를 사용하여 해당 날짜의 일정만 가져옴
      const schedules = await scheduleService.getDailyView(dateObj);
      setEvents(
        schedules.map((s) => ({
          id: String(s.id),
          title: s.title,
          start: s.startTime,
          end: s.endTime,
          extendedProps: {
            status: s.scheduleStatus,
            type: s.scheduleType,
            description: s.description,
          },
        }))
      );
    } catch (error) {
      console.error("일정을 불러오는데 실패했습니다", error);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 일정 유형별 필터링
  const filteredEvents =
    filter === "ALL"
      ? events
      : events.filter((event) => event.extendedProps?.type === filter);

  const handleAddSchedule = () => {
    setIsFormModalOpen(true);
  };

  const handleFormClose = () => {
    setIsFormModalOpen(false);
  };

  const handleFormSubmit = () => {
    setIsFormModalOpen(false);
    fetchEvents();
  };
  const handleScheduleClick = (event: EventInput) => {
    setSelectedScheduleId(Number(event.id));
    setIsDetailModalOpen(true);
  };
  return (
    <>
      <Modal onClose={onClose} title={formattedDate}>
        <div>
          {/* 제목 및 새 일정 버튼 */}
          <div className="flex justify-end px-5 mb-6">
            <button
              onClick={handleAddSchedule}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-1" />새 일정
            </button>
          </div>

          {/* 필터 버튼 */}
          <div className="flex gap-2 mb-4 px-5 overflow-x-auto scrollbar-hide">
            <button
              className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === "ALL"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setFilter("ALL")}
            >
              전체
            </button>
            {[
              { type: ScheduleType.PERSONAL, label: "개인" },
              { type: ScheduleType.DEPARTMENT, label: "부서" },
              { type: ScheduleType.COMPANY, label: "회사" },
            ].map(({ type, label }) => (
              <button
                key={type}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === type
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setFilter(type)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 일정 목록 */}
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600" />
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <ScheduleCard
                      event={event}
                      onClick={() => handleScheduleClick(event)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <CalendarIcon className="w-12 h-12 text-gray-300" />
                <div className="text-center">
                  <p className="text-gray-500 mb-2">
                    이 날짜에는 일정이 없습니다
                  </p>
                  <button
                    onClick={handleAddSchedule}
                    className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center"
                  >
                    새로운 일정 추가하기
                    <PlusIcon className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>{" "}
      {/* + 새 일정 폼 모달 */}
      {isFormModalOpen && (
        <ScheduleFormModal
          mode="create"
          initialStartDate={date}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={() => {
            setIsFormModalOpen(false);
            fetchEvents(); // 리스트 새로고침
          }}
        />
      )}
      {/* 상세 보기 모달 */}
      {isDetailModalOpen && selectedScheduleId !== null && (
        <ScheduleDetailModal
          scheduleId={selectedScheduleId}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </>
  );
}

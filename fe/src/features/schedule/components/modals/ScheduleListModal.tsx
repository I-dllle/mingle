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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 제목 및 새 일정 버튼 */}
          <div className="flex justify-end px-5 py-4">
            <button
              onClick={handleAddSchedule}
              className="inline-flex items-center px-4 py-2 border border-purple-200 text-sm font-medium rounded-full text-white bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4 mr-1.5" />새 일정 추가
            </button>
          </div>

          {/* 필터 버튼 */}
          <div className="flex gap-2 mb-5 px-5 overflow-x-auto pb-3 scrollbar-hide">
            <button
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === "ALL"
                  ? "bg-purple-500 text-white shadow-md shadow-purple-200"
                  : "bg-gray-50 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
              }`}
              onClick={() => setFilter("ALL")}
            >
              전체
            </button>
            {[
              {
                type: ScheduleType.PERSONAL,
                label: "개인",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ),
              },
              {
                type: ScheduleType.DEPARTMENT,
                label: "부서",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
              },
              {
                type: ScheduleType.COMPANY,
                label: "회사",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                ),
              },
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${
                  filter === type
                    ? "bg-purple-500 text-white shadow-md shadow-purple-200"
                    : "bg-gray-50 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
                }`}
                onClick={() => setFilter(type)}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* 일정 목록 */}
          <div className="border-t border-purple-100 bg-white">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-10">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-purple-100"></div>
                  <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-purple-500 animate-spin"></div>
                </div>
                <p className="mt-4 text-purple-500 font-medium animate-pulse">
                  일정 불러오는 중...
                </p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="divide-y divide-purple-50 max-h-[65vh] overflow-y-auto">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="px-5 py-4 hover:bg-purple-50/50 transition-all duration-200 cursor-pointer group"
                  >
                    <ScheduleCard
                      event={event}
                      onClick={() => handleScheduleClick(event)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 space-y-6">
                <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center animate-pulse">
                  <CalendarIcon className="w-10 h-10 text-purple-300" />
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-3">
                    이 날짜에는 일정이 없습니다
                  </p>
                  <button
                    onClick={handleAddSchedule}
                    className="inline-flex items-center px-6 py-2.5 rounded-full text-white bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 font-medium shadow-md shadow-purple-200 transition-all duration-200"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    새로운 일정 추가하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

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
          onDeleteSuccess={() => {
            // 모달 닫고, 리스트를 다시 불러옵니다
            setIsDetailModalOpen(false);
            fetchEvents();
          }}
        />
      )}
    </>
  );
}

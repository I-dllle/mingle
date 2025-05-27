"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { ScheduleType } from "@/features/schedule/types/Enums";
import { ScheduleFormModal } from "../modals/ScheduleFormModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";

export default function FullCalendarView() {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedType, setSelectedType] = useState<ScheduleType | "all">("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { user } = useAuth();
  const isAdmin =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUPER_ADMIN";

  // 일정 타입 필터 핸들러
  const handleTypeChange = (type: ScheduleType | "all") => {
    setSelectedType(type);
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.startStr);
    setIsFormModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const scheduleId = clickInfo.event.id;
    router.push(`/schedule/detail/${scheduleId}`);
  };

  return (
    <div className="flex-1 p-6">
      {/* 상단 필터 */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedType === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleTypeChange("all")}
          >
            전체
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedType === ScheduleType.PERSONAL
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleTypeChange(ScheduleType.PERSONAL)}
          >
            개인
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              selectedType === ScheduleType.DEPARTMENT
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleTypeChange(ScheduleType.DEPARTMENT)}
          >
            부서
          </button>
          {isAdmin && (
            <button
              className={`px-4 py-2 rounded-lg ${
                selectedType === ScheduleType.COMPANY
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleTypeChange(ScheduleType.COMPANY)}
            >
              회사
            </button>
          )}
        </div>
      </div>

      {/* 캘린더 */}
      <div className="bg-white rounded-lg shadow">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: ""
          }}
          height="auto"
          eventClassNames={(arg) => {
            const type =
              arg.event.extendedProps.type?.toLowerCase() || "personal";
            return [`event-${type}`];
          }}
          events={(info, successCallback) => {
            const start = info.start;
            const type = selectedType === "all" ? undefined : selectedType;
            scheduleService
              .getMonthlySchedules(start, type as ScheduleType)
              .then((events) =>
                successCallback(
                  events.map((event) => ({
                    id: String(event.id),
                    title: event.title,
                    start: event.startTime,
                    end: event.endTime,
                    extendedProps: {
                      type: event.scheduleType,
                      description: event.description,
                      memo: event.memo,
                    },
                  }))
                )
              );
          }}
        />
      </div>

      {/* 모달 */}
      {isFormModalOpen && selectedDate && (
        <ScheduleFormModal
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedDate(null);
          }}
          onSubmit={() => {
            setIsFormModalOpen(false);
            setSelectedDate(null);
            if (calendarRef.current) {
              calendarRef.current.getApi().refetchEvents();
            }
          }}
          mode="create"
          initialStartDate={selectedDate}
        />
      )}
    </div>
  );
}

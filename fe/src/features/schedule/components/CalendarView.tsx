"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import { scheduleService } from "../services/scheduleService";
import { convertToCalendarEvents } from "../utils/calendarUtils";
import { ScheduleType, ScheduleStatus } from "../types/Enums";
import {
  scheduleTypeColors,
  scheduleStatusLabels,
  scheduleTypeLabels,
} from "../constants/scheduleLabels";
import { Schedule } from "../types/Schedule";
import StatusBadge from "./StatusBadge";

export default function CalendarView() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<
    ScheduleType | "ALL"
  >("ALL");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [departments, setDepartments] = useState<
    { id: number; departmentName: string }[]
  >([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null
  );
  const [viewType, setViewType] = useState<"month" | "week" | "day">("month");

  // 부서 목록 가져오기
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departments = await scheduleService.getDepartments();
        setDepartments(departments);
      } catch (error) {
        console.error("부서 목록을 불러오는데 실패했습니다", error);
      }
    };

    fetchDepartments();
  }, []);

  // 일정 가져오기
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      let schedules: Schedule[] = [];

      if (viewType === "month") {
        schedules = await scheduleService.getMonthlySchedules(
          currentDate,
          selectedTypeFilter !== "ALL" ? selectedTypeFilter : undefined,
          selectedDepartment || undefined
        );
      } else if (viewType === "week") {
        schedules = await scheduleService.getWeeklySchedules(
          currentDate,
          selectedTypeFilter !== "ALL" ? selectedTypeFilter : undefined,
          selectedDepartment || undefined
        );
      } else {
        schedules = await scheduleService.getDailySchedules(
          currentDate,
          selectedTypeFilter !== "ALL" ? selectedTypeFilter : undefined,
          selectedDepartment || undefined
        );
      }

      const calendarEvents = convertToCalendarEvents(schedules);
      setEvents(calendarEvents);
    } catch (error) {
      console.error("일정을 불러오는데 실패했습니다", error);
    } finally {
      setLoading(false);
    }
  };

  // 일정 첫 로딩 및 필터 변경시 데이터 다시 불러오기
  useEffect(() => {
    fetchSchedules();
  }, [selectedTypeFilter, currentDate, selectedDepartment, viewType]);

  // 필터링 기능
  const handleTypeFilterChange = (type: ScheduleType | "ALL") => {
    setSelectedTypeFilter(type);
  };

  // 이벤트 클릭 핸들러
  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    router.push(`/schedule/${eventId}`);
  };

  // 날짜 클릭 핸들러 (새 일정 생성)
  const handleDateClick = (info: any) => {
    router.push(`/schedule/new?date=${info.dateStr}`);
  };

  // 이벤트 렌더링 커스터마이징
  const eventContent = (eventInfo: any) => {
    const { extendedProps } = eventInfo.event;
    const scheduleType = extendedProps?.scheduleType;
    const scheduleStatus = extendedProps?.scheduleStatus;

    return (
      <div className="flex flex-col p-1 overflow-hidden">
        <div className="font-bold text-sm truncate">
          {eventInfo.timeText && (
            <span className="mr-1">{eventInfo.timeText}</span>
          )}
          {eventInfo.event.title}
        </div>
        <div className="flex items-center gap-1 mt-1">
          {scheduleStatus && <StatusBadge status={scheduleStatus} />}
        </div>
      </div>
    );
  };

  // 달력 변경 이벤트 핸들러
  const handleDatesSet = (dateInfo: any) => {
    setCurrentDate(dateInfo.start);

    // 뷰 타입 설정
    if (dateInfo.view.type === "dayGridMonth") {
      setViewType("month");
    } else if (dateInfo.view.type === "timeGridWeek") {
      setViewType("week");
    } else if (dateInfo.view.type === "timeGridDay") {
      setViewType("day");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">일정 관리</h2>
        </div>
        <div className="flex gap-2">
          {" "}
          <select
            value={selectedTypeFilter}
            onChange={(e) =>
              handleTypeFilterChange(e.target.value as ScheduleType | "ALL")
            }
            className="border rounded p-1"
          >
            <option value="ALL">모든 일정</option>
            <option value={ScheduleType.PERSONAL}>개인 일정</option>
            <option value={ScheduleType.DEPARTMENT}>부서 일정</option>
            <option value={ScheduleType.COMPANY}>회사 일정</option>
          </select>
          {selectedTypeFilter === ScheduleType.DEPARTMENT && (
            <select
              value={selectedDepartment || ""}
              onChange={(e) =>
                setSelectedDepartment(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="border rounded p-1"
            >
              <option value="">모든 부서</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => router.push("/schedule/new")}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            일정 등록
          </button>
        </div>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>일정을 불러오는 중...</p>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            locale={koLocale}
            events={events}
            eventContent={eventContent}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            datesSet={handleDatesSet}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            height="auto"
            eventClassNames={(arg) => {
              const type =
                (arg.event.extendedProps?.scheduleType as ScheduleType) ||
                ScheduleType.PERSONAL;
              const typeColor = scheduleTypeColors[type] || "#757575";

              return [
                "bg-opacity-80",
                "border-l-4",
                "rounded",
                "custom-event-style",
              ];
            }}
            eventDidMount={(info) => {
              const type =
                (info.event.extendedProps?.scheduleType as ScheduleType) ||
                ScheduleType.PERSONAL;
              const typeColor = scheduleTypeColors[type] || "#757575";

              // DOM 요소에 직접 스타일 적용
              if (info.el) {
                info.el.style.borderLeftColor = typeColor;
                info.el.style.borderLeftWidth = "4px";
              }
            }}
            // 사진처럼 표현하기 위한 추가 설정
            slotEventOverlap={false}
            dayMaxEvents={4}
            weekends={true}
            allDaySlot={true}
            firstDay={0} // 일요일부터 시작
          />
        )}
      </div>
    </div>
  );
}

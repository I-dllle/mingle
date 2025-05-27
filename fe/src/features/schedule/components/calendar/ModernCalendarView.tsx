"use client";

import React, { useRef, useState, useEffect } from "react";
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
import { getEventClassNames } from "@/features/schedule/utils/calendarTheme";
import styles from "@/features/schedule/styles/ModernCalendarView.module.css";

// 아이콘 컴포넌트
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default function ModernCalendarView() {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedType, setSelectedType] = useState<ScheduleType | "all">("all");
  const [currentView, setCurrentView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  >("dayGridMonth");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>("");

  const { user } = useAuth();
  const isAdmin =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUPER_ADMIN";
  // 현재 달 표시 업데이트
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const date = calendarApi.getDate();
      updateCurrentMonthTitle(date, calendarApi.view.type);
    }
  }, []);

  // 일정 타입 필터 핸들러
  const handleTypeChange = (type: ScheduleType | "all") => {
    setSelectedType(type);
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }
  };
  // 뷰 변경 핸들러
  const handleViewChange = (
    view: "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  ) => {
    setCurrentView(view);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      // 뷰 전환 + 오늘 날짜 강제 지정 (일간 뷰만)
      if (view === "timeGridDay") {
        calendarApi.changeView(view, new Date());
      } else {
        calendarApi.changeView(view);
      }
      // 바뀐 뷰의 날짜로 타이틀 갱신
      const date = calendarApi.getDate();
      updateCurrentMonthTitle(date, view);
    }
  };

  // 날짜 이동 핸들러
  const handleDateChange = (direction: "prev" | "next" | "today") => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (direction === "prev") {
        calendarApi.prev();
      } else if (direction === "next") {
        calendarApi.next();
      } else {
        calendarApi.today();
      }
      const date = calendarApi.getDate();
      updateCurrentMonthTitle(date, calendarApi.view.type);
    }
  };

  // 현재 달/주/일 타이틀 업데이트
  const updateCurrentMonthTitle = (date: Date, viewType?: string) => {
    const currentViewType = viewType || currentView;

    if (
      currentViewType === "timeGridWeek" ||
      currentViewType === "dayGridWeek"
    ) {
      // 주간 뷰일 때는 현재 날짜가 속한 주의 일요일부터 토요일까지 표시
      const day = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일

      // 이번 주 일요일 계산
      const sunday = new Date(date);
      sunday.setDate(date.getDate() - day);

      // 이번 주 토요일 계산
      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);

      const startMonth = sunday.toLocaleString("ko-KR", { month: "long" });
      const startDay = sunday.getDate();
      const endMonth = saturday.toLocaleString("ko-KR", { month: "long" });
      const endDay = saturday.getDate();
      const year = sunday.toLocaleString("ko-KR", { year: "numeric" });

      if (startMonth === endMonth) {
        setCurrentMonth(`${year} ${startMonth} ${startDay}일-${endDay}일`);
      } else {
        setCurrentMonth(
          `${year} ${startMonth} ${startDay}일-${endMonth} ${endDay}일`
        );
      }
    } else if (
      currentViewType === "timeGridDay" ||
      currentViewType === "dayGridDay"
    ) {
      // 일간 뷰일 때는 '2023년 5월 1일 (월)' 형태로 표시
      const format: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
      };
      const formattedDate = date.toLocaleString("ko-KR", format);
      setCurrentMonth(formattedDate);
    } else {
      // 월간 뷰
      const format: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
      };
      const formattedDate = date.toLocaleString("ko-KR", format);
      setCurrentMonth(formattedDate);
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
  const handleDatesSet = (info: any) => {
    updateCurrentMonthTitle(info.view.currentStart, info.view.type);
  };

  return (
    <div className={styles.calendarContainer}>
      {/* 캘린더 헤더 */}
      <div className={styles.calendarHeader}>
        <div className={styles.calendarTitle}>{currentMonth}</div>
        <div className={styles.dateControls}>
          <button
            className={styles.dateButton}
            onClick={() => handleDateChange("prev")}
            aria-label="이전"
          >
            <ChevronLeftIcon />
          </button>
          <button
            className={styles.todayButton}
            onClick={() => handleDateChange("today")}
          >
            오늘
          </button>
          <button
            className={styles.dateButton}
            onClick={() => handleDateChange("next")}
            aria-label="다음"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className={styles.filterSection}>
        <div className={styles.viewSelector}>
          <button
            className={`${styles.viewButton} ${
              currentView === "dayGridMonth" ? styles.active : ""
            }`}
            onClick={() => handleViewChange("dayGridMonth")}
          >
            월
          </button>
          <button
            className={`${styles.viewButton} ${
              currentView === "timeGridWeek" ? styles.active : ""
            }`}
            onClick={() => handleViewChange("timeGridWeek")}
          >
            주
          </button>
          <button
            className={`${styles.viewButton} ${
              currentView === "timeGridDay" ? styles.active : ""
            }`}
            onClick={() => handleViewChange("timeGridDay")}
          >
            일
          </button>
        </div>{" "}
        <div className={styles.typeFilters}>
          <button
            className={`${styles.typeButton} ${
              selectedType === "all" ? styles.active : ""
            }`}
            onClick={() => handleTypeChange("all")}
          >
            <span
              className={`${styles.typeIndicator} ${styles.indicatorAll}`}
            ></span>
            종합
          </button>
          <button
            className={`${styles.typeButton} ${
              selectedType === ScheduleType.PERSONAL ? styles.active : ""
            }`}
            onClick={() => handleTypeChange(ScheduleType.PERSONAL)}
          >
            <span
              className={`${styles.typeIndicator} ${styles.indicatorPersonal}`}
            ></span>
            개인
          </button>
          <button
            className={`${styles.typeButton} ${
              selectedType === ScheduleType.DEPARTMENT ? styles.active : ""
            }`}
            onClick={() => handleTypeChange(ScheduleType.DEPARTMENT)}
          >
            <span
              className={`${styles.typeIndicator} ${styles.indicatorDepartment}`}
            ></span>
            부서
          </button>
          <button
            className={`${styles.typeButton} ${
              selectedType === ScheduleType.COMPANY ? styles.active : ""
            }`}
            onClick={() => handleTypeChange(ScheduleType.COMPANY)}
          >
            <span
              className={`${styles.typeIndicator} ${styles.indicatorCompany}`}
            ></span>
            회사
          </button>
        </div>
      </div>

      {/* 캘린더 */}
      <div className={styles.calendarWrapper}>
        {" "}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={new Date()}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          headerToolbar={false} // 커스텀 헤더를 사용하므로 기본 헤더는 비활성화
          dayMaxEvents={true}
          eventClassNames={getEventClassNames}
          height="100%" // 높이를 100%로 설정
          contentHeight="auto" // 컨텐츠 높이를 자동으로 조정
          aspectRatio={1.35} // 원하는 종횡비로 조절
          locale="ko"
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          allDaySlot={true}
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
                      scheduleStatus: event.scheduleStatus,
                    },
                  }))
                )
              );
          }}
        />
      </div>

      {/* 새 일정 추가 버튼 */}
      <button
        className={styles.newScheduleButton}
        onClick={() => {
          const today = new Date().toISOString().split("T")[0];
          setSelectedDate(today);
          setIsFormModalOpen(true);
        }}
        aria-label="새 일정 추가"
      >
        <PlusIcon />
      </button>

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

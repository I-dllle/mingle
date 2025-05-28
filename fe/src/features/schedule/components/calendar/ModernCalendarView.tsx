"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { ScheduleType } from "@/features/schedule/types/Enums";
import ScheduleFormModal from "@/features/schedule/components/modals/ScheduleFormModal";
import ScheduleListModal from "../modals/ScheduleListModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import type { DateClickArg } from "@fullcalendar/interaction";
import { getEventClassNames } from "@/features/schedule/utils/calendarTheme";
import styles from "@/features/schedule/styles/ModernCalendarView.module.css";

import Modal from "@/features/schedule/components/ui/Modal";
import ScheduleCard from "@/features/schedule/components/ui/ScheduleCard";
import ActivitySummary from "@/features/schedule/components/calendar/ActivitySummary";

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

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [selectedType, setSelectedType] = useState<ScheduleType | "all">("all");
  const [currentView, setCurrentView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  >("dayGridMonth");
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>("");

  const [summaryDate, setSummaryDate] = useState<Date>(new Date());

  // 캘린더의 view가 바뀔 때마다 타이틀도 바꾸고 summaryDate도 갱신
  const handleDatesSet = (info: any) => {
    // 상단의 현재 달/주/일 텍스트 갱신
    updateCurrentMonthTitle(info.view.currentStart, info.view.type);
    // ActivitySummary 에 넘길 기준 날짜 저장
    setSummaryDate(info.view.currentStart);
  };

  const { user } = useAuth();
  const isAdmin =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUPER_ADMIN";
  // 현재 달 표시 업데이트
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const date = calendarApi.getDate();
      updateCurrentMonthTitle(date, calendarApi.view.type);
      setSummaryDate(date);
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

  // 일정 검색 핸들러
  const handleSearch = async () => {
    const results = await scheduleService.searchSchedules(searchTerm, true);
    setSearchResults(
      results.map((e) => ({
        id: String(e.id),
        title: e.title,
        start: e.startTime,
        end: e.endTime,
        extendedProps: { type: e.scheduleType, status: e.scheduleStatus },
      }))
    );
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
    setClickedDate(selectInfo.startStr);
    setIsListModalOpen(true);
  };

  // 단일 날짜 클릭 핸들러
  const handleDateClick = (info: DateClickArg) => {
    // 무조건 리스트 모달을 띄우도록
    setClickedDate(info.dateStr);
    setIsListModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    // 클릭된 이벤트의 날짜로 리스트 모달 열기
    setClickedDate(clickInfo.event.startStr!);
    setIsListModalOpen(true);
  };

  return (
    <div className={styles.calendarContainer}>
      {/* 캘린더 헤더 */}
      <div className={styles.calendarHeader}>
        <div className="flex items-center gap-4">
          <button
            className={styles.searchButton}
            onClick={() => setShowSearchModal(true)}
            aria-label="일정 검색"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <div className={styles.calendarTitle}>{currentMonth}</div>
        </div>
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
      {/* 검색 모달 */}
      {showSearchModal && (
        <Modal title="일정 검색" onClose={() => setShowSearchModal(false)}>
          <div className="p-6 space-y-5">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
                  placeholder="일정명, 메모 등으로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
              <button
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                onClick={handleSearch}
              >
                검색
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-auto rounded-lg bg-gray-50 p-3">
              {searchResults.length > 0 ? (
                searchResults.map((evt) => (
                  <ScheduleCard
                    key={evt.id}
                    event={evt}
                    onClick={() => {
                      router.push(`/schedule/detail/${evt.id}`);
                      setShowSearchModal(false);
                    }}
                  />
                ))
              ) : (
                <div className="bg-white p-6 rounded-lg text-center border border-gray-100 shadow-sm">
                  <p className="text-gray-500 mb-2">검색 결과가 없습니다.</p>
                  <p className="text-sm text-gray-400">
                    다른 키워드로 검색해보세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
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
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          headerToolbar={false} // 커스텀 헤더를 사용하므로 기본 헤더는 비활성화          dayMaxEvents={true}
          eventClassNames={getEventClassNames}
          slotEventOverlap={false} // 주간/일간 뷰에서 이벤트가 겹치지 않도록 설정
          height="100%" // 높이를 100%로 설정
          contentHeight="auto" // 컨텐츠 높이를 자동으로 조정
          aspectRatio={1.8} // 종횡비를 높여서 세로로 더 크게 설정
          locale="ko"
          slotMinTime="00:00:00" // 오전 0시부터
          slotMaxTime="24:00:00" // 자정까지 (24시간 전체)
          allDaySlot={true}
          nowIndicator={true}
          events={(info, successCallback) => {
            const calApi = calendarRef.current?.getApi();
            // calApi.getDate()로 현재 포커스된 날짜를 가져온 후, 월의 1일로 설정
            const now = calApi?.getDate();
            // 해당 월의 1일을 정확히 설정 (2025-05-01 형식)
            const monthStart = now
              ? new Date(now.getFullYear(), now.getMonth(), 1)
              : null;
            const type = selectedType === "all" ? undefined : selectedType;
            if (monthStart) {
              scheduleService
                .getMonthlySchedules(monthStart, type as ScheduleType)
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
            } else {
              successCallback([]); // 안전장치
            }
          }}
        />
      </div>{" "}
      {/* ──── 하단 활동기록 ──── */}
      <div className="p-6 bg-white border-t border-gray-100">
        <ActivitySummary
          view={
            currentView === "dayGridMonth"
              ? "monthly"
              : currentView === "timeGridWeek"
              ? "weekly"
              : "daily"
          }
          scheduleType={selectedType}
          date={summaryDate}
        />
      </div>
      {/* ─── 리스트 모달 ─── */}
      {isListModalOpen && clickedDate && (
        <ScheduleListModal
          date={clickedDate}
          onClose={() => setIsListModalOpen(false)}
        />
      )}
    </div>
  );
}

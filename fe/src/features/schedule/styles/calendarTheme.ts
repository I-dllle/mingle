// FullCalendar 테마 설정을 위한 설정 옵션

export const calendarThemeOptions = {
  // FullCalendar 커스텀 옵션
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },

  // 헤더 버튼 텍스트
  buttonText: {
    today: "오늘",
    month: "월",
    week: "주",
    day: "일",
  },

  // 비즈니스 시간 설정
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5], // 월-금
    startTime: "09:00",
    endTime: "18:00",
  },

  // 시간 포맷
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },

  // 날짜/시간 관련 설정
  locale: "ko",
  firstDay: 0, // 주의 시작을 일요일로
  weekNumbers: false,
  navLinks: true, // 날짜/주 클릭으로 뷰 전환 가능
  editable: false,
  dayMaxEvents: true,
  selectMirror: true,

  // 스타일 관련
  height: "auto",
  expandRows: true,
  slotMinTime: "07:00:00",
  slotMaxTime: "21:00:00",
  allDaySlot: true,
  slotEventOverlap: true,

  // 일정 표시 관련
  eventDisplay: "block",

  // 일정 타입별 색상
  eventTypeColors: {
    PERSONAL: {
      backgroundColor: "rgba(251, 191, 36, 0.8)",
      borderColor: "#fbbf24",
      textColor: "#000000",
    },
    DEPARTMENT: {
      backgroundColor: "rgba(59, 130, 246, 0.8)",
      borderColor: "#3b82f6",
      textColor: "#ffffff",
    },
    COMPANY: {
      backgroundColor: "rgba(239, 68, 68, 0.8)",
      borderColor: "#ef4444",
      textColor: "#ffffff",
    },
  },

  // 일정 상태별 색상
  eventStatusColors: {
    IMPORTANT_MEETING: {
      backgroundColor: "rgba(236, 72, 153, 0.8)",
      borderColor: "#ec4899",
    },
    BUSINESS_TRIP: {
      backgroundColor: "rgba(147, 51, 234, 0.8)",
      borderColor: "#9333ea",
    },
    COMPLETED: {
      backgroundColor: "rgba(34, 197, 94, 0.8)",
      borderColor: "#22c55e",
    },
    CANCELED: {
      backgroundColor: "rgba(156, 163, 175, 0.8)",
      borderColor: "#9ca3af",
    },
    VACATION: {
      backgroundColor: "rgba(14, 165, 233, 0.8)",
      borderColor: "#0ea5e9",
    },
  },

  // Calendar 기본 스타일 변수
  styleVariables: {
    "--fc-border-color": "#e5e7eb",
    "--fc-daygrid-event-dot-width": "8px",
    "--fc-button-bg-color": "#f3f4f6",
    "--fc-button-border-color": "#d1d5db",
    "--fc-button-hover-bg-color": "#e5e7eb",
    "--fc-button-hover-border-color": "#9ca3af",
    "--fc-button-active-bg-color": "#e5e7eb",
    "--fc-button-active-border-color": "#9ca3af",
    "--fc-event-bg-color": "#4C1D95",
    "--fc-event-border-color": "#3B0764",
    "--fc-event-text-color": "#fff",
    "--fc-today-bg-color": "rgba(156, 29, 149, 0.05)",
  },
};

// 일정 필터링을 위한 유틸리티 함수
export const getEventClassNames = (event: any) => {
  const scheduleType = event.extendedProps?.scheduleType;
  const scheduleStatus = event.extendedProps?.scheduleStatus;

  const classNames = ["fc-event"];

  // 일정 유형에 따른 클래스
  if (scheduleType === "PERSONAL") classNames.push("personal-event");
  else if (scheduleType === "DEPARTMENT") classNames.push("department-event");
  else if (scheduleType === "COMPANY") classNames.push("company-event");

  // 일정 상태에 따른 클래스
  if (scheduleStatus === "CANCELED") classNames.push("canceled-event");
  else if (scheduleStatus === "COMPLETED") classNames.push("completed-event");

  return classNames;
};

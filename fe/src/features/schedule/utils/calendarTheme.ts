// FullCalendar 테마 설정을 위한 설정 옵션
import { ScheduleStatus, ScheduleType } from "../types/Enums";

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
  // 일정 타입별 색상 - 파스텔 연보라색 컨셉에 맞게 변경
  eventTypeColors: {
    PERSONAL: {
      backgroundColor: "rgba(147, 51, 234, 0.15)",
      borderColor: "#9333ea",
      textColor: "#6b21a8",
    },
    DEPARTMENT: {
      backgroundColor: "rgba(79, 70, 229, 0.15)",
      borderColor: "#4f46e5",
      textColor: "#3730a3",
    },
    COMPANY: {
      backgroundColor: "rgba(219, 39, 119, 0.15)",
      borderColor: "#db2777",
      textColor: "#9d174d",
    },
  },
  // 일정 상태별 색상 - 파스텔 톤으로 조정
  eventStatusColors: {
    IMPORTANT_MEETING: {
      backgroundColor: "rgba(236, 72, 153, 0.2)",
      borderColor: "#ec4899",
    },
    BUSINESS_TRIP: {
      backgroundColor: "rgba(147, 51, 234, 0.2)",
      borderColor: "#9333ea",
    },
    COMPLETED: {
      backgroundColor: "rgba(34, 197, 94, 0.2)",
      borderColor: "#22c55e",
    },
    CANCELED: {
      backgroundColor: "rgba(156, 163, 175, 0.2)",
      borderColor: "#9ca3af",
    },
    VACATION: {
      backgroundColor: "rgba(14, 165, 233, 0.2)",
      borderColor: "#0ea5e9",
    },
  },
  // Calendar 기본 스타일 변수 - 파스텔 연보라색 컨셉에 맞게 변경
  styleVariables: {
    "--fc-border-color": "#f3f4f6",
    "--fc-daygrid-event-dot-width": "8px",
    "--fc-button-bg-color": "#f3e8ff",
    "--fc-button-border-color": "#e9d5ff",
    "--fc-button-hover-bg-color": "#e9d5ff",
    "--fc-button-hover-border-color": "#d8b4fe",
    "--fc-button-active-bg-color": "#d8b4fe",
    "--fc-button-active-border-color": "#c084fc",
    "--fc-today-bg-color": "#f3e8ff",
    "--fc-event-border-color": "transparent",
  },
};

/**
 * 일정 타입과 상태에 따른 CSS 클래스를 생성하는 함수
 * 새로운 디자인 시스템에 맞게 업데이트
 */
export const getEventClassNames = (arg: {
  event: { extendedProps: any };
}): string[] => {
  const event = arg.event;
  const classNames: string[] = [];

  // 일정 타입 클래스 추가
  const scheduleType = event.extendedProps?.type as ScheduleType;
  if (scheduleType) {
    classNames.push(`event-${scheduleType.toLowerCase()}`);
  }

  // 일정 상태 클래스 추가
  const scheduleStatus = event.extendedProps?.scheduleStatus as ScheduleStatus;
  if (scheduleStatus === "CANCELED") classNames.push("canceled-event");
  else if (scheduleStatus === "COMPLETED") classNames.push("completed-event");

  return classNames;
};

/**
 * 일정 이벤트의 렌더링을 커스터마이징 하는 함수
 */
export const customEventRenderer = (eventInfo: any) => {
  const { event } = eventInfo;
  const scheduleType = event.extendedProps?.type as ScheduleType;
  const scheduleStatus = event.extendedProps?.scheduleStatus as ScheduleStatus;

  // 일정 타입에 따른 스타일 클래스
  let typeClass = "";
  if (scheduleType === ScheduleType.PERSONAL) typeClass = "personal-event";
  else if (scheduleType === ScheduleType.DEPARTMENT)
    typeClass = "department-event";
  else if (scheduleType === ScheduleType.COMPANY) typeClass = "company-event";

  // 일정 상태에 따른 스타일 클래스
  let statusClass = "";
  if (scheduleStatus === "CANCELED") statusClass = "status-canceled";
  else if (scheduleStatus === "COMPLETED") statusClass = "status-completed";

  return {
    html: `
      <div class="modern-event ${typeClass} ${statusClass}">
        <div class="event-title">${event.title}</div>
        ${
          event.extendedProps?.description
            ? `<div class="event-description">${event.extendedProps.description}</div>`
            : ""
        }
      </div>
    `,
  };
};

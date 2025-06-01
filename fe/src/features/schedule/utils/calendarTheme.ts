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
  // 시간 포맷  
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    meridiem: false, // 오전/오후 표시 제거
    omitZeroMinute: false, // 0분일 때도 표시 (XX:00)
  },

  // 날짜/시간 관련 설정
  locale: "en",
  firstDay: 0, // 주의 시작을 일요일로
  weekNumbers: false,
  navLinks: true, // 날짜/주 클릭으로 뷰 전환 가능
  editable: false,
  dayMaxEvents: true,
  selectMirror: true,

  // 일정 표시 관련
  eventDisplay: "block",

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
    classNames.push(`event-${scheduleType.toLowerCase()}`); // event-personal, event-department, event-company
    classNames.push(scheduleType.toLowerCase()); // personal, department, company (기본 클래스도 추가)
  }
  // 일정 상태 클래스 추가
  const scheduleStatus = event.extendedProps?.scheduleStatus as ScheduleStatus;
  if (scheduleStatus) {
    // 모든 상태에 대한 클래스 추가
    // 예: IMPORTANT_MEETING → status-important-meeting
    classNames.push(
      `status-${scheduleStatus.toLowerCase().replace(/_/g, "-")}`
    );

    // 기존 호환성을 위한 클래스도 유지
    if (scheduleStatus === "CANCELED") classNames.push("canceled-event");
    else if (scheduleStatus === "COMPLETED") classNames.push("completed-event");
  }

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
  // 시간 형식 지정 (HH:MM 형식) - 24시간제 강제 적용
  const formatTime = (date: string | Date) => {
    const d = new Date(date);
    // 24시간제로 표시, 오전/오후 없이, 항상 두 자리 숫자로
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 시작 시간 포맷팅
  const startTime = formatTime(event.start);  // 각 달력 뷰에 맞게 최적화된 이벤트 내용 생성
  // 현재 보고 있는 달력 뷰 유형 확인
  const viewType = eventInfo.view.type; // dayGridMonth, timeGridWeek, timeGridDay
  
  // 뷰 타입별 클래스 추가 (CSS에서 뷰별 스타일링을 위함)
  const viewClass = `view-${viewType.replace('Grid', '-')}`;
  
  return {
    html: `
      <div class="modern-event ${typeClass} ${statusClass} ${viewClass}">
        <div class="event-main-frame">
          <span class="event-time">${startTime}</span>
          <div class="event-content">
            <div class="event-title">${event.title}</div>
            ${
              event.extendedProps?.description && 
              (viewType === 'timeGridDay' || viewType === 'timeGridWeek')
                ? `<div class="event-description">${event.extendedProps.description}</div>`
                : ""
            }
          </div>
        </div>
      </div>
    `,
  };
};

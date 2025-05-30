// features/reservation/components/RoomAvailabilityCalendar.tsx

import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { formatDate } from "@/lib/date";
import { Room } from "@/features/room/types/room";
import { Reservation } from "@/features/reservation/types/reservation";
import { RoomWithReservationsDto } from "../types/roomWithReservations";
import {
  transformRoomsToResources,
  transformReservationsToEvents,
} from "../utils/fullCalendarTransformers";
import styles from "../styles/fullCalendarStyles.module.css";
// FullCalendar 한글 로케일 설정
const koLocale = {
  code: "ko",
  buttonText: {
    prev: "이전",
    next: "다음",
    today: "오늘",
    month: "월",
    week: "주",
    day: "일",
    list: "목록",
  },
  weekText: "주",
  allDayText: "종일",
  moreLinkText: "개",
  noEventsText: "예약이 없습니다",
};

interface Props {
  rooms: RoomWithReservationsDto[];
  currentUserId: number;
  onSelect: (reservationId: number) => void;
}

export function RoomAvailabilityCalendar({
  rooms,
  currentUserId,
  onSelect,
}: Props) {
  const [date, setDate] = useState(new Date());

  // 방을 FullCalendar 리소스로 변환
  const resources = transformRoomsToResources(rooms);

  // 예약을 FullCalendar 이벤트로 변환
  const events = transformReservationsToEvents(rooms, currentUserId); // 이벤트 렌더링 커스터마이징
  const renderEventContent = (eventInfo: any) => {
    const { extendedProps } = eventInfo.event;
    const isMine = extendedProps.isMine;
    const isTimeline = eventInfo.view.type.includes("timeline");

    // 이벤트에 클래스 추가
    const eventEl = eventInfo.el;
    if (eventEl) {
      if (isMine) {
        eventEl.classList.add("fc-event-mine");
      } else {
        eventEl.classList.add("fc-event-others");
      }
    }

    return (
      <div
        className={`${isMine ? "font-medium" : ""}`}
        style={{
          // 타임라인 뷰일 경우 최적화
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
          padding: "4px 6px",
          overflow: "hidden",
        }}
      >
        <div
          className="text-xs mb-1"
          style={{ color: isMine ? "#4338ca" : "#4b5563" }}
        >
          {eventInfo.timeText}
        </div>
        <div
          className="text-sm font-medium"
          style={{ color: isMine ? "#1e40af" : "#4b5563" }}
        >
          {eventInfo.event.title || (isMine ? "내 예약" : "예약됨")}
        </div>
      </div>
    );
  };
  return (
    <div className={styles.fullCalendarContainer}>
      {" "}
      <FullCalendar
        plugins={[
          resourceTimeGridPlugin,
          resourceTimelinePlugin,
          timeGridPlugin,
          dayGridPlugin,
          interactionPlugin,
        ]}
        initialView="resourceTimelineDay"
        schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
        resources={resources}
        events={events}
        slotDuration="00:30:00"
        slotMinTime="08:00:00"
        slotMaxTime="23:00:00"
        allDaySlot={false}
        locale={koLocale}
        direction="ltr"
        resourceAreaWidth="150px"
        resourcesInitiallyExpanded={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        views={{
          resourceTimelineDay: {
            eventMinHeight: 30,
            slotDuration: "01:00:00", // 1시간 단위로 표시
            slotLabelInterval: "01:00:00", // 시간 레이블은 1시간마다
            snapDuration: "00:30:00", // 이벤트 조정은 30분 단위로
            resourceAreaWidth: "120px",
            slotLabelFormat: {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            },
            // 타임라인 뷰 추가 설정
            resourceLabelDidMount: (info) => {
              const room = rooms.find(
                (r) => r.roomId.toString() === info.resource.id
              );
              if (room) {
                info.el.innerHTML = `<div class="${styles.resourceLabel}">
                  <span class="${styles.resourceName}">${room.roomName}</span>
                  <span class="${styles.resourceType}">${
                  room.roomType === "MEETING_ROOM" ? "회의실" : "연습실"
                }</span>
                </div>`;
              }
            },
          },
        }} // 타임라인 뷰에서는 views 내부에 resourceLabelDidMount를 정의
        eventContent={renderEventContent}
        eventClick={(info) => {
          // 이벤트 클릭 시 예약 ID를 추출하여 onSelect 콜백 실행
          const reservationId = parseInt(info.event.id);
          onSelect(reservationId);
        }}
        datesSet={(dateInfo) => {
          setDate(dateInfo.view.currentStart);
        }}
        nowIndicator={true}
        height="auto"
        initialDate={date}
      />
    </div>
  );
}

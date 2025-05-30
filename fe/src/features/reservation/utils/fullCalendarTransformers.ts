// features/reservation/utils/fullCalendarTransformers.ts

import { Room } from "@/features/room/types/room";
import { Reservation } from "@/features/reservation/types/reservation";
import { RoomWithReservationsDto } from "../types/roomWithReservations";

/**
 * 방(room)을 FullCalendar의 리소스 형식으로 변환
 */
export function transformRoomsToResources(rooms: RoomWithReservationsDto[]) {
  return rooms.map((room) => ({
    id: room.roomId.toString(),
    title: room.roomName,
  }));
}

/**
 * 예약(reservations)을 FullCalendar의 이벤트 형식으로 변환
 * 예약 색상과 사용자 예약 여부를 처리
 */
export function transformReservationsToEvents(
  rooms: RoomWithReservationsDto[],
  currentUserId: number
) {
  const events: any[] = [];

  rooms.forEach((room) => {
    room.reservations.forEach((reservation) => {
      if (reservation.reservationStatus === "CANCELED") return;

      const isMine = reservation.userId === currentUserId; // 예약 상태나 ID를 기반으로 일관된 색상 할당
      const getPurpleColor = (id: number) => {
        // ID에 따라 일정한 색상을 선택하도록 함 (동일 ID는 항상 같은 색상)
        const purpleColors = [
          "#8a70d6", // 진한 보라색
          "#9370DB", // 중간 보라색
          "#a98eec", // 밝은 보라색
          "#c4a6ff", // 연한 보라색
          "#b57edc", // 분홍빛 보라색
        ];
        // ID를 사용해 인덱스 계산
        const colorIndex = id % purpleColors.length;
        return purpleColors[colorIndex];
      };

      const eventColor = isMine ? getPurpleColor(reservation.id) : "#9ca3af"; // 내 예약은 보라색 계열, 타인 예약은 회색

      events.push({
        id: reservation.id.toString(),
        title: reservation.title || "",
        start: `${reservation.date}T${reservation.startTime}`,
        end: `${reservation.date}T${reservation.endTime}`,
        resourceId: room.roomId.toString(),
        backgroundColor: eventColor,
        borderColor: eventColor,
        textColor: "#ffffff", // 텍스트는 흰색으로
        extendedProps: {
          isMine,
          reservation,
        },
      });
    });
  });

  return events;
}

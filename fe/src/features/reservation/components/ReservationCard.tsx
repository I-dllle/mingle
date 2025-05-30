// features/reservation/components/ReservationCard.tsx

import React from "react";
import { Reservation } from "@/features/reservation/types/reservation";
import { formatTime } from "@/lib/date";

interface Props {
  reservation: Reservation;
  isMine: boolean;
  onClick: () => void;
}

// 30분 = 50px, 1시간 = 100px 기준
const HALF_HOUR_WIDTH = 50;

const getPositionStyle = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  const left = (start / 30) * HALF_HOUR_WIDTH;
  const width = ((end - start) / 30) * HALF_HOUR_WIDTH;

  return {
    left: `${left}px`,
    width: `${width}px`,
  };
};

export function ReservationCard({ reservation, isMine, onClick }: Props) {
  const style = getPositionStyle(reservation.startTime, reservation.endTime);

  const titleText = `${formatTime(reservation.startTime)}~${formatTime(
    reservation.endTime
  )} ${reservation.title || ""}`.trim();

  return (
    <div
      className={`absolute top-1 h-8 px-2 text-xs text-white rounded-md cursor-pointer 
        ${isMine ? "bg-indigo-500" : "bg-gray-400"}
        hover:opacity-90`}
      style={style}
      onClick={onClick}
      title={titleText}
    >
      {reservation.title || ""}
    </div>
  );
}

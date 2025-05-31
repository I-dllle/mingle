// features/reservation/components/ReservationCard.tsx
"use client";

import React from "react";
import { Reservation } from "@/features/reservation/types/reservation";

interface Props {
  reservation: Reservation;
  isMine: boolean;
  onClick: () => void;
  rowIndex: number;
  cellWidth: number;
  rowHeight: number;
}

export function ReservationCard({
  reservation,
  isMine,
  onClick,
  rowIndex,
  cellWidth,
  rowHeight,
}: Props) {
  const [sh, sm] = reservation.startTime.split(":").map(Number);
  const [eh, em] = reservation.endTime.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const durationMin = eh * 60 + em - startMin;

  const left = (startMin / 60) * cellWidth;
  const width = (durationMin / 60) * cellWidth;
  const top = rowIndex * rowHeight + 4; // +패딩

  const isPast =
    new Date() > new Date(`${reservation.date}T${reservation.endTime}`);

  const baseClasses = `absolute text-xs rounded-md flex items-center px-1`;

  return (
    <div
      onClick={() => {
        if (!isPast) onClick();
      }}
      title={`${reservation.title}`}
      className={`absolute text-xs text-white rounded-md cursor-pointer flex items-center px-1
        ${isMine ? "bg-indigo-500" : "bg-purple-300"} 
        hover:opacity-90`}
      style={{
        top,
        left,
        width: Math.max(width, cellWidth * 0.5), // 최소 폭
        height: rowHeight * 0.6,
      }}
    >
      {reservation.title || "내 예약"}
    </div>
  );
}

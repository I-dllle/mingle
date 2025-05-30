// features/reservation/components/ReservationDetail.tsx

import React from "react";
import { Reservation } from "@/features/reservation/types/reservation";
import { formatDate, formatTime, getDayOfWeek } from "@/lib/date";

interface Props {
  reservation: Reservation;
  isMine: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
}

export function ReservationDetail({
  reservation,
  isMine,
  onClose,
  onEdit,
  onCancel,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-[360px]">
      <h2 className="text-lg font-bold mb-2">
        {reservation.title || "(제목 없음)"}
      </h2>

      <div className="text-sm text-gray-700 space-y-1 mb-4">
        <p>
          <strong>시간:</strong> {formatTime(reservation.startTime)} ~{" "}
          {formatTime(reservation.endTime)}
        </p>
        <p>
          <strong>날짜:</strong> {formatDate(reservation.date)} (
          {getDayOfWeek(reservation.date)})
        </p>
        <p>
          <strong>방:</strong> {reservation.roomName} (
          {reservation.roomType === "MEETING_ROOM" ? "회의실" : "연습실"})
        </p>
        <p>
          <strong>사용자:</strong> {reservation.userName}
          {isMine && " (나)"}
        </p>
        <p>
          <strong>상태:</strong>{" "}
          {reservation.reservationStatus === "CONFIRMED" ? "확정됨" : "취소됨"}
        </p>
      </div>

      <div className="flex justify-end space-x-2">
        {isMine && (
          <>
            <button
              onClick={onEdit}
              className="text-sm px-3 py-1 rounded bg-blue-500 text-white"
            >
              수정
            </button>
            <button
              onClick={onCancel}
              className="text-sm px-3 py-1 rounded bg-red-500 text-white"
            >
              취소
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded bg-gray-300"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

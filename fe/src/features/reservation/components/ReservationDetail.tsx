// features/reservation/components/ReservationDetail.tsx

import React from "react";
import { Reservation } from "@/features/reservation/types/rservation";
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
    <div className="bg-white rounded-2xl p-6 w-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {reservation.title || "(제목 없음)"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
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
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="text-sm text-gray-700 space-y-3 mb-6">
        <p className="flex items-center">
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
            className="text-violet-500 mr-2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="font-medium mr-2">시간:</span>{" "}
          {formatTime(reservation.startTime)} ~{" "}
          {formatTime(reservation.endTime)}
        </p>
        <p className="flex items-center">
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
            className="text-violet-500 mr-2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="font-medium mr-2">날짜:</span>{" "}
          {formatDate(reservation.date)} ({getDayOfWeek(reservation.date)})
        </p>
        <p className="flex items-center">
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
            className="text-violet-500 mr-2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="font-medium mr-2">방:</span> {reservation.roomName} (
          {reservation.roomType === "MEETING_ROOM" ? "회의실" : "연습실"})
        </p>
        <p className="flex items-center">
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
            className="text-violet-500 mr-2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="font-medium mr-2">사용자:</span>{" "}
          {reservation.userName}
          {isMine && (
            <span className="text-violet-600 font-medium ml-1">(나)</span>
          )}
        </p>
        <p className="flex items-center">
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
            className="text-violet-500 mr-2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="font-medium mr-2">상태:</span>
          <span
            className={`${
              reservation.reservationStatus === "CONFIRMED"
                ? "text-green-600"
                : "text-red-500"
            } font-medium`}
          >
            {reservation.reservationStatus === "CONFIRMED"
              ? "확정됨"
              : "취소됨"}
          </span>
        </p>
      </div>

      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
        {isMine && (
          <>
            <button
              onClick={onEdit}
              className="text-sm px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-700 text-white transition shadow-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              수정
            </button>
            <button
              onClick={onCancel}
              className="text-sm px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition shadow-sm flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              취소
            </button>
          </>
        )}
        {!isMine && (
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            닫기
          </button>
        )}
      </div>
    </div>
  );
}

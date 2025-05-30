// features/reservation/components/ReservationForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { RoomSelector } from "@/features/room/components/common/RoomSelector";
import { formatDate, formatTime } from "@/lib/date";
import type { ReservationFormInput } from "@/features/reservation/types/reservation";
import { hasConflict } from "@/features/reservation/utils/reservationDateUtils";

interface Props {
  initial?: Partial<ReservationFormInput>;
  onSubmit: (data: ReservationFormInput) => void;
  onCancel: () => void;
}

export function ReservationForm({ initial = {}, onSubmit, onCancel }: Props) {
  const [roomId, setRoomId] = useState<number | null>(initial.roomId ?? null);
  const [date, setDate] = useState<string>(
    initial.date ?? formatDate(new Date())
  );
  const [startTime, setStartTime] = useState<string>(
    initial.startTime ?? "09:00"
  );
  const [endTime, setEndTime] = useState<string>(initial.endTime ?? "10:00");
  const [title, setTitle] = useState<string>(initial.title ?? "");

  // validation error
  const [error, setError] = useState<string>("");
  const handleSubmit = () => {
    if (!roomId) return setError("방을 선택해주세요.");
    if (
      hasConflict(
        // need reservations list passed in or fetched
        initial.reservations ?? [],
        date,
        startTime,
        endTime
      )
    ) {
      return setError("해당 시간에 이미 예약이 있습니다.");
    }
    onSubmit({ roomId, date, startTime, endTime, title });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-[400px]">
      <h3 className="text-lg font-semibold mb-4">
        {initial.roomId ? "예약 수정" : "새 예약"}
      </h3>{" "}
      <div className="space-y-3">
        {/* 방 선택 (기존 예약 수정 시에는 비활성화) */}
        <RoomSelector
          value={roomId}
          onChange={setRoomId}
          disabled={!!initial.roomId} // 기존 예약 수정 시 방 변경 불가
        />

        {/* 날짜 */}
        <div>
          <label className="text-sm font-medium">날짜</label>
          <input
            type="date"
            className="w-full border rounded px-2 py-1 mt-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* 시간 */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium">시작 시간</label>
            <input
              type="time"
              className="w-full border rounded px-2 py-1 mt-1"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">종료 시간</label>
            <input
              type="time"
              className="w-full border rounded px-2 py-1 mt-1"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="text-sm font-medium">제목</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1 mt-1"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-1 border rounded hover:bg-gray-100"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:opacity-90"
        >
          저장
        </button>
      </div>
    </div>
  );
}

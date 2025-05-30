// features/reservation/components/ReservationFilter.tsx

"use client";

import React from "react";
import { formatDate } from "@/lib/date";
import { RoomType } from "@/features/room/types/room";

interface Props {
  date: string;
  roomType: RoomType;
  onDateChange: (newDate: string) => void;
  onTypeChange: (newType: RoomType) => void;
}

export function ReservationFilter({
  date,
  roomType,
  onDateChange,
  onTypeChange,
}: Props) {
  return (
    <div className="flex items-center gap-4 mb-4">
      {/* 날짜 선택 */}
      <div className="flex flex-col">
        <label htmlFor="filter-date" className="text-sm font-medium">
          날짜
        </label>
        <input
          id="filter-date"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>

      {/* 룸 타입 선택 */}
      <div className="flex flex-col">
        <label htmlFor="filter-type" className="text-sm font-medium">
          방 타입
        </label>
        <select
          id="filter-type"
          value={roomType}
          onChange={(e) => onTypeChange(e.target.value as RoomType)}
          className="border rounded px-2 py-1"
        >
          <option value="MEETING_ROOM">회의실</option>
          <option value="PRACTICE_ROOM">연습실</option>
        </select>
      </div>
    </div>
  );
}

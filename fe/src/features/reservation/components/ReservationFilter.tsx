// features/reservation/components/ReservationFilter.tsx
"use client";

import React from "react";
import { RoomType } from "@/features/room/types/room";

interface Props {
  date: string;
  roomType: RoomType;
  onDateChange: (newDate: string) => void;
  onTypeChange: (rt: RoomType) => void;
}

export function ReservationFilter({
  date,
  roomType,
  onDateChange,
  onTypeChange,
}: Props) {
  return (
    <div className="flex items-center space-x-4">
      {/* 날짜 선택기 (단순히 <input type="date" /> 예시) */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-600">날짜:</label>
        <input
          type="date"
          className="border rounded px-2 py-1 text-sm"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      {/* 방 타입 드롭다운 */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-600">방 타입:</label>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={roomType}
          onChange={(e) => onTypeChange(e.target.value as RoomType)}
        >
          <option value="PRACTICE_ROOM">연습실</option>
          <option value="MEETING_ROOM">회의실</option>
        </select>
      </div>
    </div>
  );
}

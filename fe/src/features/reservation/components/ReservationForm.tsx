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
  isRoomSelected?: boolean; // 방이 이미 선택되었는지 여부
}

export function ReservationForm({
  initial = {},
  onSubmit,
  onCancel,
  isRoomSelected = false,
}: Props) {
  const [roomId, setRoomId] = useState<number | null>(initial.roomId ?? null);
  const [date, setDate] = useState<string>(
    initial.date ?? formatDate(new Date())
  );
  const [startTime, setStartTime] = useState<string>(
    initial.startTime ?? "09:00"
  );
  const [endTime, setEndTime] = useState<string>(initial.endTime ?? "10:00");
  // 기본 제목 생성 (방 이름과 날짜/시간 조합)
  const defaultTitle = initial.roomName
    ? `${initial.roomName} ${initial.date?.replace(/-/g, "/")} ${
        initial.startTime || ""
      }`
    : "";

  const [title, setTitle] = useState<string>(initial.title ?? defaultTitle);

  // 시작 시간이 변경될 때 종료 시간을 자동으로 업데이트하는 useEffect 추가
  useEffect(() => {
    if (!initial.endTime && startTime) {
      try {
        const [hours, minutes] = startTime.split(":").map(Number);
        const endHours = hours + 1;
        const endTimeString = `${String(endHours % 24).padStart(
          2,
          "0"
        )}:${String(minutes).padStart(2, "0")}`;
        setEndTime(endTimeString);
      } catch (error) {
        console.error("시간 형식 변환 오류", error);
      }
    }
  }, [startTime, initial.endTime]);

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
      <h3 className="text-lg font-semibold mb-2">
        {initial.roomId && !isRoomSelected ? "예약 수정" : "새 예약"}
      </h3>
      {isRoomSelected && initial.roomName && (
        <p className="text-sm text-gray-500 mb-4">
          {initial.roomName} / {initial.date} {initial.startTime}
        </p>
      )}
      <div className="space-y-3">
        {" "}
        {/* 방 선택 (기존 예약 수정 시나 달력에서 방을 선택했을 때는 비활성화) */}
        {isRoomSelected || !!initial.roomId ? (
          <div>
            <label className="text-sm font-medium">선택된 방</label>
            <div className="w-full border rounded px-2 py-1 mt-1 bg-gray-50">
              {initial.roomName || `${roomId}번 방`}
            </div>
          </div>
        ) : (
          <RoomSelector
            value={roomId}
            onChange={setRoomId}
            disabled={false}
            initialType={initial.roomType as any}
          />
        )}{" "}
        {/* 날짜 */}
        <div>
          <label className="text-sm font-medium">날짜</label>
          <input
            type="date"
            className={`w-full border rounded px-2 py-1 mt-1 ${
              isRoomSelected ? "bg-gray-50" : ""
            }`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            readOnly={isRoomSelected} // 시간 슬롯에서 선택한 경우 읽기 전용
          />
        </div>
        {/* 시간 */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium">시작 시간</label>
            <input
              type="time"
              className={`w-full border rounded px-2 py-1 mt-1 ${
                isRoomSelected ? "bg-gray-50" : ""
              }`}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              readOnly={isRoomSelected} // 시간 슬롯에서 선택한 경우 읽기 전용
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">종료 시간</label>
            <input
              type="time"
              className="w-full border rounded px-2 py-1 mt-1"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              // 종료 시간은 항상 수정 가능 (시작 시간 + 1시간이 기본값이지만 사용자가 조정 가능)
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

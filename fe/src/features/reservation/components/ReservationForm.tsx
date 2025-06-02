// features/reservation/components/ReservationForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { RoomSelector } from "@/features/room/components/common/RoomSelector";
import { formatDate, formatTime } from "@/lib/date";
import type { ReservationFormInput } from "@/features/reservation/types/rservation";
import * as reservationDateUtils from "@/features/reservation/utils/reservationDateUtils";

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
  const [endTime, setEndTime] = useState<string>(
    // 초기 endTime이 없으면 startTime +1 을 디폴트로, 있으면 그대로 내려받은 초기값 사용
    initial.endTime ??
      (() => {
        const [h, m] = (initial.startTime ?? "09:00").split(":").map(Number);
        const hh = (h + 1) % 24;
        return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      })()
  );
  // ▶ 변경: “기본 제목 생성” 로직은 그대로 두되, 사용자가 직접 수정 가능
  const defaultTitle = initial.roomName
    ? `${initial.roomName} ${initial.date?.replace(/-/g, "/")} ${
        initial.startTime || ""
      }`
    : "";
  const [title, setTitle] = useState<string>(initial.title ?? defaultTitle);

  // 시작 시간이 변경될 때 종료 시간을 자동으로 업데이트하는 useEffect 추가
  useEffect(() => {
    try {
      const [hours, minutes] = startTime.split(":").map(Number);
      const endHours = (hours + 1) % 24;
      const endTimeString = `${String(endHours).padStart(2, "0")}:00`;
      setEndTime((prev) => {
        // ★ 자동 설정된 endTime 조건:
        //    1) prev가 초기값(initial.endTime)과 같거나
        //    2) prev가 "시작시간 HH:00" 이었던 과거 자동값과 같다면,
        //    → 새로 계산한 endTimeString(다음 정시)으로 덮어쓰기
        const wasAuto =
          prev === initial.endTime ||
          // "현재 startTime의 시:00" 이었던 과거 자동값(예: startTime=03:xx 였다면 "03:00")과 같거나
          prev === `${String(hours % 24).padStart(2, "0")}:00`;

        return wasAuto ? endTimeString : prev;
      });
    } catch (error) {
      console.error("시간 형식 변환 오류", error);
    }
  }, [startTime, initial.endTime]);
  // validation error
  const [error, setError] = useState<string>("");
  // 2) handleSubmit 수정: isValidTimeRange 검사 추가
  const handleSubmit = () => {
    // 1) 방 선택 여부
    if (!roomId) {
      return setError("방을 선택해주세요.");
    }

    // 2) 과거 날짜 선택 금지
    const todayZeroTs = new Date().setHours(0, 0, 0, 0);
    const selectedZeroTs = new Date(date).setHours(0, 0, 0, 0);
    if (selectedZeroTs < todayZeroTs) {
      return setError("오늘 이전 날짜는 선택할 수 없습니다.");
    }

    // 3) “오늘이고, 시작 시간이 현재 시각보다 이전”인지 검사
    if (!reservationDateUtils.isNotPastStartTime(date, startTime)) {
      return setError("시작 시간이 현재 시각 이전일 수 없습니다.");
    }

    // 4) 시작/종료 시각 유효성 검사 (시작 < 종료)
    if (!reservationDateUtils.isValidTimeRange(startTime, endTime, date)) {
      return setError("시작 시간은 종료 시간보다 이전이어야 합니다.");
    }

    // 5) 기존 예약과 겹치는지 검사
    if (
      reservationDateUtils.hasConflict(
        initial.reservations ?? [],
        date,
        startTime,
        endTime
      )
    ) {
      return setError("해당 시간에 이미 예약이 있습니다.");
    }

    // 모든 검사를 통과하면 onSubmit 호출
    onSubmit({ roomId, date, startTime, endTime, title });
  };

  return (
    <div className="bg-white p-6 rounded-2xl w-[420px]">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 text-violet-600"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {initial.roomId && !isRoomSelected ? "예약 수정" : "새 예약"}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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

      {isRoomSelected && initial.roomName && (
        <div className="mb-5 p-3 bg-violet-50 rounded-lg text-sm text-violet-700 flex items-center">
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
            className="mr-2"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {initial.roomName} / {initial.date?.replace(/-/g, ".")}{" "}
          {initial.startTime}
        </div>
      )}

      <div className="space-y-4">
        {/* 방 선택 (기존 예약 수정 시나 달력에서 방을 선택했을 때는 비활성화) */}
        {isRoomSelected || !!initial.roomId ? (
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
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
                className="mr-1.5 text-violet-500"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              선택된 방
            </label>
            <div className="w-full border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-gray-700">
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
          <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
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
              className="mr-1.5 text-violet-500"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            날짜
          </label>
          <input
            type="date"
            className={`w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none ${
              isRoomSelected ? "bg-gray-50" : ""
            }`}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            readOnly={isRoomSelected} // 시간 슬롯에서 선택한 경우 읽기 전용
          />
        </div>
        {/* 시간 */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
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
                className="mr-1.5 text-violet-500"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              시작 시간
            </label>
            <input
              type="time"
              className={`w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none"
              }`}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
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
                className="mr-1.5 text-violet-500"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              종료 시간
            </label>
            <input
              type="time"
              className={`w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                isRoomSelected ? "bg-gray-50" : ""
              }`}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              readOnly={isRoomSelected}
              min={startTime}
              max="23:59"
            />
          </div>
        </div>
        {/* 제목 */}
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center mb-1">
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
              className="mr-1.5 text-violet-500"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            제목
          </label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center">
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
              className="mr-2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700 transition shadow-sm"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition shadow-sm flex items-center"
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
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          저장
        </button>
      </div>
    </div>
  );
}

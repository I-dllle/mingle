// features/reservation/components/RoomReservationPage.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { RoomAvailabilityCalendar } from "./RoomAvailabilityCalendar";
import { ReservationDetail } from "./ReservationDetail";
import { ReservationForm } from "./ReservationForm";
import { reservationService } from "../services/reservationService";
import { RoomStatusBadge } from "@/features/room/components/common/RoomStatusBadge";
import { formatDate } from "@/lib/date";
import type { Reservation, ReservationFormInput } from "../types/reservation";
import { RoomType } from "@/features/room/types/room";
import type { RoomWithReservations } from "../types/roomWithReservations";
import { ReservationStatus } from "../types/reservationStatus";
import { RoomLayoutDiagram } from "@/features/room/components/common/RoomLayoutDiagram";

export default function RoomReservationPage() {
  // ───────────────────────────────────────────
  // 1) 사용자 정보
  // ───────────────────────────────────────────
  const { user, isLoading: authLoading } = useAuth();

  // ───────────────────────────────────────────
  // 2) 날짜(date) 상태 (부모가 관리)
  // ───────────────────────────────────────────
  const [date, setDate] = useState(formatDate(new Date()));

  // ───────────────────────────────────────────
  // 3) 방 타입(roomType) 상태 (부모가 관리)
  // ───────────────────────────────────────────
  const [roomType, setRoomType] = useState<RoomType>("PRACTICE_ROOM");

  // ───────────────────────────────────────────
  // 4) 해당 날짜·방타입의 “룸 + 예약” 데이터
  // ───────────────────────────────────────────
  const [roomsWithReservations, setRoomsWithReservations] = useState<
    RoomWithReservations[]
  >([]);

  // ───────────────────────────────────────────
  // 5) 모달 상태들
  // ───────────────────────────────────────────
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ───────────────────────────────────────────
  // 6) 로딩/에러 상태
  // ───────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = user?.id ?? 0;

  // ───────────────────────────────────────────
  // A) 예약 데이터를 불러오는 useEffect
  //    (date, roomType, user 변경 시 재요청)
  // ───────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await reservationService.getRoomWithReservations(
          roomType,
          date
        );
        setRoomsWithReservations(data);
      } catch (err) {
        console.error("예약 데이터 불러오기 실패:", err);
        setError("예약 정보를 가져오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [date, roomType, user]);

  // ───────────────────────────────────────────
  // B) 자식(RoomAvailabilityCalendar)에서 발생시킨
  //    dateChange 이벤트를 듣고, 부모의 date 상태를 갱신
  // ───────────────────────────────────────────
  useEffect(() => {
    const handleDateChange = (e: any) => {
      const newDate = e.detail?.date;
      if (newDate && newDate !== date) {
        setDate(newDate);
      }
    };
    window.addEventListener("dateChange", handleDateChange);
    return () => window.removeEventListener("dateChange", handleDateChange);
  }, [date]);

  // ───────────────────────────────────────────
  // C) 달력 내 슬롯(예약/빈칸) 클릭 → 신규 or 상세 모달 띄우기
  // ───────────────────────────────────────────
  const handleReservationSelect = async (
    reservationId: number,
    newReservationData?: { roomId: number; date: string; startTime: string }
  ) => {
    if (reservationId === -1) {
      // 1) 빈 슬롯 클릭 → 신규 예약 폼 열기
      const { roomId, date: newDate, startTime } = newReservationData!;
      const [h, m] = startTime.split(":").map(Number);
      const endTime = `${String(h + 1).padStart(2, "0")}:${String(m).padStart(
        2,
        "0"
      )}`;
      const room = roomsWithReservations.find((r) => r.roomId === roomId);

      setSelectedReservation({
        id: 0,
        roomId,
        roomName: room?.roomName || "",
        roomType: room?.roomType || roomType,
        date: newDate,
        startTime,
        endTime,
        title: "",
        userId: currentUserId,
        userName: user.name,
        reservationStatus: ReservationStatus.CONFIRMED,
      });
      setSelectedReservationId(null);
      setIsFormOpen(true);
      return;
    }

    // 2) 기존 예약 클릭 → 상세 모달 열기
    try {
      const res = await reservationService.getById(reservationId);
      setSelectedReservation(res);
      setSelectedReservationId(reservationId);
      setIsDetailOpen(true);
    } catch (err) {
      console.error("예약 상세 정보 불러오기 실패:", err);
    }
  };

  // ───────────────────────────────────────────
  // D) 상세 모달 → “수정” → 예약 폼 모달로 전환
  // ───────────────────────────────────────────
  const handleEditReservation = () => {
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  // ───────────────────────────────────────────
  // E) 상세 모달 → “취소” → 예약 취소 & 달력 리프레시
  // ───────────────────────────────────────────
  const handleCancelReservation = async () => {
    if (!selectedReservationId) return;
    try {
      await reservationService.cancel(selectedReservationId);
      const data = await reservationService.getRoomWithReservations(
        roomType,
        date
      );
      setRoomsWithReservations(data);
      setIsDetailOpen(false);
    } catch (err) {
      console.error("예약 취소 실패:", err);
    }
  };

  // ───────────────────────────────────────────
  // F) 예약 폼 제출 → 신규 or 수정 → 달력 리프레시
  // ───────────────────────────────────────────
  const handleSubmitForm = async (formData: ReservationFormInput) => {
    try {
      if (selectedReservationId) {
        await reservationService.update(selectedReservationId, formData);
      } else {
        await reservationService.create(formData);
      }
      setIsFormOpen(false);

      const data = await reservationService.getRoomWithReservations(
        roomType,
        date
      );
      setRoomsWithReservations(data);
    } catch (err) {
      console.error("예약 저장 실패:", err);
    }
  };

  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    // 최신 브라우저의 경우:
    if (typeof hiddenDateInputRef.current?.showPicker === "function") {
      hiddenDateInputRef.current.showPicker();
      return;
    }
    // showPicker()가 없으면 포커스만 줘도 대부분의 브라우저에서 달력 열림
    hiddenDateInputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* ┌──────────────────────────────────────────
          (A) 부모 최상단 헤더: “◀ 날짜 ▶ 오늘” + “방 타입 선택”
         ─────────────────────────────────────────── */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between">
          {/* ◀ 이전 / 날짜 / ▶ 다음 / 오늘 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const prev = new Date(date);
                prev.setDate(prev.getDate() - 1);
                setDate(prev.toISOString().slice(0, 10));
              }}
              className="p-2 rounded-full hover:bg-violet-50 text-violet-700 transition"
            >
              &lt;
            </button>

            <div className="relative inline-block">
              <button
                type="button"
                onClick={openDatePicker}
                className="text-base font-semibold text-gray-800 bg-transparent border-none px-1"
              >
                {date}
              </button>
              <input
                ref={hiddenDateInputRef}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                style={{ pointerEvents: "all" }}
              />
            </div>

            <button
              onClick={() => {
                const next = new Date(date);
                next.setDate(next.getDate() + 1);
                setDate(next.toISOString().slice(0, 10));
              }}
              className="p-2 rounded-full hover:bg-violet-50 text-violet-700 transition"
            >
              &gt;
            </button>

            <button
              onClick={() => setDate(formatDate(new Date()))}
              className="px-3 py-1 text-sm bg-violet-100 text-violet-700 rounded-full hover:bg-violet-200 font-medium transition"
            >
              오늘
            </button>
          </div>

          {/* 우측 끝: 방 타입 드롭다운 */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">
              방 타입:
            </label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as RoomType)}
            >
              <option value="PRACTICE_ROOM">연습실</option>
              <option value="MEETING_ROOM">회의실</option>
            </select>
          </div>
        </div>
      </div>

      {/* ┌──────────────────────────────────────────
          (B) 달력 컴포넌트: 헤더 없음 → “시간 슬롯 + 예약 카드”만 렌더링
         ─────────────────────────────────────────── */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-500">불러오는 중...</div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      ) : (
        <RoomAvailabilityCalendar
          rooms={roomsWithReservations}
          currentUserId={currentUserId}
          date={date}
          onSelect={handleReservationSelect}
        />
      )}

      {/* ┌──────────────────────────────────────────
          (C) 예약 상세 모달 (ReservationDetail)
         ─────────────────────────────────────────── */}
      {isDetailOpen && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <ReservationDetail
              reservation={selectedReservation}
              isMine={selectedReservation.userId === currentUserId}
              onClose={() => setIsDetailOpen(false)}
              onEdit={handleEditReservation}
              onCancel={handleCancelReservation}
            />
          </div>
        </div>
      )}

      {/* ┌──────────────────────────────────────────
          (D) 예약 폼 모달 (ReservationForm)
         ─────────────────────────────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <ReservationForm
              initial={
                selectedReservation
                  ? {
                      roomId: selectedReservation.roomId,
                      roomName: selectedReservation.roomName,
                      roomType: selectedReservation.roomType,
                      date: selectedReservation.date,
                      startTime: selectedReservation.startTime,
                      endTime: selectedReservation.endTime,
                      title: selectedReservation.title || "",
                    }
                  : {}
              }
              isRoomSelected={
                !!(selectedReservation && selectedReservation.id === 0)
              }
              onSubmit={handleSubmitForm}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ┌──────────────────────────────────────────
          (E) 하단: 연습실 배치도 + 연습실 상태 리스트
         ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">연습실 배치도</h3>
          <RoomLayoutDiagram imageUrl="https://i.namu.wiki/i/kPP-AgF1PDjxsQxZq2VqDfw51SYDFh_FZPay3ThGtMJm4u7X2sd_mpQLY3dJ47zPga33giJTL2esWEKMvI8GqZYivMBMcYCtUmpTyG-QpidSnac5pg-0dt0MdJD4kWBBE5x5XZVbXRc6SUF41KJMZQ.webp" />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">연습실 정보</h3>
          <div className="space-y-3">
            {roomsWithReservations.map((room) => (
              <div
                key={room.roomId}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="text-sm font-medium">{room.roomName}</div>
                <RoomStatusBadge
                  isActive={room.reservations.some((r) => {
                    const now = new Date();
                    const start = new Date(`${r.date}T${r.startTime}`);
                    const end = new Date(`${r.date}T${r.endTime}`);
                    return (
                      r.reservationStatus !== "CANCELED" &&
                      now >= start &&
                      now < end
                    );
                  })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

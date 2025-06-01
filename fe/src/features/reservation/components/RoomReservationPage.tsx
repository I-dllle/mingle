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
import type { Reservation, ReservationFormInput } from "../types/Reservation";
import { RoomType } from "@/features/room/types/room";
import type { RoomWithReservations } from "../types/roomWithReservations";
import { ReservationStatus } from "../types/ReservationStatus";
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
    // ★ 2차 검증: 삭제 전 확인창 띄우기
    const proceed = window.confirm("정말 취소하시겠습니까?");
    if (!proceed) {
      return; // “취소”를 누르면 이 함수 종료(삭제 로직 실행 안 됨)
    }

    try {
      // 예시: fetch 요청에 credentials: 'include' 추가
      const response = await fetch(
        `http://localhost:8080/api/v1/reservations/${selectedReservationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Authorization 헤더를 사용하지 않고, 쿠키(JWT)를 전송하려면 아래 credentials 설정이 필수입니다.
          },
          credentials: "include",
          // └── "include" 로 하면 cross‐origin(3000→8080) 요청에도 쿠키가 자동으로 따라갑니다.
          // └── 만약 백엔드/프론트가 동일 도메인이라면 'same-origin' 도 사용 가능합니다.
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `예약 취소 실패: ${response.status}`);
      }

      // 예약 취소 성공 시 달력 갱신
      const data = await reservationService.getRoomWithReservations(
        roomType,
        date
      );
      setRoomsWithReservations(data);
      setIsDetailOpen(false);
    } catch (err: any) {
      console.error("예약 취소 실패:", err);
      alert("예약 취소 중 오류가 발생했습니다.\n" + err.message);
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
         ─────────────────────────────────────────── */}{" "}
      <div className="p-4 m-0 bg-white rounded-xl shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between w-full">
          {/* ◀ 이전 / 날짜 / ▶ 다음 / 오늘 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                const prev = new Date(date);
                prev.setDate(prev.getDate() - 1);
                setDate(prev.toISOString().slice(0, 10));
              }}
              className="p-2 rounded-md hover:bg-violet-50 text-violet-700 transition flex items-center justify-center"
            >
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
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>{" "}
            <div className="relative inline-block">
              <button
                type="button"
                onClick={openDatePicker}
                className="text-base font-semibold text-gray-800 bg-transparent border-none px-3 py-1.5 hover:bg-gray-50 rounded-md flex items-center"
              >
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
                  className="mr-2 text-violet-600"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="3" x2="9" y2="9" />
                  <line x1="15" y1="3" x2="15" y2="9" />
                </svg>
                {date.replace(/-/g, ".")}
              </button>
              <input
                ref={hiddenDateInputRef}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                style={{ pointerEvents: "all" }}
              />
            </div>{" "}
            <button
              onClick={() => {
                const next = new Date(date);
                next.setDate(next.getDate() + 1);
                setDate(next.toISOString().slice(0, 10));
              }}
              className="p-2 rounded-md hover:bg-violet-50 text-violet-700 transition flex items-center justify-center"
            >
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
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <button
              onClick={() => setDate(formatDate(new Date()))}
              className="px-4 py-1.5 text-sm bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200 font-medium transition shadow-sm"
            >
              오늘
            </button>
          </div>{" "}
          <div className="flex-1 space-x-6 mt-2 px-4">
            {/* 타인 예약 (연결된 CSS 클래스가 calendar.module.css에서 정의한 .otherReservation 스타일과 색을 맞춰주세요) */}
            <div className="flex items-center space-x-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#C084FC" }}
                /* #C084FC ≒ 다른 예약의 왼쪽 보더 색(purple-400) */
              />
              <span className="text-sm text-gray-600">타인 예약</span>
            </div>
            {/* 내 예약 (calendar.module.css에서 정의한 .myReservation의 보더 색을 맞춰주세요) */}
            <div className="flex items-center space-x-1">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#8B5CF6" }}
                /* #8B5CF6 ≒ 내 예약의 왼쪽 보더 색(violet-500) */
              />
              <span className="text-sm text-gray-600">내 예약</span>
            </div>
          </div>
          {/* 우측 끝: 방 타입 드롭다운 */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600 mr-1">
              방 타입:
            </label>
            <select
              className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm"
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
         ─────────────────────────────────────────── */}{" "}
      {isDetailOpen && selectedReservation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full ring-1 ring-gray-100 transform transition-all duration-300 scale-100 animate-fadeIn"
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
         ─────────────────────────────────────────── */}{" "}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full ring-1 ring-gray-100 transform transition-all duration-300 scale-100 animate-fadeIn"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-gray-100">
          <h3 className="text-lg font-medium mb-5 text-gray-800 flex items-center">
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
            </svg>
            {roomType === "PRACTICE_ROOM" ? "연습실 배치도" : "회의실 배치도"}
          </h3>
          <RoomLayoutDiagram roomType={roomType} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-gray-100">
          <h3 className="text-lg font-medium mb-5 text-gray-800 flex items-center">
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
              <path d="M2 17 7 2h10l5 15" />
              <path d="M2 17h20" />
              <path d="M16 9h4" />
              <path d="M4 9h4" />
              <path d="M12 17v-4" />
              <path d="M7 2v7" />
              <path d="M17 2v7" />
            </svg>
            연습실 정보
          </h3>
          <div className="space-y-3">
            {" "}
            {[...roomsWithReservations]
              .sort((a, b) =>
                a.roomName.localeCompare(b.roomName, "ko", {
                  numeric: true,
                  sensitivity: "base",
                })
              )
              .map((room) => (
                <div
                  key={room.roomId}
                  className="flex justify-between items-center border-b border-gray-100 pb-8"
                >
                  <div className="text-sm font-medium text-gray-700">
                    {room.roomName}
                  </div>
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

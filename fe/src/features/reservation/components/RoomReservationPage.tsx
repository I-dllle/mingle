"use client";

import { useState, useEffect } from "react";
import { RoomAvailabilityCalendar } from "./RoomAvailabilityCalendar";
import { ReservationFilter } from "./ReservationFilter";
import { ReservationDetail } from "./ReservationDetail";
import { ReservationForm } from "./ReservationForm";
import { reservationService } from "../services/reservationService";
import { RoomLayoutDiagram } from "@/features/room/components/common/RoomLayoutDiagram";
import { RoomStatusBadge } from "@/features/room/components/common/RoomStatusBadge";
import { formatDate } from "@/lib/date";
import { Reservation } from "../types/reservation";
import { RoomType } from "@/features/room/types/room";
import { RoomWithReservationsDto } from "../types/roomWithReservations";

export function RoomReservationPage() {
  // 상태 관리
  const [date, setDate] = useState(formatDate(new Date()));
  const [roomType, setRoomType] = useState<RoomType>("PRACTICE_ROOM");
  const [roomsWithReservations, setRoomsWithReservations] = useState<
    RoomWithReservationsDto[]
  >([]);
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 사용자 ID (실제로는 인증에서 가져와야 함)
  const currentUserId = 1; // 임시 ID

  // 예약 데이터 불러오기
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await reservationService.getRoomWithReservations(
          roomType,
          date
        );
        setRoomsWithReservations(data);
      } catch (error) {
        console.error("예약 데이터 불러오기 실패:", error);
        setError("예약 정보를 가져오는데 실패했습니다.");
        // 테스트용 더미 데이터
        setRoomsWithReservations([
          {
            roomId: 1,
            roomName: "A 연습실 (대)",
            roomType: "PRACTICE_ROOM",
            reservations: [],
          },
          {
            roomId: 2,
            roomName: "B 연습실 (중)",
            roomType: "PRACTICE_ROOM",
            reservations: [],
          },
          {
            roomId: 3,
            roomName: "C 연습실 (소)",
            roomType: "PRACTICE_ROOM",
            reservations: [],
          },
          {
            roomId: 4,
            roomName: "D 연습실 (5층)",
            roomType: "PRACTICE_ROOM",
            reservations: [],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [date, roomType]);

  // 예약 선택 처리
  const handleReservationSelect = async (reservationId: number) => {
    try {
      const reservation = await reservationService.getById(reservationId);
      setSelectedReservation(reservation);
      setSelectedReservationId(reservationId);
      setIsDetailOpen(true);
    } catch (error) {
      console.error("예약 상세 정보 불러오기 실패:", error);
    }
  };

  // 예약 생성 폼 열기
  const handleOpenForm = () => {
    setSelectedReservation(null);
    setSelectedReservationId(null);
    setIsFormOpen(true);
  };

  // 예약 수정 폼 열기
  const handleEditReservation = () => {
    setIsFormOpen(true);
    setIsDetailOpen(false);
  };

  // 예약 취소 처리
  const handleCancelReservation = async () => {
    if (!selectedReservationId) return;

    try {
      await reservationService.cancel(selectedReservationId);
      // 데이터 다시 불러오기
      const data = await reservationService.getRoomWithReservations(
        roomType,
        date
      );
      setRoomsWithReservations(data);
      setIsDetailOpen(false);
    } catch (error) {
      console.error("예약 취소 실패:", error);
    }
  };

  // 예약 폼 제출 처리
  const handleSubmitForm = async (formData: any) => {
    try {
      if (selectedReservationId) {
        // 수정
        await reservationService.update(selectedReservationId, formData);
      } else {
        // 생성
        await reservationService.create(formData);
      }

      // 성공 후 폼 닫기
      setIsFormOpen(false);

      // 데이터 다시 불러오기
      const data = await reservationService.getRoomWithReservations(
        roomType,
        date
      );
      setRoomsWithReservations(data);
    } catch (error) {
      console.error("예약 저장 실패:", error);
    }
  };

  // 방 상태 확인 (현재 사용 중인지)
  const isRoomInUseNow = (reservations: Reservation[]): boolean => {
    const now = new Date();
    return reservations.some((r) => {
      if (r.reservationStatus === "CANCELED") return false;
      const start = new Date(`${r.date}T${r.startTime}`);
      const end = new Date(`${r.date}T${r.endTime}`);
      return now >= start && now < end;
    });
  };

  // 현재 방을 사용 중인 사용자 이름 가져오기
  const getActiveReservationUser = (
    reservations: Reservation[]
  ): string | null => {
    const now = new Date();
    const activeReservation = reservations.find((r) => {
      if (r.reservationStatus === "CANCELED") return false;
      const start = new Date(`${r.date}T${r.startTime}`);
      const end = new Date(`${r.date}T${r.endTime}`);
      return now >= start && now < end;
    });

    return activeReservation ? activeReservation.userName : null;
  };

  return (
    <div className="space-y-6">
      {/* 상단 필터 및 버튼 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ReservationFilter
          date={date}
          roomType={roomType}
          onDateChange={setDate}
          onTypeChange={setRoomType}
        />
        <button
          onClick={handleOpenForm}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          예약 등록
        </button>
      </div>

      {/* 캘린더 섹션 */}
      {isLoading ? (
        <div className="flex justify-center items-center p-12 bg-white rounded-lg shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <RoomAvailabilityCalendar
            rooms={roomsWithReservations}
            currentUserId={currentUserId}
            onSelect={handleReservationSelect}
          />
        </div>
      )}

      {/* 연습실 배치도와 정보 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 배치도 */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">연습실 배치도</h3>
          <div
            className="border-2 border-gray-200 rounded-lg bg-gray-50 p-4"
            style={{ minHeight: "280px", position: "relative" }}
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
              {roomsWithReservations
                .filter((room) => room.roomType === "PRACTICE_ROOM")
                .map((room, index) => {
                  const positions = [
                    { top: "20px", left: "20px" }, // 좌상단
                    { top: "20px", right: "20px" }, // 우상단
                    { bottom: "20px", left: "20px" }, // 좌하단
                    { bottom: "20px", right: "20px" }, // 우하단
                  ];
                  const posIndex = index % positions.length;
                  const isInUse = isRoomInUseNow(room.reservations);
                  const statusColor = isInUse
                    ? "bg-red-100 border-red-300"
                    : "bg-green-100 border-green-300";

                  return (
                    <div key={room.roomId} className="relative h-full w-full">
                      <div
                        className={`absolute border-2 ${statusColor} w-24 h-24 flex flex-col items-center justify-center rounded-md`}
                        style={positions[posIndex]}
                      >
                        <span className="text-xl font-bold">
                          {room.roomName.split(" ")[0]}
                        </span>
                        <span className="text-xs mt-1">
                          {room.roomName.split(" ").slice(1).join(" ")}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* 연습실 정보 */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">연습실 정보</h3>
          <div className="space-y-2">
            {roomsWithReservations.map((room) => {
              const isInUse = isRoomInUseNow(room.reservations);
              const activeUser = getActiveReservationUser(room.reservations);

              return (
                <div
                  key={room.roomId}
                  className="p-3 border-b border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{room.roomName}</p>
                    {activeUser && (
                      <p className="text-xs text-gray-500">
                        사용자: {activeUser}
                      </p>
                    )}
                  </div>
                  <RoomStatusBadge isActive={isInUse} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 예약 상세 모달 */}
      {isDetailOpen && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg overflow-hidden max-w-md w-full"
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

      {/* 예약 폼 모달 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg overflow-hidden max-w-md w-full"
          >
            <ReservationForm
              initial={selectedReservation || {}}
              onSubmit={handleSubmitForm}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomReservationPage;

"use client";

import { useState, useEffect } from "react";
import {
  Room,
  RoomType,
  roomTypeLabels,
} from "@/features/reservation/types/Room";
import { roomService } from "@/features/reservation/services/reservationService";
import RoomManagement from "@/features/reservation/components/RoomManagement";
import ReservationNav from "@/features/reservation/components/ReservationNav";

export default function RoomsManagementPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

  // 방 목록 로드
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setIsLoading(true);
        const data = await roomService.getAllRooms();
        setRooms(data);
        setError(null);
      } catch (err) {
        console.error("방 정보를 불러오는 중 오류가 발생했습니다:", err);
        setError(
          "방 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, []);

  // 방 생성 핸들러
  const handleCreateRoom = async (newRoom: Omit<Room, "id">) => {
    try {
      setIsLoading(true);
      const createdRoom = await roomService.createRoom(newRoom);
      setRooms((prev) => [...prev, createdRoom]);
      setShowAddForm(false);
    } catch (err) {
      console.error("방 생성 중 오류가 발생했습니다:", err);
      setError("방 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 방 수정 핸들러
  const handleUpdateRoom = async (room: Room) => {
    try {
      setIsLoading(true);
      const { id, ...roomData } = room;
      const updatedRoom = await roomService.updateRoom(id, roomData);
      setRooms((prev) => prev.map((r) => (r.id === id ? updatedRoom : r)));
      setRoomToEdit(null);
    } catch (err) {
      console.error("방 수정 중 오류가 발생했습니다:", err);
      setError("방 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 방 삭제 핸들러
  const handleDeleteRoom = async (id: number) => {
    if (!window.confirm("정말로 이 방을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsLoading(true);
      await roomService.deleteRoom(id);
      setRooms((prev) => prev.filter((room) => room.id !== id));
    } catch (err) {
      console.error("방 삭제 중 오류가 발생했습니다:", err);
      setError("방 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">방 관리</h1>

      {/* 예약 시스템 네비게이션 */}
      <ReservationNav isAdmin={true} />

      <div className="flex justify-between items-center mb-6">
        <div></div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          방 추가
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <RoomManagement
          rooms={rooms}
          onCreateRoom={handleCreateRoom}
          onUpdateRoom={handleUpdateRoom}
          onDeleteRoom={handleDeleteRoom}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          roomToEdit={roomToEdit}
          setRoomToEdit={setRoomToEdit}
        />
      )}
    </div>
  );
}

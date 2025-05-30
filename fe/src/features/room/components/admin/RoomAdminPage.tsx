"use client";

import React, { useState, useEffect } from "react";
import { roomService } from "@/features/room/service/roomService";
import { Room } from "@/features/room/types/room";
import RoomFormModal from "./RoomFormModal";
import RoomTableRow from "./RoomTableRow";

export default function RoomAdminPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1) 목록 불러오기
  const fetchRooms = () => {
    roomService.getAll().then(setRooms).catch(console.error);
  };
  useEffect(fetchRooms, []);

  // 2) 생성/수정 모달 오픈 핸들러
  const openCreateModal = () => {
    setSelectedRoom(undefined);
    setIsModalOpen(true);
  };
  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  // 3) 삭제 핸들러
  const handleDelete = async (roomId: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        await roomService.delete(roomId);
        fetchRooms();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 4) 모달 제출 성공 후
  const onSubmitSuccess = () => {
    setIsModalOpen(false);
    fetchRooms();
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">회의실/연습실 관리</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          방 생성
        </button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                방 이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                타입
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <RoomTableRow
                key={room.id}
                room={room}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 모달 */}
      <RoomFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialRoom={selectedRoom}
        onSubmitSuccess={onSubmitSuccess}
      />
    </div>
  );
}

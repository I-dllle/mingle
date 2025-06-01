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

  // 3) 삭제 핸들러 (2차 확인창 + fetch DELETE)
  const handleDelete = async (roomId: number) => {
    // 2차 검증: 삭제 전 확인창 띄우기
    const proceed = window.confirm("정말 삭제하시겠습니까?");
    if (!proceed) {
      return; // "취소"를 누르면 함수 종료
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/room/${roomId}`, // 백엔드 DELETE 엔드포인트
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // cross‐origin 요청 시 쿠키 자동 전송
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `방 삭제 실패: ${response.status}`);
      }

      // 삭제 성공(204), 목록 갱신
      fetchRooms();
    } catch (err: any) {
      console.error("방 삭제 실패:", err);
      alert("방 삭제 중 오류가 발생했습니다.\n" + err.message);
    }
  };
  // 4) 모달 제출 성공 후
  const onSubmitSuccess = () => {
    setIsModalOpen(false);
    fetchRooms();
  };
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* 헤더 - 새로운 디자인 */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            회의실/연습실 관리
          </h1>
          <p className="text-gray-500 mt-1">
            공간을 효율적으로 관리하고 예약할 수 있습니다
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          새 방 생성
        </button>
      </div>

      {/* 테이블 */}
      <div className="overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="px-6 py-4 bg-white border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            전체 회의실/연습실
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            총 {rooms.length}개의 방이 등록되어 있습니다
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  번호
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  방 이름
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  타입
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {rooms.map((room, index) => (
                // index를 prop으로 넘겨줍니다.
                <RoomTableRow
                  key={room.id}
                  room={room}
                  index={index}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div className="p-4 rounded-full bg-gray-100/70 mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-2">등록된 방이 없습니다</p>
                      <button
                        onClick={openCreateModal}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        새 방 생성하기
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

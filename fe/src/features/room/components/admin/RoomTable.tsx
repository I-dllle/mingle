// features/room/components/admin/RoomTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import { roomService } from "@/features/room/service/roomService";
import { Room } from "@/features/room/types/room";
import RoomTableRow from "./RoomTableRow";

interface Props {
  onEdit: (room: Room) => void;
  onDelete: (roomId: number) => void;
}

export default function RoomTable({ onEdit, onDelete }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    roomService
      .getAll()
      .then((data: Room[]) => setRooms(data))
      .catch((err: unknown) => console.error(err));
  }, []);

  return (
    <div className="overflow-x-auto w-full">
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
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// RoomTable.tsx
"use client";

import { useEffect, useState } from "react";
import { roomService } from "@/features/room/services/roomService";
import { Room } from "@/features/room/types/room";
import RoomTableRow from "./RoomTableRow";

export default function RoomTable() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    roomService.getAll().then(setRooms).catch(console.error);
  }, []);

  return (
    <div className="overflow-x-auto w-full">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>방 이름</th>
            <th>타입</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <RoomTableRow key={room.id} room={room} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

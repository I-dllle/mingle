import React from "react";
import { Room } from "@/features/room/types/room";
import { RoomTypeLabel } from "@/features/room/constants/roomLabels";
import { PencilIcon, TrashIcon } from "lucide-react";

interface RoomTableRowProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: number) => void;
}

export default function RoomTableRow({
  room,
  onEdit,
  onDelete,
}: RoomTableRowProps) {
  return (
    <tr className="border-b text-sm">
      <td className="px-4 py-2">{room.id}</td>
      <td className="px-4 py-2 font-medium">{room.name}</td>
      <td className="px-4 py-2">{RoomTypeLabel[room.type]}</td>
      <td className="px-4 py-2 text-right space-x-2">
        <button
          onClick={() => onEdit(room)}
          className="text-blue-500 hover:text-blue-700"
          aria-label="수정"
        >
          <PencilIcon size={16} />
        </button>
        <button
          onClick={() => onDelete(room.id)}
          className="text-red-500 hover:text-red-700"
          aria-label="삭제"
        >
          <TrashIcon size={16} />
        </button>
      </td>
    </tr>
  );
}

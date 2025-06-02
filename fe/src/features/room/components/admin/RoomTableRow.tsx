import React from "react";
import { Room } from "@/features/room/types/room";
import { RoomTypeLabel } from "@/features/room/types/roomLabels";
import { PencilIcon, TrashIcon } from "lucide-react";

interface RoomTableRowProps {
  room: Room;
  index: number;
  onEdit: (room: Room) => void;
  onDelete: (roomId: number) => void;
}

export default function RoomTableRow({
  room,
  index,
  onEdit,
  onDelete,
}: RoomTableRowProps) {
  return (
    <tr className="hover:bg-blue-50/30 transition-all duration-200 group">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-700 rounded-full text-sm">
          {index + 1}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="font-medium text-gray-900">{room.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">ID: {room.id}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm border ${
            room.type === "MEETING_ROOM"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-purple-50 text-purple-700 border-purple-200"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-1.5 ${
              room.type === "MEETING_ROOM" ? "bg-blue-500" : "bg-purple-500"
            }`}
          ></span>
          {RoomTypeLabel[room.type]}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(room)}
            className="flex items-center justify-center text-blue-600 hover:text-blue-700 transition-all p-2 rounded-full hover:bg-blue-50 border border-transparent hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="수정"
          >
            <PencilIcon
              size={16}
              className="transform hover:scale-110 transition-transform"
            />
            <span className="sr-only">수정</span>
          </button>
          <button
            onClick={() => onDelete(room.id)}
            className="flex items-center justify-center text-red-500 hover:text-red-600 transition-all p-2 rounded-full hover:bg-red-50 border border-transparent hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-200"
            aria-label="삭제"
          >
            <TrashIcon
              size={16}
              className="transform hover:scale-110 transition-transform"
            />
            <span className="sr-only">삭제</span>
          </button>
        </div>
      </td>
    </tr>
  );
}

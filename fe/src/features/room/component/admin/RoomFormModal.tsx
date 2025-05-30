// features/room/components/admin/RoomFormModal.tsx

"use client";

import { useState, useEffect } from "react";
import { Room, RoomType } from "@/features/room/types/room";
import { roomService } from "@/features/room/services/roomService";
import { Dialog } from "@headlessui/react";

interface RoomFormModalProps {
  open: boolean;
  onClose: () => void;
  initialRoom?: Room;
  onSubmitSuccess: () => void;
}

const roomTypeLabels: Record<RoomType, string> = {
  MEETING_ROOM: "회의실",
  PRACTICE_ROOM: "연습실",
};

export function RoomFormModal({
  open,
  onClose,
  initialRoom,
  onSubmitSuccess,
}: RoomFormModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<RoomType>("MEETING_ROOM");

  const isEdit = !!initialRoom;

  useEffect(() => {
    if (initialRoom) {
      setName(initialRoom.name);
      setType(initialRoom.type);
    } else {
      setName("");
      setType("MEETING_ROOM");
    }
  }, [initialRoom, open]);

  const handleSubmit = async () => {
    try {
      const payload = { name, type };

      if (isEdit) {
        await roomService.update(initialRoom!.id, payload);
      } else {
        await roomService.create(payload);
      }

      onSubmitSuccess();
      onClose();
    } catch (err) {
      alert("저장에 실패했습니다.");
      console.error(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-50 inset-0 flex items-center justify-center"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <Dialog.Title className="text-lg font-semibold mb-4">
          {isEdit ? "방 수정" : "방 생성"}
        </Dialog.Title>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">방 이름</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">방 타입</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value as RoomType)}
            >
              {Object.entries(roomTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </Dialog>
  );
}

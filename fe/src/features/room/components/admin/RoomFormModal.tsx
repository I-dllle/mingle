// features/room/components/admin/RoomFormModal.tsx
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Dialog } from "@headlessui/react";
import { Room, RoomType } from "@/features/room/types/room";
import { roomService } from "@/features/room/service/roomService";

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

export default function RoomFormModal({
  open,
  onClose,
  initialRoom,
  onSubmitSuccess,
}: RoomFormModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<RoomType>("MEETING_ROOM");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initialRoom);

  useEffect(() => {
    if (initialRoom) {
      setName(initialRoom.name);
      setType(initialRoom.type);
    } else {
      setName("");
      setType("MEETING_ROOM");
    }
    setError(null);
  }, [initialRoom, open]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("방 이름을 입력해주세요.");
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      const payload = { name: name.trim(), type };
      if (isEdit && initialRoom) {
        await roomService.update(initialRoom.id, payload);
      } else {
        await roomService.create(payload);
      }
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error("방 저장 실패:", err);
      setError("방 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black bg-opacity-30" />

      <Dialog.Panel className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <Dialog.Title className="text-lg font-semibold mb-4">
          {isEdit ? "방 수정" : "방 생성"}
        </Dialog.Title>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="room-name" className="block text-sm font-medium">
                방 이름
              </label>
              <input
                id="room-name"
                type="text"
                required
                disabled={isSaving}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="room-type" className="block text-sm font-medium">
                방 타입
              </label>
              <select
                id="room-type"
                disabled={isSaving}
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
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSaving || !name.trim()}
              className={`px-4 py-2 rounded ${
                isSaving || !name.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSaving ? "저장 중…" : "저장"}
            </button>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
}

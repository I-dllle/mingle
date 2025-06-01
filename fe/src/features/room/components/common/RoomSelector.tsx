"use client";

import { useState, useEffect } from "react";
import { Room, RoomType } from "@/features/room/types/room";

interface RoomSelectorProps {
  value: number | null;
  onChange: (roomId: number | null) => void;
  disabled?: boolean;
  initialType?: RoomType;
}

export function RoomSelector({
  value,
  onChange,
  disabled = false,
  initialType = "PRACTICE_ROOM",
}: RoomSelectorProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<RoomType>(initialType);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        // 실제로는 API 호출이 필요하지만, 지금은 더미 데이터로 대체합니다.
        // const data = await roomService.getRooms();
        const data = [
          { id: 1, name: "A 연습실 (대)", type: "PRACTICE_ROOM" },
          { id: 2, name: "B 연습실 (중)", type: "PRACTICE_ROOM" },
          { id: 3, name: "C 연습실 (소)", type: "PRACTICE_ROOM" },
          { id: 4, name: "D 연습실 (5층)", type: "PRACTICE_ROOM" },
          { id: 5, name: "회의실 1", type: "MEETING_ROOM" },
          { id: 6, name: "회의실 2", type: "MEETING_ROOM" },
        ] as Room[];

        setRooms(data);
      } catch (err) {
        console.error("방 목록 불러오기 실패:", err);
        setError("방 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // 타입 변경 시 value 초기화
  useEffect(() => {
    if (value !== null) {
      const room = rooms.find((r) => r.id === value);
      if (room && room.type !== selectedType) {
        onChange(null);
      }
    }
  }, [selectedType, value, rooms, onChange]);

  const filteredRooms = rooms.filter((room) => room.type === selectedType);

  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as RoomType);
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roomId = e.target.value ? parseInt(e.target.value) : null;
    onChange(roomId);
  };

  if (loading) return <div>방 정보 로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-2">
      {/* 방 타입 선택 */}
      <div>
        <label className="text-sm font-medium">방 타입</label>
        <select
          className="w-full border rounded px-2 py-1 mt-1"
          value={selectedType}
          onChange={handleRoomTypeChange}
          disabled={disabled}
        >
          <option value="PRACTICE_ROOM">연습실</option>
          <option value="MEETING_ROOM">회의실</option>
        </select>
      </div>

      {/* 방 선택 */}
      <div>
        <label className="text-sm font-medium">방 선택</label>
        <select
          className="w-full border rounded px-2 py-1 mt-1"
          value={value || ""}
          onChange={handleRoomChange}
          disabled={disabled}
        >
          <option value="">선택하세요</option>
          {filteredRooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default RoomSelector;

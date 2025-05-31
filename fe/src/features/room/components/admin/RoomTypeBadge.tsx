// features/room/components/common/RoomSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Room, RoomType } from "@/features/room/types/room";
// → 예시로 roomService를 임포트했다고 가정합니다.
//    실제 프로젝트에 이미 존재하는 API 호출 함수가 있다면
//    그 이름(예: roomService.getRooms())을 사용하세요.
import { roomService } from "@/features/room/service/roomService";

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

  // ① “실제 API”를 호출해서 방 목록을 가져오도록 변경
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);

      try {
        // 실제로는 roomService.getRooms() 같은 API 호출을 사용하세요.
        // 예를 들어:
        // const data = await roomService.getRooms();
        // setRooms(data);

        // ── 예시: roomService.getRooms() 가 없다면, fetch를 직접 써도 됩니다. ──
        const res = await fetch("/api/rooms");
        if (!res.ok) throw new Error("방 목록을 불러올 수 없습니다.");
        const data: Room[] = await res.json();
        setRooms(data);
      } catch (err: any) {
        console.error("방 목록 불러오기 실패:", err);
        setError("방 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // ② 선택된 value(ID)가 현재 “같은 타입(selectedType)”이 아니면 초기화
  useEffect(() => {
    if (value !== null) {
      const existing = rooms.find((r) => r.id === value);
      if (!existing || existing.type !== selectedType) {
        // - existing이 없으면: 삭제된 방이거나 타입이 달라진 방
        // - existing.type !== selectedType: 현재 선택 타입과 맞지 않음
        onChange(null);
      }
    }
  }, [selectedType, value, rooms, onChange]);

  // ③ 현재 선택된 타입에 맞는 방만 걸러낸다.
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
          value={value ?? ""}
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

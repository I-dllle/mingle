// features/room/components/admin/RoomStatusBadge.tsx

import React from "react";

interface RoomTypeBadgeProps {
  type: "MEETING_ROOM" | "PRACTICE_ROOM";
}

const typeMap = {
  MEETING_ROOM: { label: "회의실", color: "bg-blue-500 text-white" },
  PRACTICE_ROOM: { label: "연습실", color: "bg-green-500 text-white" },
};

export function RoomTypeBadge({ type }: RoomTypeBadgeProps) {
  const { label, color } = typeMap[type];
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${color}`}>
      {label}
    </span>
  );
}

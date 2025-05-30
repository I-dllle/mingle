// features/room/components/admin/RoomStatusBadge.tsx

import React from "react";
import classNames from "classnames";
import styles from "./RoomStatusBadge.module.scss"; // 선택

interface RoomStatusBadgeProps {
  type: "MEETING_ROOM" | "PRACTICE_ROOM";
}

const typeMap = {
  MEETING_ROOM: {
    label: "회의실",
    color: "bg-blue-500 text-white",
  },
  PRACTICE_ROOM: {
    label: "연습실",
    color: "bg-green-500 text-white",
  },
};

export function RoomStatusBadge({ type }: RoomStatusBadgeProps) {
  const { label, color } = typeMap[type];

  return (
    <span
      className={classNames(
        "px-2 py-0.5 text-xs rounded-full font-medium",
        color
      )}
    >
      {label}
    </span>
  );
}

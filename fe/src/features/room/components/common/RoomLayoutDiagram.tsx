// features/room/components/common/RoomLayoutDiagram.tsx
"use client";

import React from "react";
import type { RoomType } from "@/features/room/types/room";

interface RoomLayoutDiagramProps {
  /** 방 타입: "PRACTICE_ROOM" | "MEETING_ROOM" */
  roomType: RoomType;
  /** 대체 텍스트(alt) */
  alt?: string;
}

export function RoomLayoutDiagram({
  roomType,
  alt = "방 배치도",
}: RoomLayoutDiagramProps) {
  // 타입별로 보여줄 이미지 URL 매핑
  const imageMap: Record<RoomType, string> = {
    PRACTICE_ROOM: "/images/practice-room-layout.png",
    MEETING_ROOM: "/images/meeting-room-layout.png",
  };

  // roomType 에 해당하는 URL 을 가져오되, 등록된 게 없으면 기본 이미지 URL 사용
  const src = imageMap[roomType] ?? imageMap.PRACTICE_ROOM;

  return (
    <img
      src={src}
      alt={`${roomType === "PRACTICE_ROOM" ? "연습실" : "회의실"} 배치도`}
      className="w-full h-112 object-cover rounded-md shadow-sm"
    />
  );
}

// features/room/constants/roomLabels.ts
import { RoomType } from "@/features/room/types/room";

/**
 * RoomType별 화면에 표시할 라벨 매핑
 */
export const RoomTypeLabel: Record<RoomType, string> = {
  MEETING_ROOM: "회의실",
  PRACTICE_ROOM: "연습실",
};

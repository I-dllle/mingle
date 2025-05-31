export type RoomType = "MEETING_ROOM" | "PRACTICE_ROOM";

export interface Room {
  id: number;
  name: string;
  type: RoomType;
}

// features/reservation/types/RoomWithReservationsDto.ts

import { Reservation } from "./reservation";
import { RoomType } from "@/features/room/types/room";

export interface RoomWithReservationsDto {
  roomId: number;
  roomName: string;
  roomType: RoomType;
  reservations: Reservation[];
}

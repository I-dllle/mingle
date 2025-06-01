// features/reservation/types/RoomWithReservationsDto.ts

import { Reservation } from "./Reservation";
import { RoomType } from "@/features/room/types/room";

export interface RoomWithReservations {
  roomId: number;
  roomName: string;
  roomType: RoomType;
  reservations: Reservation[];
}

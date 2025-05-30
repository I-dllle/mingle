import { RoomWithReservationsDto } from "@/features/reservation/types/roomWithReservations";
import { RoomStatusBadge } from "./RoomStatusBadge";

interface Props {
  room: RoomWithReservationsDto;
}

function isRoomInUseNow(
  reservations: RoomWithReservationsDto["reservations"]
): boolean {
  const now = new Date();

  return reservations.some((r) => {
    const start = new Date(`${r.date}T${r.startTime}`);
    const end = new Date(`${r.date}T${r.endTime}`);
    return now >= start && now < end;
  });
}

export default function RoomInfoPanel({ room }: Props) {
  const isUsingNow = isRoomInUseNow(room.reservations);

  return (
    <div className="p-4 border rounded shadow-sm space-y-2">
      <h2 className="text-lg font-semibold">{room.roomName}</h2>
      <p className="text-sm text-gray-500">
        {room.roomType === "MEETING_ROOM" ? "회의실" : "연습실"}
      </p>
      <RoomStatusBadge isActive={isUsingNow} />
    </div>
  );
}

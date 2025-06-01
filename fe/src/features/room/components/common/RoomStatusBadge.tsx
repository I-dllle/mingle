interface RoomStatusBadgeProps {
  isActive: boolean;
}

export function RoomStatusBadge({ isActive }: RoomStatusBadgeProps) {
  const label = isActive ? "사용 중" : "예약 가능";
  const color = isActive
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${color}`}>
      {label}
    </span>
  );
}

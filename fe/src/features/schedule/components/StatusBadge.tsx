import { ScheduleStatus } from "../types/Enums";
import {
  scheduleStatusColors,
  scheduleStatusLabels,
} from "../constants/scheduleLabels";

interface StatusBadgeProps {
  status: ScheduleStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = scheduleStatusColors[status] || "#9E9E9E";
  const label = scheduleStatusLabels[status] || status;

  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{
        backgroundColor: `${color}20`, // 20% 투명도
        color: color,
        border: `1px solid ${color}`,
      }}
    >
      {label}
    </span>
  );
}

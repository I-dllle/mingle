import React from "react";
import { ScheduleStatus } from "../../types/Enums";
import { scheduleStatusLabels } from "../../constants/scheduleLabels";

const statusColors = {
  [ScheduleStatus.IMPORTANT_MEETING]:
    "bg-pink-100 text-pink-800 border-pink-200",
  [ScheduleStatus.BUSINESS_TRIP]:
    "bg-purple-100 text-purple-800 border-purple-200",
  [ScheduleStatus.COMPLETED]: "bg-green-100 text-green-800 border-green-200",
  [ScheduleStatus.CANCELED]: "bg-gray-100 text-gray-800 border-gray-200",
  [ScheduleStatus.VACATION]: "bg-blue-100 text-blue-800 border-blue-200",
};

interface StatusBadgeProps {
  status: ScheduleStatus;
  className?: string;
}

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]} ${className}`}
    >
      {scheduleStatusLabels[status]}
    </span>
  );
}

import React from "react";
import { ScheduleStatus } from "../../types/Enums";
import { scheduleStatusLabels } from "../../constants/scheduleLabels";

// 명시적으로 타입 매핑 정의
type StatusColorMap = {
  [key in ScheduleStatus]?: string;
};

const statusColors: StatusColorMap = {
  [ScheduleStatus.IMPORTANT_MEETING]:
    "bg-pink-100 text-pink-800 border-pink-200",
  [ScheduleStatus.BUSINESS_TRIP]:
    "bg-purple-100 text-purple-800 border-purple-200",
  [ScheduleStatus.COMPLETED]: "bg-green-100 text-green-800 border-green-200",
  [ScheduleStatus.CANCELED]: "bg-gray-100 text-gray-800 border-gray-200",
  [ScheduleStatus.VACATION]: "bg-blue-100 text-blue-800 border-blue-200",
  [ScheduleStatus.MEETING]: "bg-orange-100 text-orange-800 border-orange-200",
  [ScheduleStatus.NONE]: "bg-gray-100 text-gray-600 border-gray-200",
};

interface StatusBadgeProps {
  status: ScheduleStatus;
  className?: string;
}

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  // 기본 스타일과 해당 상태에 대한 스타일 합치기 (undefined일 경우 대비)
  const colorClass =
    statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      {scheduleStatusLabels[status]}
    </span>
  );
}

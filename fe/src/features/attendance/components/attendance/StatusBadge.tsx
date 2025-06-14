// StatusBadge.tsx

import React from "react";
import type {
  AttendanceStatus,
  ApprovalStatus,
  LeaveType,
} from "@/features/attendance/types/attendanceCommonTypes";
import {
  attendanceStatusLabels,
  approvalStatusLabels,
  leaveTypeLabels,
  statusBackgroundColorMap,
  approvalColorMap,
} from "@/features/attendance/utils/attendanceLabels";

interface BadgeProps {
  label: string;
  color: string;
}

const Badge: React.FC<BadgeProps> = ({ label, color }) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${color}`}
    >
      {label}
    </span>
  );
};

export const AttendanceStatusBadge: React.FC<{ status: AttendanceStatus }> = ({
  status,
}) => {
  const label = attendanceStatusLabels[status];
  const color = statusBackgroundColorMap[status] || "bg-gray-400";

  return <Badge label={label} color={color} />;
};

export const ApprovalStatusBadge: React.FC<{ status: ApprovalStatus }> = ({
  status,
}) => {
  const label = approvalStatusLabels[status];
  const color = approvalColorMap[status] || "bg-gray-400";

  return <Badge label={label} color={color} />;
};

// LeaveType에 대한 배지 컴포넌트
export const LeaveTypeBadge: React.FC<{ leaveType: LeaveType }> = ({
  leaveType,
}) => {
  const label = leaveTypeLabels[leaveType];

  // LeaveType에 따른 배경색과 텍스트 색상 매핑
  const colorMap: Record<LeaveType, string> = {
    ANNUAL: "bg-indigo-500",
    SICK: "bg-purple-500",
    OFFICIAL: "bg-sky-500",
    HALF_DAY_AM: "bg-pink-500",
    HALF_DAY_PM: "bg-pink-500",
    MARRIAGE: "bg-green-500",
    BEREAVEMENT: "bg-gray-600",
    PARENTAL: "bg-blue-500",
    BUSINESS_TRIP: "bg-teal-500",
    EARLY_LEAVE: "bg-orange-400",
    OTHER: "bg-gray-500",
  };

  const color = colorMap[leaveType] || "bg-gray-400";

  return <Badge label={label} color={color} />;
};

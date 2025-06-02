// StatusBadge.tsx

import React from "react";
import type {
  AttendanceStatus,
  ApprovalStatus,
} from "@/features/attendance/types/attendanceCommonTypes";
import {
  attendanceStatusLabels,
  approvalStatusLabels,
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

// features/schedule/ui/FooterCard.tsx
"use client";

import React from "react";
import { ScheduleStatus } from "@/features/schedule/types/Enums";
import { scheduleStatusColors } from "@/features/schedule/constants/scheduleLabels";

export interface FooterCardProps {
  title: string;
  count: number;
  className?: string;
  status?: ScheduleStatus;
}

export function FooterCard({
  title,
  count,
  className = "",
  status,
}: FooterCardProps) {
  // 상태에 따른 색상 설정
  const colorStyle = status
    ? {
        backgroundColor: `${scheduleStatusColors[status]}15`, // 배경색 연하게
        borderLeft: `3px solid ${scheduleStatusColors[status]}`,
        color: scheduleStatusColors[status],
      }
    : {};

  // 상태에 따른 텍스트 그라데이션 색상
  const getTextGradient = () => {
    if (!status) return "from-purple-700 to-indigo-500";

    // 색상 조금 더 진하게 해서 그라데이션 만들기
    const color = scheduleStatusColors[status];
    return `from-[${color}] to-[${adjustColor(color, -20)}]`;
  };

  // 색상 밝기 조절 (어둡게)
  const adjustColor = (color: string, amount: number) => {
    const hex = color.replace("#", "");
    const r = Math.max(
      0,
      Math.min(255, parseInt(hex.substring(0, 2), 16) + amount)
    );
    const g = Math.max(
      0,
      Math.min(255, parseInt(hex.substring(2, 4), 16) + amount)
    );
    const b = Math.max(
      0,
      Math.min(255, parseInt(hex.substring(4, 6), 16) + amount)
    );
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  return (
    <div
      className={
        `border-none rounded-xl p-4 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg transition-all ` +
        className
      }
      style={colorStyle}
    >
      <div
        className="font-medium mb-1 text-xs uppercase tracking-wide"
        style={{ color: status ? scheduleStatusColors[status] : "#4f46e5" }}
      >
        {title}
      </div>
      <div
        className={`text-2xl font-bold bg-gradient-to-r ${
          status ? "" : "from-purple-700 to-indigo-500"
        } bg-clip-text text-transparent`}
        style={status ? { color: scheduleStatusColors[status] } : {}}
      >
        {count}
        <span className="ml-1 text-sm font-medium text-gray-500">개</span>
      </div>
    </div>
  );
}

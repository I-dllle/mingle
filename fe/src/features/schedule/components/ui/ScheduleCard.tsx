"use client";

import { EventInput } from "@fullcalendar/core";
import { formatDate } from "../../utils/calendarUtils";

interface ScheduleCardProps {
  event: EventInput;
  onClick: () => void;
}

export default function ScheduleCard({ event, onClick }: ScheduleCardProps) {
  const scheduleType = event.extendedProps?.type;
  const scheduleStatus = event.extendedProps?.status;

  // 일정 유형에 따라 다른 색상 적용
  let borderLeftColor = "#4C1D95"; // 메인 테마 색상 - 진한 보라색

  if (scheduleType === "COMPANY") {
    borderLeftColor = "#F44336";
  } else if (scheduleType === "DEPARTMENT") {
    borderLeftColor = "#2196F3";
  }

  // 일정 상태에 따른 상태 라벨 색상
  const statusColors = {
    IMPORTANT_MEETING: "#E91E63",
    BUSINESS_TRIP: "#9C27B0",
    COMPLETED: "#8BC34A",
    CANCELED: "#9E9E9E",
    VACATION: "#00BCD4",
  };

  // 일정 상태에 따른 라벨 텍스트
  const statusLabels = {
    IMPORTANT_MEETING: "중요회의",
    BUSINESS_TRIP: "출장",
    COMPLETED: "완료",
    CANCELED: "취소",
    VACATION: "휴가",
  };

  return (
    <div
      className={`group rounded-md cursor-pointer transition-colors`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-full self-stretch shrink-0 rounded-full bg-opacity-80"
          style={{ backgroundColor: borderLeftColor }}
        />
        <div className="flex-1 py-1">
          <div className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1">
            {event.title}
          </div>
          {event.start && event.end && (
            <div className="text-sm text-gray-500 mt-1">
              {formatDate(event.start.toString(), "HH:mm")} -
              {formatDate(event.end.toString(), "HH:mm")}
            </div>
          )}
          {scheduleStatus && (
            <div className="mt-2">
              <span
                className="text-[11px] px-1.5 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${
                    statusColors[scheduleStatus as keyof typeof statusColors] ||
                    "#9E9E9E"
                  }15`,
                  color:
                    statusColors[scheduleStatus as keyof typeof statusColors] ||
                    "#9E9E9E",
                }}
              >
                {statusLabels[scheduleStatus as keyof typeof statusLabels] ||
                  scheduleStatus}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

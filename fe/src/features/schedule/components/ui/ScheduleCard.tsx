"use client";

import { EventInput } from "@fullcalendar/core";
import { formatDate } from "@/features/schedule/utils/calendarUtils";
import styles from "../../styles/ModernCalendarView.module.css";

interface ScheduleCardProps {
  event: EventInput;
  onClick: () => void;
}

export default function ScheduleCard({ event, onClick }: ScheduleCardProps) {
  const scheduleType = event.extendedProps?.type;
  const scheduleStatus = event.extendedProps?.status;
  // 일정 유형에 따라 다른 색상 적용 - ModernCalendarView.module.css 색상과 일치시킴
  let borderLeftColor = "#9333ea"; // 개인 일정 (indicatorPersonal) 색상

  if (scheduleType === "COMPANY") {
    borderLeftColor = "#ec4899"; // 회사 일정 (indicatorCompany) 색상
  } else if (scheduleType === "DEPARTMENT") {
    borderLeftColor = "#ffd8b1"; // 부서 일정 (indicatorDepartment) 색상
  }

  // 일정 상태에 따른 상태 라벨 색상
  const statusColors = {
    IMPORTANT_MEETING: "#E91E63",
    BUSINESS_TRIP: "#9C27B0",
    COMPLETED: "#8BC34A",
    CANCELED: "#9E9E9E",
    VACATION: "#00BCD4",
    NONE: "#9E9E9E", // 기본 색상
    MEETING: "#FF9800", // 회의는 오렌지색
  };

  // 일정 상태에 따른 라벨 텍스트
  const statusLabels = {
    IMPORTANT_MEETING: "중요회의",
    BUSINESS_TRIP: "출장",
    COMPLETED: "완료",
    CANCELED: "취소",
    VACATION: "휴가",
    NONE: "없음",
    MEETING: "회의",
  };

  return (
    <div
      className="group rounded-md cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center mb-1.5">
            {" "}
            <div className="text-sm text-gray-700 font-medium mr-auto">
              {event.start && event.end && (
                <span>
                  {new Date(event.start.toString()).toDateString() !==
                  new Date(event.end.toString()).toDateString() ? (
                    <>
                      {formatDate(event.start.toString(), "MM.dd")}{" "}
                      {formatDate(event.start.toString(), "HH:mm")} ~{" "}
                      {formatDate(event.end.toString(), "MM.dd")}{" "}
                      {formatDate(event.end.toString(), "HH:mm")}
                    </>
                  ) : (
                    <>
                      {formatDate(event.start.toString(), "HH:mm")} ~{" "}
                      {formatDate(event.end.toString(), "HH:mm")}
                    </>
                  )}
                </span>
              )}
            </div>
            {scheduleStatus && scheduleStatus !== "NONE" && (
              <span
                className="text-[11px] px-2 py-0.5 rounded-full font-medium"
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
            )}
          </div>
          <div className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-1 mb-1">
            {event.title}
          </div>
          {event.extendedProps?.description && (
            <div className="text-sm text-gray-500 line-clamp-1 mt-0.5">
              {event.extendedProps.description as string}
            </div>
          )}{" "}
          {scheduleType && (
            <div className="flex mt-2 items-center gap-1">
              {/* 일정 유형에 따른 참석자 아바타 렌더링 - ModernCalendarView.module.css 색상 적용 */}
              {scheduleType === "COMPANY" && (
                <div className="flex -space-x-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-medium"
                    style={{ backgroundColor: "#ec4899" }} // indicatorCompany 색상
                  >
                    회사
                  </div>
                </div>
              )}
              {scheduleType === "DEPARTMENT" && (
                <div className="flex -space-x-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-medium"
                    style={{ backgroundColor: "#ffd8b1", color: "#6b5900" }} // indicatorDepartment 색상, 가독성을 위해 텍스트 색상 어둡게
                  >
                    부서
                  </div>
                </div>
              )}
              {scheduleType === "PERSONAL" && (
                <div className="flex -space-x-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-medium"
                    style={{ backgroundColor: "#9333ea" }} // indicatorPersonal 색상
                  >
                    개인
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

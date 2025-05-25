import { formatDate, formatTime } from "../utils/calendarUtils";
import { Schedule } from "../types/Schedule";
import {
  scheduleTypeColors,
  scheduleTypeLabels,
} from "../constants/scheduleLabels";
import StatusBadge from "./StatusBadge";
import Link from "next/link";

interface ScheduleCardProps {
  schedule: Schedule;
}

export default function ScheduleCard({ schedule }: ScheduleCardProps) {
  const typeColor = scheduleTypeColors[schedule.scheduleType];
  const getScheduleTypeLabel = () => {
    return scheduleTypeLabels[schedule.scheduleType] || schedule.scheduleType;
  };
  return (
    <Link href={`/schedule/${schedule.id}`}>
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div
          className="p-3 text-white font-medium flex justify-between items-center"
          style={{ backgroundColor: typeColor }}
        >
          <span>{schedule.title}</span>
          <StatusBadge status={schedule.scheduleStatus} />
        </div>

        <div className="p-4 space-y-2">
          <div className="text-sm text-gray-500">
            <span className="inline-block bg-gray-100 rounded px-2 py-0.5 mr-1">
              {getScheduleTypeLabel()}
            </span>
            {formatDate(schedule.startTime)}
          </div>

          <div className="text-sm">
            <span className="font-medium">시간:</span>{" "}
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </div>

          {schedule.description && (
            <div className="text-sm">
              <span className="font-medium">설명:</span>
              <p className="mt-1 text-gray-700">{schedule.description}</p>
            </div>
          )}

          {schedule.memo && (
            <div className="text-sm mt-2">
              <span className="font-medium">메모:</span>
              <p className="mt-1 text-gray-600 text-xs">{schedule.memo}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

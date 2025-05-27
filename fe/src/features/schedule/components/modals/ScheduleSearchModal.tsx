import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "../../services/scheduleService";
import { ScheduleResponse } from "../../types/Schedule";
import { formatDate } from "../../utils/calendarUtils";
import { useDebounce } from "@/hooks/useDebounce";
import Modal from "../ui/Modal";
import { SearchIcon } from "@heroicons/react/outline";

interface ScheduleSearchModalProps {
  onClose: () => void;
  onSelectSchedule?: (schedule: ScheduleResponse) => void;
}

export function ScheduleSearchModal({
  onClose,
  onSelectSchedule,
}: ScheduleSearchModalProps) {
  const [keyword, setKeyword] = useState("");
  const [includeMemo, setIncludeMemo] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 300);

  const { data: schedules, isLoading } = useQuery<ScheduleResponse[]>({
    queryKey: ["schedules", "search", debouncedKeyword, includeMemo],
    queryFn: () =>
      scheduleService.searchSchedules(debouncedKeyword, includeMemo),
    enabled: debouncedKeyword.length > 0,
  });

  const handleScheduleClick = (schedule: ScheduleResponse) => {
    if (onSelectSchedule) {
      onSelectSchedule(schedule);
    }
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="w-full max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">일정 검색</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">닫기</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="일정 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={includeMemo}
                onChange={(e) => setIncludeMemo(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              메모 포함
            </label>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && keyword && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {schedules && schedules.length > 0 ? (
            <div className="space-y-2">
              {schedules.map((schedule) => (
                <button
                  key={schedule.id}
                  onClick={() => handleScheduleClick(schedule)}
                  className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {schedule.title}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-purple-600 font-medium">
                        {formatDate(schedule.startTime, "MM월 dd일")}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(schedule.startTime, "HH:mm")}
                      </span>
                    </div>
                  </div>
                  {schedule.description && (
                    <p className="mt-1 text-gray-600 text-sm line-clamp-2">
                      {schedule.description}
                    </p>
                  )}
                  {includeMemo && schedule.memo && (
                    <p className="mt-2 text-gray-500 text-sm bg-gray-50 p-2 rounded line-clamp-2">
                      {schedule.memo}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : keyword && !isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
              <p className="text-sm text-gray-400 mt-1">
                다른 검색어로 시도해보세요.
              </p>
            </div>
          ) : !keyword ? (
            <div className="text-center py-12 text-gray-400">
              <SearchIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>검색어를 입력하세요</p>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { scheduleService } from "../../services/scheduleService.ts";
import { ScheduleResponse } from "../../types/Schedule";
import Modal from "@/features/schedule/components/ui/Modal";

interface ScheduleSearchModalProps {
  onClose: () => void;
  onSelectSchedule?: (schedule: ScheduleResponse) => void;
}

export function ScheduleSearchModal({
  onClose,
  onSelectSchedule,
}: ScheduleSearchModalProps) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<ScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<"title" | "full">("title");
  const includeDescription = searchMode === "full";

  // 검색 함수
  const doSearch = async (kw: string) => {
    setIsLoading(true);
    try {
      const data = await scheduleService.searchSchedules(
        kw,
        includeDescription
      );
      setResults(data);
    } finally {
      setIsLoading(false);
    }
  };

  // 키워드 변경 시 디바운스 처리 + 검색 호출
  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword.trim()) {
        doSearch(keyword.trim());
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, searchMode]);

  return (
    <Modal title="일정 검색" onClose={onClose}>
      {" "}
      <div className="p-6 space-y-5">
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-1.5 rounded-full transition-all duration-200 ease-in-out text-sm font-medium ${
              searchMode === "title"
                ? "bg-purple-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
            }`}
            onClick={() => setSearchMode("title")}
          >
            제목만
          </button>
          <button
            className={`px-4 py-1.5 rounded-full transition-all duration-200 ease-in-out text-sm font-medium ${
              searchMode === "full"
                ? "bg-purple-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
            }`}
            onClick={() => setSearchMode("full")}
          >
            제목·설명
          </button>
        </div>

        <div className="flex gap-3 relative">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={
              searchMode === "title" ? "제목만 검색" : "제목·설명 검색"
            }
            className="flex-1 border border-purple-100 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") doSearch(keyword.trim());
            }}
          />
          <span className="absolute right-3 top-3 text-purple-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="animate-pulse text-purple-400 flex items-center">
              <div className="relative w-12 h-12 mr-3">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-purple-100"></div>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-purple-500 animate-spin"></div>
              </div>
              <span className="text-lg font-medium">검색 중...</span>
            </div>
          </div>
        )}

        <div className="max-h-[60vh] overflow-auto space-y-3 pb-2">
          {results.map((s) => (
            <div
              key={s.id}
              className="p-4 bg-white rounded-lg border border-purple-50 shadow-sm hover:shadow-md hover:border-purple-100 transition-all cursor-pointer hover:bg-purple-50/50"
              onClick={() => onSelectSchedule?.(s)}
            >
              <p className="font-medium text-purple-900">{s.title}</p>
              {s.description && (
                <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">
                  {s.description}
                </p>
              )}
            </div>
          ))}
          {!isLoading && results.length === 0 && keyword.trim() !== "" && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-3 text-purple-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg">결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

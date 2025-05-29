"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };
  return (
    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          페이지 {currentPage + 1} / {totalPages}
        </div>

        <div className="flex items-center space-x-2">
          {" "}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0 || loading}
            className="px-3 py-2 rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1 text-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </button>
          {getPageNumbers().map((pageNumber, index) => (
            <button
              key={index}
              onClick={() =>
                typeof pageNumber === "number" && onPageChange(pageNumber - 1)
              }
              disabled={pageNumber === "..." || loading}
              className={`px-3 py-2 rounded shadow-sm text-sm ${
                typeof pageNumber === "number" && currentPage === pageNumber - 1
                  ? "bg-blue-500 text-white"
                  : pageNumber === "..."
                  ? "cursor-default"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNumber}
            </button>
          ))}{" "}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || loading}
            className="px-3 py-2 rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1 text-sm"
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

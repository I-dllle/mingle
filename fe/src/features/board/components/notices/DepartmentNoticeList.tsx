import React from "react";
import Link from "next/link";

type DepartmentNotice = {
  id: number;
  title: string;
  date: string;
};

type DepartmentTab = string;

interface DepartmentNoticeListProps {
  tabs: DepartmentTab[];
  notices: Record<DepartmentTab, DepartmentNotice[]>;
  selectedTab: DepartmentTab;
  setSelectedTab: (tab: DepartmentTab) => void;
}

export default function DepartmentNoticeList({
  tabs,
  notices,
  selectedTab,
  setSelectedTab,
}: DepartmentNoticeListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex gap-2 mb-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150 ${
              selectedTab === tab
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-purple-600"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
        {notices[selectedTab].map((notice) => (
          <div
            key={notice.id}
            className="flex items-center justify-between border-b last:border-b-0 py-2"
          >
            <Link
              href={`/board/common/notices/${notice.id}`}
              className="font-semibold text-base md:text-lg hover:underline"
            >
              {notice.title}
            </Link>
            <span className="text-xs text-gray-400">{notice.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

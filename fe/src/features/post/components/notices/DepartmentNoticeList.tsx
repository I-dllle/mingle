import React from "react";

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
      <ul className="divide-y">
        {notices[selectedTab].map((notice) => (
          <li
            key={notice.id}
            className="py-2 flex justify-between items-center"
          >
            <span className="text-base">{notice.title}</span>
            <span className="text-xs text-gray-400">{notice.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

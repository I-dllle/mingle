import React, { useState, useEffect } from "react";
import { boardService } from "../../services/boardService";
import { getDepartmentIdByName } from "@/utils/departmentUtils";
import type { PostResponseDto } from "../../types/post";

type DepartmentNotice = {
  id: number;
  title: string;
  date: string;
};

type DepartmentTab = string;

interface DepartmentNoticeListProps {
  tabs: DepartmentTab[];
  // 기존 더미 데이터와의 호환성
  notices?: Record<DepartmentTab, DepartmentNotice[]>;
  selectedTab: DepartmentTab;
  setSelectedTab: (tab: DepartmentTab) => void;
  // 실제 API 데이터 사용 여부
  useApi?: boolean;
}

export default function DepartmentNoticeList({
  tabs,
  notices,
  selectedTab,
  setSelectedTab,
  useApi = false,
}: DepartmentNoticeListProps) {
  const [apiNotices, setApiNotices] = useState<PostResponseDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useApi) {
      loadDepartmentNotices();
    }
  }, [selectedTab, useApi]);

  const loadDepartmentNotices = async () => {
    setLoading(true);
    try {
      const departmentId = getDepartmentIdByName(selectedTab);
      if (departmentId) {
        const data = await boardService.getDepartmentNotices(departmentId);
        setApiNotices(data);
      }
    } catch (error) {
      console.error("부서별 공지사항 로드 실패:", error);
      setApiNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
    });
  };

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

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
            <span>로딩 중...</span>
          </div>
        </div>
      ) : (
        <ul className="divide-y">
          {useApi ? (
            apiNotices.length === 0 ? (
              <li className="py-4 text-center text-gray-500">
                {selectedTab} 공지사항이 없습니다.
              </li>
            ) : (
              apiNotices.map((notice) => (
                <li
                  key={notice.postId}
                  className="py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-base">{notice.title}</span>
                  <span className="text-xs text-gray-400">
                    {formatDate(notice.createdAt)}
                  </span>
                </li>
              ))
            )
          ) : (
            notices?.[selectedTab]?.map((notice) => (
              <li
                key={notice.id}
                className="py-2 flex justify-between items-center"
              >
                <span className="text-base">{notice.title}</span>
                <span className="text-xs text-gray-400">{notice.date}</span>
              </li>
            )) || (
              <li className="py-4 text-center text-gray-500">
                공지사항이 없습니다.
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

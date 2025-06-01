import React, { useState, useEffect } from "react";
import { postService } from "../../services/postService";
import type { PostResponseDto } from "../../types/post";

interface NoticeListProps {
  // 기존 더미 데이터와의 호환성을 위해 남겨둠
  notices?: Array<{
    id: number;
    title: string;
    content: string;
    date: string;
    author: string;
    position: string;
    isPinned?: boolean;
  }>;
  // 실제 API 데이터 사용 여부
  useApi?: boolean;
}

export default function NoticeList({
  notices,
  useApi = false,
}: NoticeListProps) {
  const [apiNotices, setApiNotices] = useState<PostResponseDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useApi) {
      loadGeneralNotices();
    }
  }, [useApi]);
  const loadGeneralNotices = async () => {
    setLoading(true);
    try {
      console.log("=== 전체 공지사항 API 호출 시작 ===");
      const data = await postService.getGlobalNotices();
      console.log("API 응답 데이터:", data);
      console.log("데이터 길이:", data.length);
      setApiNotices(data);
    } catch (error) {
      console.error("전체 공지사항 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex justify-center items-center h-32">
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
          <span>로딩 중...</span>
        </div>
      </div>
    );
  }

  // API 데이터를 사용하는 경우
  if (useApi) {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
        {apiNotices.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            공지사항이 없습니다.
          </div>
        ) : (
          apiNotices.map((notice) => (
            <div
              key={notice.postId}
              className="flex flex-col border-b last:border-b-0 py-2 gap-1 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base md:text-lg">
                  {notice.title}
                </span>
                {notice.noticeType === "GENERAL_NOTICE" && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                    전체
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{notice.writerName}</span>
                <span>·</span>
                <span>{formatDate(notice.createdAt)}</span>
                <span>·</span>
                <span>{notice.departmentName}</span>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // 기존 더미 데이터를 사용하는 경우 (하위 호환성)
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      {notices?.map((notice) => (
        <div
          key={notice.id}
          className="flex flex-col border-b last:border-b-0 py-2 gap-1"
        >
          <div className="flex items-center gap-2">
            {notice.isPinned && (
              <span className="text-purple-600 font-bold mr-2">●</span>
            )}
            <span className="font-semibold text-base md:text-lg">
              {notice.title}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 ml-6">
            <span>
              {notice.author} {notice.position}
            </span>
            <span>·</span>
            <span>{notice.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { boardService } from "../../services/boardService";
import type { PostResponseDto } from "../../types/post";

type CompanyNewsItem = {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  department: string;
};

interface CompanyNewsProps {
  // 기존 더미 데이터와의 호환성
  newsList?: CompanyNewsItem[];
  // 실제 API 데이터 사용 여부
  useApi?: boolean;
}

export default function CompanyNews({
  newsList,
  useApi = false,
}: CompanyNewsProps) {
  const [apiNews, setApiNews] = useState<PostResponseDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useApi) {
      loadCompanyNews();
    }
  }, [useApi]);

  const loadCompanyNews = async () => {
    setLoading(true);
    try {
      const data = await boardService.getCompanyNews();
      setApiNews(data);
    } catch (error) {
      console.error("회사 소식 로드 실패:", error);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="w-full h-40 bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // API 데이터를 사용하는 경우
  if (useApi) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apiNews.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
            회사 소식이 없습니다.
          </div>
        ) : (
          apiNews.map((news) => (
            <Link
              key={news.postId}
              href={`/board/common/notices/${news.postId}`}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
            >
              {news.imageUrl && news.imageUrl.length > 0 ? (
                <img
                  src={news.imageUrl[0]}
                  alt={news.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    {news.title.slice(0, 2)}
                  </span>
                </div>
              )}
              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-semibold text-base md:text-lg">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {news.content.replace(/<[^>]*>/g, "").slice(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                  <span>{news.departmentName}</span>
                  <span>{formatDate(news.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    );
  }

  // 기존 더미 데이터를 사용하는 경우 (하위 호환성)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {newsList?.map((news) => (
        <div
          key={news.id}
          className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
        >
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-4 flex flex-col gap-2">
            <h3 className="font-semibold text-base md:text-lg">{news.title}</h3>
            <p className="text-sm text-gray-500">{news.summary}</p>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
              <span>{news.department}</span>
              <span>{news.date}</span>
            </div>
          </div>
        </div>
      )) || (
        <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
          회사 소식이 없습니다.
        </div>
      )}
    </div>
  );
}

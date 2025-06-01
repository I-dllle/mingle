import React from "react";
import Link from "next/link";

type CompanyNewsItem = {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
};

interface CompanyNewsProps {
  newsList: CompanyNewsItem[];
}

export default function CompanyNews({ newsList }: CompanyNewsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {newsList.map((news) => (
        <Link
          key={news.id}
          href={`/board/common/notices/${news.id}`}
          className="block"
        >
          <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 hover:bg-gray-50 transition">
            <img
              src={news.image}
              alt={news.title}
              className="rounded-md mb-2 h-32 w-full object-cover"
            />
            <div className="font-semibold text-base md:text-lg mb-1">
              {news.title}
            </div>
            <div className="text-sm text-gray-500 mb-2 line-clamp-2">
              {news.summary}
            </div>
            <div className="text-xs text-gray-400">{news.date}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

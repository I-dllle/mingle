import React from "react";
import Link from "next/link";

type Notice = {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  position: string;
  isPinned?: boolean;
};

interface NoticeListProps {
  notices: Notice[];
}

export default function NoticeList({ notices }: NoticeListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      {notices.map((notice) => (
        <div
          key={notice.id}
          className="flex flex-col border-b last:border-b-0 py-2 gap-1"
        >
          <div className="flex items-center gap-2">
            {notice.isPinned && (
              <span className="text-purple-600 font-bold mr-2">●</span>
            )}
            <Link href={`/board/common/notices/${notice.id}`}>
              <span className="font-semibold text-base md:text-lg">
                {notice.title}
              </span>
            </Link>
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

import React from "react";

type CompanyNewsItem = {
  id: number;
  title: string;
  summary: string;
  image: string;
  date: string;
  department: string;
};

interface CompanyNewsProps {
  newsList: CompanyNewsItem[];
}

export default function CompanyNews({ newsList }: CompanyNewsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {newsList.map((news) => (
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
      ))}
    </div>
  );
}

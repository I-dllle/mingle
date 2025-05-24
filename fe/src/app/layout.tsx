"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import LeftSideBar from "@/components/ui/LeftSidebar";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [currentMenuName, setCurrentMenuName] = useState("");

  // 메뉴 변경 핸들러
  const handleMenuChange = (menuName: string) => {
    setCurrentMenuName(menuName);
  };

  return (
    <html lang="ko" className="h-full bg-white">
      <body className={`${inter.className} h-full flex flex-col`}>
        {" "}
        <div className="flex flex-1 min-h-0">
          {/* 왼쪽 사이드바 컴포넌트 */}
          <LeftSideBar
            department=""
            onMenuChange={handleMenuChange}
          />

          {/* 중앙 콘텐츠 영역 */}
          <div className="flex-1 flex flex-col bg-white overflow-y-auto">
            {/* 헤더 영역 */}
            <div className="h-[60px] bg-white border-b border-[#e9e9ea] flex items-center px-6 flex-shrink-0">
              <span className="text-xl font-semibold text-[#2c2d2e]">
                {currentMenuName}
              </span>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 p-6">{children}</div>
          </div>

          {/* 오른쪽 사이드바 - 채팅 */}
          <div
            className={`flex flex-col flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out ${
              isRightSidebarOpen
                ? "w-[220px] bg-[#f7f7f8] border-l border-[#e9e9ea] pt-4"
                : "w-min" // 최소 너비로 축소
            }`}
          >
            <div
              className={`flex items-center ${
                isRightSidebarOpen ? "px-4 pb-3" : ""
              }`}
            >
              <button
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                className={`p-1 text-gray-600 hover:text-gray-800 ${
                  isRightSidebarOpen ? "mr-2" : ""
                }`}
              >
                {isRightSidebarOpen ? (
                  <FiChevronLeft className="w-5 h-5" />
                ) : (
                  <FiChevronRight className="w-5 h-5" />
                )}
              </button>
              {isRightSidebarOpen && (
                <span className="font-semibold text-lg text-[#2c2d2e]">
                  채팅
                </span>
              )}
            </div>

            {isRightSidebarOpen && (
              <>
                <div className="px-4 mb-3">
                  <ul className="space-y-1">
                    <li className="px-3 py-2 flex items-center text-sm cursor-pointer rounded-md hover:bg-[#edeef0] text-gray-700 hover:text-[#2c2d2e]">
                      <span className="w-2 h-2 rounded-full bg-green-400 mr-2.5"></span>
                      <span>채팅방</span>
                    </li>
                    <li className="px-3 py-2 flex items-center text-sm cursor-pointer rounded-md hover:bg-[#edeef0] text-gray-700 hover:text-[#2c2d2e]">
                      <span className="w-2 h-2 rounded-full bg-blue-400 mr-2.5"></span>
                      <span>자료방</span>
                    </li>
                  </ul>
                </div>

                <div className="px-4 mb-3">
                  <span className="font-semibold text-sm text-gray-500 px-3">
                    DM
                  </span>
                </div>
                <div className="flex-1 overflow-auto px-2">
                  <ul className="space-y-0.5">
                    <li className="p-2.5 flex items-center rounded-md cursor-pointer hover:bg-[#edeef0]">
                      <img
                        src="https://i.pravatar.cc/32?u=user1"
                        alt="user1"
                        className="w-6 h-6 rounded-full mr-2.5"
                      />
                      <span className="text-sm text-[#2c2d2e]">
                        통통통 사후르
                      </span>
                    </li>
                    <li className="p-2.5 flex items-center rounded-md cursor-pointer hover:bg-[#edeef0]">
                      <img
                        src="https://i.pravatar.cc/32?u=user2"
                        alt="user2"
                        className="w-6 h-6 rounded-full mr-2.5"
                      />
                      <span className="text-sm text-[#2c2d2e]">
                        발레리나 카푸치나
                      </span>
                    </li>
                    <li className="p-2.5 flex items-center rounded-md cursor-pointer hover:bg-[#edeef0]">
                      <img
                        src="https://i.pravatar.cc/32?u=user3"
                        alt="user3"
                        className="w-6 h-6 rounded-full mr-2.5"
                      />
                      <span className="text-sm text-[#2c2d2e]">아보카도</span>
                    </li>
                  </ul>
                </div>

                {/* 프로필 영역 */}
                <div className="p-3 border-t border-[#e9e9ea] bg-[#edeef0]">
                  <div className="p-2 bg-white rounded-lg flex items-center justify-between shadow-sm">
                    <div className="flex items-center">
                      <img
                        src="https://i.pravatar.cc/40?u=profile"
                        alt="profile"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <span className="text-sm font-semibold text-[#2c2d2e]">
                          김도연
                        </span>
                        <div className="text-xs text-green-500">온라인</div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

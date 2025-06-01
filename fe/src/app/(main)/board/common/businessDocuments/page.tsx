"use client";

import { useState } from "react";
import PostList from "@/features/post/components/PostList";
import PostSearch from "@/features/post/components/PostSearch";
import type { Post } from "@/features/post/types/post";
import { useRouter } from "next/navigation";
import { useDepartment } from "@/context/DepartmentContext";
import { departmentMenus } from "@/constants/PostMenu";
import { FiSearch } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";

const mockPosts: Post[] = [
  {
    id: 1,
    title: "[태그:팀소개] 우리 팀을 소개합니다",
    content: "팀의 주요 역할과 멤버를 소개합니다.",
    author: "홍길동",
    createdAt: "2024-03-10",
    tags: ["팀소개"],
  },
  {
    id: 2,
    title: "[태그:공지] 회의 일정 안내",
    content: "다음 주 회의 일정 공지입니다.",
    author: "김철수",
    createdAt: "2024-03-12",
    tags: ["공지"],
  },
];

const sortOptions = [
  { value: "desc", label: "최신순" },
  { value: "asc", label: "오래된순" },
];

export default function TeamBoardPage() {
  const { name: userDepartment } = useDepartment();
  const menus = departmentMenus[userDepartment] || departmentMenus.default;
  const currentMenu = menus.find((menu) => menu.path === "/team-composition");
  const boardName = currentMenu?.name || "게시판이름";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const router = useRouter();

  // 검색 필터링
  const filteredBySearch = searchQuery.trim()
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  // 정렬
  const sortedPosts = [...filteredBySearch].sort((a, b) => {
    if (sortOrder === "desc") {
      return b.createdAt.localeCompare(a.createdAt);
    } else {
      return a.createdAt.localeCompare(b.createdAt);
    }
  });

  // 페이지네이션
  const totalPages = 5; // 더미로 5페이지
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // 검색 버튼 클릭 시에만 검색 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  // 정렬 드롭다운 토글
  const handleSortDropdown = () => {
    setSortDropdownOpen((prev) => !prev);
  };

  // 정렬 옵션 선택
  const handleSortSelect = (value: "desc" | "asc") => {
    setSortOrder(value);
    setSortDropdownOpen(false);
  };

  // 페이지 이동
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지네이션 범위 계산 (현재 페이지 기준 ±2)
  const getPageNumbers = () => {
    const range = 2;
    let start = Math.max(1, currentPage - range);
    let end = Math.min(totalPages, currentPage + range);
    if (end - start < range * 2) {
      if (start === 1) end = Math.min(totalPages, start + range * 2);
      if (end === totalPages) start = Math.max(1, end - range * 2);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">{boardName}</h1>
      {/* 검색 바 + 정렬 드롭다운 */}
      <div className="flex items-center justify-between mb-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            검색
          </button>
        </form>
        {/* 정렬 드롭다운 */}
        <div className="relative">
          <button
            type="button"
            onClick={handleSortDropdown}
            className="flex items-center px-4 py-2 border rounded-lg bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            {sortOptions.find((opt) => opt.value === sortOrder)?.label}
            <IoChevronDown className="ml-2 text-gray-400" />
          </button>
          {sortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-20">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSortSelect(opt.value as "desc" | "asc")}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                    sortOrder === opt.value ? "text-blue-600" : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* 글 목록 (테이블 스타일) */}
      <div className="overflow-x-auto relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPosts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* 태그가 있으면 pill 형태로 예쁘게 표시 */}
                  <div className="flex gap-2 items-center">
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <span>{post.title.replace(/\[태그:.*?\]\s*/, "")}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{post.author}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {post.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 페이지네이션: 하단 중앙 */}
        <div className="flex justify-center mt-6 items-center gap-1">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-full border text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            &#x2039;
          </button>
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-3 py-1 rounded-full border text-sm font-medium ${
                currentPage === page
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-full border text-sm font-medium ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            &#x203A;
          </button>
        </div>
      </div>
      {/* 글쓰기 버튼: 오른쪽 하단 고정 */}
      <button
        className="fixed bottom-10 right-10 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 z-50"
        onClick={() => router.push("/board/team/write")}
      >
        글쓰기
      </button>
    </div>
  );
}

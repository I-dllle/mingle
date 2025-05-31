"use client";

import { useState, useEffect } from "react";
import type { Post, PostResponseDto } from "@/features/post/types/post";
import { useRouter } from "next/navigation";
import { useDepartment } from "@/context/DepartmentContext";
import { departmentMenus } from "@/context/departmentMenus";
import { getDepartmentIdByName } from "@/utils/departmentUtils";
import { postService } from "@/features/post/services/postService";
import { FiSearch } from "react-icons/fi";
import { IoChevronDown } from "react-icons/io5";

const sortOptions = [
  { value: "desc", label: "최신순" },
  { value: "asc", label: "오래된순" },
];

export default function AudioVideoPage() {
  const { name: userDepartment } = useDepartment();
  const menus = departmentMenus[userDepartment] || departmentMenus.default;
  const currentMenu = menus.find((menu) => menu.path === "/audio-video");
  const boardName = currentMenu?.name || "음원/영상";

  // 디버깅용
  console.log("User Department:", userDepartment);
  console.log("Available menus:", menus);
  console.log("Current menu:", currentMenu);
  console.log("Looking for path:", "/audio-video");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const postsPerPage = 10;
  const router = useRouter();

  // 게시글 데이터 로드
  const loadPosts = async (page: number = 1) => {
    setLoading(true);
    try {
      const deptId = getDepartmentIdByName(userDepartment);
      // 메뉴 ID를 8로 하드코딩하여 부서별 게시글 조회
      const response = await postService.getPostsByMenu(deptId, 8);
      setPosts(response);
      // 새로운 API는 페이지네이션이 없으므로 전체를 한 번에 가져옴
      setTotalPages(1);
    } catch (error) {
      console.error("게시글 로드 실패:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadPosts(currentPage);
  }, [userDepartment]); // currentPage 의존성 제거 (페이지네이션 없음)

  // 검색 필터링 및 페이지네이션 처리
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
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  // 클라이언트 사이드 페이지네이션
  const totalFilteredPosts = sortedPosts.length;
  const calculatedTotalPages = Math.ceil(totalFilteredPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

  // totalPages 업데이트
  useEffect(() => {
    setTotalPages(calculatedTotalPages);
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
    }
  }, [calculatedTotalPages, currentPage]);

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

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
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

      {/* 로딩 상태 */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      )}

      {/* 글 목록 (테이블 스타일) */}
      {!loading && (
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
              {paginatedPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((post) => (
                  <tr
                    key={post.postId}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2 items-center">
                        <span className="text-gray-900">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {post.writerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatDate(post.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 글쓰기 버튼: 테이블 아래, 페이지네이션 위에 flow로 배치 */}
      <div className="flex justify-end my-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
          onClick={() => {
            const deptId = getDepartmentIdByName(userDepartment);
            const currentMenuId = currentMenu?.id;
            const currentPath = window.location.pathname;

            // 디버깅 로그 추가
            console.log("=== 글쓰기 버튼 클릭 ===");
            console.log("deptId:", deptId);
            console.log("currentMenuId:", currentMenuId);
            console.log("currentMenu:", currentMenu);
            console.log("userDepartment:", userDepartment);

            const url = `/board/postWrite?deptId=${deptId}&postTypeId=${currentMenuId}&redirect=${encodeURIComponent(
              currentPath
            )}`;
            console.log("Generated URL:", url);

            router.push(url);
          }}
        >
          글쓰기
        </button>
      </div>

      {/* 페이지네이션: 하단 중앙 */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}

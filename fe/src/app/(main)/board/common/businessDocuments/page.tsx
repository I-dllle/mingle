"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { postService } from "@/features/post/services/postService";
import {
  PostResponseDto,
  BusinessDocumentCategory,
} from "@/features/post/types/post";
import { useDepartment } from "@/context/DepartmentContext";
import { getDepartmentIdByName } from "@/utils/departmentUtils";

const BusinessDocuments: React.FC = () => {
  const searchParams = useSearchParams();
  const { name: departmentName } = useDepartment();

  // URL에서 deptId 파라미터 가져오기
  const urlDeptId = searchParams.get("deptId");

  const [selectedTab, setSelectedTab] = useState<"meeting" | "resource">(
    "meeting"
  );
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 탭 설정
  const tabs = [
    {
      id: "meeting" as const,
      label: "회의록",
      category: BusinessDocumentCategory.MEETING_MINUTES,
    },
    {
      id: "resource" as const,
      label: "업무문서",
      category: BusinessDocumentCategory.RESOURCE,
    },
  ];

  // 부서 ID 결정 (URL 파라미터 우선, 없으면 사용자 컨텍스트에서)
  const getDepartmentId = (): number | null => {
    if (urlDeptId) {
      const deptId = parseInt(urlDeptId, 10);
      if (!isNaN(deptId)) {
        console.log("URL에서 부서 ID 사용:", deptId);
        return deptId;
      }
    }

    if (departmentName) {
      const deptId = getDepartmentIdByName(departmentName);
      console.log("사용자 컨텍스트에서 부서 ID 사용:", {
        departmentName,
        deptId,
      });
      return deptId;
    }

    console.log("부서 ID를 찾을 수 없습니다");
    return null;
  };

  // 게시글 로드 함수
  const loadPosts = async () => {
    const deptId = getDepartmentId();

    if (!deptId) {
      setError("부서 정보를 찾을 수 없습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentTab = tabs.find((tab) => tab.id === selectedTab);
      const category = currentTab?.category;

      console.log("업무자료 게시글 로드 시작:", {
        deptId,
        category,
        selectedTab,
      });

      const result = await postService.getBusinessDocuments(deptId, category);
      console.log("업무자료 게시글 로드 완료:", result);

      setPosts(result || []);
    } catch (err) {
      console.error("업무자료 게시글 로드 오류:", err);
      setError(
        err instanceof Error ? err.message : "게시글을 불러오는데 실패했습니다."
      );
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 탭 변경 시 게시글 다시 로드
  useEffect(() => {
    loadPosts();
  }, [selectedTab, urlDeptId, departmentName]);

  // 게시글 클릭 핸들러
  const handlePostClick = (postId: number) => {
    window.location.href = `/board/common/businessDocuments/${postId}`;
  };

  // 게시글 작성 버튼 클릭
  const handleCreatePost = () => {
    const deptId = getDepartmentId();
    const currentTab = tabs.find((tab) => tab.id === selectedTab);
    const category = currentTab?.category;

    const params = new URLSearchParams();
    if (deptId) params.append("deptId", deptId.toString());
    if (category) params.append("category", category);

    window.location.href = `/board/common/businessDocuments/create?${params.toString()}`;
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">게시글을 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            업무자료 게시판
          </h1>
          <p className="text-gray-600">
            회의록과 업무문서를 확인하고 관리할 수 있습니다.
          </p>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {/* 게시글 작성 버튼 */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {tabs.find((tab) => tab.id === selectedTab)?.label}
              </h2>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                글쓰기
              </button>
            </div>

            {/* 게시글 리스트 */}
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  {tabs.find((tab) => tab.id === selectedTab)?.label} 게시글이
                  없습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.postId}
                    onClick={() => handlePostClick(post.postId)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                        {post.title}
                      </h3>
                      <span className="text-sm text-gray-500 ml-4">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>작성자: {post.writerName}</span>
                      <span>{post.departmentName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDocuments;

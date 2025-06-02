"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { postService } from "@/features/post/services/postService";
import { PostResponseDto } from "@/features/post/types/post";
import { useDepartment } from "@/context/DepartmentContext";

export default function BusinessDocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { name: userDepartment } = useDepartment();
  const postId = parseInt(params.id as string);

  const [post, setPost] = useState<PostResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // 게시글 상세 정보 로드
  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPost(postId);
      setPost(response);
      setEditTitle(response.title);
      setEditContent(response.content);
    } catch (error) {
      console.error("게시글 로드 실패:", error);
      setError("게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 게시글 수정 모드 토글
  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing && post) {
      setEditTitle(post.title);
      setEditContent(post.content);
    }
  };

  // 게시글 수정 저장
  const handleSaveEdit = async () => {
    if (!post) return;

    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const updatedPost = await postService.updatePost(
        post.postId,
        post.userId,
        {
          title: editTitle,
          content: editContent,
          postTypeId: post.postMenuId,
        }
      );
      setPost(updatedPost);
      setIsEditing(false);
      alert("게시글이 수정되었습니다.");
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.content);
    }
  };
  // 게시글 삭제
  const handleDelete = async () => {
    if (!post) return;

    if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        await postService.deletePost(post.postId);
        alert("게시글이 삭제되었습니다.");
        router.back();
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">업무 문서를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-gray-600">업무 문서를 찾을 수 없습니다.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mx-auto"
            >
              ← 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 상단 네비게이션 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white/70 rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-medium">업무 문서 목록</span>
              </button>
              {/* 브레드크럼 */}
              <nav className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">공통 게시판</span>
                <span className="text-gray-300">/</span>
                <span className="text-gray-500">업무 문서</span>
                <span className="text-gray-300">/</span>
                <span className="text-blue-600 font-semibold">상세보기</span>
              </nav>
            </div>

            {/* 빠른 액션 버튼들 */}
            <div className="flex items-center gap-3">
              {!isEditing && (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span className="hidden sm:inline">수정</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span className="hidden sm:inline">삭제</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* 헤더 정보 */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {" "}
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      업무 문서
                    </span>
                    <span className="text-sm text-gray-500">
                      ID: {post.postId}
                    </span>
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-3xl font-bold text-gray-900 w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="제목을 입력하세요"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {post.title}
                    </h1>
                  )}
                </div>
              </div>{" "}
              {/* 메타 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    작성자
                  </label>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {post.writerName}
                  </p>
                  <p className="text-sm text-blue-600/70 mt-1">
                    ID: {post.userId}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <label className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                    작성일
                  </label>
                  <p className="text-base font-semibold text-gray-900 mt-2">
                    {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-green-600/70 mt-1">
                    {new Date(post.createdAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <label className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                    수정일
                  </label>
                  <p className="text-base font-semibold text-gray-900 mt-2">
                    {new Date(post.updatedAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-purple-600/70 mt-1">
                    {new Date(post.updatedAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* 콘텐츠 영역 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                내용
              </label>
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-64 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="업무 문서 내용을 입력하세요..."
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>
              )}
            </div>

            {/* 이미지 섹션 */}
            {post.imageUrl && post.imageUrl.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  첨부 이미지
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {post.imageUrl.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`첨부 이미지 ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 group-hover:shadow-lg transition-shadow"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                        <button
                          onClick={() => window.open(url, "_blank")}
                          className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg transition-opacity"
                        >
                          확대보기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 수정 모드 액션 버튼들 */}
            {isEditing && (
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  저장
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 하단 부가 정보 */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">부서:</span> {post.departmentName}
            </div>
            <div>
              <span className="font-medium">카테고리:</span> {post.postMenuName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

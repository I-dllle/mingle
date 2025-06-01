"use client";

import PostEditor from "@/features/post/components/PostEditor";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { postService } from "@/features/post/services/postService";
import {
  NoticeType,
  BusinessDocumentCategory,
} from "@/features/post/types/post";
import { getDepartmentIdByName } from "@/utils/departmentUtils";
import { useDepartment } from "@/context/DepartmentContext";

export default function PostWritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { name: userDepartment } = useDepartment();
  // URL 쿼리 파라미터에서 값 추출
  const deptId = searchParams.get("deptId");
  const postTypeId = searchParams.get("postTypeId");
  const redirectPath = searchParams.get("redirect");
  const [isSubmitting, setIsSubmitting] = useState(false); // PostType 목록 확인 (디버깅용) - 임시 비활성화
  useEffect(() => {
    console.log("Current postTypeId:", postTypeId);
    console.log("Current deptId:", deptId);
    console.log("User department:", userDepartment);

    // PostType API 호출 임시 비활성화
    /*
    const checkPostTypes = async () => {
      try {
        const postTypes = await postService.getPostTypes();
        console.log("Available PostTypes:", postTypes);
      } catch (error) {
        console.error("PostType 조회 실패:", error);
      }    };
    checkPostTypes();
    */
  }, [postTypeId, deptId, userDepartment]); // 게시글 생성 처리
  const handleSubmit = async (data: {
    title: string;
    content: string;
    tags: string[];
    images?: File[];
    noticeType?: NoticeType;
    businessDocumentCategory?: BusinessDocumentCategory;
  }) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 메뉴 ID 결정 (URL 파라미터에서 가져옴)
      const finalMenuId = postTypeId ? parseInt(postTypeId) : 1; // 기본값 1      // 게시글 생성 API 호출 (CreatePostDto 형식에 맞춤)
      await postService.createPost(
        {
          postTypeId: finalMenuId,
          title: data.title,
          content: data.content,
          noticeType: data.noticeType,
          businessDocumentCategory: data.businessDocumentCategory,
        },
        data.images
      );

      // 성공 시 리다이렉트
      const redirectTo = redirectPath || `/board/common/businessDocuments`;
      router.push(redirectTo);
    } catch (error) {
      console.error("게시글 생성 실패:", error);
      alert("게시글 생성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div className="flex items-center">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (redirectPath) {
                        window.location.href = redirectPath;
                      } else {
                        window.history.back();
                      }
                    }}
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    게시판
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-900">
                    새 게시글
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <PostEditor onSubmit={handleSubmit} />
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              if (
                window.confirm(
                  "작성한 내용이 저장되지 않습니다. 목록으로 되돌아가시겠습니까?"
                )
              ) {
                if (redirectPath) {
                  window.location.href = redirectPath;
                } else {
                  window.history.back();
                }
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            목록으로 돌아가기
          </button>
        </div>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <div className="text-lg font-medium text-gray-900">
                게시글을 등록하고 있습니다...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

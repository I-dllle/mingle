"use client";

import PostEditor from "@/features/post/components/PostEditor";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { postService } from "@/features/post/services/postService";
import { NoticeType } from "@/features/post/types/post";
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
  }) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 메뉴 ID 결정 (URL 파라미터에서 가져옴)
      const finalMenuId = postTypeId ? parseInt(postTypeId) : 1; // 기본값 1

      // 게시글 생성 API 호출 (CreatePostDto 형식에 맞춤)
      await postService.createPost(
        {
          postTypeId: finalMenuId,
          title: data.title,
          content: data.content,
          noticeType: NoticeType.GENERAL_NOTICE,
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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">글쓰기</h1>
      <PostEditor onSubmit={handleSubmit} />
      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          onClick={() => {
            if (
              window.confirm(
                "작성한 내용이 저장되지 않습니다. 목록으로 되돌아가시겠습니까?"
              )
            ) {
              // 리다이렉트 경로가 있으면 그곳으로, 없으면 뒤로가기
              if (redirectPath) {
                router.push(redirectPath);
              } else {
                router.back();
              }
            }
          }}
        >
          목록으로
        </button>
      </div>
    </div>
  );
}

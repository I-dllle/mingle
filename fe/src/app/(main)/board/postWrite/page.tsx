"use client";

import PostEditor from "@/features/post/components/PostEditor";
import { useRouter } from "next/navigation";

export default function PostWritePage() {
  const router = useRouter();
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">글쓰기</h1>
      <PostEditor
        onSubmit={() => router.push("/board/common/businessDocuments")}
      />
      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          onClick={() => {
            if (
              window.confirm(
                "작성한 내용이 저장되지 않습니다. 목록으로 되돌아가시겠습니까?"
              )
            ) {
              router.back();
            }
          }}
        >
          목록으로
        </button>
      </div>
    </div>
  );
}

import { apiClient } from "@/lib/api/apiClient";
import type {
  Post,
  PostResponseDto,
  CreatePostDto,
  UpdatePostDto,
  Page,
  NoticeType,
  BusinessDocumentCategory,
} from "../types/post";
import { addTagsToTitle } from "./tagService";

export const postService = {
  // 게시글 생성 (multipart/form-data 사용)
  createPost: async (
    data: CreatePostDto,
    images?: File[]
  ): Promise<PostResponseDto> => {
    try {
      const formData = new FormData();

      // 게시글 데이터를 JSON으로 직렬화하여 requestDto 파트로 추가
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      formData.append("requestDto", blob);

      // 이미지 파일들을 postImage 파트로 추가 (선택사항)
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append("postImage", image);
        });
      }
      const response = await fetch(`/posts/create/image`, {
        method: "POST",
        credentials: "include", // 쿠키 포함
        body: formData, // FormData 사용 (Content-Type 헤더 자동 설정)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("게시글 생성 API 오류:", error);
      throw error;
    }
  },
  // 게시글 목록 조회 (기존 방식 - 필요시 유지)
  getPosts: async (): Promise<Post[]> => {
    return await apiClient<Post[]>("/posts");
  }, // 부서별 메뉴의 게시글 조회 (새로운 API)
  getPostsByMenu: async (
    deptId: number,
    postMenuId: number
  ): Promise<PostResponseDto[]> => {
    return await apiClient<PostResponseDto[]>(
      `/posts/departments/${deptId}/menus/${postMenuId}/posts`
    );
  }, // 업무자료 게시판 게시글 조회 (category : 회의록/업무문서)
  getBusinessDocuments: async (
    deptId: number,
    category?: BusinessDocumentCategory
  ): Promise<PostResponseDto[]> => {
    try {
      const params = new URLSearchParams();
      if (category) {
        params.append("category", category);
      }

      // 부서 ID를 파라미터로 전달하는 방식으로 변경
      params.append("departmentId", deptId.toString());

      // API 엔드포인트를 부서별 조회로 수정
      const url = `/posts/business-documents?${params.toString()}`;

      console.log("=== 업무자료 게시판 API 호출 (수정된 엔드포인트) ===");
      console.log("deptId:", deptId);
      console.log("category:", category);
      console.log("전체 URL:", url);
      console.log("쿼리 파라미터:", params.toString());
      console.log("현재 시각:", new Date().toISOString());
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("=== API 응답 상태 ===");
      console.log("응답 상태:", response.status);
      console.log("응답 상태 텍스트:", response.statusText);
      console.log("응답 헤더들:");
      for (let [key, value] of response.headers.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API 오류 응답:", errorData);
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // 응답 텍스트를 먼저 가져와서 파싱 전에 확인
      const responseText = await response.text();
      console.log("=== 응답 원본 데이터 ===");
      console.log("응답 원본 텍스트:", responseText);
      console.log("응답 텍스트 길이:", responseText.length);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON 파싱 오류:", parseError);
        console.error("파싱 실패한 텍스트:", responseText);
        throw new Error("응답 JSON 파싱 실패");
      }

      console.log("=== 파싱된 응답 데이터 ===");
      console.log("파싱된 응답 데이터:", result);
      console.log("응답 데이터 타입:", typeof result);
      console.log("응답이 배열인가?", Array.isArray(result));
      if (Array.isArray(result)) {
        console.log("배열 길이:", result.length);
        result.forEach((item, index) => {
          console.log(`아이템 ${index}:`, item);
        });
      }
      return result;
    } catch (error) {
      console.error("업무자료 게시판 조회 API 오류:", error);
      throw error;
    }
  },

  // 공지사항 유형별 조회
  getNoticesByType: async (
    noticeType: NoticeType,
    departmentId?: number
  ): Promise<PostResponseDto[]> => {
    try {
      const params = new URLSearchParams({
        noticeType: noticeType.toString(),
      });

      if (departmentId) {
        params.append("departmentId", departmentId.toString());
      }
      const url = `/posts/notices?${params.toString()}`;
      console.log("=== 공지사항 API 호출 ===");
      console.log("전체 URL:", url);
      console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
      console.log("파라미터:", params.toString());
      console.log("noticeType:", noticeType);
      console.log("departmentId:", departmentId);
      console.log("현재 시각:", new Date().toISOString());

      const response = await fetch(url, {
        method: "GET",
        credentials: "include", // 쿠키 포함하여 인증 처리
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("응답 상태:", response.status);
      console.log("응답 상태 텍스트:", response.statusText);
      console.log("응답 헤더들:");
      for (let [key, value] of response.headers.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API 오류 응답:", errorData);
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // 응답 텍스트를 먼저 가져와서 파싱 전에 확인
      const responseText = await response.text();
      console.log("응답 원본 텍스트:", responseText);
      console.log("응답 텍스트 길이:", responseText.length);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON 파싱 오류:", parseError);
        console.error("파싱 실패한 텍스트:", responseText);
        throw new Error("응답 JSON 파싱 실패");
      }

      console.log("파싱된 응답 데이터:", result);
      console.log("응답 데이터 타입:", typeof result);
      console.log("응답이 배열인가?", Array.isArray(result));
      if (Array.isArray(result)) {
        console.log("배열 길이:", result.length);
      }
      return result;
    } catch (error) {
      console.error("공지사항 조회 API 오류:", error);
      throw error;
    }
  }, // 전체 공지사항 조회 (기존 getNoticesByType 메서드 활용)
  getGlobalNotices: async (): Promise<PostResponseDto[]> => {
    console.log("=== 전체 공지사항 API 호출 (getNoticesByType 사용) ===");
    return await postService.getNoticesByType("GENERAL_NOTICE" as NoticeType);
  },

  // 페이지네이션을 지원하는 게시글 목록 조회 (기존 방식이 여전히 필요하다면 유지)
  getPostsByPage: async (
    page: number = 0,
    size: number = 10,
    deptId?: number
  ): Promise<Page<PostResponseDto>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (deptId) {
      params.append("deptId", deptId.toString());
    }

    return await apiClient<Page<PostResponseDto>>(
      `/posts?${params.toString()}`
    );
  },
  // 게시글 상세 조회
  getPost: async (postId: number): Promise<PostResponseDto> => {
    try {
      const response = await fetch(`/posts/${postId}`, {
        method: "GET",
        credentials: "include", // 쿠키 포함하여 인증 처리
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("게시글 상세 조회 API 오류:", error);
      throw error;
    }
  },
  // 게시글 수정 (multipart/form-data 사용)
  updatePost: async (
    postId: number,
    userId: number,
    postRequestDto: {
      title: string;
      content: string;
      postTypeId?: number;
      businessDocumentCategory?: string;
      noticeType?: string;
    },
    postImage?: File[]
  ): Promise<PostResponseDto> => {
    try {
      const formData = new FormData();

      // 게시글 데이터를 JSON으로 직렬화하여 postRequestDto 파트로 추가
      const blob = new Blob([JSON.stringify(postRequestDto)], {
        type: "application/json",
      });
      formData.append("postRequestDto", blob);

      // 이미지 파일들을 postImage 파트로 추가 (선택사항)
      if (postImage && postImage.length > 0) {
        postImage.forEach((image) => {
          formData.append("postImage", image);
        });
      }

      const response = await fetch(`/posts/${postId}`, {
        method: "PUT",
        credentials: "include", // 쿠키 포함
        body: formData, // FormData 사용 (Content-Type 헤더 자동 설정)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("게시글 수정 API 오류:", error);
      throw error;
    }
  },
  // 게시글 삭제
  deletePost: async (postId: number): Promise<void> => {
    try {
      const response = await fetch(`/posts/${postId}`, {
        method: "DELETE",
        credentials: "include", // 쿠키 포함하여 인증 처리
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // 204 No Content 응답이므로 별도 반환값 없음
    } catch (error) {
      console.error("게시글 삭제 API 오류:", error);
      throw error;
    }
  },

  // 게시글 검색
  searchPosts: async (query: string): Promise<Post[]> => {
    return await apiClient<Post[]>(
      `/posts/search?q=${encodeURIComponent(query)}`
    );
  },
};

export type DraftPost = {
  title: string;
  content: string;
  tags: string[];
};

export function saveDraftToLocalStorage(draft: DraftPost) {
  if (typeof window !== "undefined") {
    localStorage.setItem("postDraft", JSON.stringify(draft));
  }
}

export function getDraftFromLocalStorage(): DraftPost | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("postDraft");
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function removeDraftFromLocalStorage() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("postDraft");
  }
}

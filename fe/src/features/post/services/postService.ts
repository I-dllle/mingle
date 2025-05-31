import { apiClient } from "@/lib/api/apiClient";
import type {
  Post,
  PostResponseDto,
  CreatePostDto,
  UpdatePostDto,
  Page,
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/posts/create`,
        {
          method: "POST",
          credentials: "include", // 쿠키 포함
          body: formData, // FormData 사용 (Content-Type 헤더 자동 설정)
        }
      );

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
  },

  // 부서별 메뉴의 게시글 조회 (새로운 API)
  getPostsByMenu: async (
    deptId: number,
    postMenuId: number
  ): Promise<PostResponseDto[]> => {
    return await apiClient<PostResponseDto[]>(
      `/posts/departments/${deptId}/menus/${postMenuId}/posts`
    );
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
  getPost: async (id: number): Promise<Post> => {
    return await apiClient<Post>(`/posts/${id}`);
  },

  // 게시글 수정
  updatePost: async (id: number, data: Partial<Post>) => {
    const postData = data.tags
      ? { ...data, title: addTagsToTitle(data.title || "", data.tags) }
      : data;
    return await apiClient<Post>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    });
  },

  // 게시글 삭제
  deletePost: async (id: number): Promise<void> => {
    await apiClient(`/posts/${id}`, {
      method: "DELETE",
    });
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

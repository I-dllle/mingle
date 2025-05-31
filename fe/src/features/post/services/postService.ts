import { apiClient } from "@/lib/api/apiClient";
import type { Post } from "../types/post";
import { addTagsToTitle } from "./tagService";

export const postService = {
  // 게시글 생성
  createPost: async (data: Omit<Post, "id" | "createdAt">) => {
    const postData = {
      ...data,
      title: addTagsToTitle(data.title, data.tags || []),
    };
    return await apiClient<Post>("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  },

  // 게시글 목록 조회
  getPosts: async (): Promise<Post[]> => {
    return await apiClient<Post[]>("/posts");
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

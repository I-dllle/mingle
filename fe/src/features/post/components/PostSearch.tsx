import React, { useState } from "react";
import type { PostSearchProps } from "../types/post";
import { searchByTag } from "../services/tagService";

export default function PostSearch({ posts, onSearch }: PostSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      onSearch(posts);
      return;
    }

    // 태그 검색인 경우 (#으로 시작)
    if (query.startsWith("#")) {
      const tag = query.slice(1).toLowerCase();
      const filteredPosts = searchByTag(posts, tag);
      onSearch(filteredPosts);
      return;
    }

    // 일반 검색
    const filteredPosts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
    );
    onSearch(filteredPosts);
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="검색어 입력 (#태그명으로 태그 검색)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery.startsWith("#") && (
          <div className="absolute right-2 top-2 text-sm text-gray-500">
            태그 검색
          </div>
        )}
      </div>
    </div>
  );
}

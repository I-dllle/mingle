import React from "react";
import type { PostListProps } from "../types/post";
import { extractTags, removeTagsFromTitle } from "../services/tagService";

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const tags = extractTags(post.title);
        const cleanTitle = removeTagsFromTitle(post.title);

        return (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{cleanTitle}</h3>
                {tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-gray-600 line-clamp-2">
                  {post.content}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <div>{post.author}</div>
                <div>{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

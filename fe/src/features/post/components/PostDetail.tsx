"use client";
import React from "react";

export interface PostDetailProps {
  post: {
    id: number;
    title: string;
    content: string; // HTML 가능
  };
}

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow border border-gray-200 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">{post.title}</h1>
      <div
        className="text-gray-800 text-base mb-12 p-2 min-h-[120px]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}

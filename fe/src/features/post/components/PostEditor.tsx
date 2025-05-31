import React, { useState, useEffect } from "react";
import type { PostEditorProps } from "../types/post";
import {
  saveDraftToLocalStorage,
  getDraftFromLocalStorage,
  removeDraftFromLocalStorage,
} from "../services/postService";

export default function PostEditor({ onSubmit }: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const draft = getDraftFromLocalStorage();
    if (draft) {
      setTitle(draft.title || "");
      setContent(draft.content || "");
      setTags(draft.tags || []);
    }
  }, []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      tags,
    });
    removeDraftFromLocalStorage();
  };

  const handleSaveDraft = () => {
    saveDraftToLocalStorage({ title, content, tags });
    alert("임시저장 완료!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">태그</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAddTag())
            }
            placeholder="태그 입력 후 Enter"
            className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap"
          >
            추가
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
          rows={10}
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          임시저장
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          작성하기
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setContent("");
            setTags([]);
            setTagInput("");
            removeDraftFromLocalStorage();
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          작성 취소
        </button>
      </div>
    </form>
  );
}

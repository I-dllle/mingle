import React, { useState, useEffect } from "react";
import type { PostEditorProps } from "../types/post";
import { NoticeType, BusinessDocumentCategory } from "../types/post";
import {
  saveDraftToLocalStorage,
  getDraftFromLocalStorage,
  removeDraftFromLocalStorage,
} from "../services/postService";
import {
  DocumentTextIcon,
  TagIcon,
  PhotoIcon,
  CheckCircleIcon,
  BookmarkIcon,
  XCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function PostEditor({ onSubmit }: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [noticeType, setNoticeType] = useState<NoticeType | undefined>(
    undefined
  );
  const [businessDocumentCategory, setBusinessDocumentCategory] = useState<
    BusinessDocumentCategory | undefined
  >(undefined);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      tags,
      images,
      noticeType,
      businessDocumentCategory,
    });
    removeDraftFromLocalStorage();
  };

  const handleSaveDraft = () => {
    saveDraftToLocalStorage({ title, content, tags });
    alert("임시저장 완료!");
  };
  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                새 게시글 작성
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                게시글 정보를 입력해주세요
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
            기본 정보
          </h3>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력해주세요"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500 transition-colors"
              required
            />
          </div>

          {/* Notice Type and Category in Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {" "}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공지사항 타입
              </label>
              <select
                value={noticeType || ""}
                onChange={(e) =>
                  setNoticeType(
                    e.target.value ? (e.target.value as NoticeType) : undefined
                  )
                }
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              >
                <option value="">선택하지 않음</option>
                <option value={NoticeType.GENERAL_NOTICE}>전체 공지</option>
                <option value={NoticeType.DEPARTMENT_NOTICE}>
                  부서별 공지
                </option>
                <option value={NoticeType.COMPANY_NEWS}>회사 소식</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비즈니스 문서 카테고리
              </label>
              <select
                value={businessDocumentCategory || ""}
                onChange={(e) =>
                  setBusinessDocumentCategory(
                    e.target.value
                      ? (e.target.value as BusinessDocumentCategory)
                      : undefined
                  )
                }
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
              >
                <option value="">선택하지 않음</option>
                <option value={BusinessDocumentCategory.MEETING_MINUTES}>
                  회의록
                </option>
                <option value={BusinessDocumentCategory.RESOURCE}>
                  업무문서
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <TagIcon className="h-5 w-5 text-gray-500 mr-2" />
            태그
          </h3>

          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                placeholder="태그를 입력하고 Enter를 누르세요"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAddTag}
              className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              추가
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-200 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
            내용
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              게시글 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="게시글 내용을 입력해주세요"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500 resize-none"
              rows={12}
              required
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <PhotoIcon className="h-5 w-5 text-gray-500 mr-2" />
            이미지 첨부
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 파일 (최대 10MB, JPG/PNG/GIF)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
              <div className="space-y-1 text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>파일을 선택하세요</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">또는 드래그하여 업로드</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                업로드된 이미지 ({images.length}개)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <p className="text-xs text-gray-500 mt-2 truncate px-1">
                      {image.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <BookmarkIcon className="h-4 w-4 mr-2" />
            임시저장
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "작성한 내용이 모두 삭제됩니다. 계속하시겠습니까?"
                  )
                ) {
                  setTitle("");
                  setContent("");
                  setTags([]);
                  setTagInput("");
                  setImages([]);
                  removeDraftFromLocalStorage();
                }
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <XCircleIcon className="h-4 w-4 mr-2" />
              작성 취소
            </button>

            <button
              type="submit"
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              게시글 등록
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

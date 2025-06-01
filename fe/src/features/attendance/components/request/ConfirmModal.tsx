"use client";

import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
  showCommentInput?: boolean;
  commentRequired?: boolean;
  commentPlaceholder?: string;
  maxCommentLength?: number;
  type?: "approve" | "reject" | "simple";
}

/**
 * 확인/취소 모달 컴포넌트 (코멘트 입력 지원)
 * 사용처:
 * - 휴가 요청 취소 확인
 * - 승인/반려 시 코멘트 입력
 * - 기타 확인 작업
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  confirmButtonColor = "bg-purple-600 hover:bg-purple-700",
  showCommentInput = false,
  commentRequired = false,
  commentPlaceholder = "의견을 입력하세요",
  maxCommentLength = 200,
  type = "simple",
}: ConfirmModalProps) {
  const [comment, setComment] = useState<string>("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setComment("");
      setCommentError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // 타입에 따른 버튼 색상 지정
  const buttonColor =
    type === "simple"
      ? confirmButtonColor
      : type === "approve"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-red-600 hover:bg-red-700";

  // 확인 처리 함수
  const handleConfirm = () => {
    // 코멘트가 필수이고 입력되지 않았을 때
    if (commentRequired && !comment.trim()) {
      setCommentError(
        type === "reject" ? "반려 사유를 입력해주세요" : "의견을 입력해주세요"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      // 코멘트 입력이 활성화되어 있으면 코멘트와 함께 onConfirm 호출
      onConfirm(showCommentInput ? comment : undefined);
      onClose();
    } catch (err) {
      setCommentError("처리 중 오류가 발생했습니다");
      setIsSubmitting(false);
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>

                {/* 코멘트 입력 영역 */}
                {showCommentInput && (
                  <div className="mt-4">
                    <textarea
                      className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 ${
                        commentError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-purple-500"
                      }`}
                      rows={4}
                      value={comment}
                      onChange={(e) => {
                        if (e.target.value.length <= maxCommentLength) {
                          setComment(e.target.value);
                          if (commentError) setCommentError(null);
                        }
                      }}
                      placeholder={commentPlaceholder}
                      disabled={isSubmitting}
                    />
                    <div className="flex justify-between mt-1">
                      <div>
                        {commentError && (
                          <p className="text-sm text-red-600">{commentError}</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {comment.length}/{maxCommentLength}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center rounded-md border border-transparent ${buttonColor} px-4 py-2 text-sm font-medium text-white focus:outline-none disabled:opacity-50`}
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "처리 중..." : confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";

interface ModalProps {
  children: React.ReactNode;
  maxWidth?: string;
  onClose?: () => void;
}

export default function Modal({
  children,
  maxWidth = "max-w-4xl",
  onClose,
}: ModalProps) {
  const router = useRouter();

  const onDismiss = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  }, [router, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // body 스크롤 방지
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onDismiss]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onDismiss();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 relative w-full ${maxWidth} mx-auto max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 글래스모피즘 효과를 위한 그라데이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/90 to-blue-50/80 rounded-3xl" />

        {/* 닫기 버튼 */}
        <button
          onClick={onDismiss}
          className="absolute -top-12 right-0 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
          aria-label="모달 닫기"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* 컨텐츠 */}
        <div className="relative z-10 max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

import React, { ReactNode, useEffect } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title?: string;
}

/**
 * 모달 컴포넌트
 *
 * @param children - 모달 내용
 * @param onClose - 모달 닫기 함수
 * @param title - 모달 제목 (옵션)
 */
export default function Modal({ children, onClose, title }: ModalProps) {
  // ESC 키를 누르면 모달이 닫히도록 이벤트 리스너 추가
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // 모달 외부를 클릭하면 닫히는 핸들러
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300 ease-in-out animate-backdrop-fade"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-white rounded-xl shadow-[0_10px_40px_-5px_rgba(109,40,217,0.15)] border border-purple-100 transition-all transform animate-modal-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center p-5 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white">
            <h2 className="text-xl font-semibold text-purple-800 px-1">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full text-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 ease-in-out"
              aria-label="닫기"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className={`${title ? "px-6 py-5" : "p-6"}`}>{children}</div>
      </div>
    </div>
  );
}

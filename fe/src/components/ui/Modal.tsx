"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    dialog?.addEventListener("close", onDismiss);
    return () => {
      dialog?.removeEventListener("close", onDismiss);
    };
  }, [onDismiss]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onDismiss();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm w-full h-full p-4"
      onClick={handleBackdropClick}
      onCancel={onDismiss} // ESC 키로 닫기
    >
      <div
        className="bg-white rounded-2xl shadow-2xl relative w-full max-w-3xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 rounded-full text-purple-500 hover:bg-purple-100 transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </dialog>
  );
}

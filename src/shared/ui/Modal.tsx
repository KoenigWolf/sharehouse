"use client";

import { useEffect, useCallback, ReactNode, useState } from "react";
import { cn } from "@/src/lib/utils";
import type { ModalPosition } from "@/src/shared/types";

// ============================================
// Types
// ============================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: ModalPosition;
  showCloseButton?: boolean;
  className?: string;
}

// ============================================
// Component
// ============================================

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  position = "center",
  showCloseButton = true,
  className,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animation timing
  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Keyboard and scroll lock effects
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const isCenter = position === "center";
  const isBottom = position === "bottom";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex",
        isCenter && "items-center justify-center",
        isBottom && "items-end justify-center"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "relative z-10 w-full max-h-[90vh] overflow-auto",
          "bg-white dark:bg-slate-800",
          "shadow-2xl transition-all duration-300",
          // Position-specific styles
          isCenter && "max-w-2xl m-4 rounded-2xl",
          isBottom && "max-w-lg rounded-t-3xl",
          // Animation
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : cn(
                "opacity-0",
                isCenter && "scale-95",
                isBottom && "translate-y-full"
              ),
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-slate-900 dark:text-white"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  "p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                  "rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700",
                  "transition-colors touch-manipulation",
                  !title && "ml-auto"
                )}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ============================================
// Icons
// ============================================

function CloseIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

"use client";

/**
 * Modal Component
 * Responsive modal with center and bottom sheet positions
 *
 * Mobile optimizations:
 * - Bottom sheet position for mobile-friendly interaction
 * - Touch-friendly close button with proper target size
 * - Safe area insets for notched devices
 * - Scroll locking to prevent background scroll
 */

import { useEffect, useCallback, ReactNode, useState, memo, useRef, startTransition } from "react";
import { cn } from "@/src/lib/utils";
import type { ModalPosition } from "@/src/shared/types";
import { X } from "lucide-react";

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

export const Modal = memo(function Modal({
  isOpen,
  onClose,
  title,
  children,
  position = "center",
  showCloseButton = true,
  className,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Animation timing - using startTransition to avoid cascading render warnings
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => {
        startTransition(() => {
          setIsVisible(true);
        });
        // Focus the modal for accessibility
        modalRef.current?.focus();
      });
    } else {
      startTransition(() => {
        setIsVisible(false);
      });
      // Restore focus when closing
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [onClose]
  );

  // Keyboard and scroll lock effects
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const isCenter = position === "center";
  const isBottom = position === "bottom";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex",
        "safe-area-inset",
        isCenter && "items-center justify-center p-3 xs:p-4",
        isBottom && "items-end justify-center"
      )}
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-slate-900/60 backdrop-blur-sm",
          "transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        className={cn(
          "relative z-10",
          "w-full",
          "bg-white dark:bg-slate-800",
          "shadow-2xl",
          "transition-all duration-300 ease-out",
          "focus:outline-none",
          // Position-specific styles
          isCenter && cn(
            "max-w-sm xs:max-w-md sm:max-w-lg lg:max-w-2xl",
            "max-h-[85vh] xs:max-h-[90vh]",
            "rounded-2xl xs:rounded-2xl sm:rounded-3xl",
            "overflow-hidden"
          ),
          isBottom && cn(
            "max-w-lg",
            "max-h-[90vh]",
            "rounded-t-2xl xs:rounded-t-3xl",
            "safe-area-inset-bottom"
          ),
          // Animation
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : cn(
                "opacity-0",
                isCenter && "scale-95 translate-y-4",
                isBottom && "translate-y-full"
              ),
          className
        )}
      >
        {/* Drag handle for bottom sheet (mobile UX) */}
        {isBottom && (
          <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={cn(
              "flex items-center justify-between",
              "px-4 xs:px-5 sm:px-6",
              "py-3 xs:py-4",
              "border-b border-slate-200 dark:border-slate-700"
            )}
          >
            {title && (
              <h2
                id="modal-title"
                className="text-base xs:text-lg sm:text-xl font-semibold text-slate-900 dark:text-white"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "p-2 xs:p-2.5",
                  "min-w-[40px] min-h-[40px]",
                  "flex items-center justify-center",
                  "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                  "rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700",
                  "transition-colors touch-manipulation",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  !title && "ml-auto"
                )}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}

        {/* Body with overflow handling */}
        <div
          className={cn(
            "p-4 xs:p-5 sm:p-6",
            "overflow-y-auto",
            "overscroll-contain",
            // Max height calculation
            title || showCloseButton
              ? "max-h-[calc(85vh-4rem)] xs:max-h-[calc(90vh-4.5rem)]"
              : "max-h-[85vh] xs:max-h-[90vh]"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
});


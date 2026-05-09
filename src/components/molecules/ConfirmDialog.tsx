"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  buttonText?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  message,
  buttonText = "Close",
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="fixed inset-0 z-50 bg-transparent p-0 m-0 max-w-none max-h-none w-full h-full"
    >
      {/* 배경 딤 */}
      <div
        className="fixed inset-0 bg-black/60"
        onClick={handleClose}
      />
      {/* 바텀시트 */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0",
          "bg-tcrc-bg-surface",
          "rounded-t-[20px] px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]",
          "flex flex-col gap-4 animate-sheet-up"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 바 */}
        <div className="w-9 h-1 rounded-full bg-tcrc-border mx-auto -mt-1 mb-1" />
        <p className="text-tcrc-text-primary text-center text-tcrc-body break-words px-2">
          {message}
        </p>
        <Button
          onClick={handleClose}
          size="full"
          style={{ background: "#FEE500", color: "#000" }}
        >
          {buttonText}
        </Button>
      </div>
    </dialog>
  );
}

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
      className="fixed inset-0 z-50 bg-transparent"
    >
      <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className={cn(
            "bg-tcrc-bg-surface rounded-tcrc-lg p-5 max-w-sm w-full",
            "flex flex-col gap-4 animate-scale-in"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-tcrc-text-primary text-center text-tcrc-body break-words">
            {message}
          </p>
          <Button onClick={handleClose} size="full">
            {buttonText}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

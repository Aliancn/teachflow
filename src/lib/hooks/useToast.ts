"use client";

import { useCallback } from "react";
import { ToastTone, useToastStore } from "@/lib/stores/toastStore";

type ToastOptions = {
  duration?: number;
};

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  return useCallback(
    (message: string, tone: ToastTone = "info", options?: ToastOptions) =>
      addToast({ message, tone, duration: options?.duration }),
    [addToast]
  );
}

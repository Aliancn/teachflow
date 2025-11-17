"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type ToastTone = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
  duration: number;
}

type ToastPayload = {
  message: string;
  tone?: ToastTone;
  duration?: number;
};

type ToastStore = {
  toasts: ToastItem[];
  addToast: (toast: ToastPayload) => string;
  removeToast: (id: string) => void;
  clear: () => void;
};

const DEFAULT_DURATION = 3600;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  addToast: ({ message, tone = "info", duration = DEFAULT_DURATION }) => {
    const id = uuidv4();
    const nextToast: ToastItem = { id, message, tone, duration };
    set((state) => ({ toasts: [...state.toasts, nextToast] }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

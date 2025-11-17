"use client";

import { useToastStore } from "@/lib/stores/toastStore";

const toneStyles: Record<string, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

const toneIcons: Record<string, string> = {
  success: "✓",
  error: "!",
  info: "i",
};

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[1000] flex flex-col items-center gap-3 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-2xl transition ${
            toneStyles[toast.tone] ?? toneStyles.info
          }`}
        >
          <span className="text-base font-semibold">
            {toneIcons[toast.tone] ?? toneIcons.info}
          </span>
          <p className="flex-1 leading-relaxed">{toast.message}</p>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="rounded px-1 text-xs font-semibold uppercase tracking-wide opacity-60 transition hover:opacity-100"
          >
            关闭
          </button>
        </div>
      ))}
    </div>
  );
}

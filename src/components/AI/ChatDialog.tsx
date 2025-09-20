"use client";
import { ReactNode } from 'react';
import { Dialog } from '@headlessui/react';

interface ChatDialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ChatDialog({ visible, onClose, title, children, className }: ChatDialogProps) {
  return (
    <Dialog
      open={visible}
      onClose={onClose}
      className="relative z-50"
    >
      {/* 原有对话框内容保持不变 */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-xl shadow-xl w-full max-w-2xl ${className}`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
    </Dialog>
    
  );
}
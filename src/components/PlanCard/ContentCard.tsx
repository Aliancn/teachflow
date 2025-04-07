"use client";
import MarkdownViewer from "@/components/AI/MarkdownViewer";
import { ReactNode } from "react";

interface ContentCardProps {
  id: string;
  title: string | ReactNode;
  content: string;
  className?: string;
}

export function ContentCard({ id, title, content, className }: ContentCardProps) {
  return (
    <div 
      id={id}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}
    >
      {typeof title === "string" ? (
        <h2 className="text-2xl font-semibold mb-6 text-purple-800">{title}</h2>
      ) : (
        <div className="mb-6">{title}</div>
      )}
      <MarkdownViewer 
        content={content.replace(/\n/g, '\n\n')}
        className="space-y-4 prose max-w-none"
      />
    </div>
  );
}
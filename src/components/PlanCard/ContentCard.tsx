"use client";
import MarkdownViewer from "@/components/AI/MarkdownViewer";

interface ContentCardProps {
  id: string;
  title: string;
  content: string;
  className?: string;
}

export function ContentCard({ id, title, content, className }: ContentCardProps) {
  return (
    <div 
      id={id}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 ${className}`}
    >
      <h2 className="text-2xl font-semibold mb-6 text-purple-800">{title}</h2>
      <MarkdownViewer 
        content={content.replace(/\n/g, '\n\n')}
        className="space-y-4 prose max-w-none"
      />
    </div>
  );
}
"use client";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export default function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
        components={{
          code({ node, className, children, ...props }) {
            return (
              <code className={`${className} bg-gray-100 rounded px-1 py-0.5`} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
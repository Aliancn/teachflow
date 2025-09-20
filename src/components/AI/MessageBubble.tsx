import { ReactNode } from 'react';
import MarkdownViewer from './MarkdownViewer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  timestamp: string;
  isThinking?: boolean;
  thinkingContent?: string;
}

export default function MessageBubble({ content, isUser, timestamp, thinkingContent }: MessageBubbleProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] rounded-xl p-4 ${isUser ? 'bg-gray-100 text-black' : 'bg-white shadow-md'} `}>
        <div className="space-y-2">
          {thinkingContent && (
            <div className="text-sm text-gray-500">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {thinkingContent}
              </ReactMarkdown>
            </div>
          )}
          <MarkdownViewer content={content.replace(/\n/g, '\n\n')} />
        </div>
        {timestamp && (
          <div className={`mt-2 text-xs ${isUser ? 'text-blue-700' : 'text-gray-500'}`}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}


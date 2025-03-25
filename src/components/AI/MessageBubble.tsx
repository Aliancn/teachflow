import { useState } from 'react';
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
  const [Thinking, setThinking] = useState(true);
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] rounded-xl p-4 ${isUser ? 'bg-gray-100 text-black' : 'bg-white shadow-md'} `}>
        <div className="space-y-2">
          {thinkingContent && (
            <details className="group [&_summary::-webkit-details-marker]:hidden"
              open={Thinking}
              onToggle={(e: React.ToggleEvent<HTMLDetailsElement>) => 
                setThinking((e.target as HTMLDetailsElement).open)
              }>
              <summary className="flex cursor-pointer items-center gap-1.5 text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform duration-300 group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">思考过程</span>
              </summary>
              <div className="mt-2 pl-5 text-sm text-gray-600 space-y-2 transition-all duration-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {thinkingContent}
                </ReactMarkdown>
              </div>
            </details>
          )}
          <MarkdownViewer content={content.replace(/\n/g, '\n\n')} />
        </div>
        {timestamp && (
          <div className={`mt-2 text-xs text-gray-500`}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}


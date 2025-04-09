"use client";
import { useState } from 'react';
import MathMarkdown from '@/components/MathMarkdown';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { usePaperStore } from '@/lib/stores/paperStore';

export default function PaperResultPage() {
  const [activeTab, setActiveTab] = useState('paper');
  const { generatedPaper ,loadMockData, title} = usePaperStore();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ArrowDownTrayIcon className="w-6 h-6 text-purple-600" />
          生成试卷 - {title}
        </h1>
        <button
          onClick={() => {
            const blob = new Blob([generatedPaper.content || generatedPaper.content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '试卷.md';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg hover:shadow-lg"
        >
          下载完整试卷
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('paper')}
            className={`pb-2 px-1 ${
              activeTab === 'paper'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-purple-600'
            }`}
          >
            试卷内容
          </button>
          <button
            onClick={() => setActiveTab('answer')}
            className={`pb-2 px-1 ${
              activeTab === 'answer'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-purple-600'
            }`}
          >
            参考答案
          </button>
        </nav>
      </div>

      {activeTab === 'paper' && (
        <MathMarkdown 
          content={generatedPaper.content || "试卷正在生成中..."}
          className=""
        />
      )}

      {activeTab === 'answer' && (
        <MathMarkdown
          content={generatedPaper.answer || "答案正在生成中..."}
          className=""
        />
      )}

      {!generatedPaper.content && (
        <div className="text-center py-12 text-gray-500">
          试卷生成中，请稍候...
        </div>
      )}
    </div>
  );
}
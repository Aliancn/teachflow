"use client";
import { VerticalTimeline } from '@/components/VerticalTimeline';
import { useSyllabusStore } from '@/lib/stores/syllabusStore';
import Link from 'next/link';

export default function SyllabusResult() {
  const { generatedCards } = useSyllabusStore();
  return (
    <div className="p-8 bg-white">
      <div className="grid max-w-5xl mx-auto">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">生成结果</h2>
            <Link
              href="/dashboard/syllabus"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              重新生成
            </Link>
          </div>

          <VerticalTimeline cards={generatedCards} />
          {generatedCards.length > 0 && (
            <div className="mt-6 text-sm text-gray-500">
              总时长：{generatedCards.reduce((acc, card) => acc + parseInt(card.data.duration), 0)} 分钟
            </div>
          )}
          {generatedCards.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              暂无生成内容，请返回重新生成
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
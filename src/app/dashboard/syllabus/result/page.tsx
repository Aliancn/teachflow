"use client" ;
import { Card } from '@/components/Card';
import { useSyllabusStore } from '@/lib/stores/syllabusStore';
import Link from 'next/link';

export default function SyllabusResult() {
  const { generatedCards } = useSyllabusStore();

  return (
    <div className="p-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">生成结果</h2>
          <Link
            href="/dashboard/syllabus"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            重新生成
          </Link>
        </div>
        
        <div className="space-y-4">
          {generatedCards.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>

        {generatedCards.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无生成内容，请返回重新生成
          </div>
        )}
      </div>
    </div>
  );
}
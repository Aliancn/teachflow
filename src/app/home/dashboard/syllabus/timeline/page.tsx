"use client";
import { VerticalTimeline } from '@/components/VerticalTimeline';
import { useSyllabusStore } from '@/lib/stores/syllabusStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SyllabusResult() {
  const { generatedCards , loadMockWord} = useSyllabusStore();
  const router = useRouter();
  const onSubmit = async () => {
    try {
      await loadMockWord();
      router.push('/home/dashboard/syllabus/word');
    } catch (error) {
      console.error('生成失败:', error);
    }
  };
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
        <div className='flex justify-center items-center w-full py-3'>
          <button 
          className="w-5/10 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={onSubmit}>
            加载教学大纲
          </button>
        </div>
      </div>
    </div>
  );
}
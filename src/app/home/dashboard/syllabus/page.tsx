"use client";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSyllabusStore } from '@/lib/stores/syllabusStore';
import { generateSyllabusCards } from '@/lib/agents/card_build';
import { convertToCardData } from '@/lib/utils/syllabusUtils';

type SyllabusFormData = {
  title: string;
  chapters: number;
  duration: number;
};

export default function SyllabusGeneration() {
  const { register, handleSubmit } = useForm<SyllabusFormData>();
  const router = useRouter();
  const { setGeneratedCards, setGenerating, generating } = useSyllabusStore();

  const onSubmit = async (data: SyllabusFormData) => {
    try {
      setGenerating(true);

      // 使用统一的客户端方法调用API
      const result = await generateSyllabusCards({
        topic: data.title,
        section_count: data.chapters,
        total_duration: data.duration,
      });

      // 转换卡片数据格式
      const cards = convertToCardData(result.result.cards, result.conversation_id);
      console.log('转换后的卡片数据:', cards);
      setGeneratedCards(cards);

      // 只有在成功生成后才跳转
      router.push('/home/dashboard/syllabus/timeline');
    } catch (error) {
      console.error('生成失败:', error);
      alert(`生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">新建教学大纲</h2>
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">教学内容</label>
            <input
              type="text"
              {...register('title', { required: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">预期章节</label>
            <div className="flex space-x-2 items-center">
              <input
                type="number"
                {...register('chapters', { required: true, valueAsNumber: true })}
                className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="text-sm text-gray-500">章</span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">预期时长</label>
            <div className='flex space-x-2 items-center'>
              <input
                type="number"
                {...register('duration', { required: true, valueAsNumber: true })}
                className="w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="text-sm text-gray-500">分钟</span>
            </div>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={generating}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? '生成中...' : '生成大纲'}
          </button>
        </div>
      </div>
    </div>
  );
}
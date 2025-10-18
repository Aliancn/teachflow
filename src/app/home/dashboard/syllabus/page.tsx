"use client";
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useSyllabusStore } from '@/lib/stores/syllabusStore';
import { fetchDifyCard, DifyCardReq } from '@/lib/agents/card_build';
type SyllabusFormData = {
  title: string;
  chapters: number;
  duration: number;
};

export default function SyllabusGeneration() {
  const { register, handleSubmit } = useForm<SyllabusFormData>();
  const router = useRouter();
  const { generatedCards, generating,setGeneratedCards, loadMock, setGenerating } = useSyllabusStore();

  const onSubmit = async (data: SyllabusFormData) => {
    try {
      setGenerating(true);
      const req: DifyCardReq = {
        messages: [{
          role: 'user',
          content: `请按照要求生成教学大纲。`
        }],
        topic: data.title,
        section_count: data.chapters,
        total_duration: data.duration,
        conversation_id: ''
      }
      // const response = await fetchDifyCard(req);
      const response = await loadMock();
      // TODO response.conversation_id
      console.log('response', response);
      // setGeneratedCards(response.result.cards);
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setGenerating(false);
      router.push('/home/dashboard/syllabus/timeline');
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
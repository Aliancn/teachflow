"use client";
import { useRouter } from 'next/navigation';
import { set, useForm } from 'react-hook-form';
import { useState } from 'react';
import Loading from '@/components/Loading';
type PPTFormData = {
  title: string;
  theme: string;
};

export default function PPTGeneration() {
  const { register, handleSubmit } = useForm<PPTFormData>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PPTFormData) => {
    // 调用AI生成逻辑
    setLoading(true);
    try {
      console.log('Generating PPT with:', data);
      setTimeout(() => {
        router.push(`/home/dashboard/ppt/pdf`);
        setLoading(false); // 跳转后关闭loading
      }, 1000);
    } catch (error) {
      setLoading(false); // 错误处理
      console.error('生成失败:', error);
    }
  };
  return (
    <div className="p-8 bg-white">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">新建PPT课件</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">教学主题</label>
                <input
                  {...register('title', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">教学风格</label>
                <select
                  {...register('theme')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="professional">专业风格</option>
                  <option value="education">教学风格</option>
                  <option value="creative">创意设计</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              开始生成
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
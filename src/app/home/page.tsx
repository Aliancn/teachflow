"use client";
import { MagicWandIcon } from "@/components/icons/MagicWandIcon";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/lib/stores/dashboardStore';

export default function DashboardApp() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { setTeachingParams } = useDashboardStore();

  const handleFormSubmit = (params: any) => {
    setTeachingParams({
      topic: inputValue,
      ...params
    });
  };
  const [style, setStyle] = useState('heuristic');
  const [chapters, setChapters] = useState(5);
  const [duration, setDuration] = useState(40);


  return (
    <div className="min-h-screen grid grid-cols-1 items-start justify-items-center px-4 pt-24 ">
      <div className="w-full max-w-2xl space-y-10">
        {!isSubmitted ? (
          <div >
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-800">
                随时输入您的教学主题
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-purple-100 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative flex items-center gap-3 border-2 border-purple-200 rounded-full px-6 py-4 bg-white hover:border-purple-300 transition-colors shadow-md">
                <MagicWandIcon />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setIsSubmitted(true)}
                  placeholder="为我生成一份关于《二次函数》的课程大纲"
                  className="w-full bg-transparent outline-none placeholder-purple-400 text-lg text-slate-800"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 space-y-6">
            <h3 className="text-xl font-semibold text-purple-800">请完善教学参数</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">教学风格</label>
                
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">预计章节数</label>
                
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">预计时长</label>
                
              </div>
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleFormSubmit}
            >
              生成教学方案
            </Button>
          </div>
        )}
        {/* 提示语 */}
        <div className="text-sm text-purple-500 leading-relaxed bg-purple-50 rounded-lg p-4 shadow-sm">
          🚀 支持输入：
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>课程主题</li>
            <li>知识点</li>
            <li>教学目标</li>
          </ul>
        </div>
      </div>
    </div>
  );
}



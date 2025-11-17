"use client";
import { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import MathMarkdown from '@/components/MathMarkdown';
import { generateEnhancedExercise } from '@/lib/agents/card_build';

export default function ExerciseEnhancePage() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedExercises, setGeneratedExercises] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // 调用实际的API生成增强习题
      const result = await generateEnhancedExercise({
        original: inputText
      });

      setGeneratedExercises(result.results);
    } catch (err) {
      console.error('生成增强习题失败:', err);
      setError(err instanceof Error ? err.message : '生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6 text-purple-600" />
        习题增强生成
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            原始题目 *
            <textarea
              required
              rows={4}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="请输入需要增强的题目..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
        >
          {isLoading ? '生成中...' : '立即生成'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}

      {generatedExercises.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">生成结果</h2>
          <div className="space-y-4">
            {generatedExercises.map((exercise, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">题目 {index + 1}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(exercise)}
                    className="text-purple-600 hover:text-purple-800 text-sm"
                  >
                    复制
                  </button>
                </div>
                <MathMarkdown content={exercise} className="text-base" />
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-8 text-center text-gray-500">
          <div className="animate-spin w-8 h-8 mx-auto mb-2 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          正在生成优质习题...
        </div>
      )}
    </div>
  );
}
"use client";
import { ContentCard } from '@/components/PlanCard/ContentCard';
import { useSyllabusStore } from '@/lib/stores/syllabusStore';
import { useEffect, useState } from 'react';
import { generateSyllabusContent } from '@/lib/agents/card_build';

export default function Word() {
    const { word, generatedCards, setWord } = useSyllabusStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 当内容为空时调用实际接口生成
        const generateContent = async () => {
            if (word.length === 0 || !word[0]?.content) {
                // 检查是否有卡片数据
                if (!generatedCards || generatedCards.length === 0) {
                    setError('未找到教学卡片数据，请先生成教学大纲');
                    return;
                }

                try {
                    setLoading(true);
                    setError(null);

                    // 准备卡片数据
                    const cardContent = generatedCards.map(card => ({
                        title: card.title,
                        description: card.description,
                        type: card.type,
                        data: {
                            content: card.data.content,
                            duration: card.data.duration
                        }
                    }));

                    // 调用实际接口生成详细内容
                    const result = await generateSyllabusContent({
                        card_content: cardContent
                    });

                    // 更新到 store，同时保存 text 和 goal
                    setWord(result.text, result.goal);
                } catch (err) {
                    console.error('生成详细内容失败:', err);
                    setError(err instanceof Error ? err.message : '生成失败');
                } finally {
                    setLoading(false);
                }
            }
        };

        generateContent();
    }, [word, generatedCards, setWord]);

    return (
        <div id="syllabus" className="">
            {loading && (
                <div className="text-center text-gray-500 py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                    <p>正在生成详细教学内容...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4 my-4">
                    <p className="font-medium">错误</p>
                    <p>{error}</p>
                </div>
            )}

            {!loading && !error && word[0]?.content && (
                <>
                    <ContentCard
                        id="syllabus-content"
                        title="教学大纲"
                        content={word[0].content}
                        className=""
                    />
                    <div className="flex justify-center my-2 ">
                        <button
                            onClick={() => {
                                // 创建Blob对象生成.docx文件
                                const blob = new Blob([word[0].content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = '教学大纲.docx';
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            下载Word文档
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
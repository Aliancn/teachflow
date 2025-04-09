"use client";
import { ContentCard } from '@/components/PlanCard/ContentCard';
import { useSyllabusStore } from '@/lib/stores/syllabusStore';
import { useEffect } from 'react';
export default function Word() {
    const { word, loadMockWord } = useSyllabusStore();
    useEffect(() => {
        // 当内容为空时加载模拟数据
        if (word.length === 0 || !word[0]?.content) {
            loadMockWord();
        }
    }, [word, loadMockWord]);
    return (
        <div id="syllabus" className="">
            {word[0]?.content ? (
                <>
                    <ContentCard
                        id="syllabus-content"
                        title="教学大纲"
                        content={word[0].content}
                        className=""
                    />
                </>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    正在加载教学大纲...
                </div>
            )}
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
        </div>

    )
}
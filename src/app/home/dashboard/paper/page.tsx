"use client";
import { useState } from 'react';
import { DocumentTextIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { usePaperStore } from '@/lib/stores/paperStore';
import { useRouter } from 'next/navigation';  // 导入useRouter
export default function PaperGenerationPage() {
    type KnowledgePoint = {
        id: number;
        name: string;
    };
    const router = useRouter();  // 初始化useRouter
    const [formData, setFormData] = useState({
        knowledgePoints: [] as KnowledgePoint[],
        title: '',
        subject: '数学',
        difficulty: 'medium',
        paperType: 'unit',
        questionCount: 20,
        associatedClass: '',
        includeAnswer: true,
        includeAnalysis: false
    });
    // 在现有state中添加
    const [newKnowledge, setNewKnowledge] = useState('');
    const { generatedPaper, loadMockData } = usePaperStore();
    // 在handleSubmit前添加知识点处理方法
    const handleAddKnowledge = () => {
        if (newKnowledge.trim() && formData.knowledgePoints.length < 10) {
            setFormData({
                ...formData,
                knowledgePoints: [...formData.knowledgePoints, { id: Date.now(), name: newKnowledge.trim() }]
            });
            setNewKnowledge('');
        }
    };

    // 模拟班级数据
    const classes = [
        { id: 'class1', name: '高一(1)班' },
        { id: 'class2', name: '高一(2)班' },
        { id: 'class3', name: '高三理科班' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('试卷配置：', formData);
        // TODO: 调用生成试卷的API
        loadMockData(); // 模拟数据
        router.push('/home/dashboard/paper/result'); // 跳转到生成结果页面

    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                生成测试试卷
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 基本设置 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            试卷标题 *
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            学科 *
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            >
                                <option>数学</option>
                                <option>物理</option>
                                <option>化学</option>
                                <option>英语</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium mb-2">
                        涉及知识点
                        <div className="flex gap-2 mt-1">
                            <input
                                type="text"
                                value={newKnowledge}
                                onChange={(e) => setNewKnowledge(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddKnowledge()}
                                placeholder="输入知识点后回车添加"
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                type="button"
                                onClick={handleAddKnowledge}
                                className="px-4 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                            >
                                添加
                            </button>
                        </div>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {formData.knowledgePoints.map((kp) => (
                            <span
                                key={kp.id}
                                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm flex items-center"
                            >
                                {kp.name}
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        ...formData,
                                        knowledgePoints: formData.knowledgePoints.filter(k => k.id !== kp.id)
                                    })}
                                    className="ml-2 text-purple-400 hover:text-purple-600"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>


                {/* 难度和类型 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            试卷难度 *
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500"
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                            >
                                <option value="easy">基础</option>
                                <option value="medium">中等</option>
                                <option value="hard">困难</option>
                            </select>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            试卷类型 *
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500"
                                value={formData.paperType}
                                onChange={(e) => setFormData({ ...formData, paperType: e.target.value })}
                            >
                                <option value="unit">单元测试</option>
                                <option value="midterm">期中考试</option>
                                <option value="final">期末考试</option>
                                <option value="mock">模拟考试</option>
                            </select>
                        </label>
                    </div>
                </div>

                {/* 题目数量和关联 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            题目数量 *
                            <input
                                type="number"
                                min="10"
                                max="50"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500"
                                value={formData.questionCount}
                                onChange={(e) => setFormData({ ...formData, questionCount: Number(e.target.value) })}
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            关联班级
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500"
                                value={formData.associatedClass}
                                onChange={(e) => setFormData({ ...formData, associatedClass: e.target.value })}
                            >
                                <option value="">请选择班级</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                {/* 附加选项 */}
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.includeAnswer}
                            onChange={(e) => setFormData({ ...formData, includeAnswer: e.target.checked })}
                            className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        包含参考答案
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.includeAnalysis}
                            onChange={(e) => setFormData({ ...formData, includeAnalysis: e.target.checked })}
                            className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        包含题目解析
                    </label>
                </div>

                {/* 提交按钮 */}
                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                    >
                        <AcademicCapIcon className="w-5 h-5" />
                        立即生成试卷
                    </button>
                </div>
            </form>
        </div>
    );
}
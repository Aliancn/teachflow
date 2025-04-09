"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExerciseUpload() {
    const [formData, setFormData] = useState({
        subject: '数学',
        title: '',
        knowledgePoints: '',
        difficulty: '简单',
        stage: '课前预习',
        type: '选择题',
        content: '',
        answer: '',
        image: null as File | null
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        form.append('data', JSON.stringify({
            ...formData,
            knowledgePoints: formData.knowledgePoints.split(' ')
        }));
        if (formData.image) {
            form.append('image', formData.image);
        }

        try {
            const res = await fetch('/api/exercise', {
                method: 'POST',
                body: form
            });

            if (res.ok) {
                alert('习题上传成功！');
                router.push('/home/dashboard/exercise');
            }
        } catch (error) {
            console.error('上传失败:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">上传新习题</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 各表单字段 */}
                <div>
                    <label className="block mb-2">学科</label>
                    <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option>数学</option>
                        <option>英语</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2">标题</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border rounded"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block mb-2">知识点（空格分隔）</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border rounded"
                        value={formData.knowledgePoints}
                        onChange={(e) => setFormData({ ...formData, knowledgePoints: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block mb-2">难度</label>
                    <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option>简单</option>
                        <option>中等</option>
                        <option>困难</option>
                        <option>竞赛</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2">阶段</label>
                    <select
                        value={formData.stage}
                        onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option>课前预习</option>
                        <option>承前启后</option>
                        <option>随堂检测</option>
                        <option>复习巩固</option>
                        <option>竞赛</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2">题型</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option>选择题</option>
                        <option>填空题</option>
                        <option>解答题</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-2">题目内容</label>
                    <textarea
                        required
                        rows={4}
                        className="w-full p-2 border rounded"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block mb-2">答案</label>
                    <textarea
                        required
                        rows={2}
                        className="w-full p-2 border rounded"
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block mb-2">题目图片</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
                >
                    提交习题
                </button>
            </form>
        </div>
    );
}
"use client";
import { Card } from '@/components/ui/Card';
export default function ExercisePage() {
  const problems = [
    { id: 1, title: '三角函数基础题', difficulty: '中等', type: '选择题' },
    { id: 2, title: '向量运算应用题', difficulty: '困难', type: '解答题' },
    { id: 3, title: '概率统计练习题', difficulty: '简单', type: '填空题' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">习题推荐</h1>
      <div className="grid gap-4">
        {problems.map(problem => (
          <Card key={problem.id}>
            <div className="p-4">
              <h3 className="font-medium">{problem.title}</h3>
              <div className="flex gap-2 mt-2 text-sm text-gray-600">
                <span>{problem.type}</span>
                <span>•</span>
                <span>{problem.difficulty}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
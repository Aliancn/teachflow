"use client";
import { Card } from '@/components/ui/Card';
import { useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ExercisePage() {
  const searchParams = useSearchParams();

  // Helper function to parse JSON or fallback to array
  const parseJSON = (data: string | null) => {
    try {
      const parsedData = JSON.parse(data || '[]');
      return Array.isArray(parsedData)
        ? parsedData.sort((a, b) => b.errorRate - a.errorRate) // 按错误率降序排序
        : [];
    } catch {
      return data
        ? data
            .split(',')
            .map(item => ({ name: item, errorRate: 0 }))
            .sort((a, b) => b.errorRate - a.errorRate) // 按错误率降序排序
        : [];
    }
  };

  const weakKnowledgePoints = parseJSON(searchParams.get('weakKnowledgePoints'));
  const weakQuestionTypes = parseJSON(searchParams.get('weakQuestionTypes'));

  const problems = [
    { id: 1, title: '三角函数基础题', difficulty: '中等', type: '选择题', knowledgePoint: '函数' },
    { id: 2, title: '向量运算应用题', difficulty: '困难', type: '解答题', knowledgePoint: '几何' },
    { id: 3, title: '概率统计练习题', difficulty: '简单', type: '填空题', knowledgePoint: '统计' },
    { id: 4, title: '一元二次方程求解', difficulty: '中等', type: '解答题', knowledgePoint: '代数' },
    { id: 5, title: '正态分布概率计算', difficulty: '困难', type: '选择题', knowledgePoint: '概率' },
    { id: 6, title: '平面几何角度计算', difficulty: '简单', type: '填空题', knowledgePoint: '几何' },
    { id: 7, title: '函数图像与性质', difficulty: '中等', type: '选择题', knowledgePoint: '函数' },
    { id: 8, title: '条件概率问题', difficulty: '困难', type: '解答题', knowledgePoint: '概率' }
  ];

  type Problem = typeof problems[number];
  const getRandomProblems = (problems: Problem[]) => {
    const shuffled = [...problems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const isFromAnalysis = searchParams.get('from') === 'analysis';
  const displayedProblems = isFromAnalysis ? getRandomProblems(problems) : problems;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">习题推荐</h1>

      {/* 知识点和题型错误率 */}
      <div className="flex gap-6 mb-6">
        {weakKnowledgePoints.length > 0 && (
          <Card className="flex-1">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">薄弱知识点</h2>
              <p className="text-sm text-gray-500 mb-4">错误率</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={weakKnowledgePoints}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="errorRate" fill="#F87171" barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {weakQuestionTypes.length > 0 && (
          <Card className="flex-1">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">薄弱题型</h2>
              <p className="text-sm text-gray-500 mb-4">错误率</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={weakQuestionTypes}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="errorRate" fill="#60A5FA" barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* 推荐习题标题 */}
      <h2 className="text-2xl font-semibold mb-4">推荐习题</h2>

      {/* 推荐习题列表 */}
      <div className="grid gap-4">
        {displayedProblems.map(problem => (
          <Card key={problem.id}>
            <div className="p-4">
              <h3 className="font-medium">{problem.title}</h3>
              <div className="flex gap-2 mt-2 text-sm text-gray-600">
                <span>{problem.type}</span>
                <span>•</span>
                <span>{problem.difficulty}</span>
                <span>•</span>
                <span>{problem.knowledgePoint}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
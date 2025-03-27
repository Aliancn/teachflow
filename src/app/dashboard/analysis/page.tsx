"use client";
import { Card } from '@/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalysisPage() {
  const scoreData = [
    { month: '1月', score: 65 },
    { month: '2月', score: 75 },
    { month: '3月', score: 82 },
    { month: '4月', score: 78 },
    { month: '5月', score: 85 },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">学情分析</h1>
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">数学成绩趋势</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={scoreData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis
                dataKey="month"
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                tick={{ fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: '#4F46E5', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
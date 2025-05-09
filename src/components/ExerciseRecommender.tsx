"use client";
import { useRouter } from "next/navigation";

interface ErrorRate {
  topic: string;
  errorRate: number;
}

interface QuestionTypeErrorRate {
  type: string;
  errorRate: number;
}

interface Student {
  errorRates: ErrorRate[];
  questionTypeErrorRates: QuestionTypeErrorRate[];
}

interface ExerciseRecommenderProps {
  student: Student;
  subject: string;
}

// 计算两个学生之间的余弦相似度
function calculateCosineSimilarity(student1: Student, student2: Student): number {
  // 合并错误率特征
  const features1 = [
    ...student1.errorRates.map(e => e.errorRate),
    ...student1.questionTypeErrorRates.map(e => e.errorRate)
  ];
  const features2 = [
    ...student2.errorRates.map(e => e.errorRate),
    ...student2.questionTypeErrorRates.map(e => e.errorRate)
  ];

  // 计算点积
  const dotProduct = features1.reduce((sum, val, i) => sum + val * features2[i], 0);
  
  // 计算向量模长
  const magnitude1 = Math.sqrt(features1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(features2.reduce((sum, val) => sum + val * val, 0));
  
  return dotProduct / (magnitude1 * magnitude2);
}

// 找出最相似的知识点和题型
function findRecommendations(student: Student, similarStudents: Student[]): {
  knowledgePoint: string;
  questionType: string;
} {
  // 统计相似学生中错误率最高的知识点和题型
  const knowledgePointScores = new Map<string, number>();
  const questionTypeScores = new Map<string, number>();

  similarStudents.forEach(similarStudent => {
    // 累加知识点错误率
    similarStudent.errorRates.forEach(error => {
      const currentScore = knowledgePointScores.get(error.topic) || 0;
      knowledgePointScores.set(error.topic, currentScore + error.errorRate);
    });

    // 累加题型错误率
    similarStudent.questionTypeErrorRates.forEach(error => {
      const currentScore = questionTypeScores.get(error.type) || 0;
      questionTypeScores.set(error.type, currentScore + error.errorRate);
    });
  });

  // 找出累计错误率最高的知识点和题型
  let maxKnowledgePoint = { topic: '', score: 0 };
  knowledgePointScores.forEach((score, topic) => {
    if (score > maxKnowledgePoint.score) {
      maxKnowledgePoint = { topic, score };
    }
  });

  let maxQuestionType = { type: '', score: 0 };
  questionTypeScores.forEach((score, type) => {
    if (score > maxQuestionType.score) {
      maxQuestionType = { type, score };
    }
  });

  return {
    knowledgePoint: maxKnowledgePoint.topic,
    questionType: maxQuestionType.type
  };
}

export function ExerciseRecommender({ student, subject }: ExerciseRecommenderProps) {
  const router = useRouter();

  const handleExerciseRecommend = () => {
    // 模拟其他学生数据（实际应从API获取）
    const otherStudents: Student[] = [
      {
        errorRates: [
          { topic: "解析几何", errorRate: 15 },
          { topic: "集合", errorRate: 45 },
          { topic: "三角函数", errorRate: 30 },
          { topic: "概率与统计", errorRate: 25 }
        ],
        questionTypeErrorRates: [
          { type: "选择题", errorRate: 20 },
          { type: "多选题", errorRate: 35 },
          { type: "填空题", errorRate: 40 },
          { type: "解答题", errorRate: 45 }
        ]
      },
      {
        errorRates: [
          { topic: "解析几何", errorRate: 35 },
          { topic: "集合", errorRate: 28 },
          { topic: "三角函数", errorRate: 42 },
          { topic: "概率与统计", errorRate: 38 }
        ],
        questionTypeErrorRates: [
          { type: "选择题", errorRate: 25 },
          { type: "多选题", errorRate: 38 },
          { type: "填空题", errorRate: 45 },
          { type: "解答题", errorRate: 52 }
        ]
      },
      {
        errorRates: [
          { topic: "解析几何", errorRate: 42 },
          { topic: "集合", errorRate: 35 },
          { topic: "三角函数", errorRate: 48 },
          { topic: "概率与统计", errorRate: 45 }
        ],
        questionTypeErrorRates: [
          { type: "选择题", errorRate: 32 },
          { type: "多选题", errorRate: 45 },
          { type: "填空题", errorRate: 52 },
          { type: "解答题", errorRate: 58 }
        ]
      },
      {
        errorRates: [
          { topic: "解析几何", errorRate: 12 },
          { topic: "集合", errorRate: 18 },
          { topic: "三角函数", errorRate: 22 },
          { topic: "概率与统计", errorRate: 15 }
        ],
        questionTypeErrorRates: [
          { type: "选择题", errorRate: 8 },
          { type: "多选题", errorRate: 15 },
          { type: "填空题", errorRate: 25 },
          { type: "解答题", errorRate: 30 }
        ]
      },
      {
        errorRates: [
          { topic: "解析几何", errorRate: 28 },
          { topic: "集合", errorRate: 32 },
          { topic: "三角函数", errorRate: 38 },
          { topic: "概率与统计", errorRate: 35 }
        ],
        questionTypeErrorRates: [
          { type: "选择题", errorRate: 22 },
          { type: "多选题", errorRate: 35 },
          { type: "填空题", errorRate: 42 },
          { type: "解答题", errorRate: 48 }
        ]
      }
    ];

    // 计算与每个学生的相似度
    const similarities = otherStudents.map(other => ({
      student: other,
      similarity: calculateCosineSimilarity(student, other)
    }));

    // 选择相似度最高的K个学生（这里K=3）
    const K = 3;
    const mostSimilarStudents = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, K)
      .map(s => s.student);

    // 基于相似学生推荐知识点和题型
    const recommendation = findRecommendations(student, mostSimilarStudents);

    // 构建查询参数
    const queryParams = new URLSearchParams({
      from: 'analysis',
      subject: subject,
      knowledgePoint: recommendation.knowledgePoint,
      type: recommendation.questionType,
    });

    // 跳转到习题页面
    router.push(`/home/dashboard/exercise?${queryParams.toString()}`);
  };

  return (
    <button
      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      onClick={handleExerciseRecommend}
    >
      智能习题推荐
    </button>
  );
}
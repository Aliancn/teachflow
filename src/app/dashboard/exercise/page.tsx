"use client";
import { Card } from "@/components/ui/Card";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ExercisePage() {
  const searchParams = useSearchParams();
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [knowledgePoints, setKnowledgePoints] = useState<string[]>([]); // 动态知识点
  const [subjects, setSubjects] = useState<string[]>([]); // 动态学科
  const [types, setTypes] = useState<string[]>([]); // 动态题型
  const [difficulties, setDifficulties] = useState<string[]>([]); // 动态难度
  const [stages, setStages] = useState<string[]>([]); // 动态阶段
  const [selectedFilters, setSelectedFilters] = useState<{
    subject: string[];
    type: string[];
    difficulty: string[];
    knowledgePoint: string[];
    stage: string[];
  }>({
    subject: [],
    type: [],
    difficulty: [],
    knowledgePoint: [],
    stage: [],
  });
  const [activeFilter, setActiveFilter] = useState<keyof typeof selectedFilters | null>(null); // 当前激活的筛选类型
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const itemsPerPage = 7; // 每页显示的题目数量

  // 获取 JSON 数据
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const [mathResponse, englishResponse] = await Promise.all([
          fetch("/mathProblems.json"),
          fetch("/englishProblems.json"),
        ]);
        const [mathData, englishData] = await Promise.all([
          mathResponse.json(),
          englishResponse.json(),
        ]);

        // 合并两个数据集
        const combinedData = [...mathData, ...englishData];

        const formattedProblems = combinedData.map((problem: any) => ({
          title: problem["标题"],
          subject: problem["学科"],
          knowledgePoint: problem["知识点"], // 支持多个知识点（数组）
          difficulty: problem["难度"],
          stage: problem["阶段"],
          type: problem["题型"],
          content: problem["内容"],
          answer: problem["答案"],
        }));
        setProblems(formattedProblems);

        // 动态提取属性值
        const uniqueSubjects = Array.from(new Set(combinedData.map((problem: any) => problem["学科"])));
        const uniqueTypes = Array.from(new Set(combinedData.map((problem: any) => problem["题型"])));
        const uniqueDifficulties = Array.from(new Set(combinedData.map((problem: any) => problem["难度"])));
        const uniqueStages = Array.from(new Set(combinedData.map((problem: any) => problem["阶段"])));
        const uniqueKnowledgePoints = Array.from(
          new Set(combinedData.flatMap((problem: any) => problem["知识点"])) // 展平知识点数组
        );

        // 设置动态属性值
        setSubjects(uniqueSubjects);
        setTypes(uniqueTypes);
        setDifficulties(uniqueDifficulties);
        setStages(uniqueStages);
        setKnowledgePoints(uniqueKnowledgePoints as string[]);
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    };

    fetchProblems();
  }, []);

  // 更新筛选条件
  const updateFilter = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  // 根据筛选条件过滤题目
  const filteredProblems = problems.filter(problem => {
    return (
      (selectedFilters.subject.length === 0 || selectedFilters.subject.includes(problem.subject)) &&
      (selectedFilters.type.length === 0 || selectedFilters.type.includes(problem.type)) &&
      (selectedFilters.difficulty.length === 0 || selectedFilters.difficulty.includes(problem.difficulty)) &&
      (selectedFilters.knowledgePoint.length === 0 ||
        selectedFilters.knowledgePoint.some(knowledge => problem.knowledgePoint.includes(knowledge))) && // 检查知识点是否匹配
      (selectedFilters.stage.length === 0 || selectedFilters.stage.includes(problem.stage))
    );
  });

  const displayedProblems = searchParams.get("from") === "analysis" ? filteredProblems.slice(0, 3) : filteredProblems;

  // 计算分页后的题目
  const totalPages = Math.ceil(displayedProblems.length / itemsPerPage);
  const paginatedProblems = displayedProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 翻页处理函数
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">习题推荐</h1>

      {/* 智能推荐 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">智能推荐</h2>
        <div className="flex flex-col gap-4">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="请输入提示词，让AI为您推荐习题..."
            rows={3}
          ></textarea>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            智能习题推荐
          </button>
        </div>
      </div>

      {/* 筛选标签组 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">习题筛选</h2>
        <div className="flex gap-4">
          <span className="font-medium self-center">筛选条件：</span>
          {/* 筛选按钮 */}
          {[
            { label: "学科", key: "subject" as keyof typeof selectedFilters, options: subjects },
            { label: "题型", key: "type" as keyof typeof selectedFilters, options: types },
            { label: "难度", key: "difficulty", options: difficulties },
            { label: "知识点", key: "knowledgePoint" as keyof typeof selectedFilters, options: knowledgePoints },
            { label: "阶段", key: "stage" as keyof typeof selectedFilters, options: stages },
          ].map(filter => (
            <button
              key={filter.key}
              className={`px-4 py-2 rounded ${activeFilter === filter.key ? "bg-blue-700 text-white " : "bg-gray-200"}`}
              onClick={() => setActiveFilter(activeFilter === filter.key ? null : filter.key as keyof typeof selectedFilters)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* 筛选选项 */}
        {activeFilter && (
          <div className="mt-4 p-4 rounded bg-gray-100">
            {[
              { label: "学科", key: "subject", options: subjects },
              { label: "题型", key: "type", options: types },
              { label: "难度", key: "difficulty", options: difficulties },
              { label: "知识点", key: "knowledgePoint", options: knowledgePoints },
              { label: "阶段", key: "stage", options: stages },
            ]
              .find(filter => filter.key === activeFilter)
              ?.options.map(option => (
                <label key={option} className="block">
                  <input
                    type="checkbox"
                    checked={activeFilter ? selectedFilters[activeFilter].includes(option) : false}
                    onChange={() => updateFilter(activeFilter, option)}
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
          </div>
        )}
      </div>

      {/* 题目卡片 */}
      <div className="grid gap-4">
        {paginatedProblems.map((problem, index) => (
          <Card
            key={index}
            onClick={() => setSelectedProblem(index === selectedProblem ? null : index)}
            className="cursor-pointer"
          >
            <div className="p-4">
              <h3 className="font-medium">{problem.title || problem.content.slice(0, 50)}</h3>
              <div className="flex gap-2 mt-2 text-sm text-gray-600">
                <span>{problem.type}</span>
                <span>•</span>
                <span>{problem.difficulty}</span>
                <span>•</span>
                <span>{problem.knowledgePoint.join(", ")}</span> {/* 显示多个知识点 */}
                <span>•</span>
                <span>{problem.stage}</span>
              </div>
              <div className="mt-4 text-gray-800">
                {selectedProblem === index ? (
                  <>
                    <ReactMarkdown>{problem.content}</ReactMarkdown>
                    <div className="mt-2 font-semibold text-blue-700">
                      答案：{problem.answer}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600">{problem.content.slice(0, 50)}...</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 分页控件 */}
      <div className="flex items-center justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          上一页
        </button>
        <div>
          第{" "}
          <label className="sr-only" htmlFor="page-input">跳转到页码</label>
          <input
            id="page-input"
            type="number"
            value={currentPage}
            onChange={e => goToPage(Number(e.target.value))}
            className="w-12 text-center border rounded"
            min={1}
            max={totalPages}
            placeholder="页码"
          />{" "}
          页，共 {totalPages} 页
        </div>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一页
        </button>
      </div>
    </div>
  );
}

"use client";
/** @jsxImportSource react */
import { Card } from "@/components/ui/Card";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function ExercisePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [knowledgePoints, setKnowledgePoints] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [stages, setStages] = useState<string[]>([]);
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
  const itemsPerPage = 8; // 每页显示的题目数量

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
        console.log(formattedProblems);

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

  // 题目预览阶段
  const getSafeMarkdownPreview = (markdown: string, length: number) => {
    let truncated = markdown.slice(0, length);
  
    // 确保数学公式不会被截断
    const dollarMatches = truncated.match(/\$/g);
    if (dollarMatches && dollarMatches.length % 2 !== 0) {
      // 如果 `$` 是奇数个，说明公式被截断，去掉最后一个 `$`
      truncated = truncated.slice(0, truncated.lastIndexOf("$"));
    }
    return truncated + "...";
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      {/* 如果从 plan 页面跳转而来，显示返回按钮 */}
      {searchParams.get("from") === "plan" && (
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => router.push("/home/plan")}
        >
          返回教学计划
        </button>
      )}

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
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            智能习题推荐
          </button>
        </div>
      </div>

      {/* 筛选标签组 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">习题筛选</h2>
        <div className="flex flex-wrap gap-4">
          <span className="font-medium self-center">筛选条件：</span>
          {/* 筛选按钮 */}
          {[
            { label: "学科", key: "subject" as keyof typeof selectedFilters, options: subjects },
            { label: "题型", key: "type" as keyof typeof selectedFilters, options: types },
            { label: "难度", key: "difficulty", options: difficulties },
            { label: "知识点", key: "knowledgePoint" as keyof typeof selectedFilters, options: knowledgePoints },
            { label: "阶段", key: "stage", options: stages },
          ].map(filter => (
            <button
              key={filter.key}
              className={`px-4 py-2 rounded transition-all cursor-pointer ${activeFilter === filter.key
                  ? "bg-indigo-600 text-white border border-indigo-700 shadow-md"
                  : "bg-gray-200 hover:bg-indigo-100 hover:text-indigo-700"
                }`}
              onClick={() => setActiveFilter(activeFilter === filter.key ? null : filter.key as keyof typeof selectedFilters)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* 已选择的筛选标签 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(selectedFilters).flatMap(([key, values]) =>
            values.map(value => (
              <span
                key={`${key}-${value}`}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-300"
                onClick={() => updateFilter(key as keyof typeof selectedFilters, value)}
              >
                {value} ✕
              </span>
            ))
          )}
        </div>

        {/* 筛选选项 */}
        {activeFilter && (
          <div
            className="mt-4 p-4 rounded bg-gray-100 relative"
            style={{ position: "relative" }}
          >
            {/* 关闭按钮 */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setActiveFilter(null)}
            >
              ✕
            </button>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {[
                { label: "学科", key: "subject", options: subjects },
                { label: "题型", key: "type", options: types },
                { label: "难度", key: "difficulty", options: difficulties },
                { label: "知识点", key: "knowledgePoint", options: knowledgePoints },
                { label: "阶段", key: "stage", options: stages },
              ]
                .find(filter => filter.key === activeFilter)
                ?.options.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilter ? selectedFilters[activeFilter].includes(option) : false}
                      onChange={() => updateFilter(activeFilter, option)}
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* 题目卡片 */}
      <div className="grid grid-cols-2 gap-4">
        {paginatedProblems.map((problem, index) => (
          <Card
            key={index}
            onClick={(event) => {
              // 检查点击事件的目标是否是卡片的内容区域
              const target = event.target as HTMLElement;
              if (target.tagName === "BUTTON" || target.tagName === "INPUT" || target.closest("button")) {
                // 如果点击的是按钮或输入框，阻止收回逻辑
                return;
              }
              if (window.getSelection()?.toString()) {
                // 如果用户正在选择文本，阻止收回逻辑
                return;
              }
              setSelectedProblem(index === selectedProblem ? null : index);
            }}
            className="cursor-pointer"
            padding="xs"
          >
            <div className="p-4">
              <h3 className="font-medium text-base">{problem.title || problem.content.slice(0, 50)}</h3>
              <div className="flex flex-wrap gap-1 mt-2 text-sm text-gray-600">
                <span>{problem.type}</span>
                <span>•</span>
                <span>{problem.difficulty}</span>
                <span>•</span>
                <span>{problem.knowledgePoint.join(", ")}</span>
              </div>
              <div className="mt-2 text-gray-800 text-base">
                {selectedProblem === index ? (
                  <>
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                      }}
                    >
                      {problem.content}
                    </ReactMarkdown>
                    <div className="mt-2 font-semibold text-indigo-700">
                      答案：{problem.answer}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      {searchParams.get("from") === "plan" && (
                        <button
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          onClick={(event) => {
                            event.stopPropagation();

                            // 获取当前题目信息
                            const currentProblem = problem;

                            // 从 localStorage 中获取已有的相关练习
                            const storedExercises = localStorage.getItem("relatedExercises");
                            const exercises = storedExercises ? JSON.parse(storedExercises) : [];

                            // 添加当前题目到相关练习
                            exercises.push(currentProblem);

                            // 更新 localStorage
                            localStorage.setItem("relatedExercises", JSON.stringify(exercises));

                            // 提示用户
                            alert("已添加至教学计划！");
                          }}
                        >
                          添加至教学计划
                        </button>
                      )}
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        onClick={(event) => {
                          event.stopPropagation();
                          console.log("举一反三功能待实现");
                        }}
                      >
                        举一反三
                      </button>
                    </div>
                  </>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 inline" {...props} />, // 让 Markdown 渲染成内联
                    }}
                  >
                    {getSafeMarkdownPreview(problem.content, 50)}
                  </ReactMarkdown>
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

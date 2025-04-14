"use client";
/** @jsxImportSource react */
import { Card } from "@/components/ui/Card";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Suspense } from 'react'

export default function ExercisePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExerciseContent />
    </Suspense>
  )
}

function ExerciseContent() {
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
        const responses = await Promise.all([
          fetch("/papers/2019 年普通高等学校招生全国统一考试理科数学（全国Ⅰ卷）/2019 年普通高等学校招生全国统一考试理科数学（全国Ⅰ卷）_all.json"),
          fetch("/papers/2019年全国II卷高考数学（文科）试题及答案/2019年全国II卷高考数学（文科）试题及答案_all.json"),
          fetch("/papers/2022年全国新高考I卷数学试题（解析版）/2022年全国新高考I卷数学试题（解析版）_all.json"),
          fetch("/papers/2023年全国甲卷理科数学/2023年全国甲卷理科数学_all.json"),
          fetch("/papers/2024全国高新高考I卷数学试题（解析版）/2024全国高新高考I卷数学试题（解析版）_all.json"),
          fetch("/papers/2024年湖北省武汉市中考英语真题（解析版）/2024年湖北省武汉市中考英语真题（解析版）_all.json")
        ]);

        const jsonData = await Promise.all(responses.map(response => response.json()));

        // 合并所有数据集
        const formattedProblems = jsonData.flatMap((problems: any, fileIndex: number) =>
          problems.map((problem: any, problemIndex: number) => ({
            id: `${fileIndex}-${problemIndex}`, // 添加唯一标识
            title: problem["标题"],
            subject: problem["学科"],
            knowledgePoint: problem["知识点"],
            difficulty: Array.isArray(problem["难度"]) ? problem["难度"][0] : problem["难度"],
            stage: Array.isArray(problem["阶段"]) ? problem["阶段"][0] : problem["阶段"],
            type: Array.isArray(problem["题型"]) ? problem["题型"][0] : problem["题型"],
            contentType: Array.isArray(problem["类型"]) ? problem["类型"][0] : problem["类型"],
            content: problem["类型"]?.includes("图片")
              ? problem["内容"].map((url: string) => `/papers/${url}`)
              : `/papers/${problem["内容"]}`,
            answer: problem["类型"]?.includes("图片")
              ? problem["答案"].map((url: string) => `/papers/${url}`)
              : `/papers/${problem["答案"]}`,
          }))
        );
        setProblems(formattedProblems);

        // 从格式化后的数据中提取唯一值
        const uniqueSubjects = Array.from(new Set(formattedProblems.map(p => p.subject)));
        const uniqueTypes = Array.from(new Set(formattedProblems.map(p => p.type)));
        const uniqueDifficulties = Array.from(new Set(formattedProblems.map(p => p.difficulty)));
        const uniqueStages = Array.from(new Set(formattedProblems.map(p => p.stage)));
        const uniqueKnowledgePoints = Array.from(
          new Set(formattedProblems.flatMap(p =>
            Array.isArray(p.knowledgePoint) ? p.knowledgePoint : [p.knowledgePoint]
          ))
        );

        setSubjects(uniqueSubjects.filter(Boolean));
        setTypes(uniqueTypes.filter(Boolean));
        setDifficulties(uniqueDifficulties.filter(Boolean));
        setStages(uniqueStages.filter(Boolean));
        setKnowledgePoints(uniqueKnowledgePoints.filter(Boolean));
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

  // 获取指定学科的知识点
  const getKnowledgePointsBySubject = (selectedSubjects: string[]) => {
    if (selectedSubjects.length === 0) {
      return knowledgePoints; // 如果没有选择学科，返回所有知识点
    }
    // 返回所选学科对应的所有知识点
    return Array.from(new Set(
      problems
        .filter(p => selectedSubjects.includes(p.subject))
        .flatMap(p => Array.isArray(p.knowledgePoint) ? p.knowledgePoint : [p.knowledgePoint])
    )).filter(Boolean);
  };

  // 根据筛选条件过滤题目
  const filteredProblems = problems.filter(problem => {
    const knowledgePoints = Array.isArray(problem.knowledgePoint)
      ? problem.knowledgePoint
      : [problem.knowledgePoint];

    return (
      (selectedFilters.subject.length === 0 || selectedFilters.subject.includes(problem.subject)) &&
      (selectedFilters.type.length === 0 || selectedFilters.type.includes(problem.type)) &&
      (selectedFilters.difficulty.length === 0 || selectedFilters.difficulty.includes(problem.difficulty)) &&
      (selectedFilters.knowledgePoint.length === 0 ||
        selectedFilters.knowledgePoint.some(knowledge => knowledgePoints.includes(knowledge))) &&
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

  const handleProblemClick = () => {
    setSelectedFilters({
      ...selectedFilters,
      subject: ['数学'],
      type: ['选择题'],
      knowledgePoint: ['集合', '集合的运算'],
      difficulty: [],
      stage: []
    });
  }

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
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={handleProblemClick}>
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
          <div className="mt-4 p-4 rounded bg-gray-100 relative" style={{ position: "relative" }}>
            {/* 关闭按钮 */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setActiveFilter(null)}
            >
              ✕
            </button>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {(() => {
                const filterConfig = [
                  { label: "学科", key: "subject", options: subjects },
                  { label: "题型", key: "type", options: types },
                  { label: "难度", key: "difficulty", options: difficulties },
                  {
                    label: "知识点",
                    key: "knowledgePoint",
                    options: activeFilter === "knowledgePoint"
                      ? getKnowledgePointsBySubject(selectedFilters.subject)
                      : knowledgePoints
                  },
                  { label: "阶段", key: "stage", options: stages },
                ].find(filter => filter.key === activeFilter);

                return filterConfig?.options.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={activeFilter ? selectedFilters[activeFilter].includes(option) : false}
                      onChange={() => updateFilter(activeFilter, option)}
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      {/* 题目卡片 */}
      <div className="grid grid-cols-2 gap-4">
        {paginatedProblems.map((problem) => (
          <Card
            key={problem.id}  // 使用唯一标识作为 key
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
              setSelectedProblem(problem.id === selectedProblem ? null : problem.id);
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
              {/* 在题目卡片渲染部分修改内容渲染逻辑 */}
              <div className="mt-2 text-gray-800 text-base">
                {selectedProblem === problem.id ? (
                  <>
                    {problem.contentType === "文本" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                        }}
                      >
                        {problem.content}
                      </ReactMarkdown>
                    ) : (
                      <div className="space-y-4 overflow-auto">
                        {Array.isArray(problem.content) ? (
                          problem.content.map((imgUrl: string, imgIndex: number) => (
                            <img
                              key={imgIndex}
                              src={imgUrl}
                              alt={`题目内容 ${imgIndex + 1}`}
                              className="rounded"
                            />
                          ))
                        ) : (
                          <img
                            src={problem.content}
                            alt="题目内容"
                            className="rounded"
                          />
                        )}
                      </div>
                    )}
                    <div className="mt-2 font-semibold text-indigo-700">
                      答案：
                      {problem.contentType === "文本" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {problem.answer}
                        </ReactMarkdown>
                      ) : (
                        <div className="space-y-4 mt-2 overflow-auto">
                          {Array.isArray(problem.answer) ? (
                            problem.answer.map((imgUrl: string, imgIndex: number) => (
                              <img
                                key={imgIndex}
                                src={imgUrl}
                                alt={`答案图片 ${imgIndex + 1}`}
                                className="rounded"
                              />
                            ))
                          ) : (
                            <img
                              src={problem.answer}
                              alt="题目答案"
                              className="rounded"
                            />
                          )}
                        </div>
                      )}
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
                  <>
                    {problem.contentType === "文本" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 inline" {...props} />,
                        }}
                      >
                        {getSafeMarkdownPreview(problem.content, 50)}
                      </ReactMarkdown>
                    ) : (
                      <div className="w-full h-48 overflow-hidden">
                        {Array.isArray(problem.content) ? (
                          <img
                            src={problem.content[0]}
                            alt="题目预览"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <img
                            src={problem.content}
                            alt="题目预览"
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                    )}
                  </>
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

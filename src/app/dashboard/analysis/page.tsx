"use client";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { FaRuler, FaCompass, FaFont, FaDna } from "react-icons/fa";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai"; // 引入图标
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"; // 引入 Recharts

export default function CourseSelectionPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // 示例数据
  const courseData = [
    {
      name: "数学",
      icon: (
        <>
          <FaRuler className="text-4xl text-blue-500" />{" "}
          <FaCompass className="text-4xl text-blue-500" />
        </>
      ), // 数学图标
      content: "这是数学课程的学情分析内容，包括学习进度、考试成绩等。",
      student: {
        name: "张三",
        avatar: "https://via.placeholder.com/50", // 示例头像 URL
        chapters: [
          { name: "1. 一元一次方程", completed: true, level: 1 },
          { name: "1.1 一元一次方程的定义", completed: true, level: 2 },
          { name: "1.2 一元一次方程的解法", completed: true, level: 2 },
          { name: "2. 二次函数", completed: false, level: 1 },
          { name: "2.1 二次函数的图像与性质", completed: true, level: 2 },
          { name: "2.2 二次函数的应用", completed: false, level: 2 },
        ],
        studyRecords: [
          { date: "2025-03-20", count: 3 },
          { date: "2025-03-21", count: 5 },
          { date: "2025-03-22", count: 2 },
          { date: "2025-03-23", count: 4 },
          { date: "2025-03-24", count: 6 },
        ],
        examScores: [
          { date: "2025-03-01", score: 85 },
          { date: "2025-03-15", score: 90 },
          { date: "2025-03-22", score: 78 },
          { date: "2025-03-29", score: 88 },
        ],
        errorRates: [
          { topic: "方程", errorRate: 20 },
          { topic: "函数", errorRate: 35 },
          { topic: "几何", errorRate: 65 },
          { topic: "概率", errorRate: 55 },
        ],
        questionTypeErrorRates: [
          { type: "选择", errorRate: 10 },
          { type: "填空", errorRate: 40 },
          { type: "判断", errorRate: 55 },
          { type: "应用", errorRate: 75 },
        ],
      },
    },
    {
      name: "英语",
      icon: <FaFont className="text-4xl text-green-500" />, // 英语图标
      content: "这是英语课程的学情分析内容，包括词汇量、阅读理解能力等。",
      student: {
        name: "李四",
        avatar: "https://via.placeholder.com/50", // 示例头像 URL
        chapters: [
          { name: "1. 基础词汇", completed: true, level: 1 },
          { name: "2. 阅读理解", completed: false, level: 1 },
          { name: "3. 写作技巧", completed: false, level: 1 },
        ],
      },
    },
    {
      name: "生物",
      icon: <FaDna className="text-4xl text-purple-500" />, // 生物图标
      content: "这是生物课程的学情分析内容，包括实验报告、知识点掌握情况等。",
      student: {
        name: "王五",
        avatar: "https://via.placeholder.com/50", 
        chapters: [
          { name: "1. 细胞结构", completed: true, level: 1 },
          { name: "2. 遗传与变异", completed: true, level: 1 },
          { name: "3. 生物实验", completed: false, level: 1 },
        ],
      },
    },
  ];

  // 查找选中课程的详细信息
  const selectedCourseData = courseData.find(
    (course) => course.name === selectedCourse
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 如果未选择课程，显示课程选择界面 */}
      {!selectedCourse && (
        <>
          <h1 className="text-3xl font-bold text-center mb-8">科目选择</h1>
          <div className="space-y-6">
            {courseData.map((course, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition flex items-center space-x-4 p-6"
                onClick={() => setSelectedCourse(course.name)}
              >
                <div>{course.icon}</div>
                <h2 className="text-xl font-bold">{course.name}</h2>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* 如果选择了课程，显示对应的学情分析内容 */}
      {selectedCourse && selectedCourseData && (
        <div className="mt-8 p-6 border rounded-lg shadow-md space-y-6">
          {/* 学生信息卡片 */}
          <Card className="flex items-center space-x-4 p-6">
            <img
              src={selectedCourseData.student?.avatar}
              alt="学生头像"
              className="w-12 h-12 rounded-full"
            />
            <h2 className="text-xl font-bold">{selectedCourseData.student?.name}</h2>
          </Card>

          {/* 章节任务点卡片 */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">章节任务点</h2>
            <ul className="space-y-2 text-gray-700">
              {selectedCourseData.student?.chapters.map((chapter, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center"
                  style={{
                    paddingLeft: chapter.level === 2 ? "1.5rem" : "0", // 根据等级缩进
                  }}
                >
                  <span
                    className={`${
                      chapter.level === 1
                        ? "text-lg font-bold"
                        : "text-base font-normal"
                    }`}
                  >
                    {chapter.name}
                  </span>
                  {chapter.completed ? (
                    <AiOutlineCheckCircle className="text-green-500" />
                  ) : (
                    <AiOutlineCloseCircle className="text-gray-400" />
                  )}
                </li>
              ))}
            </ul>
            {/* 完成进度统计 */}
            <p className="mt-4 text-lg font-bold text-gray-800">
              完成进度：{" "}
              {
                selectedCourseData.student?.chapters.filter(
                  (chapter) => chapter.completed
                ).length
              }
              /{selectedCourseData.student?.chapters.length}
            </p>
          </Card>

          {/* 在线学习次数卡片 */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">在线学习次数</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={selectedCourseData.student?.studyRecords}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4a90e2"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* 历次考试成绩卡片 */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">历次考试成绩</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={selectedCourseData.student?.examScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2ca02c"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* 知识点错误率卡片 */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">知识点错误率</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={selectedCourseData.student?.errorRates}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="topic" />
                <Tooltip />
                <Bar dataKey="errorRate" fill="#ff9999" barSize={15} /> {/* 修改颜色和柱体宽度 */}
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* 题型错误率卡片 */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">题型错误率</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={selectedCourseData.student?.questionTypeErrorRates}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="type" />
                <Tooltip />
                <Bar dataKey="errorRate" fill="#87CEEB" barSize={15} /> {/* 浅蓝色柱体 */}
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* 返回按钮 */}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setSelectedCourse(null)}
          >
            返回科目选择
          </button>
        </div>
      )}
    </div>
  );
}
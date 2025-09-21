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
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0); // 新增状态，用于记录当前选中的学生索引
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false); // 新增状态，用于控制下拉菜单的显示
  const [showOverallAnalysis, setShowOverallAnalysis] = useState<boolean>(false); // 新增状态，用于控制是否显示整体学情

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
      students: [
        {
          name: "张三",
          avatar: "https://i.pravatar.cc/50",
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
        {
          name: "小李",
          avatar: "https://i.pravatar.cc/50", // 示例头像 URL
          chapters: [
            { name: "1. 一元一次方程", completed: true, level: 1 },
            { name: "1.1 一元一次方程的定义", completed: true, level: 2 },
            { name: "1.2 一元一次方程的解法", completed: true, level: 2 },
            { name: "2. 二次函数", completed: true, level: 1 },
            { name: "2.1 二次函数的图像与性质", completed: true, level: 2 },
            { name: "2.2 二次函数的应用", completed: true, level: 2 },
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
      ],
    },
    {
      name: "英语",
      icon: <FaFont className="text-4xl text-green-500" />, // 英语图标
      content: "这是英语课程的学情分析内容，包括词汇量、阅读理解能力等。",
      students: [
        {
          name: "李四",
          avatar: "https://i.pravatar.cc/50",
          chapters: [
            { name: "1. 基础词汇", completed: true, level: 1 },
            { name: "2. 阅读理解", completed: false, level: 1 },
            { name: "3. 写作技巧", completed: true, level: 1 },
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
            { topic: "单词", errorRate: 20 },
            { topic: "语法", errorRate: 35 },
            { topic: "短语", errorRate: 65 },
            { topic: "理解", errorRate: 55 },
          ],
          questionTypeErrorRates: [
            { type: "完型", errorRate: 10 },
            { type: "续写", errorRate: 40 },
            { type: "阅读", errorRate: 55 },
            { type: "作文", errorRate: 75 },
          ],
        },
        {
          name: "小章",
          avatar: "https://i.pravatar.cc/50",
          chapters: [
            { name: "1. 基础词汇", completed: true, level: 1 },
            { name: "2. 阅读理解", completed: false, level: 1 },
            { name: "3. 写作技巧", completed: false, level: 1 },
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
            { topic: "单词", errorRate: 20 },
            { topic: "语法", errorRate: 35 },
            { topic: "短语", errorRate: 65 },
            { topic: "理解", errorRate: 55 },
          ],
          questionTypeErrorRates: [
            { type: "完型", errorRate: 10 },
            { type: "续写", errorRate: 40 },
            { type: "阅读", errorRate: 55 },
            { type: "作文", errorRate: 75 },
          ],
        },
      ],
    },
    {
      name: "生物",
      icon: <FaDna className="text-4xl text-purple-500" />, // 生物图标
      content: "这是生物课程的学情分析内容，包括实验报告、知识点掌握情况等。",
      students: [
        {
          name: "王五",
          avatar: "https://i.pravatar.cc/50",
          chapters: [
            { name: "1. 细胞结构", completed: true, level: 1 },
            { name: "2. 遗传与变异", completed: true, level: 1 },
            { name: "3. 生物实验", completed: true, level: 1 },
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
            { topic: "有氧呼吸", errorRate: 20 },
            { topic: "光合作用", errorRate: 35 },
            { topic: "遗传", errorRate: 65 },
            { topic: "稳态", errorRate: 55 },
          ],
          questionTypeErrorRates: [
            { type: "选择", errorRate: 10 },
            { type: "填空", errorRate: 40 },
            { type: "判断", errorRate: 55 },
            { type: "应用", errorRate: 75 },
          ],
        },
        {
          name: "小熊",
          avatar: "https://i.pravatar.cc/50",
          chapters: [
            { name: "1. 细胞结构", completed: true, level: 1 },
            { name: "2. 遗传与变异", completed: true, level: 1 },
            { name: "3. 生物实验", completed: false, level: 1 },
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
            { topic: "有氧呼吸", errorRate: 20 },
            { topic: "光合作用", errorRate: 35 },
            { topic: "遗传", errorRate: 65 },
            { topic: "稳态", errorRate: 55 },
          ],
          questionTypeErrorRates: [
            { type: "选择", errorRate: 10 },
            { type: "填空", errorRate: 40 },
            { type: "判断", errorRate: 55 },
            { type: "应用", errorRate: 75 },
          ],
        },
      ],
    },
  ];

  // 查找选中课程的详细信息
  const selectedCourseData = courseData.find(
    (course) => course.name === selectedCourse
  );

  const selectedStudent =
    selectedCourseData?.students && selectedCourseData.students[selectedStudentIndex];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 科目选择界面 */}
      {!selectedCourse && (
        <>
          <h1 className="text-3xl font-bold mb-8">科目选择</h1>
          {/* 科目选择界面 */}
          <div className="grid grid-cols-3 gap-6 mt-25">
            {courseData.map((course, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition flex flex-col items-center justify-between p-6 h-48 w-48 mx-auto"
                onClick={() => setSelectedCourse(course.name)}
              >
                <div className="flex-grow flex items-center justify-center">{course.icon}</div>
                <h2 className="text-lg font-bold text-center mt-4">{course.name}</h2>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* 如果选择了课程，显示对应的学情分析内容 */}
      {selectedCourse && selectedCourseData && (
        <div className="mt-8 p-6 border rounded-lg shadow-md space-y-6">
          {/* 添加标题 */}
          <h1 className="text-3xl font-bold mb-4">
            {selectedCourse}学情分析
          </h1>

          <div className="relative mb-4">
            {/* “个人学情”按钮 */}
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => {
                setDropdownVisible(!isDropdownVisible);
                setShowOverallAnalysis(false);
              }
              } // 点击切换列表的显示状态
            >
              个人学情
            </button>

            {/* 学生下拉列表 */}
            {isDropdownVisible && selectedCourseData.students?.length > 1 && (
              <div className="absolute left=0 mt-2 w-40 bg-white border rounded shadow-md">
                {selectedCourseData.students.map((student, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 cursor-pointer ${index === selectedStudentIndex ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                      }`}
                    onClick={() => {
                      setSelectedStudentIndex(index); // 更新选中的学生
                      setDropdownVisible(false); // 选择后关闭列表
                    }}
                  >
                    {student.name}
                  </div>
                ))}
              </div>
            )}

            {/* “整体学情”按钮 */}
            <button
              className="ml-8 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => {
                setShowOverallAnalysis(true); // 切换到整体学情
                setDropdownVisible(false); // 隐藏下拉菜单
              }}
            >
              整体学情
            </button>
          </div>

          {/* 整体学情卡片 */}
          {showOverallAnalysis && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">班级成员</h2>
              <p className="text-gray-600 mb-4">班级人数：{selectedCourseData.students.length}</p>
              <div className="flex flex-wrap gap-4">
                {selectedCourseData.students.map((student, index) => (
                  <span
                    key={index}
                    className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-500"
                    onClick={() => {
                      setSelectedStudentIndex(index); // 更新选中的学生索引
                      setShowOverallAnalysis(false); // 切换到个人学情视图
                    }}
                  >
                    {student.name}
                  </span>
                ))}
              </div>
            </Card>
          )}


          {/* 个人学情内容 */}
          {!showOverallAnalysis && selectedStudent && (
            <>
              {/* 学生信息卡片 */}
              {selectedStudent && (
                <Card className="flex items-center space-x-4 p-6">
                  <img
                    src={selectedStudent.avatar}
                    alt="学生头像"
                    className="w-12 h-12 rounded-full"
                  />
                  <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                </Card>
              )}

              {/* 章节任务点卡片 */}
              {selectedStudent && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">章节任务点</h2>
                  <ul className="space-y-2 text-gray-700">
                    {selectedStudent.chapters.map((chapter, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                        style={{
                          paddingLeft: chapter.level === 2 ? "1.5rem" : "0", // 根据等级缩进
                        }}
                      >
                        <span
                          className={`${chapter.level === 1
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
                  <p className="mt-4 text-lg font-bold text-gray-800">
                    完成进度：{" "}
                    {selectedStudent.chapters.filter((chapter) => chapter.completed).length}/
                    {selectedStudent.chapters.length}
                  </p>
                </Card>
              )}

              {/* 学习记录卡片 */}
              {selectedStudent && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">学习记录</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={selectedStudent.studyRecords}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* 历次考试成绩卡片 */}
              {selectedStudent && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">历次考试成绩</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={selectedStudent.examScores}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* 知识点错误率卡片 */}
              {selectedStudent && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">知识点错误率</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={selectedStudent.errorRates}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="topic" />
                      <Tooltip />
                      <Bar dataKey="errorRate" fill="#ff9999" barSize={15} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* 题型错误率卡片 */}
              {selectedStudent && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">题型错误率</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={selectedStudent.questionTypeErrorRates}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="type" />
                      <Tooltip />
                      <Bar dataKey="errorRate" fill="#87CEEB" barSize={15} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </>
          )}


          {/* 返回按钮 */}
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-600"
            onClick={() => setSelectedCourse(null)}
          >
            返回科目选择
          </button>
        </div>
      )}
    </div>
  );
}
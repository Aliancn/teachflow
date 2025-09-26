"use client";
import { useEffect, useState } from "react";
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

interface Chapter {
  name: string;
  completed: boolean;
  level: number;
}

interface StudyRecord {
  date: string;
  count: number;
}

interface ExamScore {
  date: string;
  score: number;
}

interface ErrorRate {
  topic: string;
  errorRate: number;
}

interface QuestionTypeErrorRate {
  type: string;
  errorRate: number;
}

interface Student {
  name: string;
  avatar: string;
  chapters: Chapter[];
  studyRecords: StudyRecord[];
  examScores: ExamScore[];
  errorRates: ErrorRate[];
  questionTypeErrorRates: QuestionTypeErrorRate[];
}

interface Course {
  name: string;
  icon: string;
  content: string;
  students: Student[];
}

export default function CourseSelectionPage() {
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [showOverallAnalysis, setShowOverallAnalysis] = useState<boolean>(false);

  // 加载 JSON 数据
  useEffect(() => {
    fetch("/courseData.json")
      .then((response) => response.json())
      .then((data) => setCourseData(data))
      .catch((error) => console.error("加载课程数据失败:", error));
  }, []);

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
          <div className="grid grid-cols-3 gap-6 mt-25">
            {courseData.map((course, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition flex flex-col items-center justify-between p-6 h-48 w-48 mx-auto"
                onClick={() => setSelectedCourse(course.name)}
              >
                <div className="flex-grow flex items-center justify-center">
                  {course.icon === "FaRuler,FaCompass" && (
                    <>
                      <FaRuler className="text-4xl text-blue-500" />
                      <FaCompass className="text-4xl text-blue-500" />
                    </>
                  )}
                  {course.icon === "FaFont" && (
                    <FaFont className="text-4xl text-green-500" />
                  )}{course.icon === "FaDna" && (
                    <FaDna className="text-4xl text-purple-500" />
                  )}
                </div>
                <h2 className="text-lg font-bold text-center mt-4">{course.name}</h2>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* 如果选择了课程，显示对应的学情分析内容 */}
      {selectedCourse && selectedCourseData && (
        <div className="mt-8 p-6  rounded-lg shadow-md space-y-6">
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
                {selectedCourseData?.students.map((student, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 cursor-pointer ${
                      index === selectedStudentIndex ? "bg-blue-600 text-white" : "hover:bg-gray-200"
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

          {/* 班级成员卡片 */}
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

          {/* 章节任务点整体完成进度卡片 */}
          {showOverallAnalysis && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">章节任务点</h2>
              <div className="text-lg text-gray-700">
                {(() => {
                  const totalCompletionRates = selectedCourseData.students.map((student) => {
                    const completedChapters = student.chapters.filter((chapter) => chapter.completed).length;
                    const totalChapters = student.chapters.length;
                    return completedChapters / totalChapters;
                  });

                  const averageCompletionRate =
                    totalCompletionRates.reduce((sum, rate) => sum + rate, 0) / totalCompletionRates.length;

                  return `平均完成率：${(averageCompletionRate * 100).toFixed(2)}%`;
                })()}
              </div>
            </Card>
          )}

          {/* 班级均分卡片 */}
          {showOverallAnalysis && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">班级均分</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={selectedCourseData.students[0].examScores.map((_, index) => {
                    const date = selectedCourseData.students[0].examScores[index].date;
                    const averageScore =
                      selectedCourseData.students.reduce((sum, student) => sum + student.examScores[index].score, 0) /
                      selectedCourseData.students.length;
                    return { date, averageScore: parseFloat(averageScore.toFixed(2)) };
                  })}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="averageScore" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* 班级平均知识点错误率卡片 */}
          {showOverallAnalysis && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">平均知识点错误率</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={selectedCourseData.students[0].errorRates.map((topic, index) => {
                    const averageErrorRate =
                      selectedCourseData.students.reduce(
                        (sum, student) => sum + student.errorRates[index].errorRate,
                        0
                      ) / selectedCourseData.students.length;
                    return { topic: topic.topic, averageErrorRate: parseFloat(averageErrorRate.toFixed(2)) };
                  })}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="topic" />
                  <Tooltip />
                  <Bar dataKey="averageErrorRate" fill="#ff9999" barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* 班级平均题型错误率卡片 */}
          {showOverallAnalysis && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">平均题型错误率</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={selectedCourseData.students[0].questionTypeErrorRates.map((type, index) => {
                    const averageErrorRate =
                      selectedCourseData.students.reduce(
                        (sum, student) => sum + student.questionTypeErrorRates[index].errorRate,
                        0
                      ) / selectedCourseData.students.length;
                    return { type: type.type, averageErrorRate: parseFloat(averageErrorRate.toFixed(2)) };
                  })}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="type" />
                  <Tooltip />
                  <Bar dataKey="averageErrorRate" fill="#87CEEB" barSize={15} />
                </BarChart>
              </ResponsiveContainer>
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
                  <h2 className="text-xl font-bold mb-4">在线学习次数记录</h2>
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
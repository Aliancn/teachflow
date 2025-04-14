"use client";
import { useState, useEffect } from "react";
import { usePlanStore } from '@/lib/stores/planStore';
import { ProfileCard } from '@/components/PlanCard/Profile';
import { ContentCard } from '@/components/PlanCard/ContentCard';
import { ResourceList } from '@/components/PlanCard/ResourceList';
import { Plus } from 'lucide-react';

export default function LessonPlanPage() {
    const { currentPlan, loadMockData } = usePlanStore();
    const [problems, setProblems] = useState<any[]>([]); // 初始习题数据
    const [addedExercises, setAddedExercises] = useState<any[]>([]); // 从 exercise 页面添加的习题

    useEffect(() => {
        loadMockData();

        // 加载习题数据
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

                const combinedData = [...mathData, ...englishData].map((problem: any) => ({
                    title: problem["标题"],
                    subject: problem["学科"],
                    knowledgePoint: problem["知识点"],
                    difficulty: problem["难度"],
                    type: problem["题型"],
                    content: problem["内容"],
                }));
                setProblems([]); // 修改这里，不再显示任何初始题目
            } catch (error) {
                console.error("加载习题数据失败:", error);
            }
        };

        fetchProblems();
        // 从 localStorage 中加载添加的习题
        const storedExercises = localStorage.getItem("relatedExercises");
        if (storedExercises) {
            setAddedExercises(JSON.parse(storedExercises));
        }
    }, []);

    return (
        <div>
            <div className="flex w-full h-screen overflow-hidden">
                <div className="relative mr-4 max-w-3xl px-8 py-10 bg-white overflow-hidden w-64 border-r border-gray-200 shadow-sm shadow-purple-100/50">
                    {/* 装饰元素 */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600"></div>
                    <div className="absolute top-3 left-3 w-12 h-12 rounded-full bg-purple-100 opacity-20"></div>
                    <div className="absolute bottom-3 right-3 w-16 h-16 rounded-full bg-purple-100 opacity-20"></div>

                    <div className="relative flex flex-col justify-between items-center mb-10">
                        <a href="#title" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
                            教学计划
                        </a>
                        <a href="#title" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
                            目录
                        </a>
                    </div>

                    <ul className="relative space-y-4">
                        <li className="group transition-all hover:translate-x-2">
                            <a
                                href="#goal"
                                className="flex items-center text-lg text-gray-800 hover:text-black hover:font-medium px-4 py-2 rounded-lg group-hover:bg-purple-50"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.querySelector('#goal')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <span className="w-3 h-3 bg-purple-500 rounded-full mr-4 group-[:hover]:w-4 group-[:hover]:h-4 transition-all"></span>
                                <span className="group-hover:font-semibold">教学目标</span>
                                <span className="ml-auto opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity">→</span>
                            </a>
                        </li>

                        <li className="group transition-all hover:translate-x-2">
                            <a
                                href="#syllabus"
                                className="flex items-center text-lg text-gray-800 hover:text-black hover:font-medium px-4 py-2 rounded-lg group-hover:bg-purple-50"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.querySelector('#syllabus')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <span className="w-3 h-3 bg-purple-500 rounded-full mr-4 group-[:hover]:w-4 group-[:hover]:h-4 transition-all"></span>
                                <span className="group-hover:font-semibold">教学大纲</span>
                                <span className="ml-auto opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity">→</span>
                            </a>
                        </li>

                        <li className="group transition-all hover:translate-x-2">
                            <a
                                href="#resource"
                                className="flex items-center text-lg text-gray-800 hover:text-black hover:font-medium px-4 py-2 rounded-lg group-hover:bg-purple-50"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.querySelector('#resource')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <span className="w-3 h-3 bg-purple-500 rounded-full mr-4 group-[:hover]:w-4 group-[:hover]:h-4 transition-all"></span>
                                <span className="group-hover:font-semibold">教学资源</span>
                                <span className="ml-auto opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity">→</span>
                            </a>
                        </li>

                        <li className="group transition-all hover:translate-x-2">
                            <a
                                href="#exercise"
                                className="flex items-center text-lg text-gray-800 hover:text-black hover:font-medium px-4 py-2 rounded-lg group-hover:bg-purple-50"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.querySelector('#exercise')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <span className="w-3 h-3 bg-purple-500 rounded-full mr-4 group-[:hover]:w-4 group-[:hover]:h-4 transition-all"></span>
                                <span className="group-hover:font-semibold">相关练习</span>
                                <span className="ml-auto opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity">→</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* 主内容区域 */}
                <div className="flex-1 overflow-y-auto mt-4">
                    <div className="prose max-w-4xl mx-auto">
                        <h1 id="title" className="text-3xl font-bold">教学计划</h1>
                        <ProfileCard
                            topic={currentPlan.title.topic}
                            subject={currentPlan.title.subject}
                            grade={currentPlan.title.grade}
                            className="my-4"
                        />

                        <div id="goal" className="mt-4">
                            <ContentCard
                                id="goal-content"
                                title="教学目标"
                                content={currentPlan.teachingObjective.content}
                                className="mb-8"
                            />
                        </div>

                        <div id="syllabus" className="mt-4">
                            <ContentCard
                                id="syllabus-content"
                                title="教学大纲"
                                content={currentPlan.syllabus.content}
                                className="mb-8"
                            />
                        </div>

                        <div id="resource" className="mt-4">
                            <ResourceList />
                        </div>

                        <div id="exercise" className="mt-4">
                            <ContentCard
                                id="exercise-content"
                                title={
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-semibold mb-6 text-purple-800">相关练习</h2>
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="relative">
                                                <button
                                                    onClick={() => {
                                                        window.location.href = "/home/dashboard/exercise?from=plan";
                                                    }}
                                                    className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                                                >
                                                    <Plus className="w-5 h-5 mr-2" />
                                                    添加练习
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                }
                                content={[
                                    ...problems,
                                    ...addedExercises,
                                ]
                                    .map(
                                        (problem, index) => `
### **题目 ${index + 1}: ${problem.title || "未命名题目"}**
**题型**: ${problem.type}  
**难度**: ${problem.difficulty}  
**知识点**: ${Array.isArray(problem.knowledgePoint) ? problem.knowledgePoint.join(", ") : problem.knowledgePoint}  

![${problem.title}](${encodeURI(problem.content)})

------
`
                                    )
                                    .join("\n")}
                                className="mb-4"
                            />
                        </div>

                        <div id="button" className="flex my-2 items-center justify-center gap-4">
                            <button
                                onClick={() => window.location.href = "/home/dashboard/ppt"}
                                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                            >
                                生成教学PPT
                            </button>
                            <button
                                onClick={() => window.location.href = "/home/dashboard/resource"}
                                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                            >
                                生成教学资源
                            </button>
                            <button
                                onClick={() => window.location.href = "/home/dashboard/exercise"}
                                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                            >
                                生成对应习题
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

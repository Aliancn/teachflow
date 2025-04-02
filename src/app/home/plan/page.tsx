"use client";
import { usePlanStore } from '@/lib/stores/planStore';
import { useEffect } from 'react';
import { ProfileCard } from '@/components/PlanCard/Profile';
import { ContentCard } from '@/components/PlanCard/ContentCard';
import { ResourceList } from '@/components/PlanCard/ResourceList';
export default function LessonPlanPage() {
    const { currentPlan, loadMockData } = usePlanStore();
    useEffect(() => {
        loadMockData();
    }, []);
    return (
        <div className="flex w-full h-screen">
            <div className="relative mr-4 max-w-3xl px-8 py-10 bg-white overflow-hidden w-64 border-r border-gray-200  shadow-sm shadow-purple-100/50">
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
            <div className="flex-1 overflow-auto">
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

                    </div>
                </div>
            </div>
        </div>
    );
}

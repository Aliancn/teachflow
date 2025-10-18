"use client";
import { useState, useRef, useEffect } from 'react';
import { Plus, FileText, Video, Image, Book, Download } from 'lucide-react';
import Link from 'next/link';
import { RecommendedResources } from './RecommendedResources';
import type { Resource } from '@/lib/stores/resourceStore';
import { useResourceStore } from '@/lib/stores/resourceStore';
const resourceTypes = [
    { type: 'document', label: '教学文档', icon: <FileText className="w-4 h-4" /> },
    { type: 'video', label: '教学视频', icon: <Video className="w-4 h-4" /> },
    { type: 'image', label: '参考图片', icon: <Image className="w-4 h-4" /> },
    { type: 'book', label: '参考书籍', icon: <Book className="w-4 h-4" /> }
];

export function ResourceList() {
    const { resources,  loadMockData } = useResourceStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addRes = (type: Resource['type']) => {
        // TODO
        // const newResource = {
        //     id: uuidv4(),
        //     type,
        //     url: [],
        //     description: [],
        //     title: `${resourceTypes.find(t => t.type === type)?.label} ${resources.filter(r => r.type === type).length + 1}`
        // };
        // addResource(newResource);
        console.log('addRes', type);
        loadMockData();
        setShowDropdown(false);
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">教学资源</h3>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        添加资源
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            {resourceTypes.map(({ type, label, icon }) => (
                                <button
                                    key={type}
                                    onClick={() => addRes(type as Resource['type'])}
                                    className="w-full px-4 py-3 text-left flex items-center hover:bg-gray-50 transition-colors"
                                >
                                    {icon}
                                    <span className="ml-2 text-gray-700">{label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* 推荐资源 */}
            <RecommendedResources className="mb-8" />
            <div className="border-t border-gray-100 pt-4">
                {resources.length > 0 ? (
                    <table className="w-full">
                        <tbody className="divide-y divide-gray-100">
                            {resources.map((resource, index) => {
                                const typeInfo = resourceTypes.find(t => t.type === resource.type);
                                return (
                                    <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 pl-4 text-gray-500 w-12">#{index + 1}</td>
                                        <td className="py-3  flex items-center">
                                            <span className="text-purple-600 mr-4">{typeInfo?.icon}</span>
                                            <Link href={`/home/plan/resource/${resource.id}`} className="text-gray-700 hover:text-purple-600 p-2">
                                                {resource.title}
                                            </Link>
                                        </td>
                                        <td className="py-3 pr-4 text-right">
                                            <button className="text-gray-400 hover:text-purple-600 p-2 rounded-lg">
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-400 py-8">
                        暂无资源，点击添加按钮创建
                    </div>
                )}
            </div>
        </div>
    );
}
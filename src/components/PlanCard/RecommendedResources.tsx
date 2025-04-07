"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
type TavilyResource = {
    title: string;
    url: string;
};

export function RecommendedResources({ className }: { className?: string }) {
    const [resources, setResources] = useState<TavilyResource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadResources = async () => {
            try {
                const data = (await import('@/types/tavily.mock.json')).default;
                let new_resources = [];
                for (let i = 0; i < data.results.length; i++) {
                    new_resources.push({
                        title: data.results[i].title,
                        url: data.results[i].url,
                    })
                }
                setResources(new_resources);
            } catch (error) {
                console.error('Failed to load resources:', error);
            } finally {
                setLoading(false);
            }
        };
        loadResources();
    }, []);

    if (loading) return <div className="text-gray-400">加载推荐资源中...</div>;

    return (
        <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
            <h4 className="text-sm font-semibold text-gray-500 mb-4">推荐资源</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource, index) => (
                    <Link
                        key={index}
                        href={resource.url}
                        target="_blank"
                        className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                        <div className="p-4">
                            <h3 className="font-medium text-gray-700 group-hover:text-purple-600 transition-colors line-clamp-2">
                                {resource.title}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
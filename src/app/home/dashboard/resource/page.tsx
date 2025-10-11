"use client";
import { useState } from 'react';
import { MagnifyingGlassIcon, DocumentTextIcon, VideoCameraIcon, PhotoIcon } from '@heroicons/react/24/outline';
import {useSearchStore} from '@/lib/stores/resourceStore';
import { useRouter } from 'next/navigation';  
export default function ResourceSearchPage() {
  const [searchCriteria, setSearchCriteria] = useState({
    keywords: '',
    subject: '数学',
    resourceType: ['document', 'video', 'image'],
    difficulty: 'all',
    sortBy: 'relevance'
  });
  const router = useRouter();
  const {searchResource , loadMockData} = useSearchStore();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现搜索逻辑
    console.log('搜索条件：', searchCriteria);
    loadMockData();// 模拟数据
    router.push('/home/dashboard/resource/result'); // 跳转到搜索结果页面
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">教学资源搜索</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 关键词搜索 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            关键词搜索 *
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchCriteria.keywords}
                onChange={(e) => setSearchCriteria({...searchCriteria, keywords: e.target.value})}
                placeholder="请输入教学主题或知识点"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </label>
        </div>

        {/* 学科和资源类型 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              学科
              <select
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={searchCriteria.subject}
                onChange={(e) => setSearchCriteria({...searchCriteria, subject: e.target.value})}
              >
                <option>数学</option>
                <option>物理</option>
                <option>化学</option>
                <option>生物</option>
                <option>英语</option>
              </select>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">资源类型</label>
            <div className="mt-1 flex gap-4">
              {[
                { value: 'document', label: '文档', icon: <DocumentTextIcon className="w-5 h-5" /> },
                { value: 'video', label: '视频', icon: <VideoCameraIcon className="w-5 h-5" /> },
                { value: 'image', label: '图片', icon: <PhotoIcon className="w-5 h-5" /> }
              ].map((type) => (
                <label key={type.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={searchCriteria.resourceType.includes(type.value)}
                    onChange={(e) => {
                      const types = e.target.checked
                        ? [...searchCriteria.resourceType, type.value]
                        : searchCriteria.resourceType.filter(t => t !== type.value);
                      setSearchCriteria({...searchCriteria, resourceType: types});
                    }}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="flex items-center gap-1">
                    {type.icon}
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 难度和排序 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              难度级别
              <select
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={searchCriteria.difficulty}
                onChange={(e) => setSearchCriteria({...searchCriteria, difficulty: e.target.value})}
              >
                <option value="all">全部</option>
                <option value="beginner">入门</option>
                <option value="intermediate">中等</option>
                <option value="advanced">高级</option>
              </select>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              排序方式
              <select
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={searchCriteria.sortBy}
                onChange={(e) => setSearchCriteria({...searchCriteria, sortBy: e.target.value})}
              >
                <option value="relevance">相关度</option>
                <option value="newest">最新</option>
                <option value="popularity">热度</option>
              </select>
            </label>
          </div>
        </div>

        {/* 搜索按钮 */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
          >
            立即搜索
          </button>
        </div>
      </form>
    </div>
  );
}
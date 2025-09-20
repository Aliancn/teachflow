"use client" ;
import NavigationMenu from '@/components/NavigationMenu';
import HistoryPanel from '@/components/HistoryPanel';
import {useConversationStore} from '@/lib/stores/chatStore';
import {useEffect, useState} from 'react';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      text: "PPT生成",
      href: "/dashboard/ppt"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      text: "教学大纲",
      href: "/dashboard/syllabus"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: "智能助手",
      href: "/dashboard/chat"
    }
  ];
  const {conversations} = useConversationStore();
  const [historyItems, setHistoryItems] = useState([
    { id: 1, title: 'PPT生成 · 数学课件', timestamp: '2025-03-22T10:00:00' },
    { id: 2, title: '教学大纲 · 物理课程', timestamp: '2025-03-22T14:30:00' },
    { id: 3, title: 'PPT生成 · 英语课件', timestamp: '2025-03-11T09:15:00' },
  ]);
  useEffect(() => {
    const merged = [
      ...historyItems.filter(item => item.id <= 3), // 保留初始示例
      ...conversations.map(con => ({
        id: con.id,
        title: con.title,
        timestamp: con.timestamp
      }))
    ].sort((a, b) => 
      b.timestamp.localeCompare(a.timestamp) // 按时间倒序
    );
    setHistoryItems(merged);
  }, [conversations]); // 监听会话变化

  return (
    <div className="grid grid-cols-[auto_auto_1fr] h-screen w-full bg-gray-50">
      <NavigationMenu items={navItems} />

      {/* 中间历史记录 */}
      <HistoryPanel items={historyItems} />

      {/* 主内容区域 */}
      <main className="p-8 bg-white overflow-y-auto h-full">
        {children}
      </main>
    </div>
  );
}
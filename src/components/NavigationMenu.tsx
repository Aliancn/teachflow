"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface NavItem {
  icon: React.ReactNode;
  text: string;
  href: string;
}

export default function NavigationMenu({ items }: { items: NavItem[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('navCollapsed');
    setIsCollapsed(savedState === 'true');
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('navCollapsed', String(newState));
  };

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-200 p-4 bg-white flex flex-col min-h-screen transition-all duration-300`}>
      <nav className="space-y-2 flex-1">
        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-gray-500 mb-4">功能导航</h3>
        )}
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
          >
            {item.icon}
            {!isCollapsed && item.text}
          </Link>
        ))}
      </nav>


      {/* <button
          onClick={toggleCollapse}
          className="w-full p-3 hover:bg-gray-100 rounded-lg flex items-center justify-center"
        >
          {isCollapsed ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button> */}
      <div className="mt-auto border-t pt-2">
        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          返回主页
        </Link>
      </div>
    </aside>
  );
}
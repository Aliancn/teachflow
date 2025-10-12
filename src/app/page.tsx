import Image from "next/image";
import Link from "next/link";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { SparklesIcon, BookOpenIcon, LightbulbIcon, UsersIcon } from 'lucide-react';
import RotatingText from '@/components/RotatingText'

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center min-h-screen h-screen overflow-auto w-full gap-8 font-[family-name:var(--font-geist-sans)] relative">
      <div className="absolute inset-0 -z-10 ">
        <BackgroundAnimation />
      </div>
      {/* 顶部导航栏 */}
      <nav className="w-full flex justify-between items-center py-4 px-6 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.svg"
            alt="TeachFlow Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-gray-800">TeachFlow</span>
        </div>

        {/* 用户信息 */}
        <div className="flex items-center gap-3">
          <Image
            src="https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff"
            alt="User Avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="hidden sm:block text-gray-700">管理员</span>
        </div>
      </nav>

      {/* 主体内容区域 */}
      <main className="max-w-6xl mx-auto w-full px-6">
        <div className="flex flex-col gap-12 text-center py-16">
          {/* 添加动态渐变色标题 */}
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-gradient-shift">
              TeachFlow 智能教学系统
            </h1>
            <div className="flex gap-4 items-center">
              <RotatingText
                texts={['教学大纲', '课件生成', '习题优化', '资源整合', '学情分析']}
                mainClassName="px-3 bg-white/20 backdrop-blur-md text-2xl text-purple-600 border border-purple-100/20 overflow-hidden py-2 rounded-xl shadow-sm"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
              <span className="text-2xl text-purple-600">AI驱动</span>
            </div>
          </div>


          {/* 副标题添加图标 */}
          {/* <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-500" />
            快速创建AI增强的教学内容
          </p> */}

          {/* 增强的CTA按钮 - 添加图标和动画 */}
          {/* <Link
            href="/home"
            className="group bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all self-center flex items-center gap-2"
          >
            <BookOpenIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">立即开始</span>
          </Link> */}
          {/* 新增快速搜索框 */}
          <div className="relative group w-full max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-purple-100 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Link
              href="/home"
              className="group relative flex items-center justify- gap-3 border-2 border-purple-200 rounded-full px-6 py-4 bg-white/80 backdrop-blur-md hover:border-purple-300 transition-colors shadow-md cursor-pointer"
            >
              <BookOpenIcon className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
              <span className="text-purple-400 text-lg font-medium ">
                点击快速创建AI增强的教学内容
              </span>
            </Link>
          </div>
          {/* 新增功能卡片网格 */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: <LightbulbIcon className="w-8 h-8" />,
                title: "智能生成",
                desc: "AI驱动的内容生成引擎"
              },
              {
                icon: <SparklesIcon className="w-8 h-8" />,
                title: "资源优化",
                desc: "自动化教学资源增强"
              },
              {
                icon: <UsersIcon className="w-8 h-8" />,
                title: "班级管理",
                desc: "全面展示班级学习情况"
              }
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100 hover:border-purple-100 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-purple-600 mb-4">{card.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="w-full border-t border-gray-100 py-6 text-sm text-gray-600 px-6 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex justify-center gap-4">
          <span>&copy; 2024 TeachFlow</span>
          <span>|</span>
          <a href="#" className="hover:text-indigo-600 transition-colors">服务条款</a>
          <span>|</span>
          <a href="#" className="hover:text-indigo-600 transition-colors">隐私政策</a>
          <span>|</span>
          <a href="#" className="hover:text-indigo-600 transition-colors">联系我们</a>
        </div>
      </footer>
    </div>
  );
}

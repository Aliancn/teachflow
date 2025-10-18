import Image from "next/image";
import Link from "next/link";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { SparklesIcon, BookOpenIcon, LightbulbIcon, UsersIcon } from 'lucide-react';
import RotatingText from '@/components/RotatingText'

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center min-h-screen h-screen overflow-auto w-full  font-[family-name:var(--font-geist-sans)] relative">
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
            src={`https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff&ts=${Date.now()}`}
            alt="User Avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="hidden sm:block text-gray-700">管理员</span>
        </div>
      </nav>

      {/* 主体内容区域 */}
      <main className="max-w-6xl mx-auto w-full px-24 my-4">
        <div className="flex flex-col gap-12 text-center py-16 mx-auto backdrop-blur-sm">
          {/* 添加动态渐变色标题 */}
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-gradient-shift">
              TeachFlow 智能教学系统
            </h1>
            <div className="flex gap-4 items-center text-gray-600">
              <RotatingText
                texts={['教学大纲', '课件生成', '习题优化', '资源整合', '学情分析']}
                mainClassName="px-3 bg-white/20 backdrop-blur-md text-2xl  border border-purple-100/20 overflow-hidden py-2 rounded-xl shadow-sm"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
                style={{

                  fontFamily: 'var(--font-geist-sans)'
                }}
              />
              <span className="text-2xl ">AI驱动</span>
            </div>
          </div>

          <div className="relative group w-full max-w-2xl mx-auto">
            <div className="absolute-inset-1  rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <Link
              href="/home"
              className="group relative flex items-center gap-3 border-1 border-gray-200 rounded-full px-6 py-4 bg-white/80 backdrop-blur-md hover:border-purple-300 transition-colors shadow-md cursor-pointer"
            >
              <BookOpenIcon className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
              <span className="text-lg text-gray-500 font-medium ">
                点击快速创建AI增强的教学内容
              </span>
            </Link>
          </div>
          {/* 功能介绍网格 */}
          <div className="grid md:grid-cols-3 gap-2 mt-8 ">
            {[
              {
                icon: <LightbulbIcon className="w-12 h-12 text-purple-600" />,
                title: "智能生成",
                features: [
                  "AI教案自动生成",
                  "多媒体课件创作",
                  "智能练习题生成"
                ]
              },
              {
                icon: <SparklesIcon className="w-12 h-12 text-blue-500" />,
                title: "资源增强",
                features: [
                  "教学资源全网搜索",
                  "相关习题举一反三",
                  "多媒体资源一键生成"
                ]
              },
              {
                icon: <UsersIcon className="w-12 h-12 text-green-500" />,
                title: "学情管理",
                features: [
                  "学情数据可视化",
                  "个性化学习路径",
                  "智能习题推荐"
                ]
              }
            ].map((section, i) => (
              <div
                key={i}
                className="group py-4 rounded-2xl transition-all hover:bg-white/80"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">{section.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.features.map((feature, j) => (
                      <li
                        key={j}
                        className="text-gray-600 leading-relaxed transition-colors group-hover:text-gray-800"
                      >
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </div>
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

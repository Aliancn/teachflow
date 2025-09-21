import Image from "next/image";
import Link from "next/link";
import BackgroundAnimation from "@/components/BackgroundAnimation";
export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center min-h-screen h-screen overflow-hidden w-full gap-8 font-[family-name:var(--font-geist-sans)] relative">
      <div className="absolute inset-0 -z-10">
        <BackgroundAnimation />
      </div>
      {/* 顶部导航栏 */}
      <nav className="w-full flex justify-between items-center py-4 border-b border-gray-200 px-6">
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
      <main className="max-w-4xl mx-auto w-full px-6">
        <div className="flex flex-col gap-8 text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900">
            欢迎使用智能备课系统
          </h1>
          <p className="text-gray-600 text-lg">
            开始创建你的第一个AI增强课程内容
          </p>
          <Link href="/dashboard" className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors self-center">
            开始使用
          </Link>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="w-full border-gray-200 py-3 text-sm text-gray-500 px-6">
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

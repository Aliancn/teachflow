import { Card } from "@/components/ui/Card";
export default function dashboardapp() {
    return(
        <div>
            <div className="h-full flex flex-col items-center justify-start pt-20">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">欢迎使用 TeachFlow</h1>
                <p className="text-slate-600 mb-8 max-w-xl text-center">智能化教学辅助平台，为您提供精准的习题推荐、学情分析和个性化教学方案</p>
                
                <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mt-8">
                    <Card>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">智能习题推荐</h3>
                            <p className="text-slate-600 text-sm">基于学习进度智能匹配练习题</p>
                            <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                                开始练习
                            </button>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">学情分析看板</h3>
                            <p className="text-slate-600 text-sm">可视化学习数据与进度跟踪</p>
                            <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                                查看报告
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
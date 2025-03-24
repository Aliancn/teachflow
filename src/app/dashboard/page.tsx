export default function dashboardapp() {
    return(
        <div>
            <div className="h-full flex flex-col items-center justify-start pt-20">
                <p className="text-2xl font-medium mb-8">请选择对应的功能标签</p>
                <div className="flex flex-col gap-4 w-full max-w-md">
                    <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-3 rounded-lg transition-colors">
                        功能标签 1
                    </button>
                    <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-3 rounded-lg transition-colors">
                        功能标签 2
                    </button>
                </div>
            </div>
        </div>
    )
}
export default function PPTGeneration() {
  return (
    <div className="p-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">新建PPT课件</h2>
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">主题名称</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            开始生成
          </button>
        </div>
      </div>
    </div>
  );
}
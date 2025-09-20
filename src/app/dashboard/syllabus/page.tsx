export default function SyllabusGeneration() {
  return (
    <div className="p-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">新建教学大纲</h2>
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">学科名称</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option>数学</option>
              <option>物理</option>
              <option>化学</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">适用年级</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            生成大纲
          </button>
        </div>
      </div>
    </div>
  );
}
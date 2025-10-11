"use client";
import { useSearchStore } from '@/lib/stores/resourceStore';   
export default function ResourceResultsPage() {
  const { searchResource } = useSearchStore();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">搜索结果</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 text-purple-800">相关文档 ({searchResource.documents.length})</h2>
        <div className="grid gap-4">
          {searchResource.documents.map((doc, index) => (
            <a
              key={index}
              href={doc.url}
              target="_blank"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{doc.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{doc.source}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                  {doc.type_name}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{doc.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* 视频结果 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 text-purple-800">相关视频 ({searchResource.videos.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResource.videos.map((video, index) => (
            <a
              key={index}
              href={video.url}
              target="_blank"
              className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-800 group-hover:text-purple-600 line-clamp-2">
                  {video.title}
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>{video.channel}</p>
                  <p className="mt-1">{video.upload_date}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 图片结果 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6 text-purple-800">相关图片 ({searchResource.images.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {searchResource.images.map((image, index) => (
            <a
              key={index}
              href={image.url}
              target="_blank"
              className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={image.thumbnail}
                alt={image.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <p className="text-sm text-gray-600 truncate">{image.source}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 空状态处理 */}
      {searchResource.documents.length + searchResource.videos.length + searchResource.images.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          未找到相关资源，请尝试其他搜索条件
        </div>
      )}
    </div>
  );
}
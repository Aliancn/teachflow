"use client";
import { useParams } from 'next/navigation';
import { useResourceStore , Resource} from '@/lib/stores/resourceStore';
import { FileText, Video, Image, Book, Download } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type ResourceCardProps = {
  url : string ,    
  type : 'document' | 'video' | 'image' | 'audio',
  description : string,
};
function ResourceCard({ resource }: { resource: ResourceCardProps }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center mb-4">
        {resource.type === 'document' && <FileText className="w-6 h-6 text-purple-600 mr-3" />}
        {resource.type === 'video' && <Video className="w-6 h-6 text-purple-600 mr-3" />}
        {resource.type === 'image' && <Image className="w-6 h-6 text-purple-600 mr-3" />}
        {resource.type === 'audio' && <Book className="w-6 h-6 text-purple-600 mr-3" />}
        <h2 className="text-lg font-semibold text-gray-800">{resource.description}</h2>
      </div>

      <div className="space-y-4">
        {resource.type === 'video' && (
          <video controls className="w-full rounded-lg aspect-video bg-gray-100">
            <source src={resource.url} type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
        )}
        
        {resource.type === 'image' && (
          <img 
            src={resource.url} 
            alt={resource.description}
            className="w-full rounded-lg object-cover bg-gray-100"
          />
        )}

        {resource.description && (
          <p className="text-gray-600 text-sm">{resource.description}</p>
        )}

        <a
          href={resource.url}
          download
          className="flex items-center justify-center bg-purple-100 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          下载资源
        </a>
      </div>
    </div>
  );
}

export default function ResourceDetailPage() {
  const { id } = useParams();
  const { getResourceByid } = useResourceStore();
  const resource = getResourceByid(id as string);

  if (!resource) return <div>资源不存在</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Link href="/home/plan" className="mr-4 text-purple-600 hover:text-purple-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{resource.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resource.url?.map((url, index) => (
          <ResourceCard 
            key={index}
            resource={{
              url,
              type: resource.type,
              description: resource.description[index],
            }} 
          />
        ))}
      </div>
    </div>
  );
}